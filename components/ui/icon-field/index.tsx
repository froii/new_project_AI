import type { CSSProperties } from "react";
import styles from "./icon-field.module.css";
import { icons } from "./icons";
import { PointerLayer } from "./pointer-layer";

const COLS = 6;
const COLS_NARROW = 3;
const SIZE_MIN = 36;
const SIZE_RANGE = 20;
const PITCH = SIZE_MIN + SIZE_RANGE + 100;

const noise = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

// x/y: scatter in %. gx/gy: cell in the packed grid, gx from its centre, gy up from its bottom row.
const cell = (i: number, cols: number) => {
  const rows = Math.ceil(icons.length / cols);
  const col = i % cols;
  const row = Math.floor(i / cols);
  return {
    x: Math.round(((col + 0.2 + 0.6 * noise(i, 1)) / cols) * 100),
    y: Math.round(((row + 0.2 + 0.6 * noise(i, 2)) / rows) * 100),
    gx: col - (cols - 1) / 2,
    gy: row - rows + 1,
  };
};

const items = icons.map(({ name, body }, i) => {
  const wide = cell(i, COLS);
  const narrow = cell(i, COLS_NARROW);
  const style = {
    "--x": wide.x,
    "--y": wide.y,
    "--xn": narrow.x,
    "--yn": narrow.y,
    "--gx": wide.gx,
    "--gy": wide.gy,
    "--gxn": narrow.gx,
    "--gyn": narrow.gy,
    "--jx": `${Math.round((noise(i, 1) - 0.5) * 60)}px`,
    "--jy": `${Math.round((noise(i, 2) - 0.5) * 60)}px`,
    "--pitch": `${PITCH}px`,
    "--size": `${SIZE_MIN + Math.round(SIZE_RANGE * noise(i, 3))}px`,
    "--depth": `${12 + Math.round(36 * noise(i, 4))}px`,
    "--tilt": `${Math.round((noise(i, 5) - 0.5) * 30)}deg`,
    "--spread": 50 + Math.round(60 * noise(i, 6)),
  } as CSSProperties;
  return { name, body, style, tone: i % 2 ? styles.muted : styles.accent };
});

/** The parent needs `position: relative; isolation: isolate`. */
export function IconField() {
  return (
    <PointerLayer className={styles.field}>
      {items.map(({ name, body, style, tone }) => (
        <svg
          key={name}
          className={`${styles.icon} ${tone}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {body}
        </svg>
      ))}
    </PointerLayer>
  );
}
