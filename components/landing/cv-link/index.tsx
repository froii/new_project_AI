import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { Link } from "@/i18n/navigation";
import styles from "./cv-link.module.css";

export function CvLink({ children }: { children: ReactNode }) {
  return (
    <Link className={styles.link} href="/cv">
      {children}
      <ArrowIcon />
    </Link>
  );
}
