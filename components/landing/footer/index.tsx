import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Contact } from "@/components/sections/contact";
import { cvPdf } from "@/content/links";
import styles from "./footer.module.css";

export function LandingFooter() {
  const t = useTranslations("common");

  return (
    <footer className={styles.footer}>
      <Contact pdf={cvPdf} />

      <div className={`shell ${styles.bottom}`}>
        {/* No year: every page here is prerendered, so `getFullYear()` froze at
            build time and would have read 2026 all through 2027. */}
        <p className={styles.copy}>© {t("name")}</p>

        {/* The contact card above already carries the profiles; a second copy
            of the same two icons a screen below says nothing new. */}
        <div className={styles.controls}>
          <LocaleSwitcher label={t("language")} />
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </footer>
  );
}
