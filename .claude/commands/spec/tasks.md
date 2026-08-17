---
description: Derive an ordered, parallelizable task list (tasks.md) from the design
argument-hint: "[optional: feature slug]"
---

Break the design into executable tasks. Read `.kiro/steering/*`, `preferences.md`, the feature's
`requirements.md` and `design.md`. Write into `.kiro/specs/<feature>/tasks.md`, in English by
default (unless `preferences.md` or the user asks for another language).

Rules:
- Task format: `- [ ] [ID] [P?] [Story] <description>` where `[P]` marks tasks that touch different
  files and have no dependency (can run in parallel).
- Group into phases: **Setup → Foundational (blocking) → User Story 1..N (by priority) → Polish**.
- Foundational tasks block all story work; say so explicitly.
- Each user story group must be independently completable and testable; add a **Checkpoint** line.
- If `preferences.md`/steering asks for test-first, put failing-test tasks before implementation.
- Reference concrete file paths where known. Keep tasks small (one clear outcome each).

Template (outer fence is `~~~` so the inner ```` ``` ```` stay intact):

~~~markdown
# Tasks: <feature>

## Phase 1 — Setup
- [ ] T001 <...>

## Phase 2 — Foundational (blocks all stories)
- [ ] T010 <...>

## Phase 3 — User Story 1: <title> (P1)
- Goal: <...>
- Independent test: <...>
- [ ] T020 [P] [US1] <...>
- **Checkpoint**: US1 works end-to-end and does not break prior stories.

## Phase N — Polish
- [ ] T090 [P] <docs / cleanup / perf>
~~~

End by summarizing task count and the critical path.
