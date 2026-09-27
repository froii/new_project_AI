export type FreeModel = { id: string; name: string };

type CatalogEntry = { id: string; name: string };

/* Only :free ids cost nothing. */
export const isFreeModelId = (id: string) => /^[\w.-]+\/[\w.-]+:free$/.test(id);

/* One per family, checked on Ukrainian. First three live ones are the "Auto" fallback. */
export const curatedModels = [
  "dots-studio/dots-3-note-preview:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "cohere/north-mini-code:free",
  "google/gemma-4-31b-it:free",
  "qwen/qwen3.8-27b:free",
];

/* Curated order, minus retired models. */
export function pickFreeModels(catalog: CatalogEntry[], curated = curatedModels): FreeModel[] {
  const names = new Map(catalog.map((entry) => [entry.id, entry.name]));

  return curated.flatMap((id) => {
    const name = names.get(id);
    return name ? [{ id, name: name.replace(/\s*\(free\)\s*$/i, "").trim() }] : [];
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
