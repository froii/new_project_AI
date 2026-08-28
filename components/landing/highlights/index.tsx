import { useTranslations } from "next-intl";
import { TagList } from "@/components/ui/tag-list";
import { skills } from "@/content";
import { Carousel } from "./carousel";
import styles from "./highlights.module.css";

const featured = ["platform", "ai", "language", "payments", "performance", "review"] as const;

const stack = ["frontend", "backend", "ai"].flatMap(
  (id) => skills.find((group) => group.id === id)?.items.slice(0, 3) ?? [],
);

export function Highlights() {
  const t = useTranslations("landing");
  const tAbout = useTranslations("about");

  const items = featured.map((id) => ({
    id,
    title: t(`work.${id}`),
    body: tAbout(`achievements.${id}.short`),
  }));

  return (
    <section className={styles.highlights}>
      <div className={`shell ${styles.layout}`}>
        <h2 className={styles.heading}>{t("work.heading")}</h2>

        <Carousel items={items} prevLabel={t("work.previous")} nextLabel={t("work.next")} />

        <div className={styles.stack}>
          <p className={styles.stackLabel}>{t("stackHeading")}</p>
          <TagList items={stack} label={t("stackHeading")} />
        </div>
      </div>
    </section>
  );
}
