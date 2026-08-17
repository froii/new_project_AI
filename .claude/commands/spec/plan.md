---
description: Produce the technical implementation plan (design.md) with a Constitution Check
argument-hint: "[optional: feature slug]"
---

Turn an approved spec into a technical **design/plan**. This describes HOW. Read `.kiro/steering/*`,
`preferences.md`, and the feature's `requirements.md` (+ `clarifications.md`, `research.md` if
present). Write into `.kiro/specs/<feature>/design.md`, in English by default (unless
`preferences.md` or the user asks for another language).

Steps:
1. Resolve the active feature folder. If `requirements.md` still has unresolved
   `[NEEDS CLARIFICATION]`, stop and tell the user to run `/spec:clarify` first.
2. Fill the template below.
3. **Constitution Check** (gate): verify the design honors `.kiro/steering/*` (structure, tech,
   principles). List any violation and either fix the design or justify it in a complexity table.
   Do not proceed past a violation without an explicit justification.
4. Summarize the approach and flag risks.

Template (outer fence is `~~~` so the inner ```` ``` ```` stay intact):

~~~markdown
# Implementation Plan: <feature>

## Summary
<what we are building + chosen technical approach in 2–4 sentences>

## Technical Context
- Language / version: ...
- Primary dependencies: ...
- Storage: ...
- Testing: ...
- Target platform / project type: ...
- Performance goals / constraints: ...

## Constitution Check
- [ ] Matches structure.md conventions
- [ ] Matches tech.md stack & rules
- [ ] Honors principles.md (if present)
- Violations & justification: <none | table below>

| Violation | Why needed | Simpler alternative rejected because |
|-----------|-----------|--------------------------------------|

## Design
### Data model
<entities, fields, relationships>
### Components / modules
<what changes, where, boundaries>
### Contracts / interfaces
<APIs, function signatures, events — as needed>
### Flow
<key sequence(s), step by step>

## Risks & open points
- ...
~~~
