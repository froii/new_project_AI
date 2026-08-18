import { describe, expect, it } from "vitest";
import type { ExperienceEntry } from "@/content/types";
import { experience } from "@/content";
import { isCurrent, sortExperience } from "./content";

const entry = (id: string, start: string, end?: string): ExperienceEntry => ({
  id,
  organisation: id,
  start,
  end,
  techStack: [],
  alsoUsed: [],
});

describe("isCurrent", () => {
  it("is true only when there is no end date", () => {
    expect(isCurrent(entry("a", "2020-01"))).toBe(true);
    expect(isCurrent(entry("b", "2020-01", "2021-01"))).toBe(false);
  });
});

describe("sortExperience", () => {
  it("orders newest first", () => {
    const sorted = sortExperience([
      entry("old", "2015-04"),
      entry("new", "2024-05"),
      entry("mid", "2018-09"),
    ]);

    expect(sorted.map((e) => e.id)).toEqual(["new", "mid", "old"]);
  });

  it("does not mutate its input", () => {
    const input = [entry("old", "2015-04"), entry("new", "2024-05")];
    sortExperience(input);

    expect(input.map((e) => e.id)).toEqual(["old", "new"]);
  });

  it("sorts months within the same year", () => {
    const sorted = sortExperience([entry("sep", "2018-09"), entry("jan", "2018-01")]);

    expect(sorted.map((e) => e.id)).toEqual(["sep", "jan"]);
  });

  it("keeps a bare year below a dated entry of the next year", () => {
    const sorted = sortExperience([entry("year", "2011"), entry("dated", "2012-01")]);

    expect(sorted.map((e) => e.id)).toEqual(["dated", "year"]);
  });
});

describe("real content", () => {
  it("has no entry ending before it starts", () => {
    for (const item of experience) {
      if (item.end) expect(item.end >= item.start).toBe(true);
    }
  });

  it("renders newest position first", () => {
    expect(sortExperience(experience)[0]?.id).toBe("bechacant");
  });
});
