import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Chat } from "@/components/ask/chat";
import { LandingFooter } from "@/components/landing/footer";
import { Faq } from "@/components/questions/faq";
import { SiteHeader } from "@/components/sections/site-header";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import { faqTopics } from "@/lib/ask/chunks";
import { freeModels } from "@/lib/ask/models";
import { ogImage } from "@/lib/og-image";
import styles from "./questions.module.css";

type QuestionsParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: QuestionsParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const tAsk = await getTranslations({ locale, namespace: "ask" });

  const title = `${t("name")} - ${tAsk("title")}`;
  const description = tAsk("intro");
  const images = ogImage(locale, title);

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/questions`,
      languages: {
        ...Object.fromEntries(locales.map((value) => [value, `/${value}/questions`])),
        "x-default": `/${defaultLocale}/questions`,
      },
    },
    /* Nested metadata replaces, not merges. */
    openGraph: { title, description, siteName: t("name"), url: `/${locale}/questions`, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function QuestionsPage({ params }: QuestionsParams) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ask" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const models = await freeModels();

  return (
    <>
      <a href="#main" className="skip-link visually-hidden">
        {tCommon("skipToContent")}
      </a>
      <SiteHeader />
      <div className={styles.backdrop}>
        <main id="main" className={`shell ${styles.page}`}>
          <header className={styles.intro}>
            <h1 className={styles.heading}>{t("heading")}</h1>
            <p className={styles.lead}>{t("intro")}</p>
          </header>

          <Faq topics={faqTopics(isLocale(locale) ? locale : defaultLocale)} />
          <Chat models={models} />
        </main>
      </div>
      <LandingFooter />
    </>
  );
}
