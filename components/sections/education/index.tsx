import { useTranslations } from "next-intl";
import { Part } from "@/components/visibility/part";
import { education } from "@/content";
import styles from "./education.module.css";

export function Education() {
  const t = useTranslations("education");

  return (
    <section className="section" id="education">
      <div className="block-head">
        <h2>{t("heading")}</h2>
      </div>

      <ul className={styles.list} role="list">
        {education.map((entry) => (
          <li key={entry.id} className={styles.entry}>
            <div className={styles.head}>
              <p className={styles.degree}>{t(`entries.${entry.id}.degree`)}</p>
              <p className={styles.period}>
                {entry.start}
                {entry.end ? `-${entry.end}` : ""}
              </p>
            </div>

            <p className={styles.institution}>{entry.institution}</p>

            {t(`entries.${entry.id}.note`) && (
              <p className={styles.note}>{t(`entries.${entry.id}.note`)}</p>
            )}

            <Part id="education.skills">
              <p className={styles.skills}>{entry.skills.join(" · ")}</p>
            </Part>
          </li>
        ))}
      </ul>
    </section>
  );
}
