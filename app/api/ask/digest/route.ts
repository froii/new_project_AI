import { del } from "@vercel/blob";
import { loggedQuestions, questionLogEnabled } from "@/lib/ask/question-log";
import { mailer } from "@/lib/mail";

/* nodemailer needs Node. */
export const runtime = "nodejs";

/* Vercel Cron, once a day (vercel.json): one mail with every question since the last run. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  /* Vercel Cron sends this header; anyone else could empty the log. */
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response(null, { status: 401 });
  }

  const send = mailer();
  if (!send || !questionLogEnabled()) return Response.json({ ok: false }, { status: 503 });

  const { entries, urls } = await loggedQuestions();
  if (urls.length === 0) return Response.json({ ok: true, sent: 0 });

  const text = entries
    .map((entry) =>
      [
        `${entry.at} | ${entry.locale} | ${entry.model ?? "unknown model"}`,
        `Q: ${entry.question}`,
        `A: ${entry.answer}`,
        ...(entry.sources.length ? [`Sources: ${entry.sources.join(", ")}`] : []),
      ].join("\n"),
    )
    .join("\n\n---\n\n");

  /* Deleted only after the mail is out, so a failed send retries tomorrow. */
  await send({ subject: `Website chat: ${entries.length} questions`, text });
  await del(urls);

  return Response.json({ ok: true, sent: entries.length });
}
