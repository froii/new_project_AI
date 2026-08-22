import { useTranslations } from "next-intl";
import { owner } from "@/content";
import { Link } from "@/i18n/navigation";
import styles from "./intro.module.css";
import { WriteButton } from "./write-button";

export function Intro() {
  const t = useTranslations("landing");
  const tHero = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tContact = useTranslations("contact");

  const photo = owner.photos[0];

  return (
    <section className={styles.intro}>
      <div className={`shell ${styles.layout}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{tHero("title")}</p>
          <h1 className={styles.name}>{tCommon("name")}</h1>
          <p className={styles.headline}>{tHero("headline")}</p>

          <ul className={styles.facts} role="list">
            <li>{tHero("location")}</li>
            <li>{tHero("availability")}</li>
            <li>{tHero("engagement")}</li>
          </ul>

          <div className={styles.actions}>
            <Link className={styles.primary} href="/cv">
              {t("cta")}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 12h15m-6-6 6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <WriteButton className={styles.secondary}>{tContact("open")}</WriteButton>
          </div>

          <p className={styles.hint}>{t("ctaHint")}</p>
        </div>

        {photo && (
          <div className={styles.portrait}>
            <img
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={tHero("photoAlt", { name: tCommon("name") })}
            />
          </div>
        )}
      </div>
    </section>
  );
}
