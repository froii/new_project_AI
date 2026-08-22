# 0001 — Gmail SMTP with an App Password, not OAuth and not a mail provider

**Status**: Accepted
**Date**: 2026-08-22
**Feature**: 005-contact-delivery

## Context

The form has to send mail from a personal Gmail account. Expected volume is 20-30 messages a month.

## Decision

`nodemailer` over Gmail SMTP, authenticated with a Google App Password held in `GMAIL_USER` and
`GMAIL_APP_PASSWORD`.

## Alternatives

- **Gmail API with OAuth2.** No dependency at all - two `fetch` calls, token then send. But the setup
  is a Cloud project, an OAuth client, a consent screen and a refresh token that has to stay alive.
  That is a standing maintenance obligation for a mailbox that sees one message a day at most.
- **A mail provider (Resend, Postmark, SES).** Better deliverability and a dashboard, but it means a
  third party, a domain to verify and an account to keep. The owner asked for "просту google gmail".
- **Keep `mailto:`.** It is what was there, and it is why this feature exists: on a phone without a
  configured mail client it does nothing visible at all.

## Consequences

- The account must have 2-Step Verification on; App Passwords do not exist without it. Google
  Workspace accounts can have them disabled by policy - then this decision is revisited.
- Gmail rewrites `From` to the authenticated account regardless of what is set, so the visitor's
  address only survives in `Reply-To`. The display name is theirs; the address is not.
- The site now needs a host that runs server code. `tech.md` §Build & deploy already treated that as
  the constraint to respect; it is no longer hypothetical.
