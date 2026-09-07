import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

const paths = ["", "/cv"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((value) => [value, `${siteUrl}/${value}${path}`])),
          "x-default": `${siteUrl}/${defaultLocale}${path}`,
        },
      },
    })),
  );
}
