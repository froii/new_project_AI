export type FreeModel = { id: string; name: string };

type CatalogEntry = { id: string; name: string };

/* Only :free ids cost nothing. */
export const isFreeModelId = (id: string) => /^[\w.-]+\/[\w.-]+:free$/.test(id);

/* By Artificial Analysis index, then speed (2026-10); dots has no score yet. First three live
   ones are the "Auto" fallback. */
export const curatedModels = [
  "nvidia/nemotron-3.5-super-vl:free",
  "thinkingmachines/inkling-small:free",
  "thinkingmachines/inkling:free",
  "google/gemma-4-26b-a4b-it:free",
  "dots-studio/dots-3-note-preview:free",
];

/* Curated order, minus retired models. */
export function pickFreeModels(catalog: CatalogEntry[], curated = curatedModels): FreeModel[] {
  const byId = new Map(catalog.map((entry) => [entry.id, entry]));

  return curated.flatMap((id) => {
    const entry = byId.get(id);
    if (!entry) return [];
    return [{ id, name: entry.name.replace(/\s*\(free\)\s*$/i, "").trim() }];
  });
}

/* Empty on failure: the dropdown falls back to "Auto". */
export async function freeModels(): Promise<FreeModel[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    const { data } = (await response.json()) as { data: CatalogEntry[] };
    return pickFreeModels(data);
  } catch {
    return [];
  }
}
