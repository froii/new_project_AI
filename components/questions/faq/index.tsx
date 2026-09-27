"use client";

import * as Accordion from "@radix-ui/react-accordion";
import type { FaqTopic } from "@/lib/ask/chunks";
import styles from "./faq.module.css";

/* Own Radix tree: ui/accordion carries CV-only styles. forceMount keeps answers in the HTML. */
export function Faq({ topics }: { topics: FaqTopic[] }) {
  return (
    <Accordion.Root type="multiple" className={styles.topics}>
      {topics.map((topic) => (
        <Accordion.Item key={topic.id} value={topic.id} className={styles.topic}>
          <Accordion.Header asChild>
            <h2 className={styles.topicHeading}>
              <Accordion.Trigger className={styles.topicTrigger}>
                <span>{topic.title}</span>
                <span className={styles.count}>{topic.items.length}</span>
                <span className={styles.caret} aria-hidden="true" />
              </Accordion.Trigger>
            </h2>
          </Accordion.Header>

          <Accordion.Content forceMount className={styles.content}>
            <Accordion.Root type="multiple" className={styles.questions}>
              {topic.items.map((item) => (
                <Accordion.Item key={item.id} value={item.id} className={styles.question}>
                  <Accordion.Header className={styles.questionHeading}>
                    <Accordion.Trigger className={styles.questionTrigger}>
                      <span>{item.q}</span>
                      <span className={styles.plus} aria-hidden="true" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content forceMount className={styles.content}>
                    <p className={styles.answer}>{item.a}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
