import { useTranslations } from "next-intl";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import { education } from "@/content";
import styles from "./education.module.css";

const recent = 2;

export function Education() {
  const t = useTranslations("education");

  const entry = (item: (typeof education)[number]) => (
    <li key={item.id} className={styles.entry}>
      <div className={styles.head}>
        <p className={styles.degree}>{t(`entries.${item.id}.degree`)}</p>
        <p className={styles.period}>
          {item.start}
          {item.end ? `-${item.end}` : ""}
        </p>
      </div>

      <p className={styles.institution}>{item.institution}</p>

      {t(`entries.${item.id}.note`) && (
        <p className={styles.note}>{t(`entries.${item.id}.note`)}</p>
      )}

      <Part id="education.skills">
        <p className={styles.skills}>{item.skills.join(" · ")}</p>
      </Part>
    </li>
  );

  return (
    <section className="section" id="education">
      <div className="block-head">
        <h2>{t("heading")}</h2>
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

      <Part id="education.all">
        <ul className={styles.list} role="list">
          {education.slice(recent).map(entry)}
        </ul>
      </Part>
    </section>
  );
}
