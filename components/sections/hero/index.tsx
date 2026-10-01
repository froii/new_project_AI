import { Fragment, useId } from "react";
import { useTranslations } from "next-intl";
import { PhotoSwitcher } from "@/components/controls/photo-switcher";
import { Part } from "@/components/visibility/part";
import { owner } from "@/content";
import { contactHref, contactText } from "@/lib/contacts";
import styles from "./hero.module.css";

export function Hero() {
  const headingId = useId();
  const t = useTranslations("hero");
  const tCommon = useTranslations("common");
  const tContact = useTranslations("contact");

  return (
    <section className="section" id="hero" aria-labelledby={headingId}>
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.title}>{t("title")}</p>
          <h1 id={headingId} className={styles.name}>
            {tCommon("name")}
          </h1>
          <p className={styles.headline}>{t("headline")}</p>

          <div className={styles.contacts}>
            <Part id="hero.contacts" className={styles.group}>
              <dl className={styles.rows} aria-label={t("contactsLabel")}>
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
            <dl className={styles.rows}>
              <dt>{t("formatLabel")}</dt>
              <dd>{t("format")}</dd>
              <dt>{t("languagesLabel")}</dt>
              <dd>{t("languages")}</dd>
            </dl>
          </div>
        </div>

        <Part id="hero.photo" className={styles.portrait}>
          <PhotoSwitcher
            photos={owner.photos}
            alt={t("photoAlt", { name: tCommon("name") })}
            groupLabel={t("photoGroup")}
            optionLabels={owner.photos.map((_, index) => t("photoOption", { n: index + 1 }))}
          />
        </Part>
      </div>
    </section>
  );
}
