---
description: Review the diff for over-engineering — what to delete, ranked, one line per finding
argument-hint: "[scope: diff | file | feature]"
---

Hunt complexity only. The best outcome of this pass is a shorter diff. Report first, apply after
approval. Tags adapted from ponytail-review (MIT).

## Input
The changed files (default: this session's diff; the argument narrows it). Read the surrounding code
before judging — a line is only surplus relative to what already exists around it.

## Tags

| Tag | Finds | Replacement |
|---|---|---|
| `delete:` | dead code, unused flexibility, speculative feature | nothing |
| `stdlib:` | hand-rolled thing the language already ships | name the function |
| `native:` | dependency doing what the platform does | name the feature |
| `yagni:` | abstraction with one implementation, config nobody sets, layer with one caller | inline it |
| `comment:` | comment restating the code, banner, narration, unasked TODO | delete it |
| `shrink:` | same logic, fewer lines | show the shorter form |

## Format
`<file>:L<line>: <tag> <what>. <replacement>.` — one line per finding, biggest cut first.

```
date.ts:L4: native: moment imported for one format call. Intl.DateTimeFormat, 0 deps.
repo.ts:L88: yagni: interface with one implementation. Inline until a second one exists.
form.tsx:L20: comment: narrates the line below it. Delete.
utils.ts:L30-44: shrink: manual loop builds a map. Object.fromEntries(entries).
```

End with `net: -<N> lines possible.` Nothing to cut: `Lean already. Ship.`

## Boundaries
- **Never flag**: trust-boundary validation, error handling / data-loss paths, security,
  accessibility, or the last remaining test. Cutting those is not a simplification, it's a bug.
- `shrink:` means fewer lines for the *same clarity* — never code-golf, never cramming logic onto
  one line. If the short form reads worse, it is not a finding.
- Correctness, security and performance are out of scope here — they belong to the verification
  pass (`preferences.md` §Role separation). This pass only asks "what can go away".
