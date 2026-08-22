import { describe, expect, it } from "vitest";
import { headerSafe, invalidContactFields, type ContactDraft } from "./contact-message";

const draft = (overrides: Partial<ContactDraft> = {}): ContactDraft => ({
  name: "Ada",
  email: "ada@example.com",
  phone: "",
  message: "Ten characters at least.",
  ...overrides,
});

describe("invalidContactFields", () => {
  it("passes a complete draft", () => {
    expect(invalidContactFields(draft())).toEqual([]);
  });

  it("rejects an empty name and one past the limit", () => {
    expect(invalidContactFields(draft({ name: "" }))).toEqual(["name"]);
    expect(invalidContactFields(draft({ name: "a".repeat(101) }))).toEqual(["name"]);
  });

  it("rejects an address without a domain", () => {
    expect(invalidContactFields(draft({ email: "ada@example" }))).toEqual(["email"]);
    expect(invalidContactFields(draft({ email: "ada example.com" }))).toEqual(["email"]);
  });

  it("rejects a message under ten characters and one over the limit", () => {
    expect(invalidContactFields(draft({ message: "hi" }))).toEqual(["message"]);
    expect(invalidContactFields(draft({ message: "x".repeat(5001) }))).toEqual(["message"]);
  });

  it("ignores the phone, which is optional and never validated for format", () => {
    expect(invalidContactFields(draft({ phone: "not a phone" }))).toEqual([]);
  });

  it("reports every broken field at once", () => {
    expect(invalidContactFields(draft({ name: "", email: "x", message: "" }))).toEqual([
      "name",
      "email",
      "message",
    ]);
  });
});

describe("headerSafe", () => {
  it("collapses the newlines an injected header would need", () => {
    expect(headerSafe("Ada\r\nBcc: victim@example.com")).toBe("Ada Bcc: victim@example.com");
  });

  it("trims what is left", () => {
    expect(headerSafe("  Ada  ")).toBe("Ada");
  });
});
