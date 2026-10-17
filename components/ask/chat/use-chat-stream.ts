"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { askLimits } from "@/lib/ask/request";
import { decodeEvents } from "@/lib/ask/sse";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string }[];
  model?: string;
  /* "limit": a daily quota is spent, so a retry cannot help. */
  failed?: "limit" | "error";
  /* Got `done`: not stopped, not dropped mid-stream. */
  complete?: boolean;
  /* Hit max_tokens; the fragment still goes into history. */
  truncated?: boolean;
};

export type ChatStatus = "idle" | "thinking" | "streaming";

export function useChatStream(locale: Locale) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (question: string, model?: string) => {
      /* Completed pairs only; the server keeps the same tail. */
      const history = messages
        .flatMap((message, index) => {
          const answer = messages[index + 1];
          return message.role === "user" && answer?.complete && answer.content
            ? [
                { role: "user" as const, content: message.content },
                { role: "assistant" as const, content: answer.content },
              ]
            : [];
        })
        .slice(-askLimits.turns);

      const id = crypto.randomUUID();
      const update = (patch: (message: ChatMessage) => ChatMessage) =>
        setMessages((all) => all.map((message) => (message.id === id ? patch(message) : message)));
      /* The first reason wins: a quota error is followed by a stream without `done`. */
      const fail = (reason: "limit" | "error" = "error") =>
        update((message) => ({ ...message, failed: message.failed ?? reason }));

      setMessages((all) => [
        ...all,
        { id: `${id}-q`, role: "user", content: question },
        { id, role: "assistant", content: "" },
      ]);
      setStatus("thinking");

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, history, locale, model }),
          signal: controller.signal,
        });

        /* 429 here is the per-IP hourly limit. */
        if (!response.ok || !response.body) {
          fail(response.status === 429 ? "limit" : "error");
          return;
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let rest = "";
        let complete = false;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;

          const decoded = decodeEvents(rest + value);
          rest = decoded.rest;

          for (const event of decoded.events) {
            if (event.type === "sources")
              update((message) => ({ ...message, sources: event.items }));
            if (event.type === "text") {
              setStatus("streaming");
              /* Some models open with blank lines. */
              update((message) => ({
                ...message,
                content: (message.content + event.content).trimStart(),
              }));
            }
            if (event.type === "done") {
              complete = true;
              update((message) => ({
                ...message,
                model: event.model,
                complete: true,
                truncated: event.truncated,
              }));
            }
            if (event.type === "error") fail(event.limit ? "limit" : "error");
          }
        }

        /* No `done`: the function timed out mid-answer. */
        if (!complete) fail();
      } catch {
        /* Stop keeps the partial answer. */
        if (!controller.signal.aborted) fail();
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setStatus("idle");
      }
    },
    [locale, messages],
  );

  /* Replaces the failed pair, so the log keeps one copy of the question. */
  const retry = useCallback(
    (model?: string) => {
      const question = messages.at(-2);
      if (question?.role !== "user") return;
      setMessages((all) => all.slice(0, -2));
      void send(question.content, model);
    },
    [messages, send],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return { messages, status, send, retry, stop };
}
