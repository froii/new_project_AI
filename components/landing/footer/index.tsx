import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Contact } from "@/components/sections/contact";
import { cvPdfs } from "@/content/links";
import { FooterCat } from "./footer-cat";
import styles from "./footer.module.css";

export function LandingFooter() {
  const t = useTranslations("common");

  return (
    <footer className={styles.footer}>
      <Contact pdfs={cvPdfs} />

      <div className={`shell ${styles.bottom}`}>
        <FooterCat />
        {/* No year: the page is prerendered, `getFullYear()` freezes at build. */}
        <p className={styles.copy}>© {t("name")}</p>

        {/* No social links: the contact card above has them. */}
        <div className={styles.controls}>
          <LocaleSwitcher label={t("language")} />
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </footer>
  );
}
