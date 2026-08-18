import type { TextareaHTMLAttributes } from "react";
import styles from "./textarea.module.css";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={[styles.textarea, className].filter(Boolean).join(" ")} />;
}
