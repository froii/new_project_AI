# Tasks: 006-production-readiness

## Phase 1 — Identity and sharing

- [x] T001 `app/icon.svg`, `app/icon.png`, `app/apple-icon.png`, `app/manifest.ts` — the owner's
  icons moved onto the framework's metadata files; the hand-written `<head>` snippet and
  `site.webmanifest` deleted with the folder they came in (FR-601).
- [x] T002 `app/[locale]/layout.tsx` — `themeColor` per colour scheme (FR-602).
- [x] T003 `public/og-{en,uk}.png` — 1200x630 cards, name, pitch, portrait; generated once from
  `content/` with the `sharp` already in the tree (FR-603).
- [x] T004 `lib/og-image.ts` + layout and CV metadata — cards declared on both routes, because a
  nested `openGraph` replaces the parent's rather than merging (FR-603, FR-604).

## Phase 2 — Machine-readable

- [x] T005 `lib/person-schema.ts` — `schema.org/Person` from `content/`, with the `<` escape
  (FR-605, FR-606).
- [x] T006 `app/[locale]/layout.tsx` — the block rendered on every page under a locale.

## Phase 3 — Dead ends

- [x] T007 `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`, `app/[locale]/status.module.css`,
  `messages/{en,uk}/error.json` — branded 404 and 500 in the visitor's language (FR-607, FR-608).
- [x] T008 `app/[locale]/[...rest]/page.tsx` — the catch-all that keeps an unmatched URL inside the
  locale. Verified: `/uk/nope` was the framework's English page before it, and answers 404 with the
  Ukrainian one after (FR-607).

## Phase 4 — Typography and weight

- [x] T009 `app/fonts.ts` — Inter / Literata / JetBrains Mono, `latin` + `cyrillic`, self-hosted;
  the system stacks in `globals.css` removed and kept as `fallback` (FR-609). Closes 001 T005.
- [x] T010 `app/fonts.ts` — `preload: false` on serif and mono: 195KB of preloaded font became 66KB
  (FR-610, SC-603).
- [x] T011 `components/landing/intro`, `components/controls/photo-switcher` — `next/image` with
  `sizes`; the thumbnail row now requests 64w instead of five full portraits (FR-611, SC-604).
- [x] T012 `public/photos/` — `city.webp` and `photo_5.jpg` (both 290x387, half the resolution of the
  set) dropped and `marina.webp` restored to `owner.photos`; unused `retro-service.webp` deleted
  (FR-612).

## Phase 5 — Hardening

- [x] T013 `next.config.ts` — Content Security Policy beside the existing headers, `unsafe-eval` in
  development only (FR-613).
- [x] T014 `.github/workflows/ci.yml` — typecheck, lint, test, build on push to main and every pull
  request (FR-614).

## Phase 6 — Review follow-up (2026-08-27)

- [x] T019 `components/sections/site-header/` — `.controls` takes `flex: none`. With `1 1 0` the
  cluster was allotted 173px for 178px of buttons at 390px, so the theme toggle wrapped and spilled
  below the header. Below 23rem the icon row hides and the name returns in its place (FR-618,
  FR-619). **Pre-existing**: measured identical with the old system font stack, so not a regression
  from T009.
- [x] T020 `next.config.ts` — `upgrade-insecure-requests` gated to production (FR-615).
- [x] T021 `app/[locale]/layout.tsx` — `themeColor` uses `--color-canvas`, the colour `body` paints,
  not `--color-bg` (FR-616).
- [x] T022 `app/manifest.ts` — light canvas for `theme_color` / `background_color`, with the reason
  the manifest cannot follow the scheme (FR-617).
- [x] T023 `app/not-found.tsx` — the boundary above the locale, owning its own document, for a URL
  whose first segment is not a locale. Verified: `/blog` and `/xx` rendered the framework's unstyled
  English page before it and the owner's page after (FR-620).
- [x] T024 `content/sections.ts` — the ordering comment says **detail**, not "how much of the CV":
  `screening` keeps fewer sections than `short` but more inside them, and the panel now shows both
  numbers, so the claim had to name which one it orders by.

## Phase 7 — Bugs and a regression (2026-08-27)

- [x] T025 `lib/rate-limit.ts` + `lib/rate-limit.test.ts` — the limiter leaves the route handler so
  the rule is testable, and a refused attempt is no longer recorded: counting it pushed the newest
  timestamp forward, so a sender who retried inside the window never left it.
- [x] T026 `components/sections/contact/` — state resets when the panel is reopened, and the
  confirmation carries a *Send another* action. One message per page load before this.
- [x] T027 `components/landing/footer/` — the year comes off. Every page is prerendered, so
  `getFullYear()` froze at build and would have read 2026 through all of 2027.
- [x] T028 `components/sections/certifications/` — `dottedDate` on `issued`; the sheet mixed
  `2025-08` with `2025.09`.
- [x] T029 `components/sections/hero/`, `components/landing/intro/` — **regression from T009**: a
  `ch` is measured in the element own font, so the `9ch` cap that fitted the old serif chopped
  "Tyshchenko" mid-word under Literata. Cap widened and `overflow-wrap: normal` added, because the
  cap exists to stack the two words and must never split either. Measured at 390/768/1170/1440 in
  both locales: two lines everywhere, no overflow.

## Open

- [x] T015 Host is Vercel: the in-memory counter in `lib/rate-limit.ts` does not hold across
  serverless instances, so it is a soft deterrent, not a real cross-instance limit. Decided to keep
  it - a personal contact form at a few messages a month is not worth an external store (Upstash/KV)
  for the traffic it will ever see. Revisit only if the form is actually abused.
- [x] T016 `NEXT_PUBLIC_SITE_URL` set in production. Verified live: `sitemap.xml`, `robots.txt`,
  `canonical` and `og:url` all resolve to `oleksatyshchenko.com`, not localhost.
- [x] T017 Uptime check on the site and a real end-to-end send through the contact form after deploy.
  Confirmed by owner: a real message went through the production form and arrived.
- [x] T030 `www.oleksatyshchenko.com` does not resolve (connection refused) - only the apex domain is
  attached in Vercel. Add `www` as a domain in the project so it redirects to the apex.
  Fixed by owner: `www` now returns 307 → `/en`. Serves content natively rather than 301ing to the
  apex - `canonical` already points at the apex, so not a launch blocker.
- [x] T018 Visual pass in a browser - headless Chrome over CDP: landing, CV, both 404s, the panel,
  and the header at seven widths in both locales.

## Verification

- [x] `npm run typecheck`
- [x] `npm run build` — 6 static routes, metadata routes for icons and manifest
- [x] `npm run lint`, `npm test` — 49 passed
- [x] Against a running production build: headers on `/en`; `og:image`, `twitter:card`,
  `application/ld+json`, icon and manifest links in the rendered HTML; `/uk/nope` and `/blog` → 404
  with a styled page; thumbnail `srcset` at 64w
- [x] Header geometry measured over CDP at 320/360/375/390/400/430/780 in both locales: one row,
  no spill, no horizontal overflow. **Screenshots via `--window-size` are not a measurement** - they
  crop rather than resize the viewport, and reading one as an overflow cost a wrong fix that was
  reverted. `Emulation.setDeviceMetricsOverride` is the only honest way to size the viewport here.
