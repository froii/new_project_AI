"use client";

import type { ReactNode } from "react";
import { useSections } from "@/components/providers/sections-provider";
import type { ToggleId } from "@/content/sections";

export function Part({
  id,
  children,
  className,
  whenOff = false,
}: {
  id: ToggleId;
  children: ReactNode;
  className?: string;
  /* Renders in place of the part while it is switched off. */
  whenOff?: boolean;
}) {
  const { visible } = useSections();

  return (
    <div className={className} hidden={visible[id] === whenOff}>
      {children}
    </div>
  );
}
