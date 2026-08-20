import type { ExperienceEntry } from "@/content/types";

export function isCurrent(entry: ExperienceEntry): boolean {
  return entry.end === undefined;
}

export function sortExperience(entries: ExperienceEntry[]): ExperienceEntry[] {
  return [...entries].sort((a, b) => b.start.localeCompare(a.start));
}

export function dottedDate(value: string): string {
  return value.replace("-", ".");
}

/** The whole career as one range. `to: null` means it is still running. */
export function experienceSpan(entries: ExperienceEntry[]): { from: string; to: string | null } {
  const starts = entries.map((entry) => entry.start.slice(0, 4)).sort();
  const ends = entries.map((entry) => entry.end?.slice(0, 4) ?? "").sort();

  return {
    from: starts[0] ?? "",
    to: entries.some(isCurrent) ? null : (ends.at(-1) ?? ""),
  };
}
