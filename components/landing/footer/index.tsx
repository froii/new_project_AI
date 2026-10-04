import { useTranslations } from "next-intl";
import { Contact } from "@/components/sections/contact";
import { FooterCat } from "./footer-cat";
import styles from "./footer.module.css";

export function LandingFooter() {
  const t = useTranslations("common");

  return (
    <footer className={styles.footer}>
      <Contact />

      <div className={`shell ${styles.bottom}`}>
        <FooterCat />
        {/* No year: the page is prerendered, `getFullYear()` freezes at build. */}
        <p className={styles.copy}>© {t("name")}</p>
      </div>
    </footer>
  );
}
