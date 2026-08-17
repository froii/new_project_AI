---
description: Bootstrap the .kiro spec-driven structure in the current project (idempotent)
argument-hint: "[optional: short project description]"
---

You are bootstrapping the Spec-Driven Development structure for THIS project.
Read `~/.claude/commands/spec/README.md` for the canonical layout before acting.

Steps (all idempotent — never overwrite existing user content, only create what is missing):

1. Ensure directories exist: `.kiro/steering/`, `.kiro/specs/`.
2. If `.kiro/steering/` has no `product.md` / `structure.md` / `tech.md`, scan the repository and
   draft them (English by default). If they already exist (e.g. created by Kiro), keep them — do
   NOT rewrite.
3. If `.kiro/steering/preferences.md` is missing, create it from the template below.
4. If `.kiro/README.md` is missing, create a short pointer that says this project uses the global
   `/spec:*` workflow and links the storage layout.
5. Ensure the project has an auto-load hook so preferences apply to ALL work, not just `/spec:*`:
   - If `CLAUDE.md` does not exist at project root, create it with a single import line:
     `@.kiro/steering/preferences.md` plus one line pointing to the spec workflow.
   - If `CLAUDE.md` exists, append the `@.kiro/steering/preferences.md` import only if absent.
6. Print a short summary of what was created vs. already present.

`preferences.md` template (write verbatim; outer fence is `~~~` so inner fences stay intact):

~~~markdown
# Project Preferences (steering)

Portable behavior settings for the AI agent. Copy this file into any project to get the same
behavior. Edit the values; keep the headings.

## Reply language
- Talk to me in: <your language>
- Store all artifacts (specs, docs, code comments): English by default

## Comments in code
- Density: minimal. Only comment non-obvious intent ("why", not "what").
- Do NOT add verbose explanatory or tutorial-style comments.

## Code changes
- Prefer the smallest change that solves the problem.
- Optimize for simplicity and readability over cleverness.
- Do NOT add features, abstractions, options, or functions that were not requested (YAGNI).
- Do NOT refactor unrelated code unless asked.

## Commands
- Preferred checks to run after changes: <lint>, <typecheck>, <tests>   (fill in per project)
- Never run without asking: destructive, deploy, or network-mutating commands.

## Response style
- Be concise. Act when the next step is obvious; do not over-explain options.

## Auto-maintenance (keep .kiro in sync WITHOUT being asked)
When I ask for a change, you ALSO update the affected `.kiro/` artifacts in the same turn — I should
not have to call `/spec:*` just to keep records current. `/spec:*` commands stay optional.
- Touch only what is materially affected. YAGNI applies to the docs too.
- Map: product/UX → requirements.md; technical/convention → design.md (+ steering if a rule changed);
  work → tasks.md; testable behavior → testcases.md; non-obvious "why" → decisions/NNNN-*.md.
- After syncing, report it in ONE line, e.g. `synced: design.md §Buttons, TC-012`.

## Writing style for artifacts
- Senior-architect terse: facts over narration, deltas not restatements, bullets/tables, no walls of text.

## Context economy (read only what's needed)
- Locate with Grep, then read specific sections (offset/limit) — never load whole large files or all
  specs at once. Load a feature's files only when working on it. Keep this file short (always in context).
~~~
