import Image from "next/image";
import { useTranslations } from "next-intl";
import { owner } from "@/content";
import { CvLink } from "@/components/landing/cv-link";
import { CatMascot } from "./cat-mascot";
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
            <span className={styles.cvSlot}>
              <CvLink>{t("cta")}</CvLink>
              <CatMascot />
            </span>

            <WriteButton className={styles.secondary}>{tContact("open")}</WriteButton>
          </div>

          <p className={styles.hint}>{t("ctaHint")}</p>
        </div>

        {photo && (
          <div className={styles.portrait}>
            <Image
              src={photo.src}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 45.99rem) 62vw, 17rem"
              priority
              alt={tHero("photoAlt", { name: tCommon("name") })}
            />
          </div>
        )}
      </div>
    </section>
  );
}
