import type { ReactNode } from "react";
import styles from "./status.module.css";

/* The shell the three dead ends share - 404 inside a locale, 404 above one, and
   a render error. What differs between them is not the shape but how they get
   the visitor out: a next-intl Link, a plain anchor, a reset button. So the
   actions stay with the caller and only the shell lives here. */
export function Status({
  code,
  heading,
  body,
  children,
}: {
  code: string;
  heading: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.status}>
      <p className={styles.code}>{code}</p>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.body}>{body}</p>
      <div className={styles.actions}>{children}</div>
    </main>
  );
}
