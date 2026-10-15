"use client";

import { useEffect, useRef } from "react";

// Plays once and rests on the clip's last frame; the poster is the clip's first frame, so neither end jumps.
export function LivePortrait({ label }: { label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ref.current?.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src="/photos/suit-live.mp4"
      poster="/photos/suit-live.webp"
      width={540}
      height={720}
      muted
      playsInline
      preload="none"
      role="img"
      aria-label={label}
    />
  );
}
