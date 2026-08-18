import { useTranslations } from "next-intl";
import { achievements } from "@/content";
import { ExpandableText } from "@/components/visibility/expandable-text";
import { Part } from "@/components/visibility/part";
import styles from "./about.module.css";

export function About() {
  const t = useTranslations("about");

  return (
    <section className="section" id="about">
      <div className="shell stack">
        <h2>{t("heading")}</h2>
        <ExpandableText id="about.full">{t("body")}</ExpandableText>

        <Part id="about.achievements">
          <h3 className={styles.heading}>{t("achievementsHeading")}</h3>
          <ul className={styles.grid} role="list">
            {achievements.map((item) => (
              <li key={item.id} className={styles.tile}>
                <span className={styles.metric}>{item.metric}</span>
                <span className={styles.text}>{t(`achievements.${item.id}`)}</span>
              </li>
            ))}
          </ul>
        </Part>

        <Part id="about.personal">
          <h3 className={styles.heading}>{t("personalHeading")}</h3>
          <div className={styles.personal}>
            {t.raw("personal").map((paragraph: string) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>
        </Part>
      </div>
    </section>
  );
}
