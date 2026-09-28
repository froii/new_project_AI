import type { MetadataRoute } from "next";
import { defaultLocale } from "@/i18n/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oleksa Tyshchenko",
    short_name: "OT",
    start_url: `/${defaultLocale}`,
    display: "standalone",
    /* A manifest colour cannot follow the colour scheme, and an installed Android app
       uses it over the meta tags. Light `--color-canvas`: an unset OS preference is light. */
    background_color: "#f2f0eb",
    theme_color: "#f2f0eb",
    icons: [
      { src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/pwa-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
