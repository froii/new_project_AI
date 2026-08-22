# 0001 — The CV moves to `/{locale}/cv`, the landing takes the root

**Status**: Accepted
**Date**: 2026-08-22
**Feature**: 004-landing-page

## Context

`/{locale}` was the full CV: header, section menu, visibility toggles, seven sections and a contact
band. That is a working document, not a first impression. A visitor who was sent the link had to
decide what to read before knowing whether they cared.

## Decision

The landing takes `/{locale}`. The CV moves, unchanged, to `/{locale}/cv`.

## Alternatives

- **Landing at `/{locale}/hello`, CV stays at the root.** No link breaks, but the address that gets
  shared keeps opening the document nobody asked to read yet. The point of a landing is that it is
  what a bare link opens.
- **One page: a landing section on top of the CV.** The section menu, the toggles and the progress
  bar exist to serve a document; putting a marketing screen above them means the page is two things
  at once and neither cleanly. Also doubles the weight of the first paint.

## Consequences

- An existing link to `/{locale}` now opens the landing. Accepted: the site is not yet published
  under a stable address, so no inbound link is being broken.
- The CV page needs its own `generateMetadata` — the layout's canonical would otherwise claim
  `/{locale}` for both routes and make them compete as duplicates.
- The CV loses its entry point unless the header offers one back; hence FR-005.
