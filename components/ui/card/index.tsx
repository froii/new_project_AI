import type { ReactNode } from "react";
import styles from "./card.module.css";

export function Card({
  children,
  className,
  accent = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={[styles.card, accent ? styles.accent : null, className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
