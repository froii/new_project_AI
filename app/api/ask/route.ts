import { after } from "next/server";
import { profileChunk } from "@/lib/ask/chunks";
import { curatedModels, freeModels, isFreeModelId } from "@/lib/ask/models";
import { buildMessages } from "@/lib/ask/prompt";
import { contentLocale, parseAsk, searchQuery } from "@/lib/ask/request";
import { keywordRetriever } from "@/lib/ask/retriever";
import { type AskEvent, encodeEvent, parseUpstream } from "@/lib/ask/sse";
import { mailer } from "@/lib/mail";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import { siteUrl } from "@/lib/site";

/* nodemailer needs Node. */
export const runtime = "nodejs";
/* Free models are slow to start. */
export const maxDuration = 30;

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_TOKENS = 1000;

/* Per IP, so one visitor cannot drain the free tier's ~50 requests a day. */
const limit = rateLimiter(10, 60 * 60 * 1000);

/* Mail once a day per subject; every failure goes to the log. */
const alertedOn = new Map<string, string>();

async function alertOwner(subject: string, detail: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (alertedOn.get(subject) === today) return;
  const send = mailer();
  if (!send) return;

  /* Claimed before the send, so parallel failures mail once. */
  alertedOn.set(subject, today);
  try {
    await send({ subject, text: detail });
  } catch (error) {
    alertedOn.delete(subject);
    console.error(`[ask] alert not sent: ${String(error)}`);
  }
}

export async function POST(request: Request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return Response.json({ ok: false }, { status: 503 });

  if (limit.hit(clientIp(request))) return Response.json({ ok: false }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const ask = parseAsk(body);
  if (!ask) return Response.json({ ok: false }, { status: 400 });

  const sourceLocale = contentLocale(ask.question);
  const [found, catalog] = await Promise.all([
    keywordRetriever(searchQuery(ask), sourceLocale),
    freeModels(),
  ]);
  const messages = buildMessages(profileChunk(sourceLocale), found, ask);
  /* Empty catalog means the fetch failed: fall back to the curated list. */
  const live = catalog.map((model) => model.id);
  const pool = live.length > 0 ? live : curatedModels;
  /* A stale tab may still offer a retired pick. */
  const pick = ask.model && pool.includes(ask.model) ? ask.model : undefined;
  const models = (pick ? [pick, ...pool.filter((id) => id !== pick)] : pool)
    /* Last gate before the bill: a paid id never leaves the server. */
    .filter(isFreeModelId)
    /* OpenRouter caps `models` at three. */
    .slice(0, 3);

  /* Abort on every exit so the model call never outlives the response. */
  const upstreamAbort = new AbortController();
  request.signal.addEventListener("abort", () => upstreamAbort.abort());
  const encoder = new TextEncoder();
  let cancelled = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: AskEvent) => controller.enqueue(encoder.encode(encodeEvent(event)));
      const fail = (detail: string) => {
        console.error(`[ask] ${detail}`);
        emit({ type: "error" });
      };

      emit({ type: "sources", items: found.map(({ id, title }) => ({ id, title })) });

      try {
        const upstream = await fetch(ENDPOINT, {
          method: "POST",
          signal: upstreamAbort.signal,
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": siteUrl,
            "X-Title": "CV chat",
          },
          /* Keep reasoning short and out of the stream. */
          body: JSON.stringify({
            models,
            messages,
            stream: true,
            max_tokens: MAX_TOKENS,
            reasoning: { effort: "low", exclude: true },
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const reason = (await upstream.text().catch(() => "")).slice(0, 500);
          const detail = `${models.join(", ")} answered ${upstream.status}\n\n${reason}`;
          fail(detail);
          /* Own subject for the daily quota, so a short throttle does not use up its mail. */
          if (upstream.status === 429) {
            const subject = reason.includes("per-day")
              ? "Website chat: the free model limit is reached"
              : "Website chat: the free model is rate-limited";
            after(() => alertOwner(subject, detail));
          }
          return;
        }

        const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
        let rest = "";
        let finished = false;
        let truncated = false;
        let answered = false;
        let answeredBy: string | undefined;

        while (!finished) {
          const { done, value } = await reader.read();
          if (done) break;

          const parsed = parseUpstream(rest + value);
          rest = parsed.rest;
          answeredBy ??= parsed.model;
          truncated ||= parsed.truncated;
          for (const content of parsed.texts) {
            answered ||= content.trim() !== "";
            emit({ type: "text", content });
          }

          if (parsed.failed) {
            fail(`${models.join(", ")} failed mid-stream`);
            return;
          }
          finished = parsed.done;
        }

        const who = answeredBy ?? models.join(", ");
        if (!finished) {
          fail(`${who} closed the stream before [DONE]`);
          return;
        }
        /* Reasoning models can finish with no content; the client would show nothing. */
        if (!answered && !truncated) {
          fail(`${who} finished with an empty answer`);
          return;
        }

        emit({ type: "done", model: answeredBy, truncated });
        if (truncated) {
          const detail = `${who} hit max_tokens (${MAX_TOKENS})`;
          console.error(`[ask] ${detail}`);
          after(() => alertOwner("Website chat: an answer was cut off", detail));
        }
        /* Questions go to the log only, never to analytics. */
        // eslint-disable-next-line no-console -- info level, read by hand
        console.log(
          `[ask] ${ask.locale} ${answeredBy} [${found.map((chunk) => chunk.id).join(", ")}] ${JSON.stringify(ask.question)}`,
        );
      } catch (error) {
        /* Visitor left. */
        if (cancelled || request.signal.aborted) return;
        fail(`${models.join(", ")} request threw: ${String(error)}`);
      } finally {
        upstreamAbort.abort();
        /* Closing a cancelled stream throws. */
        if (!cancelled) controller.close();
      }
    },
    cancel() {
      cancelled = true;
      upstreamAbort.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
