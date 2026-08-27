import { describe, expect, it } from "vitest";
import { rateLimiter } from "./rate-limit";

const HOUR = 60 * 60 * 1000;

describe("rateLimiter", () => {
  it("allows up to the limit and refuses the next", () => {
    const limit = rateLimiter(3, HOUR);
    expect([limit.hit("a", 0), limit.hit("a", 1), limit.hit("a", 2)]).toEqual([
      false,
      false,
      false,
    ]);
    expect(limit.hit("a", 3)).toBe(true);
  });

  it("keeps the window rolling when refused attempts keep coming", () => {
    const limit = rateLimiter(3, HOUR);
    for (let i = 0; i < 3; i++) limit.hit("a", i);

    /* The regression: each of these used to be recorded, pushing the window
       forward, so the sender was locked out for as long as they kept trying. */
    for (let at = HOUR / 2; at < HOUR; at += HOUR / 10) expect(limit.hit("a", at)).toBe(true);

    expect(limit.hit("a", HOUR + 1)).toBe(false);
  });

  it("counts each key on its own", () => {
    const limit = rateLimiter(1, HOUR);
    expect(limit.hit("a", 0)).toBe(false);
    expect(limit.hit("b", 0)).toBe(false);
    expect(limit.hit("a", 1)).toBe(true);
  });

  it("drops everything once the key count runs away", () => {
    const limit = rateLimiter(2, HOUR, 2);
    limit.hit("a", 0);
    limit.hit("b", 0);
    limit.hit("c", 0);
    limit.hit("d", 0);

    /* The second call is what proves the map was cleared: with a's first hit
       still on record it would already be at the limit here. */
    expect(limit.hit("a", 1)).toBe(false);
    expect(limit.hit("a", 2)).toBe(false);
    expect(limit.hit("a", 3)).toBe(true);
  });
});
