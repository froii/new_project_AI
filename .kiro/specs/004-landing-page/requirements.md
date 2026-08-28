# Feature Specification: Landing Page

**Slug**: 004-landing-page
**Created**: 2026-08-22
**Status**: Implemented
**Input**: "зараз в мене є сторінка з моїм резюме. думаю варто зробити лендінг пейдж - сторінку гарно
оформлену де буде тільки основна інформація з гарним дизайном і кнопкою - повне резюме. там треба
залишити футер з контактами (але це повинна бути сторінка без навігації - просто гарний лендінг)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A visitor gets the gist in one screen (Priority: P1)

Someone opens the shared link. The first screen tells them who the owner is, what they do, and how to
reach them. Nothing to navigate, nothing to configure. If they want more, one button takes them to
the full CV.

- **Why this priority**: This is the feature. The CV already exists and already works; the landing is
  the front door it was missing.
- **Independent Test**: Load `/en` cold on a 360px viewport; confirm name, role, headline, the CV
  button and an email route are all reachable without any interaction beyond scrolling.
- **Acceptance Scenarios**:
  1. **Given** a first-time visitor, **When** `/{locale}` loads, **Then** the owner's name, role,
     headline and portrait are visible, and no section menu, no sticky header and no in-page
     navigation is rendered.
  2. **Given** the landing, **When** the visitor activates the full-CV button, **Then** the full CV
     opens at `/{locale}/cv` in the same language.
  3. **Given** the CV page, **When** the visitor activates the identity control in its header,
     **Then** they return to `/{locale}`.

### User Story 2 — The visitor can act without leaving the landing (Priority: P1)

The landing ends on the same contact band the CV does - the form first, the address beside it, and
one *Contacts* group alongside holding the messengers and the profiles; the row below keeps the
language and theme controls only.

- **Why this priority**: FR-016/FR-017 of 001 are contact requirements on the site, not on the CV
  route. Moving the CV behind a button would strand them if the landing carried no contacts.
- **Independent Test**: Load `/uk`, confirm every public contact point of 001's Owner Profile is
  present and its link resolves; switch language and theme from the footer.
- **Acceptance Scenarios**:
  1. **Given** the landing footer, **When** it renders, **Then** the form, the address and one
     *Contacts* group holding the three messengers built from the phone plus the profile links are
     all present and resolve.
  2. **Given** the landing footer, **When** the visitor switches language, **Then** they stay on the
     landing in the other language.

### Edge Cases

- The visitor arrives at `/` → the existing redirect sends them to the default locale's landing.
- An old link points at `/{locale}` expecting the CV → it now shows the landing; the CV is one click
  away and is what the button leads to. Accepted, see `decisions/0001`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST serve a landing page at `/{locale}` and the full CV at `/{locale}/cv`, each
  prerendered per locale.
- **FR-002**: The landing MUST present only the owner's identity, headline, engagement facts, a short
  selection of past work, the core stack, and contacts. Detail belongs to the CV.
- **FR-003**: The landing MUST NOT render navigation: no sticky header, no section menu, no
  visibility toggles, no reading progress. Language and theme controls are not navigation and MUST
  stay reachable (001 FR-006, FR-013).
- **FR-004**: The landing MUST offer two actions in the intro: the primary one leads to the full CV
  in the current locale, the second opens the contact form and puts focus in it. Neither is the bare
  address - that lives in the contact band.
- **FR-005**: The CV page MUST offer a way back to the landing from its header, at every viewport
  width, with an accessible name even where the label is not drawn.
- **FR-006**: The landing MUST show every public contact point of the owner profile in **one** group
  in the contact band - the address, the messengers built from the phone, and the profile links
  together, labelled *Contacts* (001 FR-016, FR-017). The split that put messengers in the band and
  profiles in the bottom row printed the same two icons twice on one screen and asked the visitor to
  care about a distinction that only mattered to the code.
- **FR-007**: The landing and the CV MUST each declare their own canonical address and per-language
  alternates, so the two do not compete as duplicates (001 FR-024).
- **FR-008**: Both routes MUST appear in the sitemap, in both languages.
- **FR-009**: The landing MUST reuse the content source and the copy of 001/003 rather than restate
  facts. New strings are limited to what only the landing says.
- **FR-010**: The landing MUST carry the same contact form as the CV, rendered from the same
  component, and it MUST look and behave the same on both pages. The address stays beside it as the
  auxiliary route.
- **FR-012**: WHEN the intro's write action is used, the form SHALL open, take focus, and the page
  SHALL scroll to its end - including when the form was already open, where nothing animates and
  nothing else would move the page. The form is the last block on the page, so the end of the page is
  the whole form.
- **FR-014**: The work highlights MUST hold six cards and show three at a time, advancing one card
  left every 15 seconds and wrapping past the last. The rotation MUST pause while the block is
  hovered or holds focus, MUST NOT auto-advance under `prefers-reduced-motion: reduce`, and an arrow
  either side MUST step it in both directions.
- **FR-025**: The intro portrait MUST carry a cast shadow strong enough to lift it off the wash in
  both themes - it is the only image on the page and has to read as its own object, not as a framed
  patch of background.
- **FR-011**: Below the two-column breakpoint the intro MUST keep the portrait at a size close to the
  wide one, and stacked actions MUST share a width. A breakpoint may reflow the layout; it may not
  read as a different, smaller design.
- **FR-013**: The contact band MUST offer a PDF action beside the write action, in the same button
  shape and a weight of its own (the write action solid, the PDF one outlined), so the landing (which carries no section panel, FR-003) still has a
  route to the CV as a file. On the landing it MUST download the prepared PDF (`content/links.ts`,
  `cvPdf`), not open the print flow: printing the landing prints the landing - the portrait and the
  intro - and never the CV. Only the CV page prints itself, the same flow 002 FR-124 reaches from
  the panel. The band carries exactly two actions; where they no longer fit on one line they MUST
  stack full-width, as they do on a phone - never wrap into a partly filled second row. The address
  sits in the Contacts group, on its own row under the profile links (FR-006).
- **FR-014**: On a wide viewport the contact band MUST use more of its width than the paper column
  it sits under - the band spans the screen, so holding it to the CV's reading measure wastes it.

### Key Entities

No new entities. The landing reads the Owner Profile, Achievements and Skill Groups of 001/003.

## Success Criteria *(mandatory)*

- **SC-001**: A visitor on a 360px viewport reaches the full CV in exactly one activation from the
  landing.
- **SC-002**: Zero content facts are duplicated between `content/` and the landing components.
- **SC-003**: Both routes are static at build time (4 prerendered pages: 2 locales x 2 routes).
- **SC-004**: 100% of visible landing strings change with the language switch.
- **SC-005**: The contact form exists once in the repository and is rendered by both pages.

## Assumptions

- The landing is screen-only in practice; the printable file is the CV and no print styling is
  written for the landing beyond what `globals.css` already gives every page.
- The portrait on the landing is fixed, not switchable: choosing a portrait is a CV-tailoring tool
  and has nothing to do with a first impression.
- The six featured pieces of work and the stack shown are an editorial pick made in the landing
  component, not a new field on the content model. The stack is the first three of each of the
  frontend, backend and AI groups, so the order those groups are written in is what the landing
  shows.
