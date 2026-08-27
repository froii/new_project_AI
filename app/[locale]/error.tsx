"use client";

import { useTranslations } from "next-intl";
import { Status } from "@/components/ui/status";
import styles from "@/components/ui/status/status.module.css";
import { Link } from "@/i18n/navigation";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("error.failed");

  return (
    <Status code={t("code")} heading={t("heading")} body={t("body")}>
      <button type="button" className={styles.primary} onClick={reset}>
        {t("retry")}
      </button>
      <Link className={styles.secondary} href="/cv">
        {t("cv")}
      </Link>
    </Status>
  );
}
