import { get, list, put } from "@vercel/blob";

/* One blob per question: Blob has no append, and a shared file would race between instances. */
const PREFIX = "ask-log/";

export type LoggedQuestion = {
  at: string;
  locale: string;
  model?: string;
  sources: string[];
  question: string;
  answer: string;
};

/* On Vercel a connected store gives BLOB_STORE_ID and the SDK signs with OIDC; the read-write
   token is the local fallback. Neither (plain local dev): nothing is kept. */
export const questionLogEnabled = () =>
  Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

export async function logQuestion(entry: LoggedQuestion): Promise<void> {
  if (!questionLogEnabled()) return;
  await put(`${PREFIX}${Date.now()}.json`, JSON.stringify(entry), {
    access: "private",
    addRandomSuffix: true,
    contentType: "application/json",
  });
}

export async function loggedQuestions(): Promise<{ entries: LoggedQuestion[]; urls: string[] }> {
  const urls: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    urls.push(...page.blobs.map((blob) => blob.url));
    cursor = page.cursor;
  } while (cursor);

  const entries = await Promise.all(
    urls.map(async (url) => {
      const blob = await get(url, { access: "private" });
      return blob?.statusCode === 200
        ? (JSON.parse(await new Response(blob.stream).text()) as LoggedQuestion)
        : null;
    }),
  );

  return {
    entries: entries
      .filter((entry): entry is LoggedQuestion => entry !== null)
      .sort((a, b) => a.at.localeCompare(b.at)),
    urls,
  };
}
