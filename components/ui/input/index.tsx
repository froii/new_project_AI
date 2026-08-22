import type { ComponentPropsWithRef } from "react";
import styles from "./input.module.css";

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return <input {...props} className={[styles.input, className].filter(Boolean).join(" ")} />;
}
