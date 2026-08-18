import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/controls/locale-switcher";
import { SectionMenu } from "@/components/controls/section-menu";
import { ShareButton } from "@/components/controls/share-button";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { SocialLinks } from "@/components/ui/social-links";
import { owner } from "@/content";
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
    <header className={styles.header}>
      <div className={`shell ${styles.bar}`}>
        <div className={styles.identity}>
          <strong className={styles.name}>{owner.name}</strong>
          <SocialLinks links={links} label={t("socialLabel")} size="compact" />
        </div>

        <SectionMenu />

        <div className={`cluster ${styles.controls}`}>
          <ShareButton title={owner.name} />
          <LocaleSwitcher label={t("language")} />
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </header>
  );
}
