/* Committed PNGs in public/, not a generated `opengraph-image` route. */
export function ogImage(locale: string, name: string) {
  return [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: name }];
}
