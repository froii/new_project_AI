import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale } from "./config";

const loaders = {
  en: () => import("../messages/en"),
  uk: () => import("../messages/uk"),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await loaders[locale]()).default,
  };
});
