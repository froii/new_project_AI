import nodemailer from "nodemailer";
import { owner } from "@/content";
import { contactLimits, headerSafe, invalidContactFields } from "@/lib/contact-message";
import { rateLimiter } from "@/lib/rate-limit";

/* nodemailer needs a raw socket; edge has none. */
export const runtime = "nodejs";

/* One constant header, so one inbox filter catches every message. */
const FROM_NAME = "Website";
const SUBJECT = "New message from the website";

const limit = rateLimiter(5, 60 * 60 * 1000);

function text(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const user = process.env.GMAIL_USER;
  /* Google prints it in four groups of four; SMTP wants the sixteen. */
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const to = owner.contacts.find((contact) => contact.kind === "email")?.value;

  if (!user || !pass || !to) return Response.json({ ok: false }, { status: 503 });

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (limit.hit(forwarded || "unknown")) return Response.json({ ok: false }, { status: 429 });

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
    /* Gmail allows no From but the authenticated account. */
    await nodemailer.createTransport({ service: "gmail", auth: { user, pass } }).sendMail({
      from: { name: FROM_NAME, address: user },
      to,
      replyTo: headerSafe(draft.email),
      subject: SUBJECT,
      text: `${details.join("\n")}\n\n${draft.message}`,
    });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
