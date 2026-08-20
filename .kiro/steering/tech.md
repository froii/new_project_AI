# Tech

Scaffolded. Pinned exactly (`--save-exact`): Next `16.3.1`, React `19.2.8`, TypeScript `6.0.3`,
Node `22.21.1` (`.nvmrc`, `engines: >=22.18`), npm as the package manager.

**TypeScript is held at 6.x on purpose.** 7.0 was installed first and works, but `typescript-eslint`
refuses to run against it, which takes ESLint — and therefore `next lint` — off the table entirely.
A faster compiler is not worth losing the linter. Revisit when typescript-eslint ships TS 7 support.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js, App Router, TypeScript strict |
| Rendering | Static by default; server work only where a secret or a heavy dep demands it |
| Styling | CSS Modules + plain CSS (grid, container queries, custom properties) |
| i18n | `next-intl`, locale as a **root param** (`next/root-params`) |
| Theming | `next-themes`, `data-theme` on the root element |
| PDF | `@react-pdf/renderer`, client-side |
| AI (later) | Anthropic SDK behind `app/api/chat/route.ts` |
| Email | provider undecided — see §Email |

Vitest for unit tests (`npm test`), configured in `vitest.config.mts` with Vite's native
`resolve.tsconfigPaths` — no path-alias plugin. **TODO(tech):** no linter installed.

## PDF — the browser prints, by decision

The visitor keeps a PDF, so the site ships a **print stylesheet** and a trigger that calls
`window.print()`. The browser's own dialog is the preview, and "Save as PDF" is a destination in
every current engine, phones included (iOS Safari via the share sheet, Chrome and Firefox on Android
directly). Text stays selectable and searchable because it is text.

Rejected: `@react-pdf/renderer`. It buys full control of the page geometry and costs a second
renderer over `content/` — every section written twice, in two layout languages that drift on every
content change — plus a Cyrillic TTF in the bundle and ~500KB of client JavaScript for a feature used
once per visitor. Rejected earlier and still rejected: headless Chromium on a server, which needs
infrastructure the site does not otherwise have.

Consequence: **the file is the page.** What the print stylesheet does not restyle, the printer
prints as it stands, so layout work on the page is layout work on the PDF. The rules live next to
what they restyle: each component hides its own chrome in its own `@media print` block, and
`globals.css` owns `@page`, the light palette override and the page geometry tokens.

**Page geometry has one source.** `--page-width`, `--page-height`, `--page-pad-*` in `globals.css`
drive both `@page` and the on-screen page preview (`:root[data-pages]`), so the preview cannot claim
a cut the printer will not make. The preview is an indication, not a promise — `break-inside: avoid`
still nudges blocks down in the real file, and the browser dialog remains the exact answer.

**The PDF is always light.** `@media print` re-declares the palette in ink-friendly values whatever
the screen theme was.

**Closed panels must stay in the DOM.** Radix Accordion unmounts collapsed content; with the default
behaviour a printed CV carries one role out of eight. `forceMount` plus a CSS `[data-state="closed"]`
hide keeps the markup complete and lets print reveal all of it.

## Selection — one state, two consumers

The visitor chooses which blocks the site shows. **The PDF exports exactly that selection**: what is
hidden on the page is absent from the file. There is no separate "pick sections for the PDF" step.

Consequence: the selection state sits beside the content model, not inside either renderer. The page
reads it to decide what to render; the PDF reads the same state to decide what to include. A block
added later inherits both behaviours by existing in the content model — neither renderer needs a
branch for it.

Built in `002-section-selection`: `content/sections.ts` is the ordered id list,
`providers/sections-provider` holds `Record<SectionId, boolean>`. The PDF reads that same map.

Two selection models over one content model would drift, and the drift shows up as a PDF that
disagrees with the screen the visitor was just looking at.

## i18n — localized leaves, not parallel files

Translations live in `messages/<locale>/<block>.json` — one folder per language, one file per block,
per-entry text keyed by entry id. Structural facts (ids, dates, links, images, proper nouns) stay in
`content/` and are never duplicated per language.

`en` is the reference shape; every other locale is checked against it with `satisfies typeof en`, so
a missing or misspelled key is a **typecheck error**, not a blank on screen.

Every renderer takes the locale as a parameter: page, PDF and later the AI bot. There is no ambient
"current language" that the PDF has to guess.

## Theming — CSS, and it stays CSS

Colors, spacing and the type scale are plain CSS custom properties, switched by `data-theme` on the
root. CSS does this natively; a TS token layer would buy nothing, and with the PDF produced by the
print stylesheet there is no second renderer that cannot read them.

`next-themes` exists to solve one specific problem: the theme must be applied **before first paint**,
or dark-theme visitors get a white flash on every load. Print overrides the palette to ink values, so
a dark screen never becomes a dark page.

## Type — three families, all Cyrillic-capable

`--font-sans` (UI), `--font-serif` (display: `h1`, `h2`, hero lede), `--font-mono` (numbers, labels,
eyebrows). All three are system stacks today.

**A display face is only a candidate if it covers Cyrillic.** The reference design uses Newsreader,
which ships latin, latin-ext and vietnamese and **no Cyrillic** — on `/uk` every serif heading would
fall back mid-page. `--font-serif` therefore resolves to `ui-serif, Cambria, "Times New Roman"`,
which do cover it. This is the trap T005 is about; check the unicode ranges before self-hosting.

## Responsive — one layout, not two

Layout adapts through CSS grid and **container queries**, so a component responds to the space it is
actually given. No JS breakpoint branching, no parallel mobile/desktop component trees — two trees
means every content change gets made twice, and one of them gets forgotten.

## AI (later)

Not built yet. One obligation holds from day one: **the API key never reaches the client.** All model
calls go through a route handler. The bot is grounded by passing `content/` as context — at this data
size that is a prompt, not a retrieval system. No vector DB, no RAG.

## Email

A contact form: a visitor writes, the message is mailed to the owner. No subscriber list and no
broadcasts — that reading was considered and dropped, and with it the storage, double opt-in and
unsubscribe machinery.

**Today the form composes a `mailto:` link** — it opens the visitor's own mail client with the
message ready. No provider, no secrets, works offline of any backend. Swapping to a real send
replaces one function; the markup and the `ui/` primitives do not change.

Contact values live in `NEXT_PUBLIC_OWNER_*` (see `.env.example`). **This is not secrecy** — the
address is printed on the page and lands in the client bundle either way. It keeps personal contact
details out of the repository, nothing more.

- One route handler, one sending provider. **TODO(tech):** provider not chosen.
- Credentials in env vars, server-side only, never in the bundle.
- The form is a trust boundary: validate input and rate-limit before sending. An unprotected form is
  an open relay for whoever finds it — this is not on the chopping block for minimalism.

## Testing

Tests are the independent check (`preferences.md` §Role separation). Priority order:

1. `content/` type/shape correctness — enforced by `tsc`, not by tests.
2. `lib/` pure logic — this is where the tests live, because these are the functions that fail
   **silently**: a wrong sort order, a URL parameter that decodes to the wrong sections, a credential
   id that comes out empty. None of them throw; they just render something plausible and wrong.
3. Tests run against the **real** `content/` too, not only fixtures — so adding a job with a broken
   date range or a certificate with an unparseable URL fails the suite rather than the eye.
4. UI: not covered. Radix behaviour is tested upstream, and markup assertions break on every
   restyle without catching anything.

## Build & deploy

**Turbopack is the bundler** — Next ships it; there is no separate build tool. Vite exists in the
repo only as Vitest's engine for `lib/**` tests and never touches the application build.

Production configuration in `next.config.ts` (TypeScript so it can import `defaultLocale` from
`i18n/config.ts` rather than restate it): `poweredByHeader: false`, `reactStrictMode`, a `headers()`
block sending `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`
and HSTS on every route, and a `redirects()` entry sending the bare root to the default locale.

**No Content-Security-Policy yet, deliberately.** `next-themes` writes its pre-paint script inline;
a strict CSP needs either a per-request nonce — which forces dynamic rendering and gives up static
generation — or a hash that changes whenever the theme config does. Both cost more than they are
worth before a domain exists. **TODO(tech):** revisit at deploy time.

`app/robots.ts` and `app/sitemap.ts` generate their files from `locales`, so a third language adds
itself. Both read `NEXT_PUBLIC_SITE_URL`; until it is set they emit `localhost`, which is wrong in
production and must be set before the first deploy.

**TODO(tech):** hosting not chosen. Constraint to respect: route handlers for AI and email mean the
target must run server code — a pure static export would foreclose both, and would also drop the
security headers above, since those need a server.
