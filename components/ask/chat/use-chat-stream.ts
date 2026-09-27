"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { decodeEvents } from "@/lib/ask/sse";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string }[];
  model?: string;
  failed?: boolean;
  /* Got `done`: not stopped, not cut off. */
  complete?: boolean;
};

export type ChatStatus = "idle" | "thinking" | "streaming";

export function useChatStream(locale: Locale) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (question: string, model?: string) => {
      /* Answered pairs only: a stopped answer is a fragment. */
      const history = messages.flatMap((message, index) => {
        const answer = messages[index + 1];
        return message.role === "user" && answer?.complete && answer.content
          ? [
              { role: "user" as const, content: message.content },
              { role: "assistant" as const, content: answer.content },
            ]
          : [];
      });

      const id = crypto.randomUUID();
      const update = (patch: (message: ChatMessage) => ChatMessage) =>
        setMessages((all) => all.map((message) => (message.id === id ? patch(message) : message)));

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

        /* Any failure shows the same message. */
        if (!response.ok || !response.body) {
          update((message) => ({ ...message, failed: true }));
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
              update((message) => ({ ...message, model: event.model, complete: true }));
            }
            if (event.type === "error") update((message) => ({ ...message, failed: true }));
          }
        }

        /* Closed without `done`: the function hit its time limit mid-answer. */
        if (!complete) update((message) => ({ ...message, failed: true }));
      } catch {
        /* Stop keeps the partial answer. */
        if (!controller.signal.aborted) update((message) => ({ ...message, failed: true }));
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setStatus("idle");
      }
    },
    [locale, messages],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return { messages, status, send, stop };
}
