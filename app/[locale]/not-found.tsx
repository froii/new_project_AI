import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/sections/site-header";
import { Status } from "@/components/ui/status";
import styles from "@/components/ui/status/status.module.css";
import { owner } from "@/content";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/contacts";

export default function NotFound() {
  const t = useTranslations("error.notFound");
  const email = owner.contacts.find((contact) => contact.kind === "email");

  return (
    <>
      <SiteHeader />
      <Status code={t("code")} heading={t("heading")} body={t("body")}>
        <Link className={styles.primary} href="/">
          {t("home")}
        </Link>
        {email && (
          <a className={styles.secondary} href={contactHref(email)}>
            {t("email")}
          </a>
        )}
      </Status>
    </>
  );
}
