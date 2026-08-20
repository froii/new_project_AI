"use client";

import { useSections } from "@/components/providers/sections-provider";
import type { ToggleId } from "@/content/sections";
import styles from "./part-toggle.module.css";

export function PartToggle({
  id,
  label,
  off,
  on,
}: {
  id: ToggleId;
  label: string;
  off: string;
  on: string;
}) {
  const { visible, toggle } = useSections();

  return (
    <div className={`screen-only ${styles.root}`} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.option}
        aria-pressed={!visible[id]}
        onClick={() => visible[id] && toggle(id)}
      >
        {off}
      </button>
      <button
        type="button"
        className={styles.option}
        aria-pressed={visible[id]}
        onClick={() => !visible[id] && toggle(id)}
      >
        {on}
      </button>
    </div>
  );
}
