# Spec Workflow — System Guide (self-spec)

This directory contains a global, project-agnostic **Spec-Driven Development** command set for
Claude Code. It is a hybrid: it reuses the proven methodology of GitHub Spec Kit
(constitution → specify → clarify → plan → tasks → analyze → implement) but is delivered as
**global slash commands** so it works in *every* project without per-project install, without
Python/uv, and it stores artifacts in the **`.kiro/`** layout (compatible with the Kiro IDE).

> Audience of this file: the AI agent itself. Read this first when running any `/spec:*`
> command so the storage layout and update rules do not have to be re-derived.

## Where things live

```
<project-root>/
├── CLAUDE.md                         # auto-load hook → imports .kiro/steering/preferences.md
└── .kiro/
    ├── README.md                     # per-project pointer to this workflow
    ├── steering/                     # persistent context = "constitution" (Kiro-native)
    │   ├── product.md                # what the product is
    │   ├── structure.md              # repo / module layout
    │   ├── tech.md                   # stack, conventions
    │   └── preferences.md            # PORTABLE behavior settings (language, comments, code style)
    └── specs/
        └── <NNN-feature-slug>/       # one folder per feature
            ├── brainstorm.md         # /spec:brainstorm  — divergent options, before committing
            ├── requirements.md       # /spec:specify     — testable requirements (Kiro-native name)
            ├── clarifications.md     # /spec:clarify     — Q&A log resolving [NEEDS CLARIFICATION]
            ├── research.md           # /spec:research    — technical spikes / option comparison
            ├── design.md             # /spec:plan        — technical plan (Kiro-native name)
            ├── tasks.md              # /spec:tasks       — ordered, parallelizable task list
            ├── testcases.md          # /spec:testcases   — explicit test cases
            ├── analysis.md           # /spec:analyze     — cross-artifact consistency report
            └── decisions/            # /spec:adr         — one ADR per file (0001-*.md)
```

### Command → file map (names don't always match the command)

| Command | What it does | Writes/updates |
|---------|--------------|----------------|
| `/spec:init` | Create/repair the `.kiro/` skeleton + `preferences.md` + `CLAUDE.md` hook (idempotent; run once per project) | `.kiro/*`, `CLAUDE.md` |
| `/spec:start` | Orient at session start: product, stack, feature list + status, recent changes, open items | reads only (no writes) |
| `/spec:constitution` | Create/refine persistent project context (product, structure, tech, principles) | `steering/*.md` |
| `/spec:brainstorm` | Explore 3–5 approaches with trade-offs before locking a spec; recommend one | `specs/<f>/brainstorm.md` |
| `/spec:specify` | Write testable requirements (WHAT/WHY, no HOW); mark unknowns `[NEEDS CLARIFICATION]` | `specs/<f>/requirements.md` |
| `/spec:clarify` | Ask focused questions, resolve the `[NEEDS CLARIFICATION]` markers, propagate answers back | `specs/<f>/clarifications.md` (+ back-propagates) |
| `/spec:research` | Compare technical options for a decision and recommend one (de-risk the plan) | `specs/<f>/research.md` |
| `/spec:plan` | Turn the spec into a technical design; run the Constitution Check gate | `specs/<f>/design.md` |
| `/spec:tasks` | Break the design into ordered, parallelizable tasks with checkpoints | `specs/<f>/tasks.md` |
| `/spec:testcases` | Derive explicit, traceable test cases (happy / edge / negative) from spec + design | `specs/<f>/testcases.md` |
| `/spec:analyze` | Read-only consistency & coverage check across all artifacts; GO / FIX-FIRST verdict | `specs/<f>/analysis.md` |
| `/spec:implement` | Execute tasks per `preferences.md`; check off `tasks.md`; run checks; report honestly | source code + `tasks.md` |
| `/spec:adr` | Record a non-obvious decision (trade-off, rejected alternative) as a numbered ADR | `specs/<f>/decisions/NNNN-*.md` |

The two non-obvious pairs: `specify → requirements.md` and `plan → design.md`.

### Kiro IDE compatibility (partial — be honest about this)

Only `requirements.md`, `design.md`, `tasks.md` are read by the Kiro IDE (its native spec model).
Everything else (`brainstorm`, `clarifications`, `research`, `testcases`, `analysis`, `decisions/`)
is **Claude-only** — Kiro ignores those files. So the three canonical files stay dual-usable; the
rest are our extension and exist only for this workflow.

## Language rule (important)

- **Stored artifacts** (everything under `.kiro/`): **English by default**, unless `preferences.md`
  or the user explicitly asks for another language.
- **Chat replies to the user**: follow `preferences.md` (default: the user's configured language).

## Feature slug + numbering

`<NNN-feature-slug>` = zero-padded ordinal + kebab-case name, e.g. `001-user-login`.
To pick `NNN`: list existing `.kiro/specs/*` dirs, take the highest leading number, add 1.
If none exist, start at `001`.

## Command flow

**Minimal flow (small / surgical changes):** `specify → plan → tasks → implement`. Skip the rest.
Prefer this by default — do not push the full 11-step pipeline onto a small fix. Use the full flow
only for greenfield or genuinely complex features.

Full order (each step is optional/skippable, none is a hard gate except where noted):

1. `/spec:init` — one-time per project: create `.kiro/` skeleton, `preferences.md`, `CLAUDE.md`.
2. `/spec:constitution` — create/update `steering/*` (persistent context). Reuses existing files.
3. `/spec:brainstorm <idea>` — explore approaches before locking a spec.
4. `/spec:specify <feature>` — write `requirements.md` (testable MUST-style, with `[NEEDS CLARIFICATION]`).
5. `/spec:clarify` — turn every `[NEEDS CLARIFICATION]` into a resolved Q&A in `clarifications.md`.
6. `/spec:research` — (optional) compare technical options, record decision inputs.
7. `/spec:plan` — write `design.md`; run a Constitution Check against `steering/`.
8. `/spec:tasks` — derive `tasks.md` from the design.
9. `/spec:testcases` — derive explicit test cases from requirements + design.
10. `/spec:analyze` — check consistency across requirements/design/tasks/testcases → `analysis.md`.
11. `/spec:implement` — execute `tasks.md`, updating checkboxes as work completes.
12. `/spec:adr <title>` — record any non-obvious decision as an ADR under `decisions/`.

## Rules every command must follow

- **Read context first**: load `.kiro/steering/*` and `.kiro/steering/preferences.md` before acting.
- **Locate the active feature**: if the user names one, use it; else use the most recently modified
  `.kiro/specs/*` dir; if none exists, ask for a feature name (or tell them to run `/spec:specify`).
- **Never invent facts**: unknowns become `[NEEDS CLARIFICATION: question]`, not guesses.
- **Idempotent writes**: update existing files in place; do not duplicate or clobber user edits.
- **Respect `preferences.md`**: comment density, code-change scope, allowed commands, reply language.
- **Keep artifacts in English by default** (see Language rule).

## Context model (token economy)

The layout is lazy by design — keep it that way:

- **Always in context (every turn):** `CLAUDE.md` + `preferences.md` (via `@import`) + `MEMORY.md`
  index. Keep these short; they are pure overhead on every request.
- **On demand (0 cost until used):** `steering/*`, `specs/**`, and the `/spec:*` command files.
  Read the specific section you need (Grep to locate, then `offset/limit`); never load whole large
  files or all specs at once.
- At scale (many features), add a one-line-per-feature index so lookups stay cheap instead of
  scanning every spec. Not needed while feature count is low (YAGNI).

## Default behavior: auto-sync (no command needed)

The `/spec:*` commands are OPTIONAL power tools for deliberate, full passes. The normal mode is:
when the user asks for a change, the agent **also updates the affected `.kiro/` artifacts in the
same turn**, terse and delta-only, and reports the sync in one line. This is enforced by
`preferences.md` (§Auto-maintenance) via the project `CLAUDE.md` import — so it applies to all work,
not just `/spec:*`. Goal: a year later the `.kiro/` tree still answers "what/where/why" without asking.

## Start a new product (copy, then init)

1. Copy into the new project root:
   - `CLAUDE.md` — the auto-load hook.
   - `.kiro/steering/preferences.md` — portable behavior settings (the core you carry between projects).
   - (Optional) the whole `.kiro/` folder as a skeleton, then delete everything under `.kiro/specs/`.
2. Run `/spec:init` — creates any missing folders, `.kiro/README.md`, and wires the hook.
3. Run `/spec:constitution` — write `product.md` / `structure.md` / `tech.md` for the NEW product
   (do not carry over the old product's content).
4. Start working. From here the agent keeps `.kiro/` in sync automatically; use `/spec:*` only for
   deliberate full passes.

## Updating this system

- To change behavior globally: edit the command files in this directory.
- To change behavior for one project: edit that project's `.kiro/steering/preferences.md`.
- To bootstrap a fresh project: see "Start a new product" above.
