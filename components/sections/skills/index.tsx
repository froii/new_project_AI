import { useTranslations } from "next-intl";
import { Part } from "@/components/visibility/part";
import { PartToggle } from "@/components/visibility/part-toggle";
import { skills } from "@/content";
import styles from "./skills.module.css";

const featured = 5;

export function Skills() {
  const t = useTranslations("skills");

  const rows = (groups: typeof skills) =>
    groups.map((group) => (
      <li key={group.id} className={styles.row}>
        <span className={styles.name}>{t(`groups.${group.id}`)}</span>
        <div className={styles.items}>
          {group.items.join(" · ")}
          {group.more && (
            <Part id="skills.full" className={styles.tail}>{` · ${group.more.join(" · ")}`}</Part>
          )}
        </div>
      </li>
    ));

  return (
    <section className="section" id="skills">
      <div className="block-head">
        <h2>{t("heading")}</h2>
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
