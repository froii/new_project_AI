import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { ShareButton } from "@/components/controls/share-button";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { SocialLinks } from "@/components/ui/social-links";
import { owner } from "@/content";
import { Link } from "@/i18n/navigation";
import { headerLinks } from "@/lib/contacts";
import styles from "./site-header.module.css";

export function SiteHeader() {
  const t = useTranslations("common");
  const tContact = useTranslations("contact");

  const links = headerLinks(owner.contacts).map((link) => ({
    ...link,
    label: tContact(`direct.${link.id === "whatsapp" ? "phone" : link.id}`),
  }));

  return (
    <header className={`screen-only ${styles.header}`}>
      <div className={`shell ${styles.bar}`}>
        <div className={styles.identity}>
          {/* Below 48rem only the chevron shows, so aria carries the label. */}
          <Link className={styles.home} href="/" aria-label={t("home")}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M13.5 7.5 9 12l4.5 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.name}>{t("name")}</span>
          </Link>
          <SocialLinks links={links} label={t("socialLabel")} size="compact" />
        </div>

        <div className={`cluster ${styles.controls}`}>
          <ShareButton title={t("name")} />
          <LocaleSwitcher label={t("language")} />
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </header>
  );
}
