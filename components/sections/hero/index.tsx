import { useTranslations } from "next-intl";
import { PhotoSwitcher } from "@/components/controls/photo-switcher";
import { Part } from "@/components/visibility/part";
import { owner } from "@/content";
import { contactHref } from "@/lib/contacts";
import styles from "./hero.module.css";

export function Hero() {
  const t = useTranslations("hero");
  const tContact = useTranslations("contact");

  return (
    <section className="section" id="hero">
      <div className={`shell split ${styles.layout}`}>
        <Part id="hero.photo">
          <PhotoSwitcher
            photos={owner.photos}
            alt={t("photoAlt")}
            groupLabel={t("photoGroup")}
            optionLabels={owner.photos.map((_, index) => t("photoOption", { n: index + 1 }))}
          />
        </Part>

        <div className="stack">
          <p className={styles.title}>{t("title")}</p>
          <h1>{owner.name}</h1>
          <p className={styles.headline}>{t("headline")}</p>

          <ul className={`cluster ${styles.facts}`} role="list">
            <li className={styles.fact}>{t("location")}</li>
            <li className={styles.fact}>{t("origin")}</li>
            <li className={styles.fact}>{t("availability")}</li>
          </ul>

          <Part id="hero.contacts">
            <ul
              className={`cluster ${styles.contacts}`}
              role="list"
              aria-label={t("contactsLabel")}
            >
              {owner.contacts.map((contact) => (
                <li key={contact.id}>
                  <a href={contactHref(contact)}>{tContact(`direct.${contact.id}`)}</a>
                </li>
              ))}
            </ul>
          </Part>
        </div>
      </div>
    </section>
  );
}
