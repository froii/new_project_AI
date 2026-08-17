---
description: Audit preferences.md against how the work actually went, and propose improvements
argument-hint: "[scope: last task | last session | new project]"
---

Fast quality check of `.kiro/steering/preferences.md`: does each rule still pay for itself, and what
is missing. Read-only until the user approves the deltas.

## Evidence first (do not skip to opinions)
Gather what actually happened — the argument is the scope (default: this session's work).
- The diff of the recent work (`git diff`, or the files touched this session).
- The conversation: every place the user corrected, reverted, or cleaned up your output.
- `preferences.md` itself.

## Scorecard
Rate each signal **kept / slipped / missing rule**, with one concrete piece of evidence each.
Evidence means a file and line or a quote — never a general impression.

| Signal | Question |
|---|---|
| Comment surplus | Comments the user deleted or would delete. Target: zero added. |
| Unrequested scope | Features, options, flags, abstractions nobody asked for. |
| Ladder | Was existing code / stdlib / native / installed dep reused, or rewritten? |
| Correctness floor | Validation, error handling, security, a11y cut in the name of brevity? |
| Repeat corrections | Same correction twice = a rule is missing or worded too weakly. |
| Context economy | Whole large files loaded where a grepped section would do. |
| Friction | A rule that made the work worse, not better. |
| Dead weight | A rule that never once applied — candidate for deletion. |

## Output
1. **Verdict**: HEALTHY (no change) / TUNE (deltas below) / REWRITE (rules no longer match reality).
2. **Deltas** — a table of `rule → change → why`, each traceable to evidence above. Proposed
   wording, ready to paste.
3. **Deletions** — say plainly what to remove. A preferences file that only grows stops being read.

Then ask for approval and apply the approved deltas. Keep the file short; a rule that needs a
paragraph belongs in `steering/*`, not here.
