import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Contact } from "@/components/sections/contact";
import styles from "./footer.module.css";

export function LandingFooter() {
  const t = useTranslations("common");

  return (
    <footer className={styles.footer}>
      <Contact />

      <div className={`shell ${styles.bottom}`}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {t("name")}
        </p>

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
