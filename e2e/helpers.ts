import { expect, type Page } from "@playwright/test";

export { locales } from "@/i18n/config";

export const paths = ["", "/cv", "/questions"];

export const url = (locale: string, path: string) => `/${locale}${path}`;

/* Compares against the configured viewport, not innerWidth: on mobile an overflowing
   page widens the layout viewport, so innerWidth grows with the overflow. */
export async function expectNoOverflow(page: Page) {
  const width = page.viewportSize()!.width;
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  if (scrollWidth <= width) return;

  // Only on failure: walking the DOM on every animation frame is slow.
  const offenders = await page.evaluate((width) => {
    const clipped = (el: Element) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== "visible") return true;
      }
      return false;
    };
    return [...document.body.querySelectorAll("*")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > width + 1 || r.left < -1) && !clipped(el);
      })
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
  }, width);
  expect(scrollWidth, `wider than ${width}px: ${offenders.join(", ")}`).toBeLessThanOrEqual(width);
}
