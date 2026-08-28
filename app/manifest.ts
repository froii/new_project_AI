import type { MetadataRoute } from "next";
import { defaultLocale } from "@/i18n/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OTyshchenko",
    short_name: "OT",
    start_url: `/${defaultLocale}`,
    display: "standalone",
    /* A manifest colour cannot be media-gated, and on Android an installed app
       takes these over the scheme-aware meta tags. Light `--color-canvas`, since
       an unset OS preference resolves light and a light splash under a dark app
       is the milder mismatch of the two. */
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
