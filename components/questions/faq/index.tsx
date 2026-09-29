import { useId } from "react";
import type { FaqTopic } from "@/lib/ask/chunks";
import styles from "./faq.module.css";

export function Faq({ topics }: { topics: FaqTopic[] }) {
  const baseId = useId();

  return (
    <div className={styles.topics}>
      {topics.map((topic) => (
        <details
          key={topic.id}
          className={styles.topic}
          aria-labelledby={`${baseId}-topic-${topic.id}`}
        >
          <summary className={styles.topicTrigger}>
            <span id={`${baseId}-topic-${topic.id}`}>{topic.title}</span>
            <span className={styles.count}>{topic.items.length}</span>
            <span className={styles.caret} aria-hidden="true" />
          </summary>

          <div className={styles.questions}>
            {topic.items.map((item) => (
              <details
                key={item.id}
                className={styles.question}
                aria-labelledby={`${baseId}-q-${item.id}`}
              >
                <summary className={styles.questionTrigger}>
                  <span id={`${baseId}-q-${item.id}`}>{item.q}</span>
                  <span className={styles.plus} aria-hidden="true" />
                </summary>
                <p className={styles.answer}>{item.a}</p>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
