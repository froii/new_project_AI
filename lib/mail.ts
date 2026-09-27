import nodemailer from "nodemailer";
import { contactInbox } from "@/content";

/* One constant header, so one inbox filter catches every message. */
const FROM_NAME = "Website";

export type Mail = { subject: string; text: string; replyTo?: string };

/* null without Gmail credentials. */
export function mailer(): ((mail: Mail) => Promise<unknown>) | null {
  const user = process.env.GMAIL_USER;
  /* Google prints it in four groups of four; SMTP wants the sixteen. */
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass) return null;

  /* Gmail allows no From but the authenticated account. */
  return (mail) =>
    nodemailer.createTransport({ service: "gmail", auth: { user, pass } }).sendMail({
      from: { name: FROM_NAME, address: user },
      to: contactInbox,
      ...mail,
    });
}
