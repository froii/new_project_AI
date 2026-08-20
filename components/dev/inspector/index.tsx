"use client";

import { useEffect, useState } from "react";
import styles from "./inspector.module.css";

type Info = {
  rect: { top: number; left: number; width: number; height: number };
  source: string;
  box: string;
  parent: string | null;
};

const moduleClass = /^(.+)-module__[^_]+__(.+)$/;

function describe(el: Element): string {
  const names = Array.from(el.classList)
    .map((name) => name.match(moduleClass))
    .filter(Boolean) as RegExpMatchArray[];

  if (names.length === 0) {
    const global = Array.from(el.classList).join(".");
    return global ? `${el.tagName.toLowerCase()}.${global}` : el.tagName.toLowerCase();
  }

  return names.map(([, file, local]) => `${file}.module.css · .${local}`).join("  ");
}

function metrics(el: Element): string {
  const style = getComputedStyle(el);
  const { width, height } = el.getBoundingClientRect();
  const round = (value: string) => Math.round(parseFloat(value) || 0);
  const parts = [`${Math.round(width)}×${Math.round(height)}`];

  const pad = [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(round);
  if (pad.some(Boolean)) parts.push(`padding ${pad.join(" ")}`);

  const gap = [style.rowGap, style.columnGap].map(round);
  if (gap.some(Boolean)) parts.push(`gap ${gap[0]} ${gap[1]}`);

  return parts.join(" · ");
}

export function Inspector() {
  const [info, setInfo] = useState<Info | null>(null);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!event.altKey) {
        setInfo(null);
        return;
      }

      const el = document.elementFromPoint(event.clientX, event.clientY);
      if (!el || el.closest(`.${styles.panel}`)) return;

      const { top, left, width, height } = el.getBoundingClientRect();
      const parent = el.parentElement;

      setInfo({
        rect: { top, left, width, height },
        source: describe(el),
        box: metrics(el),
        parent: parent ? `↑ ${describe(parent)} · ${metrics(parent)}` : null,
      });
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt") setInfo(null);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  if (!info) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      <div
        className={styles.outline}
        style={{
          top: info.rect.top,
          left: info.rect.left,
          width: info.rect.width,
          height: info.rect.height,
        }}
      />
      <div
        className={styles.panel}
        style={{ top: Math.max(4, info.rect.top - 46), left: Math.max(4, info.rect.left) }}
      >
        <span>{info.source}</span>
        <span>{info.box}</span>
        {info.parent && <span>{info.parent}</span>}
      </div>
    </div>
  );
}
