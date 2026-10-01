import { useEffect, useRef } from "react";
import styles from "./sprite-cat.module.css";

/* `fps` plays the sheet at the speed it was filmed. */
type Sheet = { src: string; cols: number; rows: number; cell: [number, number]; fps: number };

export const sheets = {
  /* 75-87 dozes, 87-99 lifts the head, 99-108 looks ahead, 108-119 flicks the tail. */
  lie: { src: "/cat/cat-lie.webp", cols: 12, rows: 10, cell: [420, 172], fps: 12 },
  /* 0 sits, 0-48 the paw goes over the face. */
  oops: { src: "/cat/cat-oops.webp", cols: 10, rows: 5, cell: [351, 218], fps: 24 },
  /* 0-30 knocks the cup over. */
  cup: { src: "/cat/cat-cup.webp", cols: 8, rows: 4, cell: [480, 240], fps: 12 },
  /* 0 sits, 0-50 crouches and sniffs, 50-64 lifts the head, 65-79 crossfade, 80-101 lies down. */
  search: { src: "/cat/cat-search.webp", cols: 26, rows: 4, cell: [354, 234], fps: 24 },
} satisfies Record<string, Sheet>;

export type Cat = {
  node: HTMLDivElement;
  frame: number;
  show(frame: number): void;
  /* `speed` 1 = as filmed. */
  play(from: number, to: number, speed?: number): Promise<void>;
  wait(ms: number): Promise<void>;
};

/* Knocks the cup over once, then again on every hover or tap. */
export async function knockCup(cat: Cat) {
  cat.node.style.pointerEvents = "auto";
  await cat.wait(600);
  for (;;) {
    await cat.play(0, 30);
    await new Promise<void>((resolve) =>
      cat.node.addEventListener("pointerenter", () => resolve(), { once: true }),
    );
  }
}

/* Runs `script` once the sheet is on screen and decoded. Every wait also pauses
   while the cat is off screen, and rejects on unmount, which ends the script.
   With reduced motion it shows the `still` frame instead. */
export function SpriteCat({
  sheet,
  script,
  still,
  className,
}: {
  sheet: Sheet;
  script: (cat: Cat) => Promise<void>;
  still: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scriptRef = useRef(script);
  const stillRef = useRef(still);

  useEffect(() => {
    scriptRef.current = script;
    stillRef.current = still;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controller = new AbortController();
    const { signal } = controller;

    let visible = false;
    let onVisible: (() => void) | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        onVisible?.();
        onVisible = undefined;
      }
    });
    observer.observe(node);
    const onScreen = () =>
      visible ? Promise.resolve() : new Promise<void>((resolve) => (onVisible = resolve));

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const stop = () => {
          clearTimeout(timer);
          reject(signal.reason);
        };
        const timer = setTimeout(() => {
          signal.removeEventListener("abort", stop);
          resolve();
        }, ms);
        signal.addEventListener("abort", stop, { once: true });
      }).then(onScreen);

    const { cols, rows, fps } = sheet;
    const cat: Cat = {
      node,
      frame: 0,
      show(frame) {
        cat.frame = frame;
        const x = cols > 1 ? ((frame % cols) / (cols - 1)) * 100 : 0;
        const y = rows > 1 ? (Math.floor(frame / cols) / (rows - 1)) * 100 : 0;
        node.style.backgroundPosition = `${x}% ${y}%`;
      },
      async play(from, to, speed = 1) {
        const step = Math.sign(to - from);
        cat.show(from);
        for (let frame = from; frame !== to;) {
          await wait(1000 / (fps * speed));
          frame += step;
          cat.show(frame);
        }
      },
      wait,
    };

    onScreen()
      .then(() => {
        const img = new Image();
        img.src = sheet.src;
        return img.decode();
      })
      .then(() => {
        if (signal.aborted) return;
        node.style.backgroundImage = `url(${sheet.src})`;
        node.style.visibility = "visible";
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          cat.show(stillRef.current);
          return;
        }
        return scriptRef.current(cat);
      })
      .catch(() => {});

    return () => {
      controller.abort();
      observer.disconnect();
    };
  }, [sheet]);

  return (
    <div
      ref={ref}
      className={[styles.cat, className].filter(Boolean).join(" ")}
      style={{
        aspectRatio: `${sheet.cell[0]} / ${sheet.cell[1]}`,
        backgroundSize: `${sheet.cols * 100}% ${sheet.rows * 100}%`,
      }}
      aria-hidden="true"
    />
  );
}
