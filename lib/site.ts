/* Absolute, because sitemap.xml, robots.txt and the OpenGraph tags cannot be
   relative and a static build has no request to infer the host from. The
   fallback keeps a clone running without setup; production sets the variable. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
