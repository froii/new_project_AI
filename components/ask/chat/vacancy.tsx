"use client";

import { type ClipboardEvent, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askLimits, type Vacancy } from "@/lib/ask/request";
import styles from "./chat.module.css";

type Draft = { text: string; image?: string };

/* Keeps the text of a long full-page screenshot legible. */
const MAX_SIDE = 2048;

async function imageDataUrl(file: Blob): Promise<string | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return null;
    /* JPEG has no alpha: a transparent PNG would turn black. */
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const url = canvas.toDataURL("image/jpeg", 0.85);
    return url.length <= askLimits.image ? url : null;
  } catch {
    return null;
  }
}

export function pastedImage(event: ClipboardEvent): File | undefined {
  return [...event.clipboardData.files].find((file) => file.type.startsWith("image/"));
}

export function useVacancy() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [failed, setFailed] = useState(false);

  const text = draft?.text.trim();
  const vacancy: Vacancy | undefined = draft?.image
    ? { image: draft.image }
    : text
      ? { text }
      : undefined;

  const attach = async (file: File) => {
    const image = await imageDataUrl(file);
    setFailed(!image);
    setDraft((current) => (image ? { text: "", image } : (current ?? { text: "" })));
  };

  return {
    draft,
    vacancy,
    failed,
    attach,
    open: () => setDraft((current) => current ?? { text: "" }),
    setText: (value: string) => setDraft({ text: value }),
    remove: () => {
      setDraft(null);
      setFailed(false);
    },
  };
}

export function VacancyField({ state }: { state: ReturnType<typeof useVacancy> }) {
  const t = useTranslations("ask.chat");
  const fileRef = useRef<HTMLInputElement>(null);
  const { draft } = state;
  if (!draft) return null;

  return (
    <div className={styles.vacancy}>
      {draft.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- a local data URL, nothing to optimize
        <img className={styles.vacancyImage} src={draft.image} alt={t("vacancyImage")} />
      ) : (
        <Textarea
          className={styles.input}
          value={draft.text}
          onChange={(event) => state.setText(event.target.value)}
          onPaste={(event) => {
            const file = pastedImage(event);
            if (!file) return;
            event.preventDefault();
            void state.attach(file);
          }}
          maxLength={askLimits.vacancy}
          rows={4}
          placeholder={t("vacancyPlaceholder")}
          aria-label={t("vacancyLabel")}
          autoFocus
        />
      )}
      {state.failed && (
        <p className={styles.truncated} role="alert">
          {t("vacancyFailed")}
        </p>
      )}
      <div className={styles.actions}>
        {!draft.image && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                /* Lets the same file be picked again after a remove. */
                event.target.value = "";
                if (file) void state.attach(file);
              }}
            />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              {t("vacancyScreenshot")}
            </Button>
          </>
        )}
        <Button type="button" variant="outline" onClick={state.remove}>
          {t("vacancyRemove")}
        </Button>
      </div>
    </div>
  );
}
