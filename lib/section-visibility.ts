import { toggleCodes, toggleDefaults, toggleIds, type ToggleId } from "@/content/sections";

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
