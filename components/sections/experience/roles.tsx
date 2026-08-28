"use client";

import { useSections } from "@/components/providers/sections-provider";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";

export function Roles({ items, className }: { items: AccordionItem[]; className?: string }) {
  const { open, setOpen } = useSections();
  const ids = items.map((item) => item.id);

  return (
    <Accordion
      items={items}
      className={className}
      open={open.filter((id) => ids.includes(id))}
      onOpenChange={(next) => setOpen([...open.filter((id) => !ids.includes(id)), ...next])}
    />
  );
}
