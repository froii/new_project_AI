import { describe, expect, it } from "vitest";
import { certifications } from "@/content";
import { readCredential } from "./credentials";

describe("readCredential", () => {
  it("strips www from the host", () => {
    expect(readCredential("https://www.coursera.org/verify/ABC")?.host).toBe("coursera.org");
  });

  it("takes the last path segment as the identifier", () => {
    expect(
      readCredential("https://www.coursera.org/account/accomplishments/verify/252SOHEUBGKS")?.id,
    ).toBe("252SOHEUBGKS");
  });

  it("decodes a percent-encoded path and keeps only the identifier", () => {
    expect(
      readCredential("https://certificate.algoexpert.io/AlgoExpert%20Certificate%20AE-79e5eb6004"),
    ).toEqual({ host: "certificate.algoexpert.io", id: "AE-79e5eb6004" });
  });

  it("handles a short path with no encoding", () => {
    expect(readCredential("https://cert.efset.org/gteMy2")).toEqual({
      host: "cert.efset.org",
      id: "gteMy2",
    });
  });

  it("ignores query strings", () => {
    expect(readCredential("https://www.coursera.org/verify/E7HVJLUGYMK6?utm_source=link")?.id).toBe(
      "E7HVJLUGYMK6",
    );
  });

  it("returns null for something that is not a URL", () => {
    expect(readCredential("not a url")).toBeNull();
  });
});

describe("real certifications", () => {
  it("yields a host and a non-empty id for every credential", () => {
    for (const item of certifications) {
      if (!item.href) continue;
      const credential = readCredential(item.href);

      expect(credential, item.id).not.toBeNull();
      expect(credential?.id.length, item.id).toBeGreaterThan(0);
      expect(credential?.id, item.id).not.toContain(" ");
    }
  });
});
