# Feature Specification: Site Foundation — Content Model, Home Page, Language & Theme

**Slug**: 001-site-foundation
**Created**: 2026-08-17
**Status**: Draft
**Input**: "контент-модель + головна сторінка + перемикачі мови й теми. Locales: uk + en (обидві
обов'язкові, локалізовані листки в типі). Теми: світла + темна, за замовчуванням з OS, перемикач
видимий, вибір запам'ятовується. Контент: фото, дані про власника, досвід, проєкти. Поза обсягом:
PDF-експорт, форма зв'язку, AI-бот."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A recruiter skims the site and leaves with an impression (Priority: P1)

A recruiter opens the link on a phone between meetings. Within a few seconds they see who the owner
is, a photo, and what they do. They scroll, expand one role in the experience list to read detail,
glance at two projects, and close the tab.

- **Why this priority**: This is the product. Everything else — PDF, contact, bot — attaches to
  content that must first exist and render.
- **Independent Test**: Load the home page on a narrow viewport with no prior visit; confirm owner
  identity, photo, experience and projects are all reachable by scrolling and expanding.
- **Acceptance Scenarios**:
  1. **Given** a first-time visitor on a 360px-wide viewport, **When** the home page loads, **Then**
     the owner's name, role and photo are visible without horizontal scrolling.
  2. **Given** the experience section, **When** the visitor expands one entry, **Then** its detail
     becomes visible and other entries remain usable.
  3. **Given** a visitor using only a keyboard, **When** they tab to an expandable entry and press
     Enter or Space, **Then** it expands and focus stays on the control.
  4. **Given** a screen reader, **When** it reaches an expandable entry, **Then** the entry's
     expanded/collapsed state is announced.

### User Story 2 — A Ukrainian-speaking visitor reads the site in Ukrainian (Priority: P1)

A visitor lands on the site and sees it in a language they can read. If it guessed wrong, a visible
control switches language, and every part of the page — interface labels and the owner's content
alike — changes together.

- **Why this priority**: Two locales are a launch requirement, not an enhancement. A half-translated
  page is worse than a single-language one.
- **Independent Test**: Switch language and confirm no original-language text remains anywhere on
  the page.
- **Acceptance Scenarios**:
  1. **Given** the site in English, **When** the visitor selects Ukrainian, **Then** all interface
     labels and all owner content render in Ukrainian.
  2. **Given** a language has been selected, **When** the visitor reloads the page, **Then** the
     selected language is still in effect.
  3. **Given** any supported language, **When** the page is rendered, **Then** no text placeholder,
     key name, or empty string is shown in place of a translation.

### User Story 3 — A visitor reads comfortably in their preferred theme (Priority: P2)

A visitor whose device is set to dark mode opens the site and it is already dark — no flash of light.
A visible control switches theme, and the choice survives reload.

- **Why this priority**: Comfort and polish, not access. The site is fully usable in either theme, so
  this ranks below content and language.
- **Independent Test**: Set the OS to dark, load the site, confirm it renders dark from the first
  frame; toggle to light, reload, confirm it stays light.
- **Acceptance Scenarios**:
  1. **Given** a device set to dark mode and no prior visit, **When** the page loads, **Then** it
     renders in the dark theme with no light-coloured flash at any point during load.
  2. **Given** the visitor has explicitly chosen a theme, **When** they return later, **Then** their
     chosen theme is applied and the OS preference no longer overrides it.
  3. **Given** either theme, **When** any text is displayed over its background, **Then** contrast
     meets WCAG 2.1 AA.

### Edge Cases

- Visitor arrives at the bare root → English is served, regardless of browser language. Browser
  language is not consulted at all (see FR-010).
- A content entry has no translation for one locale → must be impossible to ship (see FR-004), not
  handled at runtime.
- The owner has no projects yet, or exactly one → sections must render without a broken layout.
- An experience entry is the current position, with no end date.
- A photo fails to load or is slow → layout must not shift when it arrives.
- A shared link carries a language the visitor does not read → the language control is reachable
  without first understanding the page.
- Visitor has "reduce motion" enabled → expand/collapse must respect it.

## Requirements *(mandatory)*

### Functional Requirements

**Content**
- **FR-001**: System MUST present the owner's identity (name, role, photo), a self-description,
  a list of past and current experience, and a list of projects.
- **FR-002**: System MUST treat the content as a single source of truth, so that a fact edited once
  is correct everywhere it appears.
- **FR-003**: System MUST render experience entries in reverse chronological order.
- **FR-004**: System MUST make an untranslated content field impossible to release — a missing
  translation MUST fail the build rather than reach a visitor.

**Language**
- **FR-005**: System MUST support Ukrainian and English, with neither designated as a partial or
  fallback-only locale.
- **FR-006**: Users MUST be able to switch language from a control visible on every page.
- **FR-007**: WHEN a visitor switches language, the system SHALL change interface labels and owner
  content together, with no mixed-language state.
- **FR-008**: System MUST expose a distinct address per language, including the default one, so that
  a shared link always opens in the language it was shared in.
- **FR-009**: WHEN a visitor switches language, the system SHALL change the address to that
  language's address. The address is the only record of the choice — the system MUST NOT keep a
  separate stored language preference that could contradict it.
- **FR-010**: WHEN a visitor arrives without a language in the address, the system SHALL serve
  English. Browser-language detection is deliberately not performed: it requires request-time
  middleware, and the owner chose static pages over it.

**Theme**
- **FR-011**: System MUST support a light and a dark theme.
- **FR-012**: WHEN a visitor has expressed no theme preference on the site, the system SHALL follow
  the operating system preference.
- **FR-013**: Users MUST be able to switch theme from a control visible on every page. The control
  offers light and dark only — following the operating system is the starting state (FR-012), not a
  listed option.
- **FR-014**: WHEN a visitor has explicitly chosen a theme, the system SHALL apply that choice on
  return visits in preference to the operating system setting.
- **FR-015**: WHEN a page loads, the system SHALL apply the resolved theme before the first paint,
  so no incorrectly themed frame is ever shown.

**Contact display**
- **FR-016**: System MUST display the owner's public contact points in the footer, including an
  action to write to the owner, and alongside the owner's photo in the header block.
- **FR-017**: System MUST publish the owner's email address as a working contact route without the
  visitor needing any other feature to be present.

**Presentation & access**
- **FR-018**: System MUST present all content legibly from a 320px-wide viewport up to a wide
  desktop, without horizontal scrolling and without hiding content from narrow viewports.
- **FR-019**: Users MUST be able to reach and operate every interactive control by keyboard alone,
  with a visible focus indicator.
- **FR-020**: System MUST announce the state of expandable and selectable controls to assistive
  technology.
- **FR-021**: System MUST meet WCAG 2.1 AA contrast in both themes.
- **FR-022**: WHEN a visitor has requested reduced motion, the system SHALL suppress non-essential
  animation.
- **FR-023**: System MUST reserve space for images so that content does not shift as they load.
- **FR-025**: IF the visitor's browser has JavaScript disabled, the system SHALL display a message
  stating that the site needs JavaScript, in the language of the current address, styled to match the
  site rather than appearing as an unstyled browser default.

**Findability**
- **FR-024**: System MUST provide per-language page titles and descriptions, and declare the
  relationship between language versions, so the two do not compete as duplicates in search results.

### Key Entities

- **Owner Profile**: the subject of the site. Name, role/headline, photo, self-description, and
  public contact points. Every contact point held is intended for publication — there is no private
  tier. Exactly one profile exists.
- **Experience Entry**: one position or engagement. Organisation, role, start and end period (end
  may be absent, meaning current), and a description. Ordered relative to other entries.
- **Project**: one piece of work worth showing. Title, summary, the role the owner played, one or
  more images, and links to the live site or repository where they exist.
- **Locale**: a supported language. The set is closed and known at build time; every translatable
  field carries a value for each member.
- **Theme Preference**: the visitor's resolved light/dark choice — either explicitly set or inherited
  from the operating system.

## Success Criteria *(mandatory)*

- **SC-001**: A first-time visitor on a phone can identify who the owner is and what they do within
  10 seconds of the page becoming interactive.
- **SC-002**: 100% of visible strings change language when the language is switched — zero remain in
  the previous language.
- **SC-003**: Zero incorrectly-themed frames are rendered on load, measured on a cold cache in both
  OS theme settings.
- **SC-004**: Every interactive control is reachable and operable by keyboard, verified against the
  full home page.
- **SC-005**: All text/background pairs pass WCAG 2.1 AA in both themes.
- **SC-006**: No layout shift attributable to image or font loading.
- **SC-007**: Adding a third language later requires changes to content and translation data only —
  no change to page or component structure.

## Assumptions

- Exactly one owner. No accounts, no login. Language lives in the address, so the theme choice is
  the only per-visitor state the site stores.
- Once a visitor picks a theme explicitly, there is no way back to following the operating system
  short of clearing site data. Accepted: a third button to return to a state the visitor already had
  by default is clutter for the one case in a hundred that wants it.
- JavaScript is a hard requirement; no no-JS fallback path is built. Because pages are rendered on
  the server, text and images still appear without JavaScript — what breaks is every interaction:
  expanding entries, switching language, switching theme. Rather than leave that looking like a
  broken site, FR-025 states the condition plainly (see also `clarifications.md` #2).
- The footer's "write to the owner" action opens the visitor's own mail client. Routing it through
  an on-site form is the contact-form feature's decision, not this one's.
- Visitor-controlled showing and hiding of blocks is a separate, later feature; this feature renders
  every section unconditionally. See `.kiro/TODO.md`.
- Content is edited as source and released through the normal deploy; there is no admin UI, and
  non-technical editing is not a goal.
- Out of scope for this feature, each depending on the content model this feature establishes:
  PDF export, contact form, AI assistant.
- Ukrainian and English ship together; further languages are the owner's own later work (FR-005
  fixes the current set at two).
- Interface strings and owner content are separate bodies of text with separate lifetimes.
- No analytics, tracking, or consent banner is introduced by this feature.
