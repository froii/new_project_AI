"use client";

import styles from "./switch.module.css";

type SwitchProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export function Switch({ id, label, checked, onChange, className }: SwitchProps) {
  return (
    <span className={styles.wrap}>
      <input
        type="checkbox"
        role="switch"
        id={id}
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      <label htmlFor={id} className={[styles.track, className].filter(Boolean).join(" ")}>
        <span className={styles.knob} aria-hidden="true" />
      </label>
    </span>
  );
}
