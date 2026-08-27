import { Inter, JetBrains_Mono, Literata } from "next/font/google";

/* Self-hosted, and Cyrillic on purpose: the PDF is the page, so a font the
   visitor's machine happens to lack is a CV that prints differently for every
   recruiter. `fallback` carries the old system stack until the file lands. */

export const sans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Helvetica Neue",
    "Arial",
    "sans-serif",
  ],
});

/* Not preloaded: two families times two subsets was ~200KB of render-blocking
   preload on a page whose serif is one heading and whose mono is date labels.
   `adjustFontFallback` (on by default) matches the fallback metrics, so the
   swap costs no layout shift and the first paint arrives sooner. */
export const serif = Literata({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
  fallback: ["ui-serif", "Cambria", "Times New Roman", "Times", "serif"],
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "Consolas", "Liberation Mono", "Courier", "monospace"],
});
