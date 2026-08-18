import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline";
};

export function Button({ variant = "solid", className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={[styles.button, styles[variant], className].filter(Boolean).join(" ")}
    />
  );
}
