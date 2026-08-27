import { getTranslations } from "next-intl/server";
import { Status } from "@/components/ui/status";
import styles from "@/components/ui/status/status.module.css";
import { defaultLocale } from "@/i18n/config";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

/* `/blog` matches `[locale]`, so the locale layout runs, fails `isLocale` and
   throws - from the root layout, which is above its own `not-found` boundary.
   This is that boundary, and being above the locale it owns its own document.
   The default locale is the only honest answer: the URL named no valid one. */
export default async function RootNotFound() {
  const t = await getTranslations({ locale: defaultLocale, namespace: "error.notFound" });

  return (
    <html lang={defaultLocale} className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <Status code={t("code")} heading={t("heading")} body={t("body")}>
          <a className={styles.primary} href={`/${defaultLocale}/cv`}>
            {t("cv")}
          </a>
          <a className={styles.secondary} href={`/${defaultLocale}`}>
            {t("home")}
          </a>
        </Status>
      </body>
    </html>
  );
}
