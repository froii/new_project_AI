/* Absolute: sitemap, robots and OpenGraph need full URLs, and a static build has no
   request host. Localhost keeps a clone running without env; production sets it. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
