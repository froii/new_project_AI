---
description: Derive explicit test cases from the requirements and design
argument-hint: "[optional: feature slug]"
---

Produce concrete, traceable **test cases**. Read `.kiro/steering/*`, the feature's `requirements.md`
(acceptance scenarios, success criteria, edge cases) and `design.md`. Write into
`.kiro/specs/<feature>/testcases.md`, in English by default (unless `preferences.md` or the user
asks for another language).

Rules:
- Every functional requirement (FR-xxx) and acceptance scenario must map to at least one test case.
- Cover happy paths, edge cases, and error/negative paths.
- Each case is runnable-by-a-human unambiguous: preconditions, steps, expected result.
- Tag the type (unit / integration / e2e) and the requirement it traces to.
- Do NOT write test framework code here — this is the specification of tests. (Implementation of
  these tests happens as tasks during `/spec:implement`.)

Template (outer fence is `~~~` so the inner ```` ``` ```` stay intact):

~~~markdown
# Test Cases: <feature>

| ID | Traces | Type | Title |
|----|--------|------|-------|
| TC-001 | FR-001, US1-AS1 | integration | <title> |

## TC-001 — <title>
- **Traces**: FR-001, US1 Acceptance Scenario 1
- **Type**: integration
- **Preconditions**: <...>
- **Steps**:
  1. <...>
- **Expected**: <...>

## TC-002 — <title> (negative)
...
~~~

End with a coverage note: which requirements are covered, and any gaps to flag.
