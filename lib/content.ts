import type { PresetId } from "@/content/sections";
import type { ExperienceEntry } from "@/content/types";

export function isCurrent(entry: ExperienceEntry): boolean {
  return entry.end === undefined;
}

export function sortExperience(entries: ExperienceEntry[]): ExperienceEntry[] {
  return [...entries].sort((a, b) => b.start.localeCompare(a.start));
}

/* MM/YYYY, the date format ATS parsers expect. */
export function monthYear(value: string): string {
  const [year, month] = value.split("-");
  return month ? `${month}/${year}` : value;
}

/** The whole career as one range. `to: null` means it is still running. */
export function experienceSpan(entries: ExperienceEntry[]): { from: string; to: string | null } {
  const dev = entries.filter((entry) => !entry.nonDev);
  const starts = dev.map((entry) => entry.start.slice(0, 4)).sort();
  const ends = dev.map((entry) => entry.end?.slice(0, 4) ?? "").sort();

  return {
    from: starts[0] ?? "",
    to: dev.some(isCurrent) ? null : (ends.at(-1) ?? ""),
  };
}

const recentRoles = 3;

export function shortlistExperience(entries: ExperienceEntry[]): ExperienceEntry[] {
  return sortExperience(entries)
    .filter((entry) => !entry.nonDev)
    .slice(0, recentRoles);
}

const openRoles = 2;

export function defaultOpenRoles(entries: ExperienceEntry[]): string[] {
  return shortlistExperience(entries)
    .slice(0, openRoles)
    .map((entry) => entry.id);
}

/* A preset also sets which roles print expanded: a role collapsed on screen
   would otherwise reach the PDF as a title line. */
export function presetOpenRoles(preset: PresetId, entries: ExperienceEntry[]): string[] {
  return preset === "full" ? entries.map((entry) => entry.id) : defaultOpenRoles(entries);
}
