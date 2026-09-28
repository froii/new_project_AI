import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { defaultLocale, locales } from "./i18n/config";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  /* 'unsafe-inline', not a nonce: Next and next-themes inline scripts, and a
     per-request nonce would make every prerendered page dynamic. */
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  /* Prod only: it rewrites `/_next/*` to https, so the http dev server opened
     from a phone over LAN renders a blank page. */
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  /* Stops `next dev` generating AGENTS.md and CLAUDE.md at the root:
     AI tooling config stays out of the repo (4cf11b3). */
  agentRules: false,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    /* Any path without a locale gets the default one. Redirects run before
       public files, so anything with a dot (robots.txt, icons, photos) and
       anything starting with `_` (_next, _vercel, dev's __nextjs) is left alone. */
    const skip = [...locales, "api"].join("|");
    return [
      { source: "/", destination: `/${defaultLocale}`, permanent: false },
      {
        source: `/:path((?!(?:${skip})(?:/|$)|_)[^.]+)`,
        destination: `/${defaultLocale}/:path`,
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
