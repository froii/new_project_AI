import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { experience } from "@/content";
import { cvPdfs } from "@/content/links";
import { presetIds } from "@/content/sections";
import { defaultOpenRoles, presetOpenRoles } from "@/lib/content";
import {
  encodeOpen,
  encodeVisibility,
  OPEN_PARAM,
  presetVisibility,
  SECTIONS_PARAM,
} from "@/lib/section-visibility";
import { locales } from "./helpers";

// Chrome writes one uncompressed `/Type /Page` dictionary per page.
const pageCount = (pdf: Buffer) =>
  pdf.toString("latin1").match(/\/Type\s*\/Page(?![a-zA-Z])/g)?.length ?? 0;

for (const id of presetIds) {
  const { href, pages } = cvPdfs[id];

  test(`${id}: shipped file has ${pages} pages`, () => {
    expect(pageCount(readFileSync(`public${href}`))).toBe(pages);
  });

  for (const locale of locales) {
    test(`${id}: /${locale}/cv prints to ${pages} pages`, async ({ page }) => {
      const params = new URLSearchParams();
      const sections = encodeVisibility(presetVisibility(id));
      const open = encodeOpen(presetOpenRoles(id, experience), defaultOpenRoles(experience));
      if (sections) params.set(SECTIONS_PARAM, sections);
      if (open) params.set(OPEN_PARAM, open);

      await page.goto(`/${locale}/cv?${params}`, { waitUntil: "networkidle" });
      const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
      expect(pageCount(pdf)).toBe(pages);
    });
  }
}
