import { useTranslations } from "next-intl";
import styles from "./principles.module.css";

const principles = ["ownership", "quality", "respect"] as const;

export function Principles() {
  const t = useTranslations("landing.principles");

  return (
    <section className={styles.principles}>
      <div className={`shell ${styles.layout}`}>
        <h2 className={styles.heading}>{t("heading")}</h2>

        <ol className={styles.list} role="list">
          {principles.map((id) => (
            <li key={id} className={styles.item}>
              <h3 className={styles.title}>{t(`${id}.title`)}</h3>
              <p className={styles.body}>{t(`${id}.body`)}</p>
            </li>
          ))}
        </ol>

        <p className={styles.aside}>{t("aside")}</p>
      </div>
    </section>
  );
}
