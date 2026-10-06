import { defineConfig } from "@playwright/test";

const PORT = 3210;

export default defineConfig({
  testDir: "e2e",
  reporter: "list",
  fullyParallel: true,
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: "chrome",
  },
  projects: [
    {
      name: "mobile",
      use: { viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true },
      testIgnore: "pdf.spec.ts",
    },
    {
      name: "tablet",
      use: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
      testIgnore: ["pdf.spec.ts", "a11y.spec.ts"],
    },
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
  // A production build: the dev overlay shifts layout.
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    timeout: 300_000,
  },
});
