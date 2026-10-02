import { useId } from "react";
import { useTranslations } from "next-intl";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import { skills } from "@/content";
import styles from "./skills.module.css";

const featured = 5;

/* No-break space before the dot, so a wrapped line never starts with it. */
const separator = " · ";

export function Skills() {
  const headingId = useId();
  const t = useTranslations("skills");

  const rows = (groups: typeof skills) =>
    groups.map((group) => (
      <li key={group.id} className={styles.row}>
        <span className={styles.name}>{t(`groups.${group.id}`)}</span>
        <div className={styles.items}>
          {group.items.join(separator)}
          {group.more && (
            <Part id="skills.full" className={styles.tail}>
              {separator + group.more.join(separator)}
            </Part>
          )}
        </div>
      </li>
    ));

  return (
    <section className="section" id="skills" aria-labelledby={headingId}>
      <div className="block-head">
        <h2 id={headingId}>{t("heading")}</h2>
        <PartToggle
          id="skills.full"
          label={t("scope.label")}
          off={t("scope.core")}
          on={t("scope.full")}
        />
      </div>

      <ul className={styles.list} role="list">
        {rows(skills.slice(0, featured))}
      </ul>

      <Part id="skills.full">
        <ul className={`${styles.list} ${styles.more}`} role="list">
          {rows(skills.slice(featured))}
        </ul>
      </Part>
    </section>
  );
}
