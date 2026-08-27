# 0002 — A CSP without a nonce, because a nonce costs static rendering

**Status**: Accepted
**Date**: 2026-08-27
**Feature**: 006-production-readiness

## Context

Every other security header was already in `next.config.ts`; `Content-Security-Policy` was the gap.
The strong form of the header is `script-src 'nonce-...' 'strict-dynamic'`, which requires a fresh
random nonce per response, generated in middleware and threaded into every inline script.

## Decision

A static policy in the same header block, with `'unsafe-inline'` for scripts and styles.

## Alternatives

- **Nonce via middleware.** A nonce is per request. A per-request header means the page can no longer
  be served from a prerendered file, so every route goes dynamic - `structure.md` states plainly that
  there is no middleware and both locales are prerendered. Trading the entire static build for a
  directive that guards against an injection vector this site does not have is a bad trade: nothing
  here renders visitor input into HTML. The contact form posts JSON and the response is JSON.
- **Hashes instead of a nonce.** Works for fixed inline scripts, but Next's inline bootstrap and the
  `next-themes` blocking script both change content between builds, so the hash list would have to be
  regenerated on every build and would silently break the page when it drifted.
- **No CSP.** Leaves `frame-ancestors`, `form-action`, `base-uri`, `object-src` and `connect-src` on
  the table, and those are the directives that actually apply here.

## Consequences

- `script-src 'unsafe-inline'` means the policy does not stop an injected `<script>`. Accepted: the
  site has no user-generated content and no HTML rendering path that takes visitor input.
- `connect-src 'self'` is the directive with teeth - it bounds where anything on the page can send
  data. Adding an analytics or AI endpoint later means adding its origin here, deliberately.
- `'unsafe-eval'` is added in development only, where the dev server needs it.
- If the site ever renders visitor-supplied HTML, this decision is void and the nonce is worth its
  cost.
