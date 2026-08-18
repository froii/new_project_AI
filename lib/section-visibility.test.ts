import { describe, expect, it } from "vitest";
import { toggleCodes, toggleDefaults, toggleIds } from "@/content/sections";
import {
  decodeVisibility,
  defaultVisibility,
  encodeVisibility,
  type Visibility,
} from "./section-visibility";

describe("the code table itself", () => {
  it("gives every toggle a unique code", () => {
    const codes = toggleIds.map((id) => toggleCodes[id]);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("gives every toggle a default", () => {
    for (const id of toggleIds) expect(typeof toggleDefaults[id]).toBe("boolean");
  });
});

describe("encodeVisibility", () => {
  it("returns null when nothing differs from the defaults", () => {
    expect(encodeVisibility(defaultVisibility)).toBeNull();
  });

  it("encodes only what differs, not what is on", () => {
    const visible: Visibility = { ...defaultVisibility, skills: false };
    expect(encodeVisibility(visible)).toBe(toggleCodes.skills);
  });

  it("encodes a default-off toggle that was turned on", () => {
    const visible: Visibility = { ...defaultVisibility, "about.full": true };
    expect(encodeVisibility(visible)).toBe(toggleCodes["about.full"]);
  });
});

describe("decodeVisibility", () => {
  it("returns the defaults for a missing parameter", () => {
    expect(decodeVisibility(null)).toEqual(defaultVisibility);
  });

  it("returns the defaults for an empty parameter", () => {
    expect(decodeVisibility("")).toEqual(defaultVisibility);
  });

  it("ignores codes it does not recognise", () => {
    expect(decodeVisibility("zz.qq")).toEqual(defaultVisibility);
  });

  it("flips exactly the toggles named", () => {
    const decoded = decodeVisibility("a.k.e.d.c");

    expect(decoded.about).toBe(false);
    expect(decoded.skills).toBe(false);
    expect(decoded.experience).toBe(false);
    expect(decoded.education).toBe(false);
    expect(decoded.contact).toBe(false);
    expect(decoded.hero).toBe(true);
    expect(decoded.certifications).toBe(true);
  });

  it("does not let a section code swallow a part code that starts with it", () => {
    const decoded = decodeVisibility("a");

    expect(decoded.about).toBe(false);
    expect(decoded["about.full"]).toBe(toggleDefaults["about.full"]);
    expect(decoded["about.achievements"]).toBe(toggleDefaults["about.achievements"]);
  });
});

describe("round trip", () => {
  it("survives encode → decode for every single toggle", () => {
    for (const id of toggleIds) {
      const visible: Visibility = { ...defaultVisibility, [id]: !defaultVisibility[id] };
      const decoded = decodeVisibility(encodeVisibility(visible));

      expect(decoded).toEqual(visible);
    }
  });

  it("survives a mixed selection", () => {
    const visible: Visibility = {
      ...defaultVisibility,
      skills: false,
      "experience.alsoUsed": true,
      "hero.photo": false,
    };

    expect(decodeVisibility(encodeVisibility(visible))).toEqual(visible);
  });
});
