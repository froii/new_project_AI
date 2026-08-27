import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Inspector } from "@/components/dev/inspector";
import { SectionsProvider } from "@/components/providers/sections-provider";
import { owner } from "@/content";
import { isLocale, locales } from "@/i18n/config";
import { ogImage } from "@/lib/og-image";
import { jsonLd, personSchema } from "@/lib/person-schema";
import { siteUrl } from "@/lib/site";
import { mono, sans, serif } from "../fonts";
import "../globals.css";

type LocaleParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Per scheme, because the browser chrome paints before the theme script runs.
     `--color-canvas`, which is what `body` paints: `--color-bg` is the paper, and
     it left the address bar a visibly different shade from the page. */
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0eb" },
    { media: "(prefers-color-scheme: dark)", color: "#090b0e" },
  ],
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "common" });
  const images = ogImage(locale, t("name"));

  return {
    metadataBase: new URL(siteUrl),
    title: t("name"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((value) => [value, `/${value}`])),
    },
    openGraph: {
      type: "profile",
      siteName: t("name"),
      title: t("name"),
      description: t("description"),
      url: `${siteUrl}/${locale}`,
      locale,
      alternateLocale: locales.filter((value) => value !== locale),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: t("name"),
      description: t("description"),
      images,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [t, tCommon, tHero] = await Promise.all([
    getTranslations({ locale, namespace: "noscript" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "hero" }),
  ]);

  const schema = personSchema({
    name: tCommon("name"),
    jobTitle: tHero("title"),
    description: tCommon("description"),
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}${owner.photos[0]?.src ?? ""}`,
  });

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
        />
        <noscript>
          <div className="noscript">
            <strong>{t("heading")}</strong>
            <p>{t("body")}</p>
            <p>{t("action")}</p>
          </div>
        </noscript>
        <NextIntlClientProvider>
          <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
            <SectionsProvider>{children}</SectionsProvider>
            {process.env.NODE_ENV === "development" && <Inspector />}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
