"use client";

import type { ReactNode } from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import styles from "./accordion.module.css";

export type AccordionItem = {
  id: string;
  lead?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  content: ReactNode;
};

export function Accordion({
  items,
  open,
  onOpenChange,
  className,
}: {
  items: AccordionItem[];
  open: string[];
  onOpenChange: (next: string[]) => void;
  className?: string;
}) {
  return (
    <RadixAccordion.Root
      type="multiple"
      value={open}
      onValueChange={onOpenChange}
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      {items.map((item) => (
        <RadixAccordion.Item key={item.id} value={item.id} className={styles.item}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className={styles.trigger}>
              {item.lead && <span className={styles.lead}>{item.lead}</span>}
              <span className={styles.text}>
                <span className={styles.title}>{item.title}</span>
                {item.meta && <span className={styles.meta}>{item.meta}</span>}
              </span>
              <span className={`screen-only ${styles.chevron}`} aria-hidden="true" />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content forceMount className={styles.content}>
            <div className={styles.body}>{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
