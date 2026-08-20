# Tasks: 001-site-foundation

## Phase 1 — Setup

- [x] T001 Scaffold the Next.js app at the repo root (TypeScript, App Router, CSS Modules). Pin exact versions.
- [x] T002 Record pinned Next / React / Node / package-manager versions in `.kiro/steering/tech.md`; fill `.kiro/steering/preferences.md` §Commands with the real `typecheck` / `lint` / `test` commands.
- [x] T003 `[P]` Add and pin `next-intl`, `next-themes`, `@radix-ui/react-accordion`, `prettier`.
- [x] T004 `[P]` `tsconfig.json`: `strict: true`, `resolveJsonModule`, path alias `@/*`.
- [ ] T005 (open) Pick the site font, self-host via `next/font`, **verify Cyrillic coverage**; record the choice in `tech.md`.
- [x] T006 `[P]` Vitest, `npm test`, `vitest.config.mts` with native `resolve.tsconfigPaths`. ESLint added too; TypeScript held at 6.x because `typescript-eslint` rejects 7.x.

## Phase 2 — Foundational (blocks all stories)

Nothing in Phases 3–5 can start before this phase is complete: every section reads the content
types, the messages, and the layout that provides locale and theme.

- [x] T010 `content/types.ts` — `Locale`, `OwnerProfile`, `Contact`, `ExperienceEntry`, `Project`. No React or Next imports.
- [x] T011 `content/index.ts` — structural data: ids, organisations, dates, project titles, links. **Placeholder values; the owner replaces them.** Photo field deferred until a real image file exists.
- [x] T012 `[P]` `messages/en/` — `common`, `hero`, `about`, `experience`, `projects`, `footer`, `noscript` JSON files; `messages/en/index.ts` as the reference shape.
- [x] T013 `messages/uk/` — same files; `messages/uk/index.ts` declared `satisfies typeof en` so a missing key fails `tsc` (FR-004).
- [x] T014 `[P]` `app/globals.css` — CSS custom properties under `:root` and `:root[data-theme="dark"]`, plus layout primitives (`shell`, `stack`, `cluster`, `auto-grid`, `split`, `section`).
- [x] T015 `app/layout.tsx` — `<html>`, `globals.css` imported here only. `next/font` still pending T005.
- [x] T016 `i18n/` config: locale prefix always on including `en` (FR-008), `localeCookie: false`, `localeDetection: false`. **No middleware** — `generateStaticParams` prerenders both locales, a `redirects()` entry in `next.config.ts` sends the bare root to `/en` (FR-010).
- [x] T017 `next-themes` provider in `app/[locale]/layout.tsx`: `attribute="data-theme"`, `defaultTheme="system"`; confirm the CSS selector matches what its script writes (FR-015).
- [x] T018 `[P]` `lib/content.ts` — `sortExperience()` (FR-003), `isCurrent()`.
- [x] T019 `[P]` Unit tests for `lib/**` — 34 tests across `content`, `section-visibility`, `credentials`, `contacts`, including assertions against the real `content/`.

## Phase 3 — User Story 1: Content renders on the home page (P1)

- Goal: name, photo, self-description, experience and projects are all present and readable from 320px up.
- Independent test: load `/en` on a 360px viewport with no prior visit; confirm every section is reachable by scrolling and one experience entry expands.

- [x] T020 `[P]` `[US1]` `components/ui/accordion.tsx` — Radix wrapper, styling only, no content knowledge.
- [x] T021 `[P]` `[US1]` `components/ui/button/` (solid + outline). `visually-hidden` stayed a global class rather than a component — it is one CSS rule with no behaviour.
- [x] T022 `[US1]` `components/sections/hero.tsx` — name, headline, photo, contacts beside the photo (FR-016).
- [x] T023 `[P]` `[US1]` `components/sections/about.tsx`.
- [x] T024 `[US1]` `components/sections/experience.tsx` — accordion, reverse chronological via `sortExperience()`, "present" for open-ended entries.
- [x] T025 `[P]` `[US1]` `components/sections/projects.tsx` — titles, summaries, images with reserved dimensions, links.
- [x] T026 `[US1]` `components/sections/site-footer.tsx` — public contacts + a write-to-owner action opening the visitor's mail client (FR-016, FR-017).
- [x] T027 `[US1]` `app/[locale]/page.tsx` — compose sections from an ordered list (the extension point for the later selection feature; add no filter now).
- [x] T028 `[US1]` Responsive layout: CSS grid + container queries, 320px → wide desktop, no horizontal scrolling, nothing hidden from narrow viewports (FR-018).
- **Checkpoint**: US1 works end-to-end at `/en`; `tsc --noEmit` clean.

## Phase 4 — User Story 2: Language switching (P1)

- Goal: both locales render fully; switching changes labels and content together.
- Independent test: switch language and confirm no string from the previous language remains; reload and confirm the language holds.

- [x] T030 `[US2]` ~~`components/ui/dropdown-menu.tsx`~~ — dropped. Two locales render as two links; a menu primitive would be machinery for a list of two. Dependency uninstalled.
- [x] T031 `[US2]` `components/controls/locale-switcher.tsx` — link-based navigation to the same page under the other locale segment; no client state, no stored preference (FR-009).
- [x] T032 `[US2]` Place the switcher in the header on every page; pass translated strings as props from server sections so `ui/` holds no translation lookups.
- [x] T033 `[US2]` Verify `/uk` renders with zero English strings and `/en` with zero Ukrainian (SC-002).
- **Checkpoint**: both locales complete and shareable by URL; US1 unaffected.

## Phase 5 — User Story 3: Theme switching (P2)

- Goal: theme follows the OS by default, is switchable, persists, and never paints a wrong frame.
- Independent test: OS set to dark, cold cache → first frame is dark; toggle to light, reload → stays light.

- [x] T040 `[US3]` `components/controls/theme-toggle/` — a round icon button, not a switch; placed in the header (FR-013).
- [ ] T041 `[US3]` Complete the dark palette in `app/globals.css`; verify every text/background pair meets WCAG 2.1 AA in both themes (FR-021, SC-005).
- [ ] T042 `[US3]` Verify no incorrectly themed frame on cold load in both OS settings (FR-015, SC-003).
- **Checkpoint**: theme works in both locales; US1 and US2 unaffected.

## Phase 6 — Polish

- [x] T050 `[P]` `generateMetadata` per locale + `alternates.languages` hreflang so the two locales do not compete as duplicates (FR-024).
- [x] T051 `[P]` `<noscript>` banner in `app/[locale]/layout.tsx`, localized from `messages/*/noscript.json`, coloured from `prefers-color-scheme` — **not** from `data-theme` (FR-025).
- [x] T052 `[P]` `prefers-reduced-motion`: suppress non-essential animation (FR-022).
- [x] T052a `[P]` Migrate off the deprecated `setRequestLocale`: `[locale]/` becomes the root layout, `i18n/request.ts` reads `next/root-params`, bare-root redirect moves into `next.config.ts` (ADR-0001).
- [x] T052b Adopt the reference layout: `.workspace` grid, `.paper` sheet, contents panel as a sticky sidebar from 80rem, canvas/paper/panel tokens, serif + mono type tokens, CSS-counter section numbers.
- [x] T052c Full desktop visual pass on the reference design: numbered rail headings, serif display type, flat experience list, education + certifications as paired cards, inverted contact card, quiet mono footer.
- [x] T052d Mobile pass: contents panel becomes a bottom sheet with a thumb-reachable pill, paper goes edge-to-edge below 48rem, tap targets raised to 44px.
- [x] T052e Outro band: contact and footer span full width in the inverted palette, reading-progress bar below 80rem, social icons dropped from the header on phones.
- [x] T052f Strip the module labels: headings visually hidden, section counter removed, education and certifications unpaired, footer folded into the contact band.
- [x] T052g Skills gains a Core / Full switch in place, backed by a new `skills.full` part in the toggle registry.
- [x] T052h Block rubrics restored as `.block-head`; skills collapsed from chip clusters to four label/items rows.
- [x] T052i Rule diet: section separators and per-record hairlines replaced by spacing; section rhythm tightened to `--space-xl`.
- [x] T052j Print stylesheet + `@page` A4, Print / PDF trigger and an on-screen page-break preview; accordion forced to mount so every role prints.
- [x] T052k Print visibility unified on a single `.screen-only` utility: portrait thumbnails and the contact band leave the PDF, four per-component `@media print` hide-blocks removed.
- [x] T052l Print layout pass: hero wrapper freed from `.body` so its grid applies at all (portrait carries its 280px screen column onto paper), hero contacts at `--step-0`, tag chips printed as `·`-separated text, field-list term column narrowed, certificate links and accordion chevrons marked `screen-only`.
- [x] T052m Screen rhythm pass: intro facts stacked, portrait capped at 280px, `#hero` tail shortened ~30%, accordion trigger given an 8px bleed for its hover plate, record row gaps tightened to `--space-s`.
- [x] T052n Dev-only Alt+hover inspector (`components/dev/inspector`): element source module, box metrics and the parent that owns the gap.
- [x] T052o Grid audit: one-column grids (`.section`, contact form and rows) turned into flex columns, hero contact list flattened out of `subgrid` and baseline-aligned; multi-column grids left as they were.
- [x] T052p About summary always visible: `about.full` toggle and `ExpandableText` removed from the registry, labels, presets and tests; summary rewritten to domains + stack + LLM work with the filler cut.
- [x] T052q Reading pass: summary fixed at `1.125rem` and pulled up under the contacts in print (`#hero` ends on 2mm); field values honour `pre-line` so the two longest responsibility texts break into paragraphs.
- [ ] T053 Keyboard pass: every control reachable and operable, visible focus indicator, expanded/collapsed state announced (FR-019, FR-020, SC-004).
- [ ] T054 `[P]` Confirm no layout shift from images or fonts (FR-023, SC-006).
- [ ] T055 Verification subagent per `preferences.md` §Role separation: input is `requirements.md` + `testcases.md` + changed files only.
- [ ] T056 Sync `.kiro/` artifacts and tick this file.

## Summary

**47 tasks** across 6 phases: 6 setup, 10 foundational, 9 (US1), 4 (US2), 3 (US3), 15 polish.

**Critical path**: T001 → T004 → T010 → T011 → T012 → T013 → T016 → T027 → T031 → T040.

Everything marked `[P]` touches a distinct file and can run alongside its siblings. The widest
parallel bands are T012/T014/T018 in Phase 2, and T020/T021/T023/T025 in Phase 3.

**Blocking risk on the critical path**: T016. `next-intl`'s App Router setup differs between
versions — follow the pinned version's own documentation.
