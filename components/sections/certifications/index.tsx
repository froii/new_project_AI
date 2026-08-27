import { useTranslations } from "next-intl";
import { certifications } from "@/content";
import { dottedDate } from "@/lib/content";
import { readCredential } from "@/lib/credentials";
import styles from "./certifications.module.css";

export function Certifications() {
  const t = useTranslations("certifications");

  return (
    <section className="section" id="certifications">
      <div className="block-head">
        <h2>{t("heading")}</h2>
      </div>

      <ul className={styles.list} role="list">
        {certifications.map((item) => {
          const credential = item.href ? readCredential(item.href) : null;
          const meta = [
            t(`entries.${item.id}.issuer`),
            item.issued && dottedDate(item.issued),
            credential?.host,
          ].filter(Boolean);

          return (
            <li key={item.id} className={styles.entry}>
              <div className={styles.text}>
                <p className={styles.name}>{t(`entries.${item.id}.name`)}</p>
                {meta.length > 0 && <p className={styles.meta}>{meta.join(" · ")}</p>}
              </div>

              {item.href && (
                <a
                  className={`screen-only ${styles.link}`}
                  href={item.href}
                  aria-label={t("view")}
                  title={credential ? `${t("credentialId")}: ${credential.id}` : t("view")}
                >
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
    </section>
  );
}
