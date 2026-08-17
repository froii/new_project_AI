---
description: Write the feature specification (testable requirements) into .kiro/specs/<feature>/requirements.md
argument-hint: "<feature description>"
---

Create the **specification** for a feature. This describes WHAT and WHY, never HOW.
Read `.kiro/steering/*` and `preferences.md` first. Write artifacts in English by default (unless
`preferences.md` or the user asks for another language).

Steps:
1. Resolve/create the feature folder `.kiro/specs/<NNN-slug>/`. Numbering: `NNN` = highest existing
   ordinal under `.kiro/specs/*` + 1 (or `001` if none); `slug` = kebab-case feature name. If a
   `brainstorm.md` exists, use its recommendation as the starting point.
2. Write `requirements.md` using the template below.
3. Mark every genuine unknown as `[NEEDS CLARIFICATION: specific question]` — do not guess.
4. Requirements must be testable and implementation-free (no tech/library/API choices here).
   Phrase each as a verifiable statement: `System MUST …`; use `WHEN <event> …, the system SHALL …`
   or `IF <condition> …` where the trigger/condition matters. Keep the style consistent.
5. Summarize and list all `[NEEDS CLARIFICATION]` items so the user can run `/spec:clarify`.

Template (outer fence is `~~~` so the inner ```` ``` ```` stay intact):

~~~markdown
# Feature Specification: <FEATURE NAME>

**Slug**: <NNN-slug>
**Created**: <YYYY-MM-DD>
**Status**: Draft
**Input**: "<original user description>"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — <title> (Priority: P1)
<journey in plain language>
- **Why this priority**: ...
- **Independent Test**: ...
- **Acceptance Scenarios**:
  1. **Given** <state>, **When** <action>, **Then** <outcome>

### Edge Cases
- What happens when <boundary>?
- How does the system handle <error>?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST <capability>
- **FR-002**: Users MUST be able to <interaction>
- **FR-003**: System MUST <behavior> [NEEDS CLARIFICATION: ... if unknown]

### Key Entities *(if data involved)*
- **<Entity>**: <what it represents, key attributes, relationships> (no implementation detail)

## Success Criteria *(mandatory)*
- **SC-001**: <measurable outcome, e.g. "task completes in under 2 min">
- **SC-002**: <measurable outcome>

## Assumptions
- <assumption / scope boundary / dependency>
~~~
