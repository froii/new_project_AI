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

// Only idle frames 45-46 and 115-119 match the rest pose; 0-44 sit 5px lower and show as a size jump.
const IDLE_FROM = 45;
const IDLE_TO = 119;
// Sheet px the idle source camera drifts right by, measured on the paws against the rest pose.
const IDLE_DRIFT_PX: Record<number, number> = {
  96: 1,
  97: 4,
  98: 5,
  99: 4,
  100: 3,
  101: 2,
  102: 1,
  103: 1,
  104: 1,
};
const IDLE_GAP_MS = [2000, 6000];
const IDLE_FADE_MS = 250;
const REST_IMAGE = "url(/cat/cat.webp)";

const rem = (value: number) => `calc(${value}rem * var(--cat-scale))`;

const framePosition = (frame: number) =>
  `${rem(-(frame % COLS) * FRAME_W_REM)} ${rem(-Math.floor(frame / COLS) * FRAME_H_REM)}`;

function showFrame(wrap: HTMLDivElement, rest: HTMLDivElement, frame: number) {
  rest.style.backgroundPosition = framePosition(frame);
  wrap.style.transform = `translateX(${rem(boxAt(frame))})`;
}

export function CatMascot() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const rest = restRef.current;
    const idle = idleRef.current;
    if (!wrap || !rest || !idle) return;

    wrap.style.width = rem(FRAME_W_REM);
    wrap.style.height = rem(FRAME_H_REM);
    rest.style.backgroundSize = `${rem(COLS * FRAME_W_REM)} ${rem(ROWS * FRAME_H_REM)}`;
    idle.style.backgroundSize = rest.style.backgroundSize;
    idle.style.transition = `opacity ${IDLE_FADE_MS}ms ease-in-out`;

    let raf = 0;
    let sitting = false;
    let disposed = false;

    const slot = wrap.parentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion keeps the hover animation (user-triggered) but drops the idle loop.
    const sit = () => {
      sitting = true;
      wrap.style.cursor = "pointer";
      wrap.style.pointerEvents = "auto";
      if (reduced) return;
      const img = new Image();
      img.src = "/cat/cat-idle.webp";
      img.decode().then(
        () => {
          if (disposed) return;
          idle.style.backgroundImage = `url(${img.src})`;
          scheduleIdle();
        },
        () => {},
      );
    };

    const run = (start: number) => {
      rest.style.backgroundImage = REST_IMAGE;
      wrap.style.visibility = "visible";
      slot?.setAttribute("data-cat-behind", "");
      const tick = (now: number) => {
        const frame = Math.min(FRAMES - 1, Math.floor((now - start) / FRAME_MS));
        showFrame(wrap, rest, frame);
        if (frame >= CLEAR_FRAME) slot?.removeAttribute("data-cat-behind");
        if (frame < FRAMES - 1) {
          raf = requestAnimationFrame(tick);
        } else {
          sit();
        }
      };
      raf = requestAnimationFrame(tick);
    };

    let tapRaf = 0;
    let hovering = false;
    let frame = FRAMES - 1;
    let lastStep = 0;
    let touchTap = false;
    let struck = false;

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
        showFrame(wrap, rest, frame);
        if (touchTap && frame === TAP_START) struck = true;
        if (touchTap && struck && frame === TAP_END) {
          touchTap = false;
          hovering = false;
        }
      }
      tapRaf = hovering || frame < FRAMES - 1 ? requestAnimationFrame(tapTick) : 0;
    };

    let idleTimer = 0;
    let idleRaf = 0;

    const scheduleIdle = () => {
      const [min, max] = IDLE_GAP_MS;
      idleTimer = window.setTimeout(playIdle, min + Math.random() * (max - min));
    };

    const stopIdle = () => {
      cancelAnimationFrame(idleRaf);
      idleRaf = 0;
      rest.style.opacity = "1";
      idle.style.opacity = "0";
    };

    const playIdle = () => {
      if (hovering || tapRaf) {
        scheduleIdle();
        return;
      }
      const show = (f: number) => {
        idle.style.backgroundPosition = framePosition(f);
        idle.style.transform = `translateX(${rem(-(IDLE_DRIFT_PX[f] ?? 0) * PX_REM)})`;
      };
      show(IDLE_FROM);
      idle.style.opacity = "1";
      const start = performance.now();
      const tick = (now: number) => {
        const f = Math.min(IDLE_TO, IDLE_FROM + Math.floor((now - start) / FRAME_MS));
        show(f);
        // Hidden, not unset: WebKit drops an unused sheet's decoded pixels and repaints it blank on return.
        if (now - start >= IDLE_FADE_MS) rest.style.opacity = "0";
        if (f < IDLE_TO) {
          idleRaf = requestAnimationFrame(tick);
        } else {
          stopIdle();
          scheduleIdle();
        }
      };
      idleRaf = requestAnimationFrame(tick);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      if (!sitting) return;
      if (idleRaf) {
        stopIdle();
        scheduleIdle();
      }
      hovering = true;
      touchTap = event.pointerType === "touch";
      struck = false;
      if (!tapRaf) tapRaf = requestAnimationFrame(tapTick);
    };
    // Touch fires leave as soon as the finger lifts, so a tap plays one full strike instead.
    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType !== "touch") hovering = false;
    };
    wrap.addEventListener("pointerenter", handlePointerEnter);
    wrap.addEventListener("pointerleave", handlePointerLeave);

    let observer: IntersectionObserver | undefined;
    if (reduced) {
      rest.style.backgroundImage = REST_IMAGE;
      showFrame(wrap, rest, FRAMES - 1);
      wrap.style.visibility = "visible";
      sit();
    } else {
      observer = new IntersectionObserver(
        ([entry], self) => {
          if (entry.isIntersecting) {
            self.disconnect();
            raf = requestAnimationFrame(run);
          }
        },
        { threshold: 0.6 },
      );
      observer.observe(wrap);
    }

    return () => {
      disposed = true;
      slot?.removeAttribute("data-cat-behind");
      observer?.disconnect();
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
      <div ref={restRef} className={styles.rest} />
      <div ref={idleRef} className={styles.idle} />
    </div>
  );
}
