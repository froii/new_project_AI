import { contactLimits, headerSafe, invalidContactFields } from "@/lib/contact-message";
import { mailer } from "@/lib/mail";
import { clientIp, rateLimiter } from "@/lib/rate-limit";

/* nodemailer needs a raw socket; edge has none. */
export const runtime = "nodejs";

const SUBJECT = "New message from the website";

const limit = rateLimiter(5, 60 * 60 * 1000);

function text(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const send = mailer();
  if (!send) return Response.json({ ok: false }, { status: 503 });

  if (limit.hit(clientIp(request))) return Response.json({ ok: false }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;

  /* Reporting failure would just teach the bot to drop the field. */
  if (text(fields, "company") !== "") return Response.json({ ok: true });

  const draft = {
    name: text(fields, "name"),
    email: text(fields, "email"),
    phone: text(fields, "phone").slice(0, contactLimits.phone),
    message: text(fields, "message"),
  };

  const invalid = invalidContactFields(draft);
  if (invalid.length > 0) return Response.json({ ok: false, invalid }, { status: 400 });

  const details = [`Name: ${draft.name}`, `Email: ${draft.email}`];
  if (draft.phone) details.push(`Phone: ${draft.phone}`);

  try {
    await send({
      replyTo: headerSafe(draft.email),
      subject: SUBJECT,
      text: `${details.join("\n")}\n\n${draft.message}`,
    });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
