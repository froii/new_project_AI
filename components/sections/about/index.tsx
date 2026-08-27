import { useTranslations } from "next-intl";
import { achievements } from "@/content";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import styles from "./about.module.css";

export function About() {
  const t = useTranslations("about");

  return (
    <section className="section" id="about">
      <h2>{t("heading")}</h2>

      <div className="body">
        <div className={styles.summary}>
          <p>{t("body")}</p>
        </div>

        <div className={styles.group}>
          <div className="block-head">
            <p className={styles.label}>{t("achievementsHeading")}</p>
            <PartToggle
              id="about.achievementsFull"
              label={t("achievementsScope.label")}
              off={t("achievementsScope.short")}
              on={t("achievementsScope.full")}
            />
          </div>
          <ul className={styles.results} role="list">
            {achievements.map((item) => (
              <li key={item.id} className={styles.result}>
                {t(`achievements.${item.id}.short`)}
                <Part id="about.achievementsFull" className={styles.detail}>
                  {t(`achievements.${item.id}.detail`)}
                </Part>
              </li>
            ))}
          </ul>
        </div>

        <Part id="about.personal" className={styles.group}>
          <div className="block-head">
            <p className={styles.label}>{t("personalHeading")}</p>
          </div>
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
