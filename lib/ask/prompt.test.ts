import { describe, expect, it } from "vitest";
import type { Chunk } from "./chunks";
import { buildMessages } from "./prompt";

const profile: Chunk = { id: "profile", title: "Jane Doe", text: "Engineer.", keywords: [] };
const found: Chunk[] = [{ id: "faq.remote", title: "Remote?", text: "Yes.", keywords: [] }];

describe("buildMessages", () => {
  it("puts rules and context in the system message, then history, then the question", () => {
    const messages = buildMessages(profile, found, {
      question: "Relocation?",
      locale: "uk",
      history: [
        { role: "user", content: "Remote?" },
        { role: "assistant", content: "Yes." },
      ],
    });

    expect(messages.map((message) => message.role)).toEqual([
      "system",
      "user",
      "assistant",
      "user",
    ]);
    expect(messages[0].content).toContain("Answer in the language of the user's last question");
    expect(messages[0].content).toContain("[Jane Doe]\nEngineer.");
    expect(messages[0].content).toContain("[Remote?]\nYes.");
    expect(messages.at(-1)?.content).toBe("Relocation?");
  });
});
