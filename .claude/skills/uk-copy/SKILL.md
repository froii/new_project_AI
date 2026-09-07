---
name: uk-copy
description: Use when writing, editing or reviewing Ukrainian copy in messages/uk/** or any user-facing Ukrainian text in this project. Covers the register this CV uses, the euphony and apostrophe rules an LLM gets wrong, and the calques to delete.
---

# Ukrainian copy

## Register decided for this project

- **Job titles stay English.** `Senior Frontend / Full Stack Engineer`, never `розробник`. Half
  translated titles read as sloppy and lose the keyword.
- **Tech terms are not translated**: `low-code`, `PWA`, `LLM`, `RAG`, `EOR`, `B2B`, `ФОП`, `undo/redo`.
  Hybrid compounds take a hyphen: `LLM-функції`, `ШІ-функції`, `код-рев'ю`, `RAG-пошук`.
- **Apostrophe is U+0027** (`'`), the straight one. The repo is consistent; U+2019 would split search
  and diff noise across files.
- **No em or en dashes** anywhere. Plain hyphen only.
- Terse over polite. No `будь ласка`, no `ми раді`, no exclamation marks.

## What an LLM gets wrong

**Euphony (в/у, і/й).** Not optional in Ukrainian, and models default to the English-shaped choice.

| Position | в/у | і/й |
|---|---|---|
| after a vowel, before a consonant | `в` | `й` |
| after a consonant, before a consonant | `у` | `і` |
| at the start of a sentence, before a consonant | `у` | `і` |

`функції в продакшені` (after `-ї`), but `досвід у продакшені` (after `-д`).
`платформи й системи` (after `-и`), but `бекенд і фронтенд` (after `-д`).

**Apostrophe** goes after б п в м ф and р, and after a prefix ending in a consonant, before
я ю є ї: `рев'ю`, `п'ять`, `об'єкт`, `м'який`. Not when the labial belongs to a cluster in the root:
`свято`, `цвях`, `морквяний`.

**Calques to delete on sight:**

| Wrong | Right |
|---|---|
| на протязі | протягом |
| приймати участь | брати участь |
| відноситься до | стосується |
| по замовчуванню | за замовчуванням, типово |
| в якості (кого/чого) | як |
| являється | є |
| даний (проєкт) | цей |
| не дивлячись на | попри, незважаючи на |
| згідно (чогось) | згідно з (чимось), відповідно до |

## Syntax traps this project has already hit

- **Dangling adverb after an enumeration.** `LLM-функції в продакшені, наскрізно.` The adverb has
  nothing to attach to; say what it is end to end of: `від UI до бази`.
- **Colon standing in for a verb.** `Десять років: low-code платформи...` reads as a telegram.
  Give the sentence a verb: `Десять років будую...`.
- **English participial phrases translated literally.** `Building X, doing Y` becomes two finite
  clauses in Ukrainian, not two adverbial participles.

## Before shipping

1. Read each string aloud. Euphony errors are audible before they are visible.
2. Check every string against its English pair: same claim, not the same word order.
3. Verify in a **separate context** (see `preferences.md` §Role separation): hand a subagent the
   changed Ukrainian strings alone, with no access to the conversation that produced them. A checker
   that watched the writing validates the intent, not the text.

For objective errors (agreement, typos, punctuation) prefer a mechanism over this file: LanguageTool
ships a mature Ukrainian ruleset and runs offline or over its API. This skill covers what a linter
cannot judge, which is register.
