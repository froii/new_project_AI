# Tasks: 004-landing-page

## Phase 1 — Routes

- [x] T001 Move `app/[locale]/page.tsx` to `app/[locale]/cv/page.tsx`; add its own
  `generateMetadata` (title, canonical, alternates) (FR-001, FR-007).
- [x] T002 `app/sitemap.ts` — emit both routes for both locales (FR-008).

## Phase 2 — Landing

- [x] T003 `components/landing/intro/` — role, name, headline, engagement facts, portrait, primary
  link to `/cv`, email as the secondary action (FR-002, FR-004).
- [x] T004 `components/landing/highlights/` — three featured achievements + core stack, both read
  from `content/` (FR-002, FR-009).
- [x] T005a Contact band carries one *Contacts* group (messengers + profiles); the footer row below keeps locale and theme only, its duplicate profile icons removed. Social icons enlarged; the landing wash driven by `--wash-near` / `--wash-far` so light gets a gradient that is actually visible.
- [x] T005 `components/landing/footer/` — every public contact, messengers, locale and theme
  controls, in the inverted palette (FR-003, FR-006).
- [x] T006 `app/[locale]/page.tsx` — compose the three blocks; no header, no menu, no progress bar
  (FR-003).

## Phase 3 — Copy

- [x] T007 `messages/{en,uk}/landing.json` + registration in both `index.ts`; `common.cvTitle` and
  `common.home` (FR-009).

## Phase 4 — Return path

- [x] T008 `components/sections/site-header/` — the identity becomes a link to `/`, with a chevron
  that survives the sub-48rem rule and an aria label from `common.home` (FR-005).

## Phase 5 — Follow-up (review of the first pass)

- [x] T009 `components/landing/footer/` — render `sections/contact` instead of restating the
  address, keeping only the bottom row (profiles, locale, theme, copyright) of its own (FR-006,
  FR-010).
- [x] ~~T010~~ withdrawn by T013 - restyling the address was not asked for and it read worse.
- [x] T011 `components/landing/intro/intro.module.css` — two columns from 46rem instead of 56rem,
  the one-column portrait at `min(62%, 16rem)` instead of 13rem, actions full-width below 34rem
  (FR-011).

## Phase 6 — Follow-up (owner review of the second pass)

- [x] T012 `lib/contact-open.ts` + `components/landing/intro/write-button.tsx` — the intro's second
  action opens the footer form and focuses it; a DOM event carries it across the two server
  components (FR-004, FR-012).
- [x] T013 Revert `contact.module.css` `.email` and the button order to the pre-landing look: the
  address keeps its solid treatment, the toggle stays `outline`. T010 is withdrawn (FR-010).

## Verification

- [x] `npm run typecheck`
- [x] `npm run build` — 4 prerendered pages, locale-correct CTA hrefs, canonical per route (SC-003)
- [x] Rendered markup of `/uk` and `/uk/cv` checked for the form, the CTA and the back link
- [x] Visual pass in a browser — headless Chrome over CDP at 1440px and 390px

## Phase 7 — Follow-up (owner review of the contact band)

- [x] T014 `components/sections/contact/` — a PDF button beside the write action, accent-outlined
  against the toggle's neutral outline, calling `window.print()`; new `savePdf` string in both
  locales (FR-013).
- [x] T015 `contact.module.css` — from a 64rem container the band's content grows to 62rem, with a
  taller card and a larger headline (FR-014).

### Verification (Phase 7)

- [x] `npm run typecheck`
- [x] T016 `contact.module.css` — the address and the two actions stack full-width below a 65rem
  container instead of wrapping into a ragged second row (FR-013).
- [x] T017 `contact.module.css` + `contact/index.tsx` — the address reads as a text link, the solid
  weight moves to the write action, PDF keeps the neutral outline; the bar is lighter, so it holds
  one line down to a 60rem container. Supersedes T013 - the owner asked for the restyle this time
  (FR-010, FR-013).
- [x] T018 `contact/index.tsx` + `contact.module.css` — the address moves out of the action bar into
  the Contacts group, a row under the links; the group's rhythm grows 1.5x; the bar of two buttons
  holds a line down to a 50rem container (FR-006, FR-013).
- [x] T019 `app/globals.css` + `contact.module.css` — the CV sheet declares `--thumb-clearance`
  below the sidebar breakpoint and the contact card spends it as bottom padding, so the fixed
  section-menu pill stops covering the end of the band; the address gets its own top margin inside
  the Contacts group. The card spends the sum at 1.5x less than its own top padding - the full
  amount read as a hole after the address (002 FR-124, FR-006).
