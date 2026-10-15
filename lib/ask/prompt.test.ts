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
    expect(messages[0].content).not.toContain("job posting");
  });

  it("keeps the system message and history fixed and puts the posting on the last turn", () => {
    const history = [
      { role: "user" as const, content: "Fit?" },
      { role: "assistant" as const, content: "React: meets it." },
    ];
    const text = buildMessages(profile, found, {
      question: "Why partly?",
      locale: "en",
      history,
      vacancy: { text: "React, Angular" },
    });
    const image = buildMessages(profile, found, {
      question: "Why partly?",
      locale: "en",
      history,
      vacancy: { image: "data:image/jpeg;base64,AAAA" },
    });

    expect(text.slice(0, -1)).toEqual(image.slice(0, -1));
    expect(text[0].content).toContain("job posting");
    expect(text.at(-1)?.content).toBe("Job posting:\n\nReact, Angular\n\nQuestion: Why partly?");
    expect(image.at(-1)?.content).toContainEqual({
      type: "image_url",
      image_url: { url: "data:image/jpeg;base64,AAAA" },
    });
  });
});
