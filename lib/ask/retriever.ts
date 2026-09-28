import MiniSearch from "minisearch";
import type { Locale } from "@/i18n/config";
import { type Chunk, chunks } from "./chunks";

/* Swap point for a vector store. */
export type Retriever = (query: string, locale: Locale) => Promise<Chunk[]>;

const TOP_K = 5;

/* Too common to rank by in a corpus this small. */
const stopWords = new Set(
  (
    "a an and are can do does did for have how i in is it of on or the to what when where which who why with you your " +
    "а в ви вас ваш ваша ваше ваші вам де до з і й коли на по та у хто це чи що як який яка яке які"
  ).split(" "),
);

/* Truncation stemming for Ukrainian endings. */
const STEM = 6;

export function stem(term: string): string | null {
  const word = term.toLowerCase();
  if (word.length < 2 || stopWords.has(word)) return null;
  return word.slice(0, STEM);
}

const indexes = new Map<Locale, { search: MiniSearch<Chunk>; byId: Map<string, Chunk> }>();

function index(locale: Locale) {
  const cached = indexes.get(locale);
  if (cached) return cached;

  const all = chunks(locale);
  const search = new MiniSearch<Chunk>({
    fields: ["title", "keywords", "text"],
    extractField: (doc, field) =>
      field === "keywords" ? doc.keywords.join(" ") : doc[field as "title" | "text" | "id"],
    processTerm: stem,
    searchOptions: { boost: { keywords: 3, title: 2 }, fuzzy: 0.2 },
  });
  search.addAll(all);

  const built = { search, byId: new Map(all.map((chunk) => [chunk.id, chunk])) };
  indexes.set(locale, built);
  return built;
}

export const keywordRetriever: Retriever = async (query, locale) => {
  const { search, byId } = index(locale);

  return search
    .search(query)
    .slice(0, TOP_K)
    .map((hit) => byId.get(hit.id as string))
    .filter((chunk): chunk is Chunk => chunk !== undefined);
};
