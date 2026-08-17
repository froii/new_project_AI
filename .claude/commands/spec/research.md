---
description: Investigate and compare technical options for a feature; record findings
argument-hint: "<question or decision to research>"
---

Technical spike / option comparison to de-risk a design decision. Read `.kiro/steering/*` and the
feature's `requirements.md`. Write into `.kiro/specs/<feature>/research.md`, in English by default
(unless `preferences.md` or the user asks for another language).

Steps:
1. Resolve the active feature folder.
2. State the decision to be made and the constraints that bound it (from steering + spec).
3. Investigate: inspect the codebase for existing patterns/dependencies first, then external options
   if needed. Prefer reusing what the project already has.
4. Compare candidates on the axes that matter (fit, effort, risk, maintenance, dependency cost).
5. Give a clear recommendation with rationale, feeding into `/spec:plan`.

Template:

~~~markdown
# Research: <decision>

## Decision to make
<one sentence>

## Constraints
- ...

## Candidates
### <Option A>
- Fit / Effort / Risk / Maintenance / Adds dependency?

### <Option B>
...

## Findings
- <evidence from codebase or docs>

## Recommendation
<option> — <why>. Follow-ups: <if any>
~~~

Do not add a new dependency in the recommendation without justifying why existing tools are insufficient.
