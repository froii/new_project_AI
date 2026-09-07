"use client";

import { useEffect, useState } from "react";

const step = 8;

export function useScrollAway(held: boolean) {
  const [away, setAway] = useState(false);
  const [wasHeld, setWasHeld] = useState(held);

  if (held !== wasHeld) {
    setWasHeld(held);
    if (held) setAway(false);
  }

  useEffect(() => {
    if (held) return;

    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < step) return;

      last = y;
      setAway(delta > 0 && y > window.innerHeight / 2);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [held]);

  return away;
}
