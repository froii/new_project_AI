import type { ReactNode } from "react";
import styles from "./field-list.module.css";

export function FieldList({ children }: { children: ReactNode }) {
  return <dl className={styles.list}>{children}</dl>;
}

export function Field({ term, children }: { term: string; children: ReactNode }) {
  return (
    <>
      <dt className={styles.term}>{term}</dt>
      <dd className={styles.value}>{children}</dd>
    </>
  );
}
