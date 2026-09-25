"use client";

import { useEffect, useState, type TouchEvent, type TransitionEvent } from "react";
import styles from "./highlights.module.css";

type Item = { id: string; title: string; body: string };

const VISIBLE = 3;
const INTERVAL = 3000;
const SWIPE = 40;

/* Static track with edge copies: a slide only moves `translate`. Past either
   end, `pos` snaps back to the identical frame once the slide lands. */
export function Carousel({
  items,
  prevLabel,
  nextLabel,
}: {
  items: Item[];
  prevLabel: string;
  nextLabel: string;
}) {
  const [pos, setPos] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [paused, setPaused] = useState(false);
  const [touch, setTouch] = useState<{ x: number; y: number } | null>(null);

  const wrap = (value: number) => (value + items.length) % items.length;

  const move = (step: 1 | -1) => {
    if (sliding) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos((value) => wrap(value + step));
      return;
    }
    setSliding(true);
    setPos((value) => value + step);
  };

  const land = (event: TransitionEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget || !sliding) return;
    setSliding(false);
    setPos(wrap);
  };

  const swipe = (event: TouchEvent) => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    setTouch(null);
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    if (paused || sliding || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setTimeout(() => {
      setSliding(true);
      setPos((value) => value + 1);
    }, INTERVAL);
    return () => clearTimeout(timer);
  }, [paused, sliding]);

  const slots = Array.from(
    { length: items.length + VISIBLE + 1 },
    (_, slot) => items[wrap(slot - 1)],
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

      <div
        className={styles.viewport}
        onTouchStart={(event) =>
          setTouch({ x: event.touches[0].clientX, y: event.touches[0].clientY })
        }
        onTouchEnd={swipe}
      >
        <ul
          className={styles.track}
          style={{ "--pos": pos + 1 } as React.CSSProperties}
          data-sliding={sliding ? "" : undefined}
          onTransitionEnd={land}
          role="list"
        >
          {slots.map((item, slot) => (
            <li
              key={slot}
              className={styles.card}
              aria-hidden={slot <= pos || slot > pos + VISIBLE || undefined}
            >
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </li>
          ))}
        </ul>

        <div className={styles.sizer} aria-hidden="true">
          {items.map((item) => (
            <div key={item.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </div>
          ))}
        </div>
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
