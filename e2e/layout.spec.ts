import { expect, test } from "@playwright/test";
import { expectNoOverflow, locales, paths, url } from "./helpers";

for (const locale of locales) {
  for (const path of paths) {
    test.describe(url(locale, path), () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(url(locale, path));
      });

      test("no horizontal overflow", async ({ page }) => {
        await expectNoOverflow(page);
      });

      test("text stays inside its box", async ({ page }) => {
        const spilled = await page.evaluate(() =>
          [...document.body.querySelectorAll("*")]
            .filter((el) => {
              const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
              const style = getComputedStyle(el);
              return (
                own &&
                style.display !== "inline" &&
                style.overflowX === "visible" &&
                el.scrollWidth > el.clientWidth + 1
              );
            })
            .map((el) => `${el.tagName.toLowerCase()}: ${el.textContent!.trim().slice(0, 40)}`),
        );
        expect(spilled).toEqual([]);
      });

      // WCAG 2.5.8: under 24px passes only if a 24px circle on its centre clears every other target.
      test("tap targets are at least 24px or spaced", async ({ page }, info) => {
        test.skip(info.project.name === "desktop", "touch only");
        const crowded = await page.evaluate(() => {
          const targets = [
            ...document.querySelectorAll("a[href], button, summary, input, select, textarea"),
          ]
            // Links in a sentence are exempt (WCAG 2.5.8 inline exception).
            .filter((el) => !el.closest('[aria-hidden="true"], [tabindex="-1"], p'))
            .map(
              (el) =>
                (el.matches("[type=checkbox], [type=radio]") &&
                  (el as HTMLInputElement).labels?.[0]) ||
                el,
            )
            // clip-path: the visually hidden skip link.
            .filter((el) => getComputedStyle(el).clipPath === "none")
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.width > 0);

          const distance = (x: number, y: number, r: DOMRect) =>
            Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));

          const small = (r: DOMRect) => Math.min(r.width, r.height) < 24;
          const centre = (r: DOMRect) => [r.left + r.width / 2, r.top + r.height / 2];

          // Two undersized targets clash when their 24px circles overlap.
          return targets
            .filter(({ el, r }) => {
              if (!small(r)) return false;
              const [x, y] = centre(r);
              return targets.some(({ el: otherEl, r: other }) => {
                if (otherEl === el) return false;
                if (!small(other)) return distance(x, y, other) < 12;
                const [ox, oy] = centre(other);
                return Math.hypot(x - ox, y - oy) < 24;
              });
            })
            .map(({ el, r }) => {
              const label = el.getAttribute("aria-label") ?? el.textContent!.trim().slice(0, 30);
              return `${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`;
            });
        });
        expect(crowded).toEqual([]);
      });
    });
  }
}
