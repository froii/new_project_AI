"use client";

import type { ReactNode } from "react";
import { useSections } from "@/components/providers/sections-provider";
import type { SectionId } from "@/content/sections";

export function SectionSlot({ id, children }: { id: SectionId; children: ReactNode }) {
  const { visible } = useSections();

  return (
    <div className="section-slot" hidden={!visible[id]}>
      {children}
    </div>
  );
}
