"use client";

import type { ReactNode } from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import styles from "./accordion.module.css";

export type AccordionItem = {
  id: string;
  title: string;
  meta?: string;
  content: ReactNode;
};

export function Accordion({
  items,
  defaultOpen = [],
}: {
  items: AccordionItem[];
  defaultOpen?: string[];
}) {
  return (
    <RadixAccordion.Root type="multiple" defaultValue={defaultOpen} className={styles.root}>
      {items.map((item) => (
        <RadixAccordion.Item key={item.id} value={item.id} className={styles.item}>
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className={styles.trigger}>
              <span className={styles.text}>
                <span className={styles.title}>{item.title}</span>
                {item.meta && <span className={styles.meta}>{item.meta}</span>}
              </span>
              <span className={styles.chevron} aria-hidden="true" />
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className={styles.content}>
            <div className={styles.body}>{item.content}</div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
