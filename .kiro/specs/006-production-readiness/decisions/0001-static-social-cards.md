# 0001 — Social cards are committed PNGs, not a runtime renderer

**Status**: Accepted
**Date**: 2026-08-27
**Feature**: 006-production-readiness

## Context

A CV site is handed over by URL. LinkedIn, Telegram and Slack unfurl that URL, and until now they
rendered nothing: no `og:image` existed. The card has to exist in both locales, and the Ukrainian one
carries a Cyrillic name.

## Decision

Two 1200x630 PNGs, `public/og-{en,uk}.png`, composed once from `content/` and the owner's portrait
with the `sharp` already in the tree, and committed. `lib/og-image.ts` declares them on both routes.

## Alternatives

- **`ImageResponse` in an `opengraph-image.tsx`.** The framework-native answer, and it would regenerate
  the card whenever the pitch changes. But Satori needs real font data for every glyph it draws, and
  the name is Cyrillic - so it means a TTF committed to the repo and read at build, or a build-time
  fetch of a font file from a hardcoded CDN URL. That is a heavier dependency than the thing it
  produces: two images that change when the owner rewrites their pitch, which is roughly never.
- **One card for both locales.** Halves the work and shows a Ukrainian visitor a transliterated name
  in a Latin font. The second file costs nothing once the generator exists.
- **A screenshot of the page.** Needs headless Chromium, which the project rejected for the PDF and
  has no other use for.

## Consequences

- The cards are generated artefacts under version control, like the photos. When the name, the title
  or the pitch changes, they are stale until regenerated, and nothing warns about it. The generator
  is a scratch script, not a build step - if the pitch starts moving, it earns a place in `package.json`.
- Because they are static files, the CSP needs no exception and the host does no work per unfurl.
