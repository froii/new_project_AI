import { useTranslations } from "next-intl";
import { certifications } from "@/content";
import { readCredential } from "@/lib/credentials";
import styles from "./certifications.module.css";

export function Certifications() {
  const t = useTranslations("certifications");

  return (
    <section className="section" id="certifications">
      <div className="shell stack">
        <h2>{t("heading")}</h2>

        <ul className={styles.grid} role="list">
          {certifications.map((item) => {
            const credential = item.href ? readCredential(item.href) : null;

            return (
              <li key={item.id} className={styles.card}>
                {credential && <p className={styles.host}>{credential.host}</p>}

                <p className={styles.name}>{t(`entries.${item.id}.name`)}</p>
                {t(`entries.${item.id}.issuer`) && (
                  <p className={styles.issuer}>{t(`entries.${item.id}.issuer`)}</p>
                )}

                <div className={styles.footer}>
                  {credential && (
                    <code className={styles.id} title={t("credentialId")}>
                      {credential.id}
                    </code>
                  )}
                  {item.issued && <span className={styles.issued}>{item.issued}</span>}
                </div>

                {item.href && (
                  <a className={styles.link} href={item.href}>
                    <span className={styles.linkText}>{t("view")}</span>
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none">
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
