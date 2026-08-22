import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { Contact } from "@/components/sections/contact";
import { SocialLinks } from "@/components/ui/social-links";
import { owner } from "@/content";
import styles from "./footer.module.css";

export function LandingFooter() {
  const t = useTranslations("common");
  const tContact = useTranslations("contact");

  const profiles = owner.contacts
    .filter((contact) => contact.kind === "link")
    .map((contact) => ({
      id: contact.id,
      href: contact.value,
      label: tContact(`direct.${contact.id}`),
    }));

  return (
    <footer className={styles.footer}>
      <Contact />

      <div className={`shell ${styles.bottom}`}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {t("name")}
        </p>

        <div className={styles.controls}>
          <SocialLinks links={profiles} label={t("socialLabel")} size="compact" />
          <LocaleSwitcher label={t("language")} />
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </footer>
  );
}
