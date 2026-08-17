---
description: Orient at the start of a session — project state, features, and recent changes
argument-hint: "[optional: feature slug to focus on]"
---

Fast orientation so work resumes without re-asking "where is what / what changed". Read cheaply:
`.kiro/README.md`, the headings of `.kiro/steering/*`, and list `.kiro/specs/*`. Do NOT dump whole
files. Reply in the user's language, terse (aim for ≤ 15 lines).

Report:
- **Product**: one line from `product.md`.
- **Stack**: one line from `tech.md` (languages / package managers per sub-project).
- **Features**: a table of `specs/*` — slug, status (Draft / Planned / In-progress / Done, inferred
  from the files present and `tasks.md` checkboxes), and last-touched artifact (most recent mtime).
- **Open items**: any unresolved `[NEEDS CLARIFICATION]` or `FIX-FIRST` analysis verdicts.
- **Behavior**: confirm active preferences in one line (reply language, comment policy, auto-sync on).

If `$ARGUMENTS` names a feature, also read that feature's files and add: current state + the next
unchecked tasks from its `tasks.md`. Do not expand beyond this unless asked.
