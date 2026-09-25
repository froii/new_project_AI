"use client";

import { useEffect, useRef } from "react";
import styles from "./cat-mascot.module.css";

// One continuous reference shot (no cuts): the cat sits, stands and turns, walks, sits down, taps
// low, then strikes high. Sampled at 12fps and shown at that rate, so it plays at its real pace.
// Sprite frames are 320x180px (the full source width) in a 40x3 grid.
const FRAME_H_REM = 4.86; // keep in sync with the floor offset in cat-mascot.module.css
const PX_REM = FRAME_H_REM / 180;
const FRAME_W_REM = 320 * PX_REM;
const FRAME_MS = 1000 / 12;
const FRAMES = 120;
const COLS = 40;
const ROWS = 3;

// Box offset per frame, measured from the source: the camera pans with the cat while it walks, and
// that pan (read off the ground under the planted paws) is how far the cat really travels. Zero
// while it turns in place, then the walk, then flat once the camera stops and it sits down - after
// that the cat's own movement is inside the frames.
const TRACK_REM = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.027,
  0.088, 0.171, 0.267, 0.383, 0.514, 0.653, 0.819, 1.015, 1.201, 1.396, 1.608, 1.857, 2.136, 2.426,
  2.666, 2.889, 3.097, 3.312, 3.537, 3.727, 3.896, 4.066, 4.276, 4.54, 4.862, 5.195, 5.441, 5.692,
  5.937, 6.172, 6.351, 6.536, 6.751, 6.981, 7.19, 7.399, 7.6, 7.776, 7.896, 8.005, 8.104, 8.154,
];
const TRAVEL_REM = TRACK_REM[TRACK_REM.length - 1];
// Once seated (frame 76) the source cat slowly slides left on the floor; this cancels it, measured
// from the paw it sits on (smoothed), so the seated cat holds its spot - the lean into a strike
// stays, since that is the body moving, not the cat.
const SEAT_FROM = 76;
const SEAT_FIX_REM = [
  0, 0.009, 0.004, 0.004, -0.023, -0.05, -0.056, -0.05, -0.029, 0.02, 0.079, 0.128, 0.198, 0.268,
  0.333, 0.387, 0.441, 0.479, 0.495, 0.484, 0.468, 0.457, 0.452, 0.473, 0.527, 0.592, 0.646, 0.7,
  0.743, 0.776, 0.803, 0.83, 0.846, 0.857, 0.868, 0.873, 0.873, 0.873, 0.878, 0.884, 0.889, 0.895,
  0.9, 0.9,
];
// Box position when the cat sits down, from the CV button's right edge (the box's anchor). Set so
// the strike's farthest paw tip (frame 106: 2.24rem into the frame, +0.8rem seat fix) lands 0.35rem
// inside the button; the seated body then rests ~0.85rem clear of it. The walk starts TRAVEL_REM to
// the left, i.e. behind the button.
const END_REM = -3.39;
const START_REM = END_REM - TRAVEL_REM;
// First frame where the whole cat, tail included, is past the button's right edge. Until then the
// container is flagged so the page can see the cat through the button it walks behind.
const CLEAR_FRAME = 73;
const boxAt = (frame: number) =>
  START_REM +
  TRACK_REM[Math.min(frame, TRACK_REM.length - 1)] +
  (frame >= SEAT_FROM ? SEAT_FIX_REM[frame - SEAT_FROM] : 0);

// Hover loops the whole high strike at its real pace: paw up to the chest, out and high, back down
// to the floor (99-111), a short hold with the paw down, then again. Entering rewinds from the rest
// pose to the landed paw; leaving plays forward to the rest pose, so no pose ever jumps.
const TAP_START = 99;
const TAP_END = 111;
const TAP_HOLD_MS = 400;
const TAP_REWIND_MS = 45;
const TAP_SETTLE_MS = 70;

function showFrame(node: HTMLDivElement, frame: number) {
  node.style.backgroundPosition = `${-(frame % COLS) * FRAME_W_REM}rem ${-Math.floor(frame / COLS) * FRAME_H_REM}rem`;
  node.style.transform = `translateX(${boxAt(frame)}rem)`;
}

export function CatMascot() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.style.width = `${FRAME_W_REM}rem`;
    wrap.style.height = `${FRAME_H_REM}rem`;
    wrap.style.backgroundSize = `${COLS * FRAME_W_REM}rem ${ROWS * FRAME_H_REM}rem`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.style.backgroundImage = "url(/cat/cat.webp)";
      showFrame(wrap, FRAMES - 1);
      wrap.style.visibility = "visible";
      return;
    }

    let raf = 0;
    let sitting = false;

    const slot = wrap.parentElement;

    const run = (start: number) => {
      wrap.style.backgroundImage = "url(/cat/cat.webp)";
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

    const handlePointerEnter = () => {
      if (!sitting) return;
      hovering = true;
      if (!tapRaf) tapRaf = requestAnimationFrame(tapTick);
    };
    const handlePointerLeave = () => {
      hovering = false;
    };
    wrap.addEventListener("pointerenter", handlePointerEnter);
    wrap.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      slot?.removeAttribute("data-cat-behind");
      observer.disconnect();
      wrap.removeEventListener("pointerenter", handlePointerEnter);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tapRaf);
    };
  }, []);

  return <div ref={wrapRef} className={styles.wrap} aria-hidden="true" />;
}
