import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { locales, paths, url } from "./helpers";

// Mid-transition colours fail contrast at random; reduced motion turns transitions off.
test.use({ reducedMotion: "reduce" });

const report = (violations: { id: string; nodes: { target: unknown[] }[] }[]) =>
  violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(colorScheme, () => {
    test.use({ colorScheme });

    for (const locale of locales) {
      for (const path of paths) {
        test(url(locale, path), async ({ page }) => {
          await page.goto(url(locale, path));
          const { violations } = await new AxeBuilder({ page }).analyze();
          expect(report(violations)).toEqual([]);
        });
      }
    }

    test("pdf dialog", async ({ page }) => {
      await page.goto("/en/cv");
      // Retried: a click that lands before hydration does nothing.
      await expect(async () => {
        await page.locator('button[aria-haspopup="dialog"]').click();
        await expect(page.locator("dialog[open]")).toBeVisible({ timeout: 1000 });
      }).toPass();
      const { violations } = await new AxeBuilder({ page }).include("dialog[open]").analyze();
      expect(report(violations)).toEqual([]);
    });
  });
}
