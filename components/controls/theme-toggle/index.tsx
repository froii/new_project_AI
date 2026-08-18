"use client";

import { useTheme } from "next-themes";
import { useHydrated } from "@/lib/use-hydrated";
import styles from "./theme-toggle.module.css";

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();

  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      aria-pressed={hydrated ? resolvedTheme === "dark" : undefined}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <svg className={styles.sun} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="5" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </g>
      </svg>
      <svg className={styles.moon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="currentColor" />
      </svg>
    </button>
  );
}
