import { describe, expect, it } from "vitest";
import { keywordRetriever, stem } from "./retriever";

const ids = async (query: string, locale: "en" | "uk") =>
  (await keywordRetriever(query, locale)).map((chunk) => chunk.id);

describe("stem", () => {
  it("brings Ukrainian case forms to one term", () => {
    expect(stem("досвіду")).toBe(stem("досвідом"));
  });

  it("drops stop words and single letters", () => {
    expect(stem("ви")).toBeNull();
    expect(stem("You")).toBeNull();
    expect(stem("x")).toBeNull();
  });
});

describe("keywordRetriever", () => {
  it("finds an answer by a keyword the question never uses", async () => {
    expect(await ids("Would you move to another country?", "en")).toContain("faq.relocation");
  });

  it("matches an inflected Ukrainian question", async () => {
    expect(await ids("Чи готові ви до переїзду?", "uk")).toContain("faq.relocation");
  });

  it("finds CV entries, not only the FAQ", async () => {
    expect(await ids("What did you build at BechaCant?", "en")).toContain("experience.bechacant");
  });

  it("returns at most five chunks", async () => {
    expect((await ids("React TypeScript experience", "en")).length).toBeLessThanOrEqual(5);
  });

  it("returns nothing for a question the corpus has no words for", async () => {
    expect(await ids("salary", "en")).toEqual([]);
  });
});
