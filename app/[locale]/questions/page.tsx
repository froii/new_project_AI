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
import { jsonLd } from "@/lib/person-schema";
import styles from "./questions.module.css";

type QuestionsParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: QuestionsParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const tAsk = await getTranslations({ locale, namespace: "ask" });

  const title = `${t("name")} - ${tAsk("metaTitle")}`;
  const description = tAsk("metaDescription", { name: t("name") });
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
  const topics = faqTopics(isLocale(locale) ? locale : defaultLocale);
  /* Visible topics only: the markup has to match what the page shows. */
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topics.flatMap((topic) =>
      topic.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
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

          <Faq topics={topics} />
          <Chat models={models} />
        </main>
      </div>
      <LandingFooter />
    </>
  );
}
