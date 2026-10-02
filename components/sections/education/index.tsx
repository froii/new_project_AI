import { useId } from "react";
import { useTranslations } from "next-intl";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import { education } from "@/content";
import { monthYear } from "@/lib/content";
import styles from "./education.module.css";

const recent = 2;

export function Education() {
  const headingId = useId();
  const t = useTranslations("education");
  const tExperience = useTranslations("experience");

  const entry = (item: (typeof education)[number]) => (
    <li key={item.id} className={styles.entry}>
      <div className={styles.head}>
        <p className={styles.degree}>{t(`entries.${item.id}.degree`)}</p>
        <p className={styles.period}>
          <span>{monthYear(item.start)}</span>
          <span>{item.end ? monthYear(item.end) : tExperience("present")}</span>
        </p>
      </div>

      <p className={styles.institution}>{item.institution}</p>

      {t(`entries.${item.id}.note`) && (
        <p className={styles.note}>{t(`entries.${item.id}.note`)}</p>
      )}

      <Part id="education.skills">
        <p className={styles.skills}>{item.skills.join(" · ")}</p>
      </Part>
    </li>
  );

  return (
    <section className="section" id="education" aria-labelledby={headingId}>
      <div className="block-head">
        <h2 id={headingId}>{t("heading")}</h2>
        <PartToggle
          id="education.all"
          label={t("scope.label")}
          off={t("scope.recent")}
          on={t("scope.all")}
        />
      </div>

      <ul className={styles.list} role="list">
        {education.slice(0, recent).map(entry)}
      </ul>

      <Part id="education.all" className={styles.rest}>
        <ul className={styles.list} role="list">
          {education.slice(recent).map(entry)}
        </ul>
      </Part>
    </section>
  );
}
