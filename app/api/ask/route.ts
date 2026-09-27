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

/* ~50 free requests a day per account. */
const limit = rateLimiter(10, 60 * 60 * 1000);

/* Mail once a day on 429; every failure goes to the log. */
let alertedOn = "";

async function alertLimit(detail: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const send = mailer();
  if (alertedOn === today || !send) return;

  /* Claimed before the send, so parallel 429s mail once. */
  alertedOn = today;
  try {
    await send({ subject: "Website chat: the free model limit is reached", text: detail });
  } catch (error) {
    alertedOn = "";
    console.error(`[ask] limit alert not sent: ${String(error)}`);
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
  const found = await keywordRetriever(searchQuery(ask), sourceLocale);
  const messages = buildMessages(profileChunk(sourceLocale), found, ask);
  /* Curated only, minus retired ids (the catalog is cached for an hour); OpenRouter caps `models` at three. */
  const live = (await freeModels()).map((model) => model.id);
  const pool = live.length > 0 ? live : curatedModels;
  const models = (ask.model ? [ask.model, ...pool.filter((id) => id !== ask.model)] : pool)
    /* Last gate before the bill: a paid id never leaves the server. */
    .filter(isFreeModelId)
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
            max_tokens: 1000,
            reasoning: { effort: "low", exclude: true },
          }),
        });

        if (!upstream.ok || !upstream.body) {
          const reason = (await upstream.text().catch(() => "")).slice(0, 500);
          const detail = `${models.join(", ")} answered ${upstream.status}\n\n${reason}`;
          fail(detail);
          /* All models refused. Mail after the response. */
          if (upstream.status === 429) after(() => alertLimit(detail));
          return;
        }

        const reader = upstream.body.pipeThrough(new TextDecoderStream()).getReader();
        let rest = "";
        let finished = false;
        let answeredBy: string | undefined;

        while (!finished) {
          const { done, value } = await reader.read();
          if (done) break;

          const parsed = parseUpstream(rest + value);
          rest = parsed.rest;
          answeredBy ??= parsed.model;
          for (const content of parsed.texts) emit({ type: "text", content });

          if (parsed.failed) {
            fail(`${models.join(", ")} failed mid-stream`);
            return;
          }
          finished = parsed.done;
        }

        /* Closed before [DONE]: the answer is cut short. */
        if (!finished) {
          fail(`${answeredBy ?? models.join(", ")} closed the stream before [DONE]`);
          return;
        }

        emit({ type: "done", model: answeredBy });
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
