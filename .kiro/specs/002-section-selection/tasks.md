# Tasks: 002-section-selection

The feature was built ahead of its spec; this file starts at the change that gave the panel its
version list. Earlier work is recorded in `requirements.md` and `design.md`.

## Phase 6 — Versions (2026-08-27)

- [x] T601 `content/sections.ts` — six versions instead of four: `full`, `eu`, `us`, `tech`,
  `screening`, `short`, ordered by how much of the CV survives (FR-121).
- [x] T602 `content/sections.ts` — `experience.interest` defaults on and `eu` becomes an empty
  override, so the state a visitor lands in **is** a named version. Before this the panel opened on
  "Custom" with nothing touched (FR-125).
- [x] T603 `lib/section-visibility.ts` — `visibilityCount` and `fullCount`: what a version contains,
  counted off the toggles. Parts inside a switched-off section do not count (FR-126).
- [x] T604 `components/controls/section-menu/` — versions become a labelled block of cards above the
  section rows, each carrying name, note and derived count; the active one is marked, and a
  selection matching no version renders a dashed **Custom** card with the same count (FR-122,
  FR-126, FR-127). The preset pill row and its `.presetRow` / `.preset` styles are gone.
- [x] T605 `components/controls/section-menu/` — the trigger names the active version instead of the
  section in view; the scroll container now holds both groups, and `tools` keeps only the hint,
  reset and PDF (FR-230).
- [x] T606 `content/sections.ts`, `messages/{en,uk}/sections.json` — `experience.result` toggle
  (code `eo`, on by default) and the version labels and notes for both locales (003 FR-232).
- [x] T607 `lib/section-visibility.test.ts` — the default-off encode case moved from
  `experience.interest`, which is now on by default, to `experience.alsoUsed`.

## Phase 7 — The panel, settled (2026-08-27)

- [x] T701 Version cards reverted to the pill row they replaced: the cards pushed the section list
  off the rail and read worse. The note and the derived count went with them (FR-126 revised).
- [x] T702 A tooltip carrying note and count was built to nedyx's pattern and then removed at the
  owner's call - see `components/ui/tooltip` in the history if it is ever wanted back.
- [x] T703 No status line, no Custom pill, nothing highlighted by default (FR-127 withdrawn):
  `experience.interest` is off by default again and `eu` carries it, so the landing state matches no
  template.
- [x] T704 The hint sentence removed entirely, with its style and both strings.
- [x] T705 Rubric settled on **Templates** / **Готові варіанти** (FR-129).
- [x] T706 `Reset` back where it was, bottom left facing the PDF button.
- [x] T707 Repaired `presets.full.label`, which an earlier JSON rewrite in this session had
  overwritten with the reset button's text - the first pill read "скинути" instead of "Усе".

## Verification

- [x] `npm run typecheck`, `npm run build`
- [x] Against a running production build: six versions render on `/uk/cv` with counts derived from
  the toggles (`6/6 · 15`, `6/6 · 14`, `6/6 · 11`, `6/6 · 11`, `4/6 · 7`, `5/6 · 5`); the trigger
  reads "Європа" on first load and no Custom card is present
- [x] Visual pass in a browser - headless Chrome over CDP at 1440px and 390px: the six version cards
  read as one scale, the active one is unmistakable, and the section rows still fit under them

## Phase 8 — the trigger stops covering the text

- [x] T801 `use-scroll-away.ts` — an 8px-deadband scroll direction hook; held open or above half a
  viewport it reports nothing (FR-130).
- [x] T802 `section-menu.module.css` — the trigger translates out of view on scroll down and comes
  back on scroll up, on focus, and under reduced motion; it keeps its centred position, now held by
  auto margins so the transform is free (FR-130).

### Verification (Phase 8)

- [x] `npm run typecheck`
