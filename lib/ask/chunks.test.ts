import { describe, expect, it } from "vitest";
import { questionTopics } from "@/content/questions";
import { locales } from "@/i18n/config";
import enQuestions from "@/messages/en/questions.json";
import ukQuestions from "@/messages/uk/questions.json";
import { chunks, profileChunk } from "./chunks";

const catalogs = { en: enQuestions, uk: ukQuestions };
const ids = questionTopics.flatMap((topic) => topic.items);

describe("questions.json", () => {
  it.each(locales)("%s has a question for every listed id, keywords for every answer", (locale) => {
    const items = catalogs[locale].items as Record<
      string,
      { q: string; a: string; keywords: string[] }
    >;

    for (const id of ids) {
      expect(items[id]?.q, id).toBeTruthy();
      if (items[id]?.a) expect(items[id].keywords.length, id).toBeGreaterThan(0);
    }
  });

  it("answers the same questions in both locales", () => {
    const answered = (items: Record<string, { a: string }>) =>
      ids.filter((id) => items[id]?.a).sort();

    expect(answered(enQuestions.items)).toEqual(answered(ukQuestions.items));
  });

  it.each(locales)("%s has no entry the page would never show", (locale) => {
    expect(Object.keys(catalogs[locale].items).sort()).toEqual([...ids].sort());
  });

  it.each(locales)("%s names every topic", (locale) => {
    for (const topic of questionTopics) {
      expect(catalogs[locale].topics[topic.id as keyof typeof enQuestions.topics]).toBeTruthy();
    }
  });
});

describe("chunks", () => {
  it.each(locales)("%s gives every chunk a unique id and some text", (locale) => {
    const all = chunks(locale);

    expect(new Set(all.map((chunk) => chunk.id)).size).toBe(all.length);
    for (const chunk of all) expect(chunk.text.trim(), chunk.id).not.toBe("");
  });

  it("keeps the phone number out of the profile", () => {
    expect(profileChunk("en").text).not.toMatch(/\+\d{6,}/);
  });
});
