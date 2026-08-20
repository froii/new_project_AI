import { describe, expect, it } from "vitest";
import type { ExperienceEntry } from "@/content/types";
import { experience } from "@/content";
import { dottedDate, experienceSpan, isCurrent, sortExperience } from "./content";

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

describe("dottedDate", () => {
  it("turns a month into the printed form", () => {
    expect(dottedDate("2024-05")).toBe("2024.05");
  });

  it("leaves a bare year alone", () => {
    expect(dottedDate("2011")).toBe("2011");
  });
});

describe("experienceSpan", () => {
  it("runs from the earliest start to the latest end", () => {
    const span = experienceSpan([
      entry("a", "2015-04", "2016-10"),
      entry("b", "2012-01", "2017-06"),
    ]);

    expect(span).toEqual({ from: "2012", to: "2017" });
  });

  it("reports no end while a position is still running", () => {
    const span = experienceSpan([entry("a", "2015-04", "2016-10"), entry("b", "2024-05")]);

    expect(span).toEqual({ from: "2015", to: null });
  });

  it("survives an empty list", () => {
    expect(experienceSpan([])).toEqual({ from: "", to: "" });
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
