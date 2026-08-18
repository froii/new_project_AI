import styles from "./tag-list.module.css";

export function TagList({
  items,
  label,
  variant = "solid",
}: {
  items: string[];
  label: string;
  variant?: "solid" | "quiet";
}) {
  if (items.length === 0) return null;

  return (
    <ul className={styles.list} role="list" aria-label={label}>
      {items.map((item) => (
        <li key={item} className={[styles.tag, styles[variant]].join(" ")}>
          {item}
        </li>
      ))}
    </ul>
  );
}
