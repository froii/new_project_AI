"use client";

import { useEffect, useState } from "react";
import { isToggleSection, sectionIds, type SectionId } from "@/content/sections";
import type { Visibility } from "@/lib/section-visibility";

const isShown = (visible: Visibility, id: SectionId) =>
  isToggleSection(id) ? visible[id] : true;

export function useActiveSection(visible: Visibility): SectionId | null {
  const [seen, setSeen] = useState<SectionId | null>(null);

  useEffect(() => {
    const elements = sectionIds
      .filter((id) => isShown(visible, id))
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const topmost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (topmost) setSeen(topmost.target.id as SectionId);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [visible]);

  return seen && isShown(visible, seen) ? seen : null;
}
