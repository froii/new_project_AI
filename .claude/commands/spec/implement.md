---
description: Execute the task list, implementing the feature and updating progress
argument-hint: "[optional: feature slug, or task IDs to run]"
---

Implement the feature by executing `tasks.md`. Read `.kiro/steering/*`, `preferences.md`, and the
feature's `requirements.md`, `design.md`, `tasks.md`, `testcases.md`.

Rules:
- Follow `preferences.md` strictly: minimal comments, smallest change that works, no unrequested
  features/abstractions, no unrelated refactors, allowed commands only.
- Respect task order: Setup → Foundational → Stories (by priority) → Polish. Honor `[P]` for
  parallelizable work and dependencies otherwise.
- If test-first is configured, implement the failing test before its code.
- Update `tasks.md` in place: check off `- [x]` completed tasks as you go.
- Match the surrounding code's style, naming, and idiom.
- If reality diverges from the design (a task is wrong/blocked), stop, note it, and propose a design
  update rather than silently improvising.
- After a story's tasks are done, run its checkpoint verification and report the result honestly.

Steps:
1. Resolve the active feature and load all artifacts.
2. If `$ARGUMENTS` names specific task IDs, run only those; otherwise run the next unchecked phase.
3. Implement, run the project's configured checks (lint/typecheck/tests) if allowed, and report
   real results (including failures) with the relevant output.
4. Summarize what was completed, what remains, and any deviations from the plan.
