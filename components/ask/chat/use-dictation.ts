"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import { useHydrated } from "@/lib/use-hydrated";

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognitionCtor = new () => Recognition;

const speechLang: Record<Locale, string> = { uk: "uk-UA", en: "en-US" };

function recognitionCtor(): RecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function useDictation(locale: Locale, draft: string, setDraft: (text: string) => void) {
  const supported = useHydrated() && Boolean(recognitionCtor());
  const [listening, setListening] = useState(false);
  const recognition = useRef<Recognition | null>(null);

  useEffect(() => () => recognition.current?.abort(), []);

  const start = async () => {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      return;
    }
    recognition.current?.abort();
    const base = draft.trimEnd();
    const rec = new Ctor();
    rec.lang = speechLang[locale];
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (event) => {
      const spoken = Array.from(event.results, (result) => result[0].transcript).join("");
      setDraft([base, spoken.trim()].filter(Boolean).join(" "));
    };
    rec.onend = () => {
      if (recognition.current !== rec) return;
      recognition.current = null;
      setListening(false);
    };
    recognition.current = rec;
    rec.start();
    setListening(true);
  };

  const stop = () => {
    recognition.current?.stop();
    setListening(false);
  };
  const cancel = () => recognition.current?.abort();

  return { supported, listening, toggle: listening ? stop : start, cancel };
}
