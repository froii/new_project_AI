# Project skills

Skills that ship with this repo. One folder per skill, each with a `SKILL.md`:

```
.claude/skills/<skill-name>/SKILL.md
```

`SKILL.md` needs YAML frontmatter with `name` and `description` — the description is what the agent
reads to decide whether the skill is relevant, so write it as a trigger, not as a title.

Empty for now. Global skills in `~/.claude/skills/` still work; anything put here is versioned with
the project and takes priority when the names collide.
