# .kiro — spec-driven workspace

Specs, decisions and behavior settings for this project. Artifacts are stored in English.
The `/spec:*` commands live in `.claude/commands/spec/` — they are part of this repo, not global.

`.kiro/` is under version control here: code lives in git, and the reasons behind that code must
too, or `git log` loses its "why".

## Layout
```
.kiro/
├── TODO.md              # ideas not built yet + what must happen first
├── steering/            # persistent context = "constitution"
│   ├── product.md       # what the product is
│   ├── structure.md     # repo / module layout
│   ├── tech.md          # stack & conventions
│   └── preferences.md   # portable behavior settings — copy to reuse
└── specs/
    └── <NNN-feature>/   # one folder per feature
        ├── brainstorm.md      # /spec:brainstorm
        ├── requirements.md    # /spec:specify
        ├── clarifications.md  # /spec:clarify
        ├── research.md        # /spec:research
        ├── design.md          # /spec:plan
        ├── tasks.md           # /spec:tasks
        ├── testcases.md       # /spec:testcases
        ├── analysis.md        # /spec:analyze
        └── decisions/         # /spec:adr  (NNNN-*.md)
```

## Commands

| Command | What it does | Writes/updates |
|---------|--------------|----------------|
| `/spec:init` | Create/repair the `.kiro/` skeleton + `preferences.md` + `CLAUDE.md` hook (run once) | `.kiro/*`, `CLAUDE.md` |
| `/spec:start` | Orient at session start: product, stack, feature list + status, recent changes | reads only |
| `/spec:constitution` | Create/refine persistent project context (product, structure, tech, principles) | `steering/*.md` |
| `/spec:brainstorm` | Explore 3–5 approaches with trade-offs before locking a spec; recommend one | `specs/<f>/brainstorm.md` |
| `/spec:specify` | Write testable requirements (WHAT/WHY, no HOW); mark unknowns `[NEEDS CLARIFICATION]` | `specs/<f>/requirements.md` |
| `/spec:clarify` | Ask focused questions, resolve `[NEEDS CLARIFICATION]`, propagate answers back | `specs/<f>/clarifications.md` |
| `/spec:research` | Compare technical options for a decision and recommend one | `specs/<f>/research.md` |
| `/spec:plan` | Turn the spec into a technical design; run the Constitution Check gate | `specs/<f>/design.md` |
| `/spec:tasks` | Break the design into ordered, parallelizable tasks with checkpoints | `specs/<f>/tasks.md` |
| `/spec:testcases` | Derive explicit, traceable test cases (happy / edge / negative) | `specs/<f>/testcases.md` |
| `/spec:analyze` | Read-only consistency & coverage check; GO / FIX-FIRST verdict | `specs/<f>/analysis.md` |
| `/spec:implement` | Execute tasks per `preferences.md`; check off `tasks.md`; run checks | source code + `tasks.md` |
| `/spec:adr` | Record a non-obvious decision as a numbered ADR | `specs/<f>/decisions/NNNN-*.md` |
| `/spec:tune` | Audit `preferences.md` against how the work actually went; propose deltas | `steering/preferences.md` |
| `/spec:cut` | Review the diff for over-engineering; ranked list of what to delete | reads only (applies after approval) |

Non-obvious name pairs: `specify → requirements.md`, `plan → design.md`.
Full guide: `.claude/commands/spec/README.md`.

## Typical flow
`/spec:constitution` → `/spec:brainstorm` → `/spec:specify` → `/spec:clarify` →
`/spec:research` → `/spec:plan` → `/spec:tasks` → `/spec:testcases` → `/spec:analyze` →
`/spec:implement` (record decisions with `/spec:adr` as you go).

## Default behavior: auto-sync
`/spec:*` commands are optional. Normally, when you ask for a change, the agent also updates the
affected `.kiro/` files in the same turn (terse, delta-only) and reports it in one line — you do not
call a command to keep records current. Rules live in `steering/preferences.md` (§Auto-maintenance),
applied everywhere via the root `CLAUDE.md` import.

## First run in a fresh project
1. `/spec:init` — create missing folders and wire the `CLAUDE.md` hook.
2. `/spec:constitution` — write `product.md` / `structure.md` / `tech.md` for THIS product.
3. Fill in `steering/preferences.md` §Commands with the real toolchain per sub-project.
4. Start working — the agent keeps `.kiro/` in sync from here.

The `requirements.md` / `design.md` / `tasks.md` filenames stay readable by the Kiro IDE.
