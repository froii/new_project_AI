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
    page.tsx              # composes sections in order
content/
  index.ts                # profile, experience, projects — structure only
  types.ts                # Locale, entity types
app/globals.css           # CSS custom properties: :root and :root[data-theme="dark"]
lib/
  content.ts              # sortExperience(), isCurrent()
components/
  ui/                     # accordion, dropdown-menu, button, visually-hidden
  sections/               # hero, about, experience, projects, footer-contacts
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

`next-intl` is configured with the locale prefix **always on** including `en` (FR-008),
`localeCookie: false` (FR-009 — nothing may contradict the URL) and `localeDetection: false`.

**There is no middleware.** `generateStaticParams` prerenders `/en` and `/uk` as static pages, and
`app/page.tsx` redirects the bare root to `/en`. The cost is that a Ukrainian-speaking visitor
arriving at the root gets English until they switch — accepted in exchange for a fully static site
with no request-time layer.

`i18n/` holds four files: `config.ts` (the locale list, free of framework imports), `routing.ts`,
`navigation.ts`, `request.ts`.

### Flow

**First load, no prior visit, OS in dark mode**

1. Request `/uk` (or `/` → middleware redirects to `/en`).
2. Server renders: root layout links `globals.css` and the theme script runs; `[locale]/layout.tsx`
   loads `messages/uk.json` and renders header, sections and footer with content read at the locale.
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

`page.tsx` composes sections from an ordered list. When the deferred selection feature arrives, it
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
