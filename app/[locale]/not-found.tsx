import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/sections/site-header";
import { Status } from "@/components/ui/status";
import styles from "@/components/ui/status/status.module.css";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("error.notFound");

  return (
    <>
      <SiteHeader />
      <Status code={t("code")} heading={t("heading")} body={t("body")}>
        <Link className={styles.primary} href="/cv">
          {t("cv")}
        </Link>
        <Link className={styles.secondary} href="/">
          {t("home")}
        </Link>
      </Status>
    </>
  );
}
