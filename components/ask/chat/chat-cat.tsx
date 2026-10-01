"use client";

import { useEffect, useRef } from "react";
import { type Cat, SpriteCat, sheets } from "@/components/ui/sprite-cat";

export type CatMood = "sleep" | "awake" | "busy" | "oops";

const DOZE = [75, 87] as const;
const HEAD_UP = 99;
const LOOK = [99, 108] as const;
const LOOK_SPEED = 0.6;
const FLICK = [99, 119] as const;
const POLL_MS = 150;
const DOZE_MS = 5000;

export function ChatCat({ mood, className }: { mood: CatMood; className?: string }) {
  const moodRef = useRef(mood);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  /* Loops step one frame at a time so a mood change shows up at once. */
  const script = async (cat: Cat) => {
    let headUp = false;
    let direction = 1;
    let idleMs = 0;

    const swing = async ([low, high]: readonly [number, number], speed: number) => {
      let next = cat.frame + direction;
      if (next < low || next > high) {
        direction = -direction;
        next = cat.frame + direction;
      }
      await cat.wait(1000 / (sheets.lie.fps * speed));
      cat.show(next);
    };

    cat.show(DOZE[0]);
    for (;;) {
      const now = moodRef.current;

      if (!headUp) {
        if (now === "sleep") {
          await swing(DOZE, 0.6);
        } else if (now === "oops") {
          await cat.wait(POLL_MS);
        } else {
          await cat.play(cat.frame, DOZE[1], 3);
          await cat.play(DOZE[1], HEAD_UP);
          headUp = true;
          idleMs = 0;
        }
      } else if (now === "busy") {
        await swing(FLICK, 1.2);
      } else if (now === "awake" || (now === "sleep" && idleMs < DOZE_MS)) {
        idleMs = now === "awake" ? 0 : idleMs + 1000 / (sheets.lie.fps * LOOK_SPEED);
        await swing(LOOK, LOOK_SPEED);
      } else {
        /* Lifting the head, played backwards, lowers it. */
        await cat.play(cat.frame, HEAD_UP, 3);
        await cat.play(HEAD_UP, DOZE[1], 0.8);
        headUp = false;
      }
    }
  };

  return <SpriteCat sheet={sheets.lie} script={script} still={DOZE[0]} className={className} />;
}
