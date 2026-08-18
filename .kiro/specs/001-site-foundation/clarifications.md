# Clarifications — 001-site-foundation

**Resolved**: 2026-08-17. All six open questions from the first draft are closed; no
`[NEEDS CLARIFICATION]` markers remain in `requirements.md`.

| # | Question | Answer | Landed in |
|---|---|---|---|
| 1 | Browser language is neither uk nor en — what is served? | English | Edge Cases, FR-010 |
| 2 | Must content render without JavaScript? | No. React/Next is the platform; no extra fallback path | Assumptions |
| 3 | Does the language choice persist across visits? | The address carries it; no separate stored preference | FR-008, FR-009 |
| 4 | Does the default language appear in the address? | Yes — every language has its own address, English is the default | FR-008, FR-010 |
| 7 | Middleware for browser-language detection? | No. `/en` and `/uk` are static pages, the bare root redirects to `/en`, browser language is never consulted | FR-010 |
| 5 | Which contact points are public? | All of them. Shown in the footer with a "write to me" action, and beside the photo in the header block | FR-016, FR-017, Owner Profile |
| 6 | Do projects carry images and links? | Yes, though not a priority now | Project entity |

## Notes on the answers

**#2 — accepted trade-off, not an oversight.** Skipping the no-JS path is a real decision. Its actual
cost is narrower than first written: pages are server-rendered, so text and images still appear
without JavaScript — what dies is every interaction (expanding, language, theme). The owner asked for
this to be stated to the visitor rather than left looking broken, which is FR-025.

**#3 + #4 together remove a whole class of bug.** With the address as the single record of language,
there is no stored preference that can disagree with the URL — the state that produces "I opened a
Ukrainian link and got English" cannot exist.

## Raised, deliberately deferred

The owner also described **visitor-controlled toggling of blocks and elements**, with display
settings in the header, and said they would explain it properly later. It is not specified here and
001 renders every section unconditionally.

The owner has since confirmed it **is** the same mechanism as PDF selection: the PDF is built from
what the page currently shows, and anything deselected is simply absent. That makes it one selection
state with two consumers — recorded as a standing rule in `steering/tech.md` §Selection. The feature
itself is still unspecified and parked in `.kiro/TODO.md`.
