---
description: Resolve open questions and [NEEDS CLARIFICATION] markers via a structured Q&A
argument-hint: "[optional: feature slug]"
---

Turn ambiguity into decisions. Read `.kiro/steering/*`, `preferences.md`, and the feature's
`requirements.md` (and `design.md` if present). Write artifacts in English by default (unless
`preferences.md` or the user asks for another language).

Steps:
1. Resolve the active feature folder (argument, or most recently modified `.kiro/specs/*`).
2. Collect every `[NEEDS CLARIFICATION: ...]` marker plus any other genuine ambiguity you find.
3. Ask the user the questions — use the interactive question tool when available, one focused batch,
   each with a recommended default. Prefer few high-impact questions over many trivial ones.
4. Record each resolved item in `clarifications.md`:

~~~markdown
# Clarifications: <feature>

## Q1 — <topic>
- **Question**: ...
- **Answer**: ...
- **Impact**: updates FR-00X / design section Y
~~~

5. Propagate answers back into `requirements.md` (and `design.md`) — replace the resolved
   `[NEEDS CLARIFICATION]` markers with concrete text.
6. Summarize what was resolved and what (if anything) still needs input.

Never fabricate an answer. If the user defers, keep the marker and note "deferred".
