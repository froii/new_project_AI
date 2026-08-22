# Tasks: 005-contact-delivery

- [x] T001 `lib/contact-message.ts` — limits, `invalidContactFields`, `headerSafe`; one definition,
  both sides (FR-004, FR-005, FR-008).
- [x] T002 `lib/contact-message.test.ts` — the rule, including the injection case.
- [x] T003 `app/api/contact/route.ts` — config check, rate limit, honeypot, validation, Gmail send;
  `503` / `429` / `400` / `502` / `200` (FR-001..FR-008, FR-010).
- [x] T004 `components/sections/contact/` — `fetch` instead of `mailto:`, sending / sent / failed
  states, honeypot input, `maxLength` per field, address shown on failure (FR-009).
- [x] T007 `app/api/contact/route.ts` — strip whitespace from the App Password: Google prints it in
  four groups of four and that is how it gets pasted (FR-003).
- [x] T005 `.env.example` — `GMAIL_USER`, `GMAIL_APP_PASSWORD` with the App Password note (FR-003).
- [x] T006 `components/ui/input` — accept a `ref`, so the form can focus its first field.

## Phase 2 — Follow-up (owner review)

- [x] T008 `app/api/contact/route.ts` — one constant From name and one constant subject; name, email
  and phone move to the head of the body (FR-002).
- [x] T009 `messages/{en,uk}/contact.json` — the note beside Send says what happens and when, rather
  than describing the owner's mail habits.

## Verification

- [x] `npx vitest run lib/contact-message.test.ts` — 8 passed
- [x] `npm run typecheck`, `npm run build`
- [x] Route branches against a running build: `503` unconfigured, `400` malformed / oversize / empty,
  `200` honeypot, `429` on the sixth request in the window
- [x] End-to-end send with the owner's credentials — `200 {"ok":true}` twice: before and after the
  header change, the second with a phone number
