export type RateLimit = { hit: (key: string, now?: number) => boolean };

/* Out of the route handler so the rule can be tested: the handler itself pulls
   in nodemailer and reads the environment, and this is where the bug was. */
export function rateLimiter(max: number, windowMs: number, maxKeys = 500): RateLimit {
  const seen = new Map<string, number[]>();

  return {
    hit(key, now = Date.now()) {
      const recent = (seen.get(key) ?? []).filter((at) => now - at < windowMs);

      /* A refused attempt is not recorded. Counting it kept pushing the newest
         timestamp forward, so anyone who retried inside the window could never
         leave it: the limit stopped rolling and became permanent. */
      if (recent.length >= max) {
        seen.set(key, recent);
        return true;
      }

      /* Bounded map instead of a store: one instance, a few messages a month. */
      if (seen.size > maxKeys) seen.clear();
      seen.set(key, [...recent, now]);

      return false;
    },
  };
}
