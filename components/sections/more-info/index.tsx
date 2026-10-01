import { useLocale, useTranslations } from "next-intl";
import { owner } from "@/content";
import { contactHref, contactText } from "@/lib/contacts";
import styles from "./more-info.module.css";

export function MoreInfo() {
  const t = useTranslations("common");
  const locale = useLocale();

  const site = owner.contacts.find((contact) => contact.id === "site");
  const linkedin = owner.contacts.find((contact) => contact.id === "linkedin");
  const questions = site && { ...site, value: `${site.value}/${locale}/questions` };

  return (
    <div className={styles.more}>
      {questions && (
        <p>
          {t("moreQuestions")} <a href={contactHref(questions)}>{contactText(questions)}</a>
        </p>
      )}
      {linkedin && (
        <p>
          {t("moreLinkedin")} <a href={contactHref(linkedin)}>{contactText(linkedin)}</a>
        </p>
      )}
    </div>
  );
}
