export type RateLimit = { hit: (key: string, now?: number) => boolean };

/* Vercel overwrites x-forwarded-for. */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function rateLimiter(max: number, windowMs: number, maxKeys = 500): RateLimit {
  const seen = new Map<string, number[]>();

  return {
    hit(key, now = Date.now()) {
      const recent = (seen.get(key) ?? []).filter((at) => now - at < windowMs);

      /* Refused hits are not recorded. Recording them pushed the newest timestamp
         forward, so a visitor who kept retrying never left the window. */
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
