/* /api/ask -> chat: one JSON event per `data:` line. */
export type AskEvent =
  | { type: "sources"; items: { id: string; title: string }[] }
  | { type: "text"; content: string }
  /* Who answered: OpenRouter may fall back past the pick. */
  | { type: "done"; model?: string; truncated?: boolean }
  /* Every failure reads as "limit reached" to the visitor. */
  | { type: "error" };

export function encodeEvent(event: AskEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

/* `rest` is the unfinished tail for the next chunk. */
export function decodeEvents(buffer: string): { events: AskEvent[]; rest: string } {
  const blocks = buffer.split("\n\n");
  const rest = blocks.pop() ?? "";
  const events: AskEvent[] = [];

  for (const block of blocks) {
    if (!block.startsWith("data: ")) continue;
    try {
      events.push(JSON.parse(block.slice(6)) as AskEvent);
    } catch {
      /* skip malformed */
    }
  }

  return { events, rest };
}

/* OpenRouter SSE: deltas, keep-alives, [DONE], mid-stream errors. */
export function parseUpstream(buffer: string): {
  texts: string[];
  done: boolean;
  failed: boolean;
  truncated: boolean;
  model?: string;
  rest: string;
} {
  const lines = buffer.split("\n");
  const rest = lines.pop() ?? "";
  const texts: string[] = [];
  let done = false;
  let failed = false;
  let truncated = false;
  let model: string | undefined;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith("data: ")) continue;

    const data = line.slice(6);
    if (data === "[DONE]") {
      done = true;
      continue;
    }

    try {
      const parsed = JSON.parse(data) as {
        error?: unknown;
        model?: unknown;
        choices?: { delta?: { content?: unknown }; finish_reason?: unknown }[];
      };
      if (parsed.error) failed = true;
      if (typeof parsed.model === "string") model ??= parsed.model;
      const choice = parsed.choices?.[0];
      /* Hit max_tokens: [DONE] still follows. */
      if (choice?.finish_reason === "length") truncated = true;
      const content = choice?.delta?.content;
      if (typeof content === "string" && content) texts.push(content);
    } catch {
      /* not JSON */
    }
  }

  return { texts, done, failed, truncated, model, rest };
}
