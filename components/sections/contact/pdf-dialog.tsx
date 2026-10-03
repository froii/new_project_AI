"use client";

import { useId, useRef, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { CvPdf } from "@/content/links";
import { presetIds, type PresetId } from "@/content/sections";
import styles from "./pdf-dialog.module.css";

function outsideBox(event: MouseEvent<HTMLDialogElement>): boolean {
  const box = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  );
}

/* The dialog is server-rendered while closed, so every file link is in the HTML
   for crawlers and agents that never run the trigger. */
export function PdfDialog({ pdfs }: { pdfs: Record<PresetId, CvPdf> }) {
  const t = useTranslations("contact");
  const tPresets = useTranslations("sections.presets");
  const dialog = useRef<HTMLDialogElement>(null);
  const pressedOutside = useRef(false);
  const headingId = useId();
  const introId = useId();

  return (
    <>
      <Button
        type="button"
        variant="outline"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        {t("downloadPdf")}
      </Button>

      {/* Backdrop clicks target the dialog, but so do a text selection released
          outside the panel and the dialog's own border or scrollbar: only a press
          and release both outside the box count. */}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby={headingId}
        aria-describedby={introId}
        onPointerDown={(event) => {
          pressedOutside.current = outsideBox(event);
        }}
        onClick={(event) => {
          if (pressedOutside.current && outsideBox(event)) event.currentTarget.close();
        }}
      >
        <div className={styles.panel}>
          <header className={styles.header}>
            <h2 id={headingId}>{t("pdf.heading")}</h2>
            <button
              type="button"
              className={styles.close}
              aria-label={t("pdf.close")}
              onClick={() => dialog.current?.close()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </header>

          <p id={introId} className={styles.intro}>
            {t("pdf.intro")}
          </p>

          <ul className={styles.list}>
            {presetIds.map((id) => {
              const pdf = pdfs[id];
              return (
                <li key={id}>
                  <a
                    className={styles.item}
                    href={pdf.href}
                    download
                    type="application/pdf"
                    onClick={() => dialog.current?.close()}
                  >
                    <span className={styles.label}>{tPresets(`${id}.label`)}</span>
                    <span className={styles.meta}>
                      {`${t("pdf.pages", { count: pdf.pages })} · ${t(`pdf.notes.${id}`)}`}
                    </span>
                    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 4v11m-5-5 5 5 5-5M5 20h14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}
