"use client";

import { type KeyboardEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/config";
import type { FreeModel } from "@/lib/ask/models";
import { askLimits } from "@/lib/ask/request";
import { requestContactForm } from "@/lib/contact-open";
import { type ChatMessage, type ChatStatus, useChatStream } from "./use-chat-stream";
import styles from "./chat.module.css";

export function Chat({ models }: { models: FreeModel[] }) {
  const t = useTranslations("ask.chat");
  const locale = useLocale() as Locale;
  const { messages, status, send, stop } = useChatStream(locale);
  const [draft, setDraft] = useState("");
  /* "" = Auto */
  const [model, setModel] = useState("");
  const busy = status !== "idle";

  const submit = (event?: { preventDefault(): void }) => {
    event?.preventDefault();
    const question = draft.trim();
    if (!question || busy) return;
    setDraft("");
    void send(question, model || undefined);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
  };

  const modelName = (id?: string) => models.find((entry) => entry.id === id)?.name ?? id;

  /* Announced once finished, not per streamed token. */
  const last = messages.at(-1);
  const announcement =
    status === "idle" && last?.role === "assistant"
      ? last.failed
        ? t("limit")
        : last.truncated
          ? [last.content, t("truncated")].filter(Boolean).join(" ")
          : last.content
      : "";

  return (
    <section className={styles.chat} aria-labelledby="chat-heading">
      <h2 id="chat-heading" className={styles.heading}>
        {t("heading")}
      </h2>
      <p className={styles.disclaimer}>{t("disclaimer")}</p>

      {messages.length > 0 && (
        <ol className={styles.log} role="list">
          {messages.map((message, index) =>
            message.role === "user" ? (
              <li key={message.id} className={styles.question}>
                {message.content}
              </li>
            ) : (
              <Answer
                key={message.id}
                message={message}
                status={index === messages.length - 1 ? status : "idle"}
                modelName={modelName(message.model)}
              />
            ),
          )}
        </ol>
      )}
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      <form className={styles.form} onSubmit={submit}>
        <Textarea
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          maxLength={askLimits.question}
          rows={2}
          placeholder={t("placeholder")}
          aria-label={t("label")}
        />
        <div className={styles.controls}>
          <label className={styles.model}>
            <span>{t("model")}</span>
            <select value={model} onChange={(event) => setModel(event.target.value)}>
              <option value="">{t("auto")}</option>
              {models.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
          </label>

          {busy ? (
            <Button type="button" variant="outline" className={styles.action} onClick={stop}>
              {t("stop")}
            </Button>
          ) : (
            <Button type="submit" className={styles.action} disabled={!draft.trim()}>
              {t("send")}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

function Answer({
  message,
  status,
  modelName,
}: {
  message: ChatMessage;
  status: ChatStatus;
  modelName?: string;
}) {
  const t = useTranslations("ask.chat");
  const tContact = useTranslations("contact");

  if (message.failed) {
    return (
      <li className={`${styles.answer} ${styles.failed}`}>
        {message.content && <p className={styles.text}>{message.content}</p>}
        <p>{t("limit")}</p>
        <Button type="button" variant="outline" onClick={requestContactForm}>
          {tContact("open")}
        </Button>
      </li>
    );
  }

  /* Stopped before any text. Blank opening lines stream as "". */
  if (!message.content && !message.truncated && status === "idle") return null;

  return (
    <li className={styles.answer} aria-busy={status !== "idle"}>
      {message.content && <p className={styles.text}>{message.content}</p>}
      {!message.content && !message.truncated && <p className={styles.thinking}>{t("thinking")}</p>}
      {message.truncated && <p className={styles.truncated}>{t("truncated")}</p>}

      {status === "idle" && (message.sources?.length || modelName) ? (
        <p className={styles.meta}>
          {message.sources?.length ? (
            <span>
              {/* Achievement chunks share one title. */}
              {t("sources")}{" "}
              {[...new Set(message.sources.map((source) => source.title))].join(" · ")}
            </span>
          ) : null}
          {modelName && <span>{t("answeredBy", { model: modelName })}</span>}
        </p>
      ) : null}
    </li>
  );
}
