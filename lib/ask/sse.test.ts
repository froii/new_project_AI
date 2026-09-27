import { describe, expect, it } from "vitest";
import { type AskEvent, decodeEvents, encodeEvent, parseUpstream } from "./sse";

describe("encodeEvent / decodeEvents", () => {
  it("round-trips a sequence of events", () => {
    const sent: AskEvent[] = [
      { type: "sources", items: [{ id: "faq.remote", title: "Remote?" }] },
      { type: "text", content: "Yes,\n\nremote." },
      { type: "done" },
    ];

    const { events, rest } = decodeEvents(sent.map(encodeEvent).join(""));

    expect(events).toEqual(sent);
    expect(rest).toBe("");
  });

  it("holds back an event cut in half until the rest arrives", () => {
    const wire = encodeEvent({ type: "text", content: "Hello" });
    const first = decodeEvents(wire.slice(0, 10));

    expect(first.events).toEqual([]);
    expect(decodeEvents(first.rest + wire.slice(10)).events).toEqual([
      { type: "text", content: "Hello" },
    ]);
  });
});

const line = (content: string) =>
  `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n`;

describe("parseUpstream", () => {
  it("collects text deltas and skips keep-alive comments", () => {
    const result = parseUpstream(`: OPENROUTER PROCESSING\n${line("Hel")}${line("lo")}`);

    expect(result.texts).toEqual(["Hel", "lo"]);
    expect(result.done).toBe(false);
  });

  it("keeps a half-received line for the next chunk", () => {
    const whole = line("Hello");
    const first = parseUpstream(whole.slice(0, 15));

    expect(first.texts).toEqual([]);
    expect(parseUpstream(first.rest + whole.slice(15)).texts).toEqual(["Hello"]);
  });

  it("reports the end of the stream", () => {
    expect(parseUpstream("data: [DONE]\n").done).toBe(true);
  });

  it("reports an error sent mid-stream", () => {
    const result = parseUpstream(`data: ${JSON.stringify({ error: { code: 429 } })}\n`);

    expect(result.failed).toBe(true);
  });
});

describe("parseUpstream model", () => {
  it("reports which model answered", () => {
    const chunk = { model: "nvidia/nemotron:free", choices: [{ delta: { content: "Hi" } }] };
    expect(parseUpstream(`data: ${JSON.stringify(chunk)}\n`).model).toBe("nvidia/nemotron:free");
  });
});
