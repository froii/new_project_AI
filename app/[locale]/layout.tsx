import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Inspector } from "@/components/dev/inspector";
import { SectionsProvider } from "@/components/providers/sections-provider";
import { isLocale, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";
import "../globals.css";

type LocaleParams = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "common" });

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
    },
    twitter: {
      card: "summary",
      title: t("name"),
      description: t("description"),
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

  const t = await getTranslations({ locale, namespace: "noscript" });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
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
