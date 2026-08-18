"use client";

import { useLocale } from "next-intl";
import { useSections } from "@/components/providers/sections-provider";
import { locales } from "@/i18n/config";
import { Link, usePathname } from "@/i18n/navigation";
import { encodeVisibility, SECTIONS_PARAM } from "@/lib/section-visibility";
import styles from "./locale-switcher.module.css";

const labels: Record<string, string> = { en: "EN", uk: "УК" };

export function LocaleSwitcher({ label }: { label: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const { visible } = useSections();

  const encoded = encodeVisibility(visible);
  const query = encoded === null ? undefined : { [SECTIONS_PARAM]: encoded };

  return (
    <nav className={styles.group} aria-label={label}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={{ pathname, query }}
          locale={locale}
          className={styles.option}
          aria-current={locale === active ? "true" : undefined}
          hrefLang={locale}
        >
          {labels[locale] ?? locale.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
