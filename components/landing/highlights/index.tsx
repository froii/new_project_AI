import { useTranslations } from "next-intl";
import { TagList } from "@/components/ui/tag-list";
import { skills } from "@/content";
import styles from "./highlights.module.css";

const featured = ["platform", "ai", "language"] as const;

const stack = ["frontend", "backend", "ai"].flatMap(
  (id) => skills.find((group) => group.id === id)?.items.slice(0, 3) ?? [],
);

export function Highlights() {
  const t = useTranslations("landing");
  const tAbout = useTranslations("about");

  return (
    <section className={styles.highlights}>
      <div className={`shell ${styles.layout}`}>
        <h2 className={styles.heading}>{t("work.heading")}</h2>

        <ul className={styles.cards} role="list">
          {featured.map((id, index) => (
            <li key={id} className={styles.card}>
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
              <h3 className={styles.cardTitle}>{t(`work.${id}`)}</h3>
              <p className={styles.cardBody}>{tAbout(`achievements.${id}.short`)}</p>
            </li>
          ))}
        </ul>

        <div className={styles.stack}>
          <p className={styles.stackLabel}>{t("stackHeading")}</p>
          <TagList items={stack} label={t("stackHeading")} />
        </div>
      </div>
    </section>
  );
}
