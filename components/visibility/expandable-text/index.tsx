"use client";

import { useSections } from "@/components/providers/sections-provider";
import type { ToggleId } from "@/content/sections";
import styles from "./expandable-text.module.css";

export function ExpandableText({ id, children }: { id: ToggleId; children: string }) {
  const { visible } = useSections();

  return <p className={visible[id] ? undefined : styles.clamped}>{children}</p>;
}
