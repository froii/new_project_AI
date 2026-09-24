import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./cv-link.module.css";

export function CvLink({ children }: { children: ReactNode }) {
  return (
    <Link className={styles.link} href="/cv">
      {children}
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 12h15m-6-6 6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
