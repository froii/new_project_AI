"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./share-button.module.css";

export function ShareButton({ title }: { title: string }) {
  const t = useTranslations("common");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => clearTimeout(timeoutRef.current ?? undefined), []);

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("shareFallback"), url);
    }
  };

  return (
    <button type="button" className={styles.button} aria-label={t("share")} onClick={share}>
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none">
        <path
          d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3m0 0L8 7m4-4 4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="share-label">{copied ? t("shareCopied") : t("share")}</span>
      <span aria-live="polite" className="visually-hidden">
        {copied ? t("shareCopied") : ""}
      </span>
    </button>
  );
}
