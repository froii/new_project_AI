import type { ReactNode } from "react";
import { StatusCat } from "./status-cat";
import styles from "./status.module.css";

/* Shell for 404 inside a locale, 404 above one, and the render error. The way out
   differs (next-intl Link, plain anchor, reset button), so the caller passes the actions. */
export function Status({
  code,
  heading,
  body,
  cat,
  children,
}: {
  code: string;
  heading: string;
  body: string;
  cat: "search" | "oops";
  children: ReactNode;
}) {
  return (
    <main className={styles.status}>
      <p className={styles.code}>{code}</p>
      <h1 className={styles.heading}>{heading}</h1>
      <p className={styles.body}>{body}</p>
      <div className={styles.actions}>
        {children}
        <StatusCat variant={cat} />
      </div>
    </main>
  );
}
