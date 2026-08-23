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
- [ ] Visual pass in a browser — not run, no browser tooling in this session
