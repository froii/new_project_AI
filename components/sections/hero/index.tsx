import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { PhotoSwitcher } from "@/components/controls/photo-switcher";
import { Part } from "@/components/visibility/part";
import { owner } from "@/content";
import { contactHref, contactText } from "@/lib/contacts";
import styles from "./hero.module.css";

export function Hero() {
  const t = useTranslations("hero");
  const tContact = useTranslations("contact");

  return (
    <section className="section" id="hero">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.title}>{t("title")}</p>
          <h1 className={styles.name}>{owner.name}</h1>
          <p className={styles.headline}>{t("headline")}</p>

          <ul className={styles.facts} role="list">
            <li>{t("location")}</li>
            <li>{t("engagement")}</li>
            <li className={styles.available}>{t("availability")}</li>
          </ul>

          <Part id="hero.contacts">
            <dl className={styles.contacts} aria-label={t("contactsLabel")}>
              {owner.contacts.map((contact) => (
                <Fragment key={contact.id}>
                  <dt>{tContact(`direct.${contact.id}`)}</dt>
                  <dd>
                    <a href={contactHref(contact)}>{contactText(contact)}</a>
                  </dd>
                </Fragment>
              ))}
            </dl>
          </Part>
        </div>

        <Part id="hero.photo" className={styles.portrait}>
          <PhotoSwitcher
            photos={owner.photos}
            alt={t("photoAlt")}
            groupLabel={t("photoGroup")}
            optionLabels={owner.photos.map((_, index) => t("photoOption", { n: index + 1 }))}
          />
        </Part>
      </div>
    </section>
  );
}
