---
description: Create or update the project constitution (steering context) in .kiro/steering/
argument-hint: "[optional: principle or area to add/refine]"
---

Maintain the project **constitution** = the persistent context in `.kiro/steering/`.
This is what every other `/spec:*` command reads first. Keep it in English by default (unless
`preferences.md` or the user asks for another language).

Do:
1. Read existing `.kiro/steering/*` (product.md, structure.md, tech.md, and any others). Reuse and
   refine them — never discard user/Kiro-authored content.
2. If `$ARGUMENTS` is given, incorporate that principle/constraint into the right file (or create a
   new `principles.md` for cross-cutting rules the agent must always honor).
3. Ensure the constitution covers:
   - **Product**: what it is, who it serves, core value.
   - **Structure**: repo/module layout, boundaries, naming conventions.
   - **Tech**: stack, versions, key libraries, testing approach, build/deploy.
   - **Principles** (optional): non-negotiable rules (e.g. "no new dependency without justification",
     "all public APIs typed", "tests before implementation").
4. Keep entries concrete and verifiable — these become the "Constitution Check" gate in `/spec:plan`.
5. Summarize what changed.

Do NOT invent facts about the codebase — inspect it. Unknowns become explicit TODOs.
