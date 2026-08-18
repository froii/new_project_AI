# Project Preferences (steering)

Portable behavior settings for the AI agent. **Copy this file into any project** to get the same
behavior. Edit the values; keep the headings. It is auto-loaded via the project `CLAUDE.md`
(`@.kiro/steering/preferences.md`) and read by every `/spec:*` command.

> **Guiding principle — the minimum of what is needed, never the maximum of what is possible.**
> Excess logic is the number-one reason review fails: the reviewer drowns in branches nobody asked
> for. Every unrequested branch, option, or abstraction is a place for a bug to hide and a thing
> someone has to read, test, and later delete. Write so little that what the code does is visible
> at a glance — to the next human and to the next agent.

## Reply language
- Talk to me in: Ukrainian
- Store all artifacts (specs, docs, code comments, commit messages): English

## Comments in code
- Default is **zero comments**. A comment must earn its place by explaining non-obvious intent
  ("why"), never restating what the code already says.
- Banned: section banners, step-by-step narration, tutorial tone, JSDoc/docblocks in files that
  don't already use them, "// TODO" I didn't ask for.
- Match the comment density of the surrounding file — usually that means none.
- I delete surplus comments by hand. Every one you add that I have to remove is a cost, not a favor.

## Code changes
Understand first, then walk the ladder. Read the code the change touches and trace the real flow
before picking a rung — lazy about the solution, never about reading.
1. Does this need to exist? → no: skip it (YAGNI)
2. Already in this codebase? → reuse it, don't rewrite
3. Stdlib does it? → use it
4. Native platform feature? → use it
5. Installed dependency? → use it
6. Then: the smallest **correct** implementation

- Small because it is necessary — never because short is the goal. No code-golf, no cramming logic
  into one line: if the clear version is five readable lines, write five lines.
- Never on the chopping block: trust-boundary validation, error handling / data-loss paths,
  security, accessibility. Cutting these is not minimalism, it's a bug.
- Solve the task as stated, not the hypothetical one: no config flags, no branch for a caller that
  does not exist, no "just in case" handling, no unrequested abstraction or option.
- Do NOT refactor unrelated code unless asked.
- Match the existing code's style, naming, and idiom (formatting is the linter's job).

## Role separation (write vs verify)
The point is asymmetric inputs: a checker that shares the writer's intent inherits the writer's
blind spots and will validate the plan instead of the code.
- Writing reads `design.md` + `tasks.md`. Verification runs as a **subagent** whose entire input is
  `requirements.md`, `testcases.md`, and the changed files — never `design.md`, never the
  conversation that wrote the code. A fresh context is only real if it is a separate one.
- Judge against requirements, not the plan: "REQ-3 uncovered", not "matches the design".
- Tests are the only truly independent check — they hold no opinion. Prefer them to a second read.

## Definition of done (do all of this unasked)
Minimalism governs the **code**, never the trail it leaves. Because the code is small and does not
explain itself, the "why" has to live next to it. Work is finished only when all three hold:
1. **Code** — the minimum that solves the task (see the guiding principle).
2. **Verified** — per §Role separation; typecheck run in the affected repo.
3. **Traceable** — `tasks.md` ticked, affected `.kiro/` artifacts synced, non-obvious "why" as an
   ADR. Six months on, any line of code must lead back to the requirement that caused it.

Report in one line: what was done, what was synced. Do not ask permission for steps 2–3 — they are
the job, not an extra.

## Review order (a finished change)
Everything that **rewrites** code runs before everything that **reads** it — otherwise the review
reports findings on lines that are already gone.
1. `/run` — gate: does it start and work at all? Reviewing code that doesn't run judges intent.
2. `/spec:cut` — what should not exist at all (ladder rung 1).
3. `/simplify` — clean up what survived the cut.
4. `/security-review`, `/code-review` — verification of the final code; order between them is free.

If a diff-based command spans several git repos, run it once **per repo** — from the workspace root
it sees only part of the change.

## Commands
- root Next.js app — npm. `npm run typecheck` / `npm run build` / `npm test` (vitest, `lib/**`) /
  `npm run lint` (eslint, flat config).
- Do NOT auto-run lint or tests — I review my own code, so it is usually redundant. ASK first whether
  I want lint or tests run. Typecheck is fine to run silently after non-trivial changes (cheap,
  catches real breakage). Always in the affected sub-project only.
- Destructive / deploy / migration / network-mutating commands are blocked by `deny` rules in
  `.claude/settings.json`. The mechanism guards this, not this file — never work around it.

## Style (replies and artifacts alike)
Terse, facts over narration, deltas not restatements. Bullets and tables over prose, no walls of
text, no tutorial tone. A reader must grasp it at a glance: what, where, why (only if non-obvious).
- Replies: act when the next step is obvious; do not over-explain options.
- Honesty: if a check fails, show the output; if a step was skipped, say so.
- Findings: every item names its trigger and its damage ("filter refetch → new invite renders under
  max-height 0 → invisible"). No damage to name → drop the item instead of listing it.

## Auto-maintenance (keep .kiro in sync WITHOUT being asked)
When I ask for a change, you ALSO update the affected `.kiro/` artifacts in the same turn — I should
not have to call `/spec:*` just to keep records current. The `/spec:*` commands stay optional, for
deliberate full passes.
- Touch only what is materially affected (button color → the design token / one testcase, not the
  whole spec). YAGNI applies to the docs too.
- Change → artifact, all under `specs/<f>/`: product/UX/behavior → `requirements.md`;
  technical/convention → `design.md` (+ `steering/*` if a rule changed); work added or done →
  `tasks.md`; testable behavior → `testcases.md`; non-obvious "why" → `decisions/NNNN-*.md`.
- If no feature folder fits, ask once which feature it belongs to (or create one).
- After syncing, report it in ONE line, e.g. `synced: design.md §Buttons, TC-012`.

## Context economy (read only what's needed)
- Locate with Grep, then read the specific section (offset/limit) — never load whole large files or
  all specs at once. Load a feature's files only when working on that feature.
- Same for `steering/tech.md` / `structure.md`: grep the section, never load the file.
- The ladder applies to loading context, not just to code: skills load all-or-nothing, so call one
  only when the answer is not already known. Prefer its `references/*` file over the whole skill.
- Keep this file short: it is always in context via the `CLAUDE.md` import. Verbose detail belongs in
  `steering/*` (read on demand), not here.

## Improving this file
- **New project**: right after `/spec:init`, flag what does not fit the new stack or toolchain —
  deltas before the first task, not after.
- **After non-trivial work**: if a rule caused friction, was missing, or I corrected you twice on
  the same thing — ASK once, "run a preferences review?" Never rewrite this file silently.
- **Budget: 130 lines**, measured as `(Get-Content file).Count`. Past that, adding a rule means
  removing one — attention is the scarce resource, not disk.
- A rule that a mechanism can enforce (ESLint, Prettier, husky, `deny` rules) belongs in the
  mechanism, and its line here gets deleted. Mechanisms do not forget; text does.
- `/spec:tune` runs the deliberate full pass.
