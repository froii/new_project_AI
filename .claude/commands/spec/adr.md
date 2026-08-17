---
description: Record an Architecture/Design Decision as a numbered ADR
argument-hint: "<decision title>"
---

Capture a non-obvious decision so the "why" survives. Read `.kiro/steering/*` and the feature
context. Write into `.kiro/specs/<feature>/decisions/NNNN-<slug>.md` (zero-padded ordinal within
that feature's `decisions/` dir; create the dir if missing), in English by default (unless
`preferences.md` or the user asks for another language).

Use this for decisions that are not self-evident from the code: a chosen trade-off, a rejected
alternative, a constraint that shaped the design.

Template (outer fence is `~~~` so the inner ```` ``` ```` stay intact):

~~~markdown
# ADR NNNN: <title>

**Status**: Accepted   <!-- Proposed | Accepted | Superseded by NNNN -->
**Date**: <YYYY-MM-DD>

## Context
<the forces at play: requirement, constraint, problem>

## Decision
<what we decided, stated plainly>

## Alternatives considered
- <option> — rejected because <reason>

## Consequences
- Positive: ...
- Negative / trade-off: ...
~~~

Keep it short. One decision per file. If this supersedes an earlier ADR, mark the old one's status.
