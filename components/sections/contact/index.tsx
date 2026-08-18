"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialLinks } from "@/components/ui/social-links";
import { Textarea } from "@/components/ui/textarea";
import { useSections } from "@/components/providers/sections-provider";
import { owner } from "@/content";
import { messengerLinks } from "@/lib/contacts";
import styles from "./contact.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: boolean; email?: boolean; message?: boolean };

export function Contact() {
  const t = useTranslations("contact");
  const { visible } = useSections();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const panelId = useId();

  const email = owner.contacts.find((contact) => contact.kind === "email")?.value;
  const phone = owner.contacts.find((contact) => contact.kind === "phone")?.value;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const tel = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {
      name: name.length === 0,
      email: !emailPattern.test(from),
      message: message.length < 10,
    };
    setErrors(next);
    if (next.name || next.email || next.message || !email) return;

    const signature = tel ? `— ${name} <${from}>, ${tel}` : `— ${name} <${from}>`;
    const body = `${message}\n\n${signature}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      t("mailSubject", { name }),
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="section" id="contact">
      <div className="shell stack">
        <h2>{t("heading")}</h2>
        <p className="muted">{t("intro")}</p>

        <div className={styles.bar}>
          {visible["contact.form"] && (
            <Button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? t("close") : t("open")}
            </Button>
          )}

          {email && (
            <a className={styles.email} href={`mailto:${email}`}>
              {email}
            </a>
          )}

          {phone && (
            <SocialLinks
              label={t("messengersLabel")}
              links={messengerLinks(phone).map((link) => ({
                ...link,
                label: t(`messengers.${link.id}`),
              }))}
            />
          )}
        </div>

        {visible["contact.form"] && (
          <div id={panelId} className={styles.reveal} data-open={open || undefined} inert={!open}>
            <div className={styles.revealInner}>
              <form className={styles.form} onSubmit={submit} noValidate>
                <div className={styles.row}>
                  <label className={styles.label} htmlFor="contact-name">
                    {t("name")}
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    aria-invalid={errors.name || undefined}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className={styles.error}>
                      {t("nameError")}
                    </p>
                  )}
                </div>

                <div className={styles.pair}>
                  <div className={styles.row}>
                    <label className={styles.label} htmlFor="contact-email">
                      {t("email")}
                    </label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      aria-invalid={errors.email || undefined}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="contact-email-error" className={styles.error}>
                        {t("emailError")}
                      </p>
                    )}
                  </div>

                  <div className={styles.row}>
                    <label className={styles.label} htmlFor="contact-phone">
                      {t("phone")} <span className={styles.optional}>{t("optional")}</span>
                    </label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <label className={styles.label} htmlFor="contact-message">
                    {t("message")}
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    aria-invalid={errors.message || undefined}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="contact-message-error" className={styles.error}>
                      {t("messageError")}
                    </p>
                  )}
                </div>

                <div className={styles.actions}>
                  <Button type="submit" disabled={!email}>
                    {t("submit")}
                  </Button>
                  <p className={styles.note}>{t("note")}</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
