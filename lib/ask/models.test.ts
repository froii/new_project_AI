import { describe, expect, it } from "vitest";
import { curatedModels, isFreeModelId, pickFreeModels } from "./models";

describe("isFreeModelId", () => {
  it("accepts only ids with the :free suffix", () => {
    expect(isFreeModelId("google/gemma-4-31b-it:free")).toBe(true);
    expect(isFreeModelId("openai/gpt-4o")).toBe(false);
    expect(isFreeModelId("openai/gpt-4o:free:extended")).toBe(false);
    expect(isFreeModelId("../free")).toBe(false);
  });
});

describe("curatedModels", () => {
  it("is free only", () => {
    expect(curatedModels.length).toBeGreaterThan(0);
    expect(curatedModels.every(isFreeModelId)).toBe(true);
  });
});

describe("pickFreeModels", () => {
  it("keeps the curated order, drops retired models and the (free) tag", () => {
    const picked = pickFreeModels(
      [
        { id: "x/other:free", name: "Other (free)" },
        { id: "b/two:free", name: "Two (free)" },
        { id: "a/one:free", name: "One (free)" },
      ],
      ["a/one:free", "gone/retired:free", "b/two:free"],
    );

    expect(picked).toEqual([
      { id: "a/one:free", name: "One" },
      { id: "b/two:free", name: "Two" },
    ]);
  });
});
