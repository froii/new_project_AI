"use client";

import { useTranslations } from "next-intl";
import { Status } from "@/components/ui/status";
import styles from "@/components/ui/status/status.module.css";
import { owner } from "@/content";
import { contactHref } from "@/lib/contacts";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("error.failed");
  const email = owner.contacts.find((contact) => contact.kind === "email");

  return (
    <Status code={t("code")} heading={t("heading")} body={t("body")}>
      <button type="button" className={styles.primary} onClick={reset}>
        {t("retry")}
      </button>
      {email && (
        <a className={styles.secondary} href={contactHref(email)}>
          {t("email")}
        </a>
      )}
    </Status>
  );
}
