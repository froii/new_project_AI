"use client";

import { useSections } from "@/components/providers/sections-provider";
import styles from "./experience.module.css";

export function OpenAll({
  ids,
  extra,
  expand,
  collapse,
}: {
  ids: string[];
  extra: string[];
  expand: string;
  collapse: string;
}) {
  const { visible, open, setOpen } = useSections();
  const shown = visible["experience.all"] ? [...ids, ...extra] : ids;
  const allOpen = shown.every((id) => open.includes(id));

  return (
    <button
      type="button"
      className={`screen-only ${styles.openAll}`}
      aria-expanded={allOpen}
      aria-label={allOpen ? collapse : expand}
      title={allOpen ? collapse : expand}
      onClick={() =>
        setOpen(
          allOpen
            ? open.filter((id) => !shown.includes(id))
            : [...open, ...shown.filter((id) => !open.includes(id))],
        )
      }
    >
      <span className={styles.openAllIcon} aria-hidden="true" />
    </button>
  );
}
