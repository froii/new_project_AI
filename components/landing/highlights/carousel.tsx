"use client";

import { useEffect, useState, type TransitionEvent } from "react";
import styles from "./highlights.module.css";

type Item = { id: string; title: string; body: string };

const VISIBLE = 3;
const INTERVAL = 5000;

/* The track renders one card either side of the three on show, so a shift has
   something to slide in from and the animation can start from the outgoing
   frame instead of a gap. `shift` is the slide in progress: the track moves by
   one step, and only when it lands does `start` take over the same offset, with
   the transition off so nothing moves back. */
export function Carousel({
  items,
  prevLabel,
  nextLabel,
}: {
  items: Item[];
  prevLabel: string;
  nextLabel: string;
}) {
  const [start, setStart] = useState(0);
  const [shift, setShift] = useState(0);
  const [paused, setPaused] = useState(false);

  const move = (step: 1 | -1) => {
    if (shift !== 0) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStart((value) => (value + step + items.length) % items.length);
      return;
    }
    setShift(-step);
  };

  const land = (event: TransitionEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget || shift === 0) return;
    setStart((value) => (value - shift + items.length) % items.length);
    setShift(0);
  };

  useEffect(() => {
    if (paused || shift !== 0 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(() => setShift(-1), INTERVAL);
    return () => clearTimeout(timer);
  }, [paused, shift]);

  const slots = Array.from(
    { length: VISIBLE + 2 },
    (_, slot) => items[(start + slot - 1 + items.length) % items.length],
  );

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <button
        type="button"
        className={styles.arrow}
        aria-label={prevLabel}
        onClick={() => move(-1)}
      >
        <Chevron />
      </button>

      <div className={styles.viewport}>
        <ul
          className={styles.track}
          style={{ "--shift": shift } as React.CSSProperties}
          data-sliding={shift !== 0 ? "" : undefined}
          onTransitionEnd={land}
          role="list"
        >
          {slots.map((item, slot) => (
            <li
              key={item.id}
              className={styles.card}
              aria-hidden={slot === 0 || slot === VISIBLE + 1 || undefined}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        aria-label={nextLabel}
        onClick={() => move(1)}
      >
        <Chevron />
      </button>
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.5 7.5 9 12l4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
