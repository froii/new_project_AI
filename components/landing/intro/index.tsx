import { useId } from "react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { CvLink } from "@/components/landing/cv-link";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { Link } from "@/i18n/navigation";
import { CatMascot } from "./cat-mascot";
import styles from "./intro.module.css";
import { LivePortrait } from "./live-portrait";
import { WriteButton } from "./write-button";

export function Intro() {
  const headingId = useId();
  const t = useTranslations("landing");
  const tHero = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tContact = useTranslations("contact");

  return (
    <section className={styles.intro} aria-labelledby={headingId}>
      <div className={styles.controls}>
        <LocaleSwitcher label={tCommon("language")} />
        <ThemeToggle label={tCommon("theme")} />
      </div>

      <div className={`shell ${styles.layout}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{tHero("title")}</p>
          <h1 id={headingId} className={styles.name}>
            {tCommon("name")}
          </h1>
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

          <p className={styles.ask}>
            {t("askPrompt")}
            <Link className={styles.textLink} href="/questions">
              {t("askLink")}
              <ArrowIcon />
            </Link>
          </p>
        </div>

        <div className={styles.portrait}>
          <LivePortrait label={tHero("photoAlt", { name: tCommon("name") })} />
        </div>
      </div>
    </section>
  );
}
