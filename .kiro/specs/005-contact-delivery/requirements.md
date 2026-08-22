# Feature Specification: Contact Delivery

**Slug**: 005-contact-delivery
**Created**: 2026-08-22
**Status**: Implemented
**Input**: "ідея форми що вона сама відправляє мені листа на пошту - стандартний хедер і повідомлення
з mail відправника + текст від нього + може телефон якщо введе. можна підключити просту google gmail
- відправка 20-30 повідомлень на місяць буде максимум."

Supersedes the `mailto:` assumption of `003-cv-content`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A visitor writes and the message arrives (Priority: P1)

Someone fills the form and presses send. Nothing opens, nothing is downloaded, no mail client is
involved. They are told the message went, and the owner has it in their inbox with a Reply-To that
answers the sender.

- **Why this priority**: `mailto:` fails silently for anyone without a configured desktop mail
  client, which on a phone is most people. A form that hands the visitor their own homework is not
  a contact route.
- **Independent Test**: Submit the form with `GMAIL_USER` and `GMAIL_APP_PASSWORD` set; confirm the
  mail arrives, that replying to it addresses the visitor, and that the UI reports success.
- **Acceptance Scenarios**:
  1. **Given** a valid submission, **When** the visitor sends it, **Then** the form reports success
     without navigating away and the message reaches the owner's inbox.
  2. **Given** the delivered mail, **When** the owner presses reply, **Then** the recipient is the
     visitor's address, not the sending account.
  3. **Given** any two messages, **When** they arrive, **Then** their From line and subject are
     identical, and each body opens with that sender's name, address and phone if given.
  4. **Given** sending fails or the server is unconfigured, **When** the visitor submits, **Then**
     they are told it did not go through and are shown the owner's address as the way round.

### User Story 2 — The form is not an open relay (Priority: P1)

The endpoint is public. It has to survive being found.

- **Why this priority**: An unvalidated, unlimited mail endpoint is abuse infrastructure that also
  gets the sending account suspended.
- **Independent Test**: Post malformed bodies, oversize fields, a filled honeypot and a burst of
  requests; confirm each is refused without a mail being sent.
- **Acceptance Scenarios**:
  1. **Given** a body that is not JSON, or has missing or oversize fields, **When** it is posted,
     **Then** the route answers `400` and sends nothing.
  2. **Given** more than five requests from one address within an hour, **When** the next arrives,
     **Then** the route answers `429` and sends nothing.
  3. **Given** the honeypot field carries a value, **When** the request is posted, **Then** the route
     answers as if it succeeded and sends nothing.
  4. **Given** a name or address containing a newline, **When** the mail is built, **Then** the
     newline never reaches a header.

### Edge Cases

- The visitor submits twice quickly → the submit button is disabled while a request is in flight.
- Credentials are absent in development → `503`, and the UI shows the fallback address. It must not
  look like a sent message.
- Gmail rejects the credentials → `502`, same fallback.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The form MUST send its message server-side. It MUST NOT depend on the visitor having a
  mail client.
- **FR-002**: Every delivered mail MUST carry the same From display name and the same subject, so one
  inbox filter catches all of them. The visitor's name, address and optional phone MUST be in the
  body; `Reply-To` is the only header that varies with the sender.
- **FR-003**: The sending account's credentials MUST be server-side environment variables and MUST
  never reach the client bundle.
- **FR-004**: The route handler MUST validate every field and reject anything outside the limits,
  independently of the browser check.
- **FR-005**: The browser and the route handler MUST apply the same validation rule, defined once.
- **FR-006**: The route handler MUST rate-limit by client address and refuse bursts.
- **FR-007**: The form MUST carry a honeypot field, and a filled honeypot MUST be answered as a
  success while sending nothing.
- **FR-008**: Any value reaching a mail header MUST have newlines stripped first.
- **FR-009**: The visitor MUST be told which of the three outcomes happened - sending, sent, failed -
  and a failure MUST offer the owner's address as an alternative.
- **FR-010**: The form MUST NOT report success when the message was not sent.

### Key Entities

- **Contact draft**: name, email, optional phone, message. Not persisted anywhere; it exists for the
  length of one request.

## Success Criteria *(mandatory)*

- **SC-001**: A visitor with no mail client configured can still reach the owner.
- **SC-002**: Zero mails are sent for a request that fails validation, the rate limit or the honeypot.
- **SC-003**: `GMAIL_APP_PASSWORD` appears in no built client asset.
- **SC-004**: The validation rule has exactly one definition in the repository.

## Assumptions

- Volume is tens of messages a month. Gmail's SMTP limits are two orders of magnitude above that, so
  no queue, no retry and no delivery log are built.
- Rate limiting is per instance and resets on deploy. Accepted at this volume; a shared store is
  infrastructure bought to solve nothing.
- `x-forwarded-for` is trusted for the rate-limit key. It is spoofable, and a determined sender gets
  past it - the limit is there to stop scripts and accidents, not a targeted attacker. The honeypot
  and the validation are the parts that carry weight.
- App Password, not OAuth: see `decisions/0001`.
- No CAPTCHA. It costs every visitor a puzzle and a third-party script to solve a problem the
  honeypot and the rate limit have not yet demonstrated they cannot handle. Revisit if spam arrives.
