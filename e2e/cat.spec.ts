import { expect, test, type Page } from "@playwright/test";
import { expectNoOverflow } from "./helpers";

const FRAME_MS = 1000 / 12;

async function playFrames(page: Page, frames: number) {
  for (let i = 0; i < frames; i++) {
    await page.clock.runFor(FRAME_MS);
    await expectNoOverflow(page);
  }
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
  await page.goto("/en");
});

test("intro cat: walk-in and strike keep the page width", async ({ page }, info) => {
  const cv = page.locator("main section").first().locator('a[href$="/cv"]');
  const cat = cv.locator("+ div");

  await expect
    .poll(async () => {
      await page.clock.runFor(100);
      return cat.evaluate((el) => getComputedStyle(el).visibility);
    })
    .toBe("visible");

  await playFrames(page, 125);
  await expect(cat).toHaveCSS("pointer-events", "auto");

  if (info.project.use.hasTouch) {
    await cat.tap();
  } else {
    await cat.hover();
  }
  await playFrames(page, 30);

  if (info.project.name === "mobile") {
    const [catBox, cvBox] = [await cat.boundingBox(), await cv.boundingBox()];
    expect(catBox!.y + catBox!.height).toBeLessThanOrEqual(cvBox!.y);
  }
});

test("footer cat: knocking the cup keeps the page width", async ({ page }) => {
  await page.locator("footer").scrollIntoViewIfNeeded();
  await playFrames(page, 60);
});
