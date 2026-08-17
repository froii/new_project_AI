---
description: Cross-check consistency across requirements, design, tasks, and test cases
argument-hint: "[optional: feature slug]"
---

Quality gate BEFORE implementation. Read the feature's `requirements.md`, `design.md`, `tasks.md`,
`testcases.md` (whichever exist) plus `.kiro/steering/*`. This is read-only analysis — do not change
the artifacts; write a report to `.kiro/specs/<feature>/analysis.md`, in English by default (unless
`preferences.md` or the user asks for another language).

Check for:
- **Coverage**: every FR has design support, a task, and a test case. Flag orphans/gaps.
- **Consistency**: no contradictions between spec, design, and tasks (names, entities, flows).
- **Constitution alignment**: design/tasks honor `.kiro/steering/*`.
- **Unresolved markers**: any remaining `[NEEDS CLARIFICATION]`.
- **Ambiguity / untestable requirements / missing success criteria.**
- **Over-engineering**: tasks or design adding scope not in the spec (violates YAGNI/preferences).

Report format (outer fence is `~~~` so the inner ```` ``` ```` stay intact):

~~~markdown
# Analysis: <feature>

## Summary
<ready to implement? yes / no + one line>

## Findings
| # | Severity | Area | Finding | Suggested fix |
|---|----------|------|---------|---------------|
| 1 | high/med/low | coverage/consistency/... | ... | ... |

## Coverage matrix
| FR | Design | Task | Test |
|----|--------|------|------|
| FR-001 | ✅ | T020 | TC-001 |

## Verdict
<GO / FIX-FIRST> — <blocking items, if any>
~~~

List findings most-severe first. Recommend fixes; do not apply them here.
