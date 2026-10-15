import { isLocale, type Locale } from "@/i18n/config";
import { curatedModels } from "./models";

export type ChatTurn = { role: "user" | "assistant"; content: string };

/* A screenshot is a JPEG data URL, already scaled down in the browser. */
export type Vacancy = { text: string } | { image: string };

export type AskRequest = {
  question: string;
  history: ChatTurn[];
  locale: Locale;
  model?: string;
  vacancy?: Vacancy;
};

/* `image` counts data URL characters; Vercel refuses bodies over 4.5 MB. */
export const askLimits = { question: 500, turns: 6, turn: 2000, vacancy: 15000, image: 3_000_000 };

function parseVacancy(value: unknown): Vacancy | null | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) return null;
  const fields = value as Record<string, unknown>;

  if (typeof fields.text === "string") {
    const text = fields.text.trim();
    return text && text.length <= askLimits.vacancy ? { text } : null;
  }
  if (typeof fields.image === "string") {
    const image = fields.image;
    return image.length <= askLimits.image &&
      /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(image)
      ? { image }
      : null;
  }
  return null;
}

function isTurn(value: unknown): value is ChatTurn {
  if (typeof value !== "object" || value === null) return false;
  const turn = value as Record<string, unknown>;
  return (turn.role === "user" || turn.role === "assistant") && typeof turn.content === "string";
}

export function parseAsk(body: unknown): AskRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const fields = body as Record<string, unknown>;

  const question = typeof fields.question === "string" ? fields.question.trim() : "";
  if (!question || question.length > askLimits.question) return null;

  const locale = typeof fields.locale === "string" ? fields.locale : undefined;
  if (!isLocale(locale)) return null;

  /* Providers 400 on empty or same-role turns in a row. */
  const turns: ChatTurn[] = [];
  for (const turn of (Array.isArray(fields.history) ? fields.history : []).filter(isTurn)) {
    const content = turn.content.trim().slice(0, askLimits.turn);
    const expected = turns.length % 2 === 0 ? "user" : "assistant";
    if (content && turn.role === expected) turns.push({ role: turn.role, content });
  }
  /* The question is the next user turn. */
  if (turns.at(-1)?.role === "user") turns.pop();
  const history = turns.slice(-askLimits.turns);

  /* Ids off the list are dropped, not refused. */
  const model =
    typeof fields.model === "string" && curatedModels.includes(fields.model)
      ? fields.model
      : undefined;

  const vacancy = parseVacancy(fields.vacancy);
  if (vacancy === null) return null;

  return {
    question,
    history,
    locale,
    ...(model && { model }),
    ...(vacancy && { vacancy }),
  };
}

/* By the question's script, not the page: a Ukrainian question on /en finds nothing in English. */
export function contentLocale(question: string): Locale {
  return /\p{Script=Cyrillic}/u.test(question) ? "uk" : "en";
}

/* Follow-ups carry no search terms of their own. */
export function searchQuery({ question, history }: AskRequest): string {
  const previous = history.filter((turn) => turn.role === "user").at(-1);
  return previous ? `${previous.content} ${question}` : question;
}
