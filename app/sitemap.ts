import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((value) => [value, `${siteUrl}/${value}`])),
    },
  }));
}
