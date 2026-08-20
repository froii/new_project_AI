import { useTranslations } from "next-intl";
import { achievements } from "@/content";
import { Part } from "@/components/visibility/part";
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

        <Part id="about.achievements">
          <p className={styles.label}>{t("achievementsHeading")}</p>
          <ul className={styles.results} role="list">
            {achievements.map((item) => (
              <li key={item.id} className={styles.result}>
                {t(`achievements.${item.id}`)}
              </li>
            ))}
          </ul>
        </Part>

        <Part id="about.personal">
          <p className={styles.label}>{t("personalHeading")}</p>
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
