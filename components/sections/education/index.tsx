import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { TagList } from "@/components/ui/tag-list";
import { Part } from "@/components/visibility/part";
import { education } from "@/content";
import styles from "./education.module.css";

export function Education() {
  const t = useTranslations("education");

  return (
    <section className="section" id="education">
      <div className="shell stack">
        <h2>{t("heading")}</h2>
        <ul className={styles.list} role="list">
          {education.map((entry) => (
            <li key={entry.id}>
              <Card className={styles.card} accent>
                <p className={styles.period}>
                  {entry.start}
                  {entry.end ? ` — ${entry.end}` : ""}
                </p>
                <p className={styles.degree}>{t(`entries.${entry.id}.degree`)}</p>
                <p className={styles.institution}>{entry.institution}</p>
                {t(`entries.${entry.id}.note`) && (
                  <p className={styles.note}>{t(`entries.${entry.id}.note`)}</p>
                )}
                <Part id="education.skills" className={styles.skills}>
                  <p className={styles.skillsLabel}>{t("skillsLabel")}</p>
                  <TagList items={entry.skills} label={t("skillsLabel")} variant="quiet" />
                </Part>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
