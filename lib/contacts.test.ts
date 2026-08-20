import { describe, expect, it } from "vitest";
import type { Contact } from "@/content/types";
import { contactHref, contactText, headerLinks, messengerLinks } from "./contacts";

const email: Contact = { id: "email", kind: "email", value: "a@b.co" };
const phone: Contact = { id: "phone", kind: "phone", value: "+380 00 000 00 00" };
const linkedin: Contact = { id: "linkedin", kind: "link", value: "https://linkedin.com/in/x" };

describe("contactHref", () => {
  it("builds a mailto for an email", () => {
    expect(contactHref(email)).toBe("mailto:a@b.co");
  });

  it("strips spaces from a phone number", () => {
    expect(contactHref(phone)).toBe("tel:+380000000000");
  });

  it("passes a link through untouched", () => {
    expect(contactHref(linkedin)).toBe("https://linkedin.com/in/x");
  });
});

describe("contactText", () => {
  it("shows an email address as it is", () => {
    expect(contactText(email)).toBe("a@b.co");
  });

  it("drops the protocol and a trailing slash from a link", () => {
    expect(contactText({ id: "gh", kind: "link", value: "https://www.github.com/x/" })).toBe(
      "github.com/x",
    );
  });
});

describe("messengerLinks", () => {
  it("keeps only digits, whatever the formatting", () => {
    const spaced = messengerLinks("+380 00 000 00 00");
    const bracketed = messengerLinks("+38 (000) 000-00-00");

    expect(spaced).toEqual(bracketed);
    expect(spaced[0]?.href).toBe("https://wa.me/380000000000");
  });

  it("offers all three messengers", () => {
    expect(messengerLinks("+380000000000").map((link) => link.id)).toEqual([
      "whatsapp",
      "viber",
      "telegram",
    ]);
  });
});

describe("headerLinks", () => {
  it("returns email, whatsapp and linkedin in that order", () => {
    expect(headerLinks([email, phone, linkedin]).map((link) => link.id)).toEqual([
      "email",
      "whatsapp",
      "linkedin",
    ]);
  });

  it("omits what is missing rather than emitting a broken link", () => {
    expect(headerLinks([email]).map((link) => link.id)).toEqual(["email"]);
    expect(headerLinks([])).toEqual([]);
  });

  it("turns the phone into a whatsapp link, not a tel link", () => {
    expect(headerLinks([phone])[0]?.href).toBe("https://wa.me/380000000000");
  });
});
