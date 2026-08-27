/* Static and committed, one per locale - see decisions/0001. */
export function ogImage(locale: string, name: string) {
  return [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: name }];
}
