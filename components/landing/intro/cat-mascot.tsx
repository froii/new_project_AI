"use client";

import { useEffect, useRef } from "react";
import styles from "./cat-mascot.module.css";

const FRAME_H_REM = 4.86; // keep in sync with the floor offset in cat-mascot.module.css
const PX_REM = FRAME_H_REM / 180;
const FRAME_W_REM = 320 * PX_REM;
const FRAME_MS = 1000 / 12;
const FRAMES = 120;
const COLS = 40;
const ROWS = 3;

// Camera pan per frame, read off the ground in the source: how far the cat really walks.
const TRACK_REM = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.027,
  0.088, 0.171, 0.267, 0.383, 0.514, 0.653, 0.819, 1.015, 1.201, 1.396, 1.608, 1.857, 2.136, 2.426,
  2.666, 2.889, 3.097, 3.312, 3.537, 3.727, 3.896, 4.066, 4.276, 4.54, 4.862, 5.195, 5.441, 5.692,
  5.937, 6.172, 6.351, 6.536, 6.751, 6.981, 7.19, 7.399, 7.6, 7.776, 7.896, 8.005, 8.104, 8.154,
];
const TRAVEL_REM = TRACK_REM[TRACK_REM.length - 1];
// Cancels the source cat's slow slide left once seated.
const SEAT_FROM = 76;
const SEAT_FIX_REM = [
  0, 0.009, 0.004, 0.004, -0.023, -0.05, -0.056, -0.05, -0.029, 0.02, 0.079, 0.128, 0.198, 0.268,
  0.333, 0.387, 0.441, 0.479, 0.495, 0.484, 0.468, 0.457, 0.452, 0.473, 0.527, 0.592, 0.646, 0.7,
  0.743, 0.776, 0.803, 0.83, 0.846, 0.857, 0.868, 0.873, 0.873, 0.873, 0.878, 0.884, 0.889, 0.895,
  0.9, 0.9,
];
// Lands the strike's farthest paw tip (frame 106) 0.35rem inside the CV button.
const END_REM = -3.39;
const START_REM = END_REM - TRAVEL_REM;
// First frame with the whole cat, tail included, past the button.
const CLEAR_FRAME = 73;
const boxAt = (frame: number) =>
  START_REM +
  TRACK_REM[Math.min(frame, TRACK_REM.length - 1)] +
  (frame >= SEAT_FROM ? SEAT_FIX_REM[frame - SEAT_FROM] : 0);

// Hover loops the high strike; enter rewinds to it and leave plays forward, so the pose never jumps.
const TAP_START = 99;
const TAP_END = 111;
const TAP_HOLD_MS = 400;
const TAP_REWIND_MS = 45;
const TAP_SETTLE_MS = 70;

// Cut at the idle clip's frames closest to the rest pose; the fade hides what is left of the gap.
// [from, to, scale at from, scale at to]: the idle cat sits up to 5px lower than the rest pose.
const IDLE_EVENTS: [number, number, number, number][] = [
  [0, 45, 1.036, 1],
  [45, 90, 1, 1.014],
  [90, 119, 1.014, 1],
];
const IDLE_GAP_MS = [2000, 6000];
const IDLE_FADE_MS = 250;
const REST_IMAGE = "url(/cat/cat.webp)";

const rem = (value: number) => `calc(${value}rem * var(--cat-scale))`;

const framePosition = (frame: number) =>
  `${rem(-(frame % COLS) * FRAME_W_REM)} ${rem(-Math.floor(frame / COLS) * FRAME_H_REM)}`;

function showFrame(node: HTMLDivElement, frame: number) {
  node.style.backgroundPosition = framePosition(frame);
  node.style.transform = `translateX(${rem(boxAt(frame))})`;
}

export function CatMascot() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const idle = idleRef.current;
    if (!wrap || !idle) return;

    wrap.style.width = rem(FRAME_W_REM);
    wrap.style.height = rem(FRAME_H_REM);
    wrap.style.backgroundSize = `${rem(COLS * FRAME_W_REM)} ${rem(ROWS * FRAME_H_REM)}`;
    idle.style.backgroundSize = wrap.style.backgroundSize;
    idle.style.transition = `opacity ${IDLE_FADE_MS}ms ease-in-out`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.style.backgroundImage = REST_IMAGE;
      showFrame(wrap, FRAMES - 1);
      wrap.style.visibility = "visible";
      return;
    }

    let raf = 0;
    let sitting = false;
    let disposed = false;

    const slot = wrap.parentElement;

    const run = (start: number) => {
      wrap.style.backgroundImage = REST_IMAGE;
      wrap.style.visibility = "visible";
      slot?.setAttribute("data-cat-behind", "");
      const tick = (now: number) => {
        const frame = Math.min(FRAMES - 1, Math.floor((now - start) / FRAME_MS));
        showFrame(wrap, frame);
        if (frame >= CLEAR_FRAME) slot?.removeAttribute("data-cat-behind");
        if (frame < FRAMES - 1) {
          raf = requestAnimationFrame(tick);
        } else {
          sitting = true;
          wrap.style.cursor = "pointer";
          wrap.style.pointerEvents = "auto";
          const img = new Image();
          img.src = "/cat/cat-idle.webp";
          img.decode().then(() => {
            if (disposed) return;
            idle.style.backgroundImage = `url(${img.src})`;
            scheduleIdle();
          }, () => {});
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          raf = requestAnimationFrame(run);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(wrap);

    let tapRaf = 0;
    let hovering = false;
    let frame = FRAMES - 1;
    let lastStep = 0;

    const nextTap = (): [number, number] => {
      if (!hovering) return [frame + 1, TAP_SETTLE_MS];
      if (frame > TAP_END) return [frame - 1, TAP_REWIND_MS];
      if (frame === TAP_END) return [TAP_START, TAP_HOLD_MS];
      return [frame + 1, FRAME_MS];
    };

    const tapTick = (now: number) => {
      const [next, ms] = nextTap();
      if (now - lastStep >= ms) {
        lastStep = now;
        frame = next;
        showFrame(wrap, frame);
      }
      tapRaf = hovering || frame < FRAMES - 1 ? requestAnimationFrame(tapTick) : 0;
    };

    let idleTimer = 0;
    let idleRaf = 0;
    let lastEvent = -1;

    const scheduleIdle = () => {
      const [min, max] = IDLE_GAP_MS;
      idleTimer = window.setTimeout(playIdle, min + Math.random() * (max - min));
    };

    const stopIdle = () => {
      cancelAnimationFrame(idleRaf);
      idleRaf = 0;
      wrap.style.backgroundImage = REST_IMAGE;
      idle.style.opacity = "0";
    };

    const playIdle = () => {
      if (hovering || tapRaf) {
        scheduleIdle();
        return;
      }
      let event = Math.floor(Math.random() * IDLE_EVENTS.length);
      if (event === lastEvent) event = (event + 1) % IDLE_EVENTS.length;
      lastEvent = event;
      const [from, to, scaleFrom, scaleTo] = IDLE_EVENTS[event];
      const show = (f: number) => {
        idle.style.backgroundPosition = framePosition(f);
        idle.style.transform = `scale(${scaleFrom + ((scaleTo - scaleFrom) * (f - from)) / (to - from)})`;
      };
      show(from);
      idle.style.opacity = "1";
      const start = performance.now();
      const tick = (now: number) => {
        const f = Math.min(to, from + Math.floor((now - start) / FRAME_MS));
        show(f);
        if (now - start >= IDLE_FADE_MS) wrap.style.backgroundImage = "none";
        if (f < to) {
          idleRaf = requestAnimationFrame(tick);
        } else {
          stopIdle();
          scheduleIdle();
        }
      };
      idleRaf = requestAnimationFrame(tick);
    };

    const handlePointerEnter = () => {
      if (!sitting) return;
      if (idleRaf) {
        stopIdle();
        scheduleIdle();
      }
      hovering = true;
      if (!tapRaf) tapRaf = requestAnimationFrame(tapTick);
    };
    const handlePointerLeave = () => {
      hovering = false;
    };
    wrap.addEventListener("pointerenter", handlePointerEnter);
    wrap.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      slot?.removeAttribute("data-cat-behind");
      observer.disconnect();
      wrap.removeEventListener("pointerenter", handlePointerEnter);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tapRaf);
      cancelAnimationFrame(idleRaf);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.wrap} aria-hidden="true">
      <div ref={idleRef} className={styles.idle} />
    </div>
  );
}
