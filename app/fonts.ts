import { Inter, JetBrains_Mono, Spectral } from "next/font/google";

/* Self-hosted with Cyrillic, so the printed CV never depends on local fonts. */

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

/* Serif and mono are above the fold: a swap from the fallback changes weight (no 300 in
   Times) and rewraps the lead. Preload + `optional` never shows a font that later swaps.
   Spectral is not variable, so list only the weights in use: 300 (h1), 400, 500 (h2/h3). */
export const serif = Spectral({
  weight: ["300", "400", "500"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "optional",
  fallback: ["ui-serif", "Cambria", "Times New Roman", "Times", "serif"],
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  display: "optional",
  fallback: ["ui-monospace", "Consolas", "Liberation Mono", "Courier", "monospace"],
});
