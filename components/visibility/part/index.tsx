"use client";

import type { ReactNode } from "react";
import { useSections } from "@/components/providers/sections-provider";
import type { ToggleId } from "@/content/sections";

export function Part({
  id,
  children,
  className,
}: {
  id: ToggleId;
  children: ReactNode;
  className?: string;
}) {
  const { visible } = useSections();

  return (
    <div className={className} hidden={!visible[id]}>
      {children}
    </div>
  );
}
