"use client";

import { useRef, useState } from "react";
import styles from "./section-menu.module.css";

export type ChipItem = { id: string; label: string; on: boolean };

export function PartChips({
  items,
  disabled,
  label,
  onToggle,
}: {
  items: ChipItem[];
  disabled: boolean;
  label: string;
  onToggle: (id: string) => void;
}) {
  const [focus, setFocus] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusAt = (index: number) => {
    setFocus(index);
    refs.current[index]?.focus();
  };

  /* One tab stop for the whole group, arrows inside: thirteen parts across the
     panel would otherwise be thirteen stops between the list and the footer. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];

    if (step) {
      event.preventDefault();
      focusAt((focus + step + items.length) % items.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(items.length - 1);
    }
  };

  return (
    <div className={styles.chips} role="group" aria-label={label} onKeyDown={onKeyDown}>
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="button"
          className={styles.chip}
          aria-pressed={item.on}
          disabled={disabled}
          tabIndex={index === focus ? 0 : -1}
          onFocus={() => setFocus(index)}
          onClick={() => onToggle(item.id)}
        >
          <svg className={styles.tick} viewBox="0 0 12 12" aria-hidden="true" fill="none">
            <path
              d="M2.5 6.4 4.8 8.7 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {item.label}
        </button>
      ))}
    </div>
  );
}
