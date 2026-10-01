"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Icons come in as server-rendered children, so their SVG stays out of the client bundle.
export function PointerLayer({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const host = layer?.parentElement;
    if (!layer || !host) return;
    const query = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
    if (!window.matchMedia(query).matches) return;

    let raf = 0;
    let clientX = 0;
    let clientY = 0;
    let inside = false;

    const apply = () => {
      raf = 0;
      const rect = host.getBoundingClientRect();
      const mx = inside ? ((clientX - rect.left) / rect.width) * 2 - 1 : 0;
      const my = inside ? ((clientY - rect.top) / rect.height) * 2 - 1 : 0;
      layer.style.setProperty("--mx", mx.toFixed(3));
      layer.style.setProperty("--my", my.toFixed(3));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const handleMove = (event: PointerEvent) => {
      inside = true;
      clientX = event.clientX;
      clientY = event.clientY;
      schedule();
    };
    const handleLeave = () => {
      inside = false;
      schedule();
    };

    host.addEventListener("pointermove", handleMove);
    host.addEventListener("pointerleave", handleLeave);
    return () => {
      host.removeEventListener("pointermove", handleMove);
      host.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {children}
    </div>
  );
}
