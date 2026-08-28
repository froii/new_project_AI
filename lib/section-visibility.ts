import {
  partsOf,
  presetIds,
  presets,
  toggleCodes,
  toggleDefaults,
  toggleIds,
  toggleSectionIds,
  type PresetId,
  type ToggleId,
  type ToggleSectionId,
} from "@/content/sections";

export type Visibility = Record<ToggleId, boolean>;

export const SECTIONS_PARAM = "x";

const SEPARATOR = ".";

export const defaultVisibility: Visibility = { ...toggleDefaults };

export function encodeVisibility(visible: Visibility): string | null {
  const changed = toggleIds.filter((id) => visible[id] !== toggleDefaults[id]);
  if (changed.length === 0) return null;
  return changed.map((id) => toggleCodes[id]).join(SEPARATOR);
}

export function decodeVisibility(value: string | null): Visibility {
  const result = { ...defaultVisibility };
  if (value === null || value === "") return result;

  const changed = new Set(value.split(SEPARATOR));
  for (const id of toggleIds) {
    if (changed.has(toggleCodes[id])) result[id] = !toggleDefaults[id];
  }
  return result;
}

export function presetVisibility(id: PresetId): Visibility {
  return { ...defaultVisibility, ...presets[id] };
}

/* What a version actually contains, counted off the toggles themselves, so the
   panel cannot describe a version the data no longer produces. Details inside a
   switched-off section do not count: nothing renders them. */
export function visibilityCount(visible: Visibility): { sections: number; details: number } {
  const sections = toggleSectionIds.filter((id) => visible[id]);

  return {
    sections: sections.length,
    details: sections.flatMap(partsOf).filter((id) => visible[id]).length,
  };
}

export function matchPreset(visible: Visibility): PresetId | null {
  return (
    presetIds.find((id) => {
      const candidate = presetVisibility(id);
      return toggleIds.every((toggle) => candidate[toggle] === visible[toggle]);
    }) ?? null
  );
}

export const OPEN_PARAM = "o";

const NONE = "-";

export function encodeOpen(open: string[], fallback: string[]): string | null {
  const same = open.length === fallback.length && open.every((id) => fallback.includes(id));
  if (same) return null;
  return open.length === 0 ? NONE : open.join(SEPARATOR);
}

export function decodeOpen(value: string | null): string[] | null {
  if (value === null || value === "") return null;
  if (value === NONE) return [];
  return value.split(SEPARATOR);
}

export function partsCount(
  visible: Visibility,
  section: ToggleSectionId,
): { on: number; total: number } {
  const parts = partsOf(section);
  return { on: parts.filter((id) => visible[id]).length, total: parts.length };
}
