---
description: Explore approaches and options for a feature before committing to a spec
argument-hint: "<idea or problem to explore>"
---

Divergent exploration BEFORE a spec is locked. Goal: surface options and trade-offs, not decide.
Read `.kiro/steering/*` and `preferences.md` first. Write artifacts in English by default (unless
`preferences.md` or the user asks for another language).

Steps:
1. Resolve the feature folder: if this idea is new, create `.kiro/specs/<NNN-slug>/` (see README
   numbering rule). If it extends an existing feature, use that folder.
2. Restate the problem in one sentence and list assumptions/constraints from the steering context.
3. Produce 3–5 distinct approaches. For each: brief description, pros, cons, rough effort, main risk.
4. Note open questions as `[NEEDS CLARIFICATION: ...]`.
5. End with a **Recommendation** (one option) and a one-line rationale.
6. Write everything to `.kiro/specs/<NNN-slug>/brainstorm.md` with this structure:

~~~markdown
# Brainstorm: <feature>

## Problem
<one sentence>

## Constraints & assumptions
- ...

## Options
### Option A — <name>
- Description / Pros / Cons / Effort / Risk

### Option B — <name>
...

## Open questions
- [NEEDS CLARIFICATION: ...]

## Recommendation
<chosen option> — <why>
~~~

Keep it lean. This feeds `/spec:specify`; it is not the spec itself.
