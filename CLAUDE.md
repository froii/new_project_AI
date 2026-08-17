# Project instructions

Behavior settings (language, comments, code-style, commands) are defined here and auto-applied:

@.kiro/steering/preferences.md

## Persistent context (constitution)
See `.kiro/steering/` — `product.md`, `structure.md`, `tech.md`.
They are empty until `/spec:constitution` fills them for this product.

## Spec-driven workflow
Specs live in `.kiro/specs/<feature>/`. The `/spec:*` commands ship with this repo in
`.claude/commands/spec/` — edit them here, they are versioned with the project.
See `.kiro/README.md` for the layout.

## Session start (orientation protocol)
- To change my behavior permanently: edit `.kiro/steering/preferences.md` (the settings file, always
  loaded via the import above). "Change settings to X" = edit that file, don't just comply for one turn.
- Before working on a feature, read its `.kiro/specs/<feature>/` files first (source of truth;
  don't rely on memory of a past session). Feature index + state: run `/spec:start`.
- Do NOT auto-read all of `.kiro/` at session start — read on demand only (token economy).
