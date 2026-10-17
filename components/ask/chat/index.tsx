"use client";

import { type KeyboardEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/config";
import type { FreeModel } from "@/lib/ask/models";
import { askLimits } from "@/lib/ask/request";
import { requestContactForm } from "@/lib/contact-open";
import { type CatMood, ChatCat } from "./chat-cat";
import { type ChatMessage, type ChatStatus, useChatStream } from "./use-chat-stream";
import { useDictation } from "./use-dictation";
import styles from "./chat.module.css";

/* A closed <details> has no box, so the link's jump needs it open first. */
function openFaqItem(id: string) {
  const item = document.getElementById(`faq-${id}`);
  if (!(item instanceof HTMLDetailsElement)) return;
  item.open = true;
  const topic = item.parentElement?.closest("details");
  if (topic) topic.open = true;
}

export function Chat({ models, faqIds }: { models: FreeModel[]; faqIds: string[] }) {
  const t = useTranslations("ask.chat");
  const locale = useLocale() as Locale;
  const { messages, status, send, retry, stop } = useChatStream(locale);
  const [draft, setDraft] = useState("");
  /* "" = Auto */
  const [model, setModel] = useState("");
  const [focused, setFocused] = useState(false);
  const busy = status !== "idle";
  const dictation = useDictation(locale, draft, setDraft);

  const submit = (event?: { preventDefault(): void }) => {
    event?.preventDefault();
    const question = draft.trim();
    if (!question || busy) return;
    dictation.cancel();
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
        ? t(last.failed === "limit" ? "limit" : "failed")
        : last.truncated
          ? [last.content, t("truncated")].filter(Boolean).join(" ")
          : last.content
      : "";

  const mood: CatMood = busy
    ? "busy"
    : last?.role === "assistant" && last.failed && !draft
      ? "oops"
      : focused || draft
        ? "awake"
        : "sleep";

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
                faqIds={faqIds}
                onRetry={
                  index === messages.length - 1 && !busy
                    ? () => retry(model || undefined)
                    : undefined
                }
              />
            ),
          )}
        </ol>
      )}
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>

      <form
        className={styles.form}
        onSubmit={submit}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
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

          <div className={styles.actions}>
            {dictation.supported && (
              <Button
                type="button"
                variant="outline"
                className={styles.mic}
                onClick={dictation.toggle}
                aria-label={dictation.listening ? t("dictateStop") : t("dictate")}
                aria-pressed={dictation.listening}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none">
                  <path
                    d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM19 11a7 7 0 0 1-14 0M12 18v3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            )}
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
        </div>
      </form>

      <ChatCat mood={mood} className={styles.cat} />
    </section>
  );
}

function Answer({
  message,
  status,
  modelName,
  faqIds,
  onRetry,
}: {
  message: ChatMessage;
  status: ChatStatus;
  modelName?: string;
  faqIds: string[];
  onRetry?: () => void;
}) {
  const t = useTranslations("ask.chat");
  const tContact = useTranslations("contact");

  if (message.failed) {
    const limit = message.failed === "limit";
    return (
      <li className={`${styles.answer} ${styles.failed}`}>
        {message.content && <p className={styles.text}>{message.content}</p>}
        <p>{t(limit ? "limit" : "failed")}</p>
        <div className={styles.actions}>
          {!limit && onRetry && (
            <Button type="button" variant="outline" onClick={onRetry}>
              {t("retry")}
            </Button>
          )}
          <Button type="button" variant="outline" onClick={requestContactForm}>
            {tContact("open")}
          </Button>
        </div>
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
            <span className={styles.sources}>
              <span>{t("sources")}</span>
              {message.sources.map((source) => {
                const id = source.id.replace(/^faq\./, "");
                /* Hidden topics feed the chat but are not on the page. */
                return faqIds.includes(id) ? (
                  <a key={source.id} href={`#faq-${id}`} onClick={() => openFaqItem(id)}>
                    {source.title}
                  </a>
                ) : (
                  <span key={source.id}>{source.title}</span>
                );
              })}
            </span>
          ) : null}
          {modelName && <span>{t("answeredBy", { model: modelName })}</span>}
        </p>
      ) : null}
    </li>
  );
}
