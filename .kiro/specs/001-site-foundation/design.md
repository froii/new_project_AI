# Implementation Plan: 001-site-foundation

## Summary

Build the Next.js application shell and the content model everything else will read: a typed,
locale-complete content source, a home page composed of sections, and language and theme switching.
Language lives in the route segment (`/en`, `/uk`); theme lives in `data-theme` on the root element
and is resolved before first paint. Design values are plain CSS custom properties.

## Technical Context

- **Language / version**: TypeScript, `strict: true`. Node ≥ the version Next requires.
  **TODO**: pin exact Next / React / Node / package-manager versions at scaffold time and record them
  in `steering/tech.md` and `preferences.md` §Commands.
- **Primary dependencies**: `next`, `react`, `next-intl` (routing + messages), `next-themes` (theme
  resolution before paint), `@radix-ui/react-accordion`, `@radix-ui/react-dropdown-menu`.
- **Storage**: none. No database, no server state. Theme preference is one `localStorage` key written
  by `next-themes`; language is carried by the URL and stored nowhere.
- **Testing**: `tsc --noEmit` is the primary gate — it is what enforces FR-004. Unit tests
  (**TODO**: pick the runner at scaffold) cover `lib/` pure functions only: experience ordering and
  open-ended period handling. No component tests in this feature; the behaviour that could break is
  Radix's, and it is already tested upstream.
- **Target platform**: modern browsers, 320px → wide desktop. Server-rendered; a static export is
  ruled out by later features (`tech.md` §Build & deploy).
- **Performance goals**: no layout shift from images or fonts (SC-006); no incorrectly themed frame
  (SC-003); the PDF bundle is absent from this feature entirely.

## Constitution Check

- [x] Matches `structure.md` conventions
- [x] Matches `tech.md` stack & rules
- [x] Honors `preferences.md` (minimum that solves the task; no unrequested options or abstractions)

**Violations**: none.

Two notes, neither a violation:

- `lib/validation/` and `app/api/contact/` appear in `structure.md` but are **not created here** —
  this feature has no form and no server input. Creating them empty would be scaffolding for a caller
  that does not exist (ladder rung 1).
- `components/pdf/` is likewise absent. The `tech.md` §Selection rule that binds it to page state is
  honored *by not foreclosing it* (see §Extension point), not by building it now.

## Design

### Data model

Translatable text and structural facts are stored separately.

**Translations** — JSON, one folder per locale, one file per block:

```
messages/
  en/  common.json  hero.json  about.json  experience.json  projects.json  footer.json  noscript.json
  uk/  common.json  hero.json  about.json  experience.json  projects.json  footer.json  noscript.json
```

Per-entry text is keyed by the entry's `id`:

`messages/en/experience.json`:

```json
{ "acme-2023": { "role": "Senior Developer", "description": "Built the reporting layer." } }
```

**Structure** — TypeScript in `content/`: ids, order, dates, links, images. No prose, no React, no
Next imports (`structure.md` boundary).

| Entity | Fields |
|---|---|
| `OwnerProfile` | `name: string`, `photo: StaticImageData`, `contacts: Contact[]` |
| `Contact` | `kind: 'email' \| 'link'`, `value: string` |
| `ExperienceEntry` | `id: string`, `organisation: string`, `start: string`, `end?: string` |
| `Project` | `id: string`, `title: string`, `images: StaticImageData[]`, `links: { id: string; href: string }[]` |

Names, organisations and project titles stay in `content/` as plain strings — proper nouns are not
translated.

`end` absent means *current*; the renderer prints the locale's word for "present".

`photo` and `images` are **static imports**, not path strings — Next then knows intrinsic dimensions
at build time and reserves the box (FR-023 / SC-006).

**FR-004 enforcement.** `en` is the reference shape; each other locale is type-checked against it:

```ts
// messages/uk/index.ts
import type en from '../en';
const uk = { about, common, experience } satisfies typeof en;
```

A missing or misspelled Ukrainian key fails `tsc`. Adding a third locale surfaces every gap at once
(SC-007).

`photo` and `images` are **static imports**, not path strings: Next then knows the intrinsic
dimensions at build time and reserves the box, which is how FR-023 / SC-006 are satisfied without
anyone hand-writing width and height.

### Components / modules

```
app/
  layout.tsx              # <html>, globals.css, fonts
  [locale]/
    layout.tsx            # NextIntlClientProvider, ThemeProvider, header, footer, <noscript>
    page.tsx              # landing page (see 004-landing-page)
    cv/page.tsx           # the full CV: composes sections in order
content/
  index.ts                # profile, experience, projects — structure only
  types.ts                # Locale, entity types
app/globals.css           # CSS custom properties: :root and :root[data-theme="dark"]
lib/
  content.ts              # sortExperience(), isCurrent()
components/
  ui/                     # accordion, dropdown-menu, button, visually-hidden
  sections/               # hero, about, experience, projects, footer-contacts
  landing/                # intro, highlights, footer — the landing page only
  controls/               # locale-switcher, theme-switcher
messages/
  en/  uk/                # one file per block; en/index.ts is the reference shape
```

`components/ui/` wraps Radix primitives with the project's styling and nothing else — no content
knowledge, per the `structure.md` boundary table. `components/sections/` is where content meets
markup.

`controls/` is separated from `ui/` deliberately: the switchers are the only components that hold
routing and theme concerns, and keeping them out of `ui/` stops that dependency from leaking into
every primitive.

### Page shell: canvas, paper, panel

The page is a document on a desk, not a full-bleed web page. `body` paints `--color-canvas`; the
sections live inside `.paper` — a sheet capped at `--paper-max` (49.625rem, roughly A4) with its own
background, border and shadow, centred by a `.sheet` flex wrapper. `.workspace` is the grid that holds
the contents panel and the sheet; from 80rem it becomes `var(--panel-width) minmax(0, 1fr)` with
`align-items: stretch` so the panel reads as a flush sidebar against the canvas, below that a single
column.

Tokens carrying the shell, each with a dark value in both places the dark palette is declared
(`[data-theme="dark"]` and the `prefers-color-scheme` block): `--color-canvas`, `--color-paper`,
`--color-panel`, `--color-surface`, `--color-hairline`, `--color-text-faint`, and the
`--color-invert-{bg,text,muted,border,accent}` family. `--color-bg` stays what it was, so cards keep
sitting a shade above the sheet.

`.paper` neutralises the `.shell` max-width inside it — sections were written against a 72rem shell
and would otherwise be constrained twice.

**Blocks are marked by a rubric, not by a module name.** Every `h2` is a small mono label sitting
directly on the content it names — no number, no rail. Hero, About and Contact hide theirs: prose and
a call to action say what they are, and a label over them is noise. The record lists (skills,
experience, education, certifications) keep theirs, because a bare list of certificates is ambiguous
while scrolling. The headings stay in the markup either way, so the outline and the section menu
point at something real, and the numbering lives only in the menu — the CSS `section` counter is
gone.

`.block-head` is the shared shape: label on the left, whatever the block needs on the right (the
Core / Full switch for skills, "8 roles · 2012 — 2026" for experience), a hairline under both.
The air under that hairline comes from the flex gap of whatever holds the head, so a block nested
below `.section` restates the gap itself and drops its label's own `margin-block-end` - About did
neither, and read as double space over the rule and none under it.

**One rule per block, and none inside it.** The hairline under each rubric is the only line the
content carries; the separator between sections, the rule under every skill row, under every degree
and under every certificate are gone, replaced by space. Thirty rules across two screens read as a
table — the eye stops at each one. Space groups just as well and costs nothing to look at. Lines
survive only where they do work: between accordion rows, which are click targets, and around the
chrome (header, paper, panel).

**The contact card inverts by redefining tokens, not by props.** `.card` re-declares `--color-bg`,
`--color-surface`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent` and
`--color-focus` from the `--color-invert-*` family, so `ui/button`, `ui/input`, `ui/textarea` and
`ui/social-links` invert inside it with no new API and stay correct in both themes.

The intro reads as a masthead: the facts stack one per line instead of running as a slash-separated
row, the portrait column is pinned at `18rem` — `auto` sized it to the widest child of the switcher
(402px) and starved the name and contacts of width — and `#hero` ends on `--space-l` instead of
`--space-xl`, closing about 30% of the gap to the summary. In the record
lists the accordion trigger carries `0.5rem` inline padding against a matching negative margin, so
the hover plate bleeds past the text without moving it off the grid; the row rhythm inside a record
tightened one step (`--space-s`) after the fields read as a table of gaps.

Below the 34rem container query the accordion trigger has two columns but three children, so the
date column swallowed the row and the role plus its tech-stack preview were squeezed into the 1.25rem
chevron track. The date span now spans the full first row (`grid-column: 1 / -1`, laid out as one
`start - end` range instead of two stacked dates) and the title takes the whole width beneath it;
the wide container query and print both reset it back to its own column.

Because the sheet is narrower than the old shell, the hero split moved from a 44rem container query
to 40rem; at 44rem it would never fire inside the paper and the portrait would drop below the name.

**The page ends on a band, not on a card.** Contact is the one section rendered outside `.paper`,
as a direct child of `.sheet`, so it spans the full width of its column and paints
`--color-invert-bg`: the last screen is one solid block with no canvas showing through. It is also
the footer — there is no separate footer element, and nothing follows it. Content inside the band is
capped at `--paper-max` and centred, so the measure never stretches.

**Below 48rem the paper stops being a sheet.** Border, radius and shadow come off and the padding
drops to one gutter: on a phone the frame costs the prose a word per line and gives nothing back.
Everything else keeps working — only the chrome goes.

**Reading progress is CSS, not a scroll listener.** A 2px bar under the header is driven by
`animation-timeline: scroll(root block)` behind an `@supports` guard, and only below 80rem — on a
wide screen the sidebar already says where you are. Browsers without scroll-driven animations get
nothing, which is the correct fallback for a decoration.


**Print subtracts; it is not a second layout.** `@media print` in `globals.css` recolours to a light
palette, unwraps the sheet, and hides one class: `.screen-only`. Anything that acts rather than
informs carries that class where it is written — the section menu, the site header, the part
toggles, the portrait thumbnails (so exactly one photo prints) and the contact band as a whole.
Component stylesheets keep an `@media print` block only where paper needs a different *layout*, not
a hidden element; accordion rows printing open is the one remaining case. Contact drops whole: its
email already prints in the hero contacts, and the CTA copy, the form and the messenger icons — SVGs
whose number lives only in `aria-label` — say nothing on paper.

**Paper has its own scale.** Print re-declares `--step-*` and `--space-*` in fixed `pt` (11pt body,
1.6 leading, against the screen's 1.4) and releases every `ch` cap inside `#main`.
Left on the screen's `clamp(… + vw, …)` values, every step and space resolved near its maximum and
the sheet carried a third of the text it could: the `short` preset ran to three A4 pages, each
ending on a third of a page of white.

**One cap for all prose was still wrong.** `ch` is the element's *own* font, so a single `96ch` rule
bit hardest exactly where the type was smallest: an 8pt achievement line stopped at 71% of the column
and wrapped a sentence that had room to finish. There is no cap on paper now. The measure is the page
margin (`@page margin: 10mm 14mm`, a 182mm column) and nothing inside it.

Measured across every preset in EN and UK: no page lost to a bad break in any configuration. Page
counts at the current scale are 2 for `short`, 4 for `default`, 5 for `full` — bigger than the 9.5pt
pass that preceded it (2 / 3 / 3), which is the trade the owner asked for.

**The field is the atom of a page break.** A whole role is too large to keep off a fold, but a
single field is not: split one and its term stays on the sheet above while the value opens the next,
labelled by nothing. So `break-inside: avoid` sits on `.list > *`, and `.value p` gets `orphans` /
`widows: 3`. The separator between two roles comes off on paper for the same reason - once the break
lands on it, it prints as a rule across the top of the next sheet, attached to nothing. Air over each
trigger already separates the records, and the section rubrics stay the only rules on the sheet.

**The text layer is read before the page is.** An ATS parses the PDF, not the layout. `h1` drops its
negative tracking on paper because the extractor loses the space inside it and the name comes out as
one token. Print already strips link colour and underline, so the hero contacts drop their
`border-block-end` too - a rule under an email that is not a link reads as a stray line.

`--rail` (106px) is the screen twin: the accordion trigger and the field list share one column, so a
value sets directly under the role title it belongs to and a term under the dates. The field list
carries the trigger's `1rem` inline offset on screen and drops it on paper, where the trigger has none.

`--paper-rail` (24mm, cut to the longest field term, `RESPONSIBILITIES`) gives the accordion date
column, the field-list terms and the skill group names one left edge, so every value on the sheet
starts on the same line. The accordion trigger drops its hover padding on paper, which was the only
thing indenting a role header away from its own fields. It also takes the field list's `--space-s`
column gap: on the trigger's own `--space-l` the role title set a couple of millimetres right of the
values underneath it, off the one content edge the rail exists to create. Education joins the same rail — period in
the rail, degree and everything under it in the content column, its period stacked over two lines
the way a role stacks its own dates, because `2025.09 - Present` is longer than the rail — and the
rule matches `.entry > *`
rather than the classes, because a switchable part arrives wrapped in a `div` of its own and would
otherwise auto-place into the rail as a narrow stack. Certifications have no date to put there and
take the empty rail as indent instead: a record starting at the left edge while every other record
starts at the rail reads as a different kind of thing.

**Density is not the same as no air.** The first pass cut both, and the sheet read as one block.
Compaction stays in the type — `pt` scale, `1.32` leading, no `ch` caps — and the air goes back only
at the seams a reader uses to find things: `--paper-section-lead` / `-tail` (1.5mm / 4mm) between
sections, `--paper-body-gap` at `--space-l` between the blocks inside one, and `--space-l` above each
role header and between degrees.

**The masthead sets its own hierarchy on paper.** Every step is fluid on screen, so the print scale
flattened the block that depends on hierarchy most: the name lost most of its lead over the headline,
and the contacts — bumped a step "so an email survives a photocopier" — came out larger than the
availability lines and level with the summary. Reference data outranked the argument. Print now sets
the masthead explicitly, in the screen's order: name 26pt, headline 13.5pt, summary 12.4pt, then
facts and contacts together at 9.5pt with mono labels at 8pt. Spacing groups them three ways —
eyebrow with name with headline, then availability, then contacts — instead of four evenly spaced
lines of different weights.

**A divider needs room on both sides.** The rule under a section rubric had `--space-xs` above it and
only the section gap below, so it read as an underline on the first line of content rather than as a
boundary. On paper it now carries `--space-s` on both sides.

**Three things that only paper sees.**
- *The trigger meta duplicated the tech stack.* It previews what a collapsed panel holds; on paper
  nothing is collapsed, so it reprinted the first four items of the stack directly above the stack
  field. `display: none` in print, for the reason the line exists at all.
- *Tag runs printed as `TypeScript· React`.* Flex laid the chips out as boxes with a `gap` the `::before`
  separator could not see. On paper the list is inline text and the separator carries its own spaces,
  so the run also wraps like a sentence instead of like a row of boxes.
- *The achievement markers did not print.* The marker was a 1px `background`, and the browser's print
  dialog drops backgrounds unless the visitor ticks "background graphics". It is a `border-block-start`
  now — identical on screen, and never suppressed. Anything decorative that must survive the PDF has
  to be a border, a glyph or text, never a background.

The hero owns its own grid: its wrapper carries `.layout` alone, without the shared `body` class.
`.section > .body` (two classes) outranks `.layout` (one) and was forcing `display: flex`, so the
portrait sat under the name on screen and on paper alike — neither the container query nor the print
rule could reach it. On paper the portrait column is `32mm`, not the screen's `18rem`: at print width
that column is a quarter of the sheet and the masthead is the one block that must not cost a page of
its own. The hero contact block steps up to `--step-0`, because an email read off paper has to
survive a photocopier. Tag chips drop their padding and background — an invisible box prints as a
gap between words — and run as `·`-separated text. The name sits at `--step-4` and breaks after the
first name on screen; on paper its `9ch` cap is released with the rest and it sets on one line.
The eyebrow role line stays on one line at every width: `white-space: nowrap` plus a `cqi`-based
`font-size` clamp, so the intro column shrinks the type instead of wrapping the title in two.

**The summary is never clamped.** The About paragraph prints and renders in full: the `about.full`
toggle and the `ExpandableText` component behind it are gone, because a summary that a visitor has
to expand is a summary nobody reads. The text carries the load instead - domains, stack, LLM work
and what the role actually owns, in three sentences. It sets its own `1.125rem` rather than taking
`--step-1`, and on paper `#hero` ends on `2mm` so the summary answers the contact block directly.

**Long prose carries its own paragraph breaks.** A field value is `white-space: pre-line`, so a blank
line inside a `messages/**` string becomes a paragraph. Two `Main responsibilities` entries were walls
of nine lines; they now break at the seams that were already there - frontend, backend, LLM work.

**Grid only where there are columns.** A one-column grid is a flex column with extra vocabulary, so
`.section`, the contact form and its rows are flex; the hero contact list dropped its per-row
`subgrid` wrapper and lets `dt` and `dd` fall into the two columns directly, aligned on `baseline`
so the mono label and its value sit on one line. Grid stays where a second column exists or appears
by container query — the hero split, `about .results`, `skills .row`, the field list, the accordion
trigger — plus the two `place-items: center` icon buttons and the `grid-template-rows: 0fr` reveal.

**Spacing is findable, not guessable.** `components/dev/inspector` mounts only under
`process.env.NODE_ENV === "development"`: holding Alt while moving the pointer outlines the element
under it and prints its source — `certifications.module.css · .entry` — plus its box and, on the next
line, the parent that actually owns the gap. Vertical rhythm lives on the container, so naming the
parent is the point; without it the panel would answer the wrong question.

### Contracts / interfaces

```ts
// lib/content
declare function sortExperience(entries: ExperienceEntry[]): ExperienceEntry[]; // FR-003
declare function isCurrent(entry: ExperienceEntry): boolean;
```

Design values are **plain CSS custom properties** in `app/globals.css`: `:root { --… }` and
`:root[data-theme="dark"] { --… }`. No TypeScript token layer and no generation step — CSS switches
themes natively, and there is no second consumer yet.

The PDF renderer will need one, since `@react-pdf/renderer` cannot read CSS variables; at that point
the declarations move to TS and the CSS is generated from them. The variable names are the contract
and stay identical, so that move touches `globals.css` alone and no component.

`next-themes` is configured with `attribute="data-theme"`, `defaultTheme="system"` — it injects a
blocking inline script that sets the attribute before first paint (FR-015 / SC-003). The CSS selector
must be `:root[data-theme="dark"]` to match what that script writes.

The theme control is `controls/theme-toggle`: a round icon button that swaps a sun and a moon. It is
**not** built on `ui/switch` — a theme control is one action ("give me the other theme"), not a bound
on/off value, and modelling it as a checkbox forces the question of what "checked" means.

`ui/switch` exists separately as a general on/off primitive for future use: a visually hidden native
checkbox carrying `role="switch"` paired with a styled `<label>`, publishing `--switch-knob-offset`
and `--switch-track-bg` so callers can restyle it without a purpose-named prop. It has no consumer
yet and knows nothing about themes.

**Which icon shows comes from `data-theme` in CSS, not from React state.** React cannot know the
theme while rendering on the server, so an icon chosen from `resolvedTheme` renders wrong and flips
after hydration — visible on every load for a dark-theme visitor. The inline script sets `data-theme`
before paint, so CSS has it right on the first frame. React state drives only `aria-pressed`, which
is what assistive technology reads.

Switching locale remounts the root layout on the client, so `next-themes` re-creates its inline
`<script>` there and React 19.2 logs *"Encountered a script tag while rendering React component"*.
**Accepted, not a defect**: the warning exists only in `react-dom-client.development.js`, fires once
per page session, and the script has already done its work from the server HTML — the theme is on
`<html>` before the switch and `ThemeProvider` re-reads `localStorage` on mount. `next-themes` 0.4.6
renders that script unconditionally and exposes no prop to suppress it; removing the warning means
removing the dependency, which costs more than the warning does.

`next-intl` is configured with the locale prefix **always on** including `en` (FR-008),
`localeCookie: false` (FR-009 — nothing may contradict the URL) and `localeDetection: false`.

**There is no middleware.** `generateStaticParams` prerenders `/en` and `/uk` as static pages, and a
`redirects()` entry in `next.config.ts` sends the bare root to `/en`. The cost is that a Ukrainian-speaking visitor
arriving at the root gets English until they switch — accepted in exchange for a fully static site
with no request-time layer.

`i18n/` holds four files: `config.ts` (the locale list, free of framework imports), `routing.ts`,
`navigation.ts`, `request.ts`.

### Flow

**First load, no prior visit, OS in dark mode**

1. Request `/uk` (or `/` → the config redirect sends the visitor to `/en`).
2. Server renders: `[locale]/layout.tsx` is the root layout — it links `globals.css`, runs the theme
   script, loads `messages/uk.json` and renders header, sections and footer with content read at the locale.
3. The theme script runs before paint, reads `localStorage` (empty) → falls back to the OS media
   query → sets `data-theme="dark"`. The dark custom properties are already in the stylesheet, so the
   first painted frame is correct.
4. Hydration attaches Radix behaviour to the accordions and the switchers.

**Switching language**

The locale switcher is a link-based control: it navigates to the same page under the other locale
segment. No client state, no stored preference — which is precisely FR-009's requirement that nothing
can contradict the URL. A visitor who copies the address after switching shares what they are
actually looking at.

**Switching theme**

`setTheme()` writes `localStorage` and flips `data-theme`. CSS variables cascade; no re-render of
content is involved.

**JavaScript disabled**

Server-rendered content still appears. `<noscript>` reveals a styled banner, localized from
`messages/*.json`. Its colours come from `prefers-color-scheme` directly, **not** from
`data-theme` — the attribute is set by a script that never ran, so a theme-dependent banner would
render with the wrong palette (FR-025).

### Extension point (deliberately not built)

`cv/page.tsx` composes sections from an ordered list. When the deferred selection feature arrives, it
filters that list, and the PDF renderer reads the same filtered list — satisfying `tech.md`
§Selection without a second selection model. This feature adds no filter, no state, and no props for
it; the extension point is the list already existing.

## Risks & open points

| Risk | Consequence | Handling |
|---|---|---|
| `next-intl` App Router API has churned across versions | Setup copied from an outdated guide silently misbehaves | Pin the exact version; follow that version's own docs, not blog posts |
| Radix components are client components; `next-intl` server messages do not reach them implicitly | Untranslated labels inside primitives | Pass translated strings as props from server sections; keep `ui/` free of translation lookups |
| `globals.css` imported in `[locale]/layout.tsx` instead of the root | Late custom properties, flash risk | Import it in the **root** layout only |
| Web fonts loaded without `next/font` | Layout shift on font swap, breaking SC-006 | `next/font` self-hosts and reserves metrics |
| Cyrillic coverage of the chosen font | Ukrainian renders in a fallback face | Verify coverage when picking the font; the same check applies again for PDF fonts later |
| `next-themes` renders its pre-paint `<script>` inside the React tree, which React 19 warns about in dev | Console error on every dev page load | **Accepted, not a defect.** The layout is a Server Component, so the script reaches the HTML and runs — verified in the built output. Dev-only; the fix belongs upstream. Do not re-investigate |

**Open**: exact versions, unit-test runner, font choice, hosting. None block starting; all are
recorded as TODOs in `steering/tech.md`.
