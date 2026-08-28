# Feature Specification: Production Readiness

**Slug**: 006-production-readiness
**Created**: 2026-08-27
**Status**: Implemented except where marked Open
**Input**: "варто зробити все необхідне, окрім ші" - the pass that turns a working site into one that
can be handed to a recruiter and indexed by a search engine.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — The link survives being pasted (Priority: P1)

A recruiter pastes the CV link into LinkedIn, Telegram or Slack. The message renders a card with the
owner's face, name and pitch instead of a blank rectangle.

- **Why this priority**: The link is the product. A CV site is handed over by URL, and the preview is
  the first thing anyone sees of it.
- **Independent Test**: Paste the URL into any unfurling client; a 1200x630 card appears in the
  locale of the link.
- **Acceptance Scenarios**:
  1. **Given** either locale, **When** the URL is unfurled, **Then** a card in that locale is served
     with an absolute URL, width and height declared.
  2. **Given** the CV route, **Then** it carries the same card - a child route must re-declare it,
     because nested metadata replaces the parent's rather than merging into it.

### User Story 2 — A machine can read the CV (Priority: P1)

Google and an AI crawler read the profile without inferring it from the layout.

- **Independent Test**: The rendered HTML contains one `application/ld+json` block that validates as
  `schema.org/Person`.
- **Acceptance Scenarios**:
  1. **Given** either page under a locale, **Then** the block carries name, job title, description,
     canonical URL, image, contacts and the skill list, all read from `content/`.

### User Story 3 — A wrong URL is still the owner's site (Priority: P2)

A stale link lands on a page that does not exist. The visitor gets a branded page in their language,
with the CV one click away, and the response is a real 404.

- **Independent Test**: Request `/uk/nope`; the response is `404` and renders the owner's 404 page.

### Edge Cases

- The site origin is unset at build time → sitemap, robots and the card point at `localhost`. The
  build must be given `NEXT_PUBLIC_SITE_URL`.
- A browser too old for an SVG favicon → the PNG icon covers it.
- A viewer whose OS theme is light → the browser chrome must not paint the dark frame.

## Requirements *(mandatory)*

**Identity and sharing**
- **FR-601**: The site MUST ship an icon set through the framework's own metadata files, not a
  hand-written `<head>` snippet: an SVG icon, a PNG fallback, an Apple touch icon, and a manifest.
- **FR-618**: Manifest icons MUST be 192 and 512 square plus a `maskable` copy, and MUST live apart
  from the framework's icon files under a name that says what reads them. They are not favicons:
  Chrome checks those two sizes for installability, an unpadded mark loses its edges to a circular
  mask, and a bare `icon-180.png` in `public/` reads as the favicon while being a duplicate of
  `app/apple-icon.png` that nothing but the manifest loads.
- **FR-602**: `theme-color` MUST be declared per colour scheme. One fixed value paints the wrong
  browser frame for half the visitors before the theme script runs.
- **FR-603**: Each locale MUST have its own social card, generated from `content/` and committed as a
  static file. It MUST NOT cost a runtime renderer or a Cyrillic font in the bundle.
- **FR-604**: Every page MUST declare `summary_large_image`; a `summary` card wastes the artwork.

**Machine-readable**
- **FR-605**: The rendered HTML MUST carry a `schema.org/Person` block built from `content/`, so the
  machine-readable copy cannot drift from the rendered one.
- **FR-606**: Values interpolated into a `ld+json` script MUST have `<` escaped.

**Dead ends**
- **FR-607**: An unmatched URL under a locale MUST render the owner's 404 in that locale and answer
  with status 404. This needs a catch-all: without one the URL matches no segment and falls out of
  the locale into the framework's own unstyled page, in the wrong language.
- **FR-620**: A URL whose **first** segment is not a locale (`/blog`) MUST also render the owner's
  404. It matches `[locale]`, so the locale layout runs and throws - from the root layout, which sits
  above its own not-found boundary. The boundary therefore has to live above the locale and own its
  own document, and can only answer in the default locale: the URL named no valid one.
- **FR-608**: A render error MUST offer a retry and a direct mail link to the owner's email, in the
  visitor's language. The CV link is no use here: the error boundary sits over the CV itself.
- **FR-621**: Both 404 pages MUST offer the home page and a direct mail link to the owner's email.
  A CV link is redundant: the home page leads there, and a dead end should point at one way out.

**Typography and weight**
- **FR-609**: Fonts MUST be self-hosted and MUST cover Cyrillic. The PDF is the page, so a font the
  visitor's machine happens to lack is a CV that prints differently for every recruiter.
- **FR-610**: Only the font the first paint needs MAY be preloaded. Preloading every family and
  subset cost ~200KB of render-blocking preload for one heading and a row of date labels.
- **FR-611**: Images MUST declare what they actually render at, so a 48px thumbnail is not served a
  600x800 portrait.
- **FR-612**: An asset no code references MUST NOT ship.

**Hardening**
- **FR-613**: The response MUST carry a Content Security Policy. It MAY leave scripts and styles
  `unsafe-inline`: a nonce is per request, and a per-request header would make every page dynamic.
  The directives that bite here are where the page may connect, what may frame it, and where a form
  may post.
- **FR-614**: Type check, lint, tests and a build MUST run on every pull request. The build is the
  only step that catches a broken metadata route or a font that stopped resolving.
- **FR-615**: `upgrade-insecure-requests` MUST be production-only. On the dev server it rewrites
  every `/_next/*` request to https, so opening the dev server from a phone over the LAN - the only
  way to test the panel on a real touch screen - loads a blank page.

**Chrome that matches the page**
- **FR-616**: `theme-color` MUST be the colour `body` actually paints (`--color-canvas`), not the
  paper colour. A near-miss reads as a seam between the address bar and the page.
- **FR-617**: The manifest cannot express a colour per scheme, and on Android an installed app takes
  its value over the scheme-aware meta tags. It MUST therefore declare the light canvas: an unset OS
  preference resolves light, and a light splash under a dark app is the milder mismatch.

**The bar fits the phone**
- **FR-618**: The header MUST occupy one row at every width it is shown at. Its controls MUST NOT
  take a shrinkable flex basis: their buttons are fixed-width, so a shrunk container wraps them and
  they spill below the header's own height.
- **FR-619**: WHERE one row still does not fit, the icon row is what gives way - the hero lists every
  contact as text and the contact band always renders, so it is the only part repeated elsewhere.
  The name comes back in its place (003 FR-217 orders the name below the links, not below nothing).

## Success Criteria

- **SC-601**: A pasted link renders a card with the owner's face in both locales.
- **SC-602**: `/uk/nope` answers 404 with the Ukrainian dead-end page.
- **SC-603**: Preloaded font payload stays under 70KB.
- **SC-604**: The thumbnail row requests 64w images, not the full portraits.
- **SC-605**: `npm run build` passes from a clean checkout in CI.
- **SC-606**: `/blog` and `/uk/nope` both answer 404 with a styled page; neither reaches the
  framework's built-in one.
- **SC-607**: The header is one row high at 320, 360, 375, 390, 430 and 780px in both locales,
  measured rather than eyeballed.

## Open

- **Rate limiting depends on the host.** `app/api/contact/route.ts` counts submissions in memory. On
  a single Node process that is exactly right. On a serverless platform the counter resets with every
  cold start, leaving the honeypot and the field limits as the only defence. Decide the host, then
  either accept it (the expected volume is a few messages a month) or move the counter to a store.
  Not decided at the time of writing, so nothing was built for either case.
- **Analytics.** `product.md` puts analytics dashboards out of scope. Knowing that a recruiter opened
  a shared link is a different thing from a dashboard, and may deserve its own spec.

## Assumptions

- The host runs Node: `app/api/contact` and the image optimiser both need it. A static export is not
  on the table.
- `NEXT_PUBLIC_SITE_URL` is set in the production build environment.
