# ADR-0001 — Locale is a root param, not a request-scoped cache entry

**Date**: 2026-08-18
**Status**: Accepted
**Context**: 001-site-foundation, FR-008, FR-010

## Problem

`next-intl` 4.13.7 marks `setRequestLocale` `@deprecated` in favour of `next/root-params`. The call
could not simply be deleted: `getRequestConfig` resolves the locale as
`getCachedRequestLocale() || getLocaleFromHeader()`, so with the cache unset every page that renders
a component calling `useTranslations` without an explicit locale reads `headers()` and opts the route
into dynamic rendering. That contradicts "static by default" (`tech.md` §Stack).

## Decision

The locale becomes a Next.js **root param**, which requires the dynamic segment to sit in the root
layout. Three changes follow from that one requirement:

1. `app/layout.tsx` (a pass-through returning `children`) and `app/page.tsx` (the bare-root redirect)
   are deleted. `app/[locale]/layout.tsx` already rendered `<html>`/`<body>` — it is now the root
   layout, and `[locale]` is therefore a root param.
2. `i18n/request.ts` reads `await locale()` from `next/root-params`, falling back to the explicit
   `locale` override that `getTranslations({locale})` passes in. No header is read at any point.
3. The bare root redirect moves to `redirects()` in `next.config.ts`. The config is TypeScript so it
   can import `defaultLocale` from `i18n/config.ts` instead of restating `"en"` — the locale list
   stays the single source of truth.

## Why not the alternatives

- **Keep `setRequestLocale`.** It still works, but every next-intl upgrade carries the risk of its
  removal, and the deprecation is visible in the editor on two files.
- **Hardcode `/en` in `next.config.mjs`** and skip the TypeScript rename. Cheaper, but it duplicates
  the default locale outside `i18n/config.ts` — the exact drift the product's core value forbids.
- **Keep `app/page.tsx` for the redirect.** Impossible: a page at `app/` needs a root layout at
  `app/`, and any root layout without a dynamic segment means Next detects no root params at all.

## Consequences

- `/` now answers with a 307 from the routing layer rather than from a rendered React page — one
  fewer prerendered route, same status code as `redirect()` produced before.
- `next/root-params` types are generated into `.next/types/root-params.d.ts`; a clean checkout has no
  types for the module until the first `next build` or `next dev`. `node_modules/next/root-params.d.ts`
  ships a bare `declare module` so this does not surface as a type error.
- Verified by `npm run build`: `/en` and `/uk` are still `●` (SSG), the generated root-params types
  declare `locale(): Promise<string>`, and `routes-manifest.json` carries the `/` → `/en` 307.
