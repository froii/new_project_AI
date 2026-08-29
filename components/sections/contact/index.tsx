"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type TransitionEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import buttonStyles from "@/components/ui/button/button.module.css";
import { Input } from "@/components/ui/input";
import { SocialLinks } from "@/components/ui/social-links";
import { Textarea } from "@/components/ui/textarea";
import { owner } from "@/content";
import { contactLimits, invalidContactFields, type ContactField } from "@/lib/contact-message";
import { CONTACT_OPEN } from "@/lib/contact-open";
import { messengerLinks } from "@/lib/contacts";
import styles from "./contact.module.css";

type Status = "idle" | "sending" | "sent" | "failed";

/* The form is the last block on both pages. No `behavior`: it inherits
   `scroll-behavior` from html, which reduced motion turns off. */
function scrollToForm() {
  window.scrollTo({ top: document.documentElement.scrollHeight });
}

export function Contact({ pdf }: { pdf?: string }) {
  const t = useTranslations("contact");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactField[]>([]);
  const panelId = useId();
  const firstField = useRef<HTMLInputElement>(null);
  const done = useRef<HTMLDivElement>(null);

  const email = owner.contacts.find((contact) => contact.kind === "email")?.value;
  const phone = owner.contacts.find((contact) => contact.kind === "phone")?.value;
  const broken = (field: ContactField) => errors.includes(field);

  /* One row of ways to reach me: the messengers the phone number opens, then
     the profiles. Splitting them into two labelled groups asked the visitor to
     care about a distinction that only matters to the code. */
  const reach = [
    ...(phone
      ? messengerLinks(phone).map((link) => ({ ...link, label: t(`messengers.${link.id}`) }))
      : []),
    ...owner.contacts
      .filter((contact) => contact.kind === "link")
      .map((contact) => ({
        id: contact.id,
        href: contact.value,
        label: t(`direct.${contact.id}`),
      })),
  ];

  useEffect(() => {
    if (open) firstField.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    const request = () => {
      /* Reopening after a send has to give back the form. Without this the
         panel came back showing the old confirmation and no fields, and only a
         reload got out of it. */
      setStatus("idle");
      setErrors([]);
      setOpen(true);
      /* Already open: nothing transitions, so settle() never fires. */
      requestAnimationFrame(() => {
        firstField.current?.focus({ preventScroll: true });
        scrollToForm();
      });
    };

    window.addEventListener(CONTACT_OPEN, request);
    return () => window.removeEventListener(CONTACT_OPEN, request);
  }, []);

  useEffect(() => {
    if (status === "sent") done.current?.focus();
  }, [status]);

  /* The panel has no height until the transition ends. */
  const settle = (event: TransitionEvent<HTMLDivElement>) => {
    if (!open || event.target !== event.currentTarget) return;
    scrollToForm();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const draft = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const invalid = invalidContactFields(draft);
    setErrors(invalid);
    if (invalid.length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, company: String(data.get("company") ?? "") }),
      });
      setStatus(response.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section className="section screen-only" id="contact">
      <div className="body">
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={styles.intro}>
              <h2 className={styles.kicker}>{t("heading")}</h2>
              <p className={styles.headline}>{t("intro")}</p>

              <div className={styles.bar}>
                <Button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpen((value) => !value)}
                >
                  {open ? t("close") : t("open")}
                </Button>

                {pdf ? (
                  <a
                    className={`${buttonStyles.button} ${buttonStyles.outline}`}
                    href={pdf}
                    download
                  >
                    {t("downloadPdf")}
                  </a>
                ) : (
                  <Button type="button" variant="outline" onClick={() => window.print()}>
                    {t("savePdf")}
                  </Button>
                )}
              </div>
            </div>

            {(reach.length > 0 || email) && (
              <div className={styles.aside}>
                <p className={styles.asideLabel}>{t("contactsLabel")}</p>
                {reach.length > 0 && <SocialLinks label={t("contactsLabel")} links={reach} />}
                {email && (
                  <a
                    className={styles.email}
                    href={`mailto:${email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {email}
                  </a>
                )}
              </div>
            )}
          </div>

          <div
            id={panelId}
            className={styles.reveal}
            data-open={open || undefined}
            inert={!open}
            onTransitionEnd={settle}
          >
            <div className={styles.revealInner}>
              {status === "sent" ? (
                <div className={styles.done} ref={done} tabIndex={-1} role="status">
                  <p className={styles.doneHeading}>{t("sent")}</p>
                  <p className={styles.note}>{t("sentNote")}</p>
                  <button
                    type="button"
                    className={styles.again}
                    onClick={() => {
                      setStatus("idle");
                      setErrors([]);
                    }}
                  >
                    {t("sendAnother")}
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={submit} noValidate>
                  <div className={styles.trap} aria-hidden="true">
                    <label htmlFor="contact-company">{t("trapLabel")}</label>
                    <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className={styles.row}>
                    <label className={styles.label} htmlFor="contact-name">
                      {t("name")}
                    </label>
                    <Input
                      id="contact-name"
                      name="name"
                      ref={firstField}
                      maxLength={contactLimits.name}
                      autoComplete="name"
                      aria-invalid={broken("name") || undefined}
                      aria-describedby={broken("name") ? "contact-name-error" : undefined}
                    />
                    {broken("name") && (
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
                        maxLength={contactLimits.email}
                        autoComplete="email"
                        aria-invalid={broken("email") || undefined}
                        aria-describedby={broken("email") ? "contact-email-error" : undefined}
                      />
                      {broken("email") && (
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
                        maxLength={contactLimits.phone}
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
                      maxLength={contactLimits.message}
                      aria-invalid={broken("message") || undefined}
                      aria-describedby={broken("message") ? "contact-message-error" : undefined}
                    />
                    {broken("message") && (
                      <p id="contact-message-error" className={styles.error}>
                        {t("messageError")}
                      </p>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <Button type="submit" disabled={status === "sending"}>
                      {status === "sending" ? t("sending") : t("submit")}
                    </Button>
                    <p className={styles.note}>{t("note")}</p>
                  </div>

                  {status === "failed" && (
                    <p className={styles.error} role="alert">
                      {t("failed")}{" "}
                      {email && (
                        <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                          {email}
                        </a>
                      )}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
