# Feature Specification: Section Selection & Anchor Menu

**Slug**: 002-section-selection
**Created**: 2026-08-17
**Status**: Draft (implemented ahead of the spec; this records what was built)
**Input**: "в хедері треба блок який буде працювати як меню якорь яке скролить до блока, але яке буде
також мати switcher — який буде вмикати і вимикати відображення цього блоку"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — A visitor jumps to the part they care about (Priority: P1)

A recruiter opens the site, sees a contents panel naming the section they are currently in, and picks
"Experience". The page scrolls there; on a narrow screen the panel closes behind it.

- **Why this priority**: Navigation is the control's primary job; selection rides on top of it.
- **Independent Test**: Open the menu, click a section, confirm the page scrolls to it and the panel
  closes.
- **Acceptance Scenarios**:
  1. **Given** the panel is open, **When** the visitor activates a section link, **Then** the page
     scrolls to that section, and below 80rem the panel closes.
  2. **Given** the visitor scrolls the page manually, **Then** the control names the section
     currently in view.
  3. **Given** a keyboard user, **When** they press Escape with the panel open, **Then** it closes
     and focus returns to the trigger.

### User Story 2 — A visitor removes what they do not want (Priority: P1)

The visitor turns off "Work". That section disappears from the page, and its menu row shows as off.

- **Why this priority**: This is the mechanism the PDF export will reuse (`tech.md` §Selection).
- **Independent Test**: Turn a section off; confirm it leaves the page and its anchor stops working.
- **Acceptance Scenarios**:
  1. **Given** all sections shown, **When** the visitor turns one off, **Then** it is removed from
     the page and from assistive technology, not merely made invisible.
  2. **Given** a section is off, **When** the visitor activates its anchor, **Then** nothing scrolls.
  3. **Given** sections are turned off, **Then** the control reports how many of the total remain.
  4. **Given** the visitor picks a preset, **Then** the whole selection is replaced in one action and
     that preset reads as the active one.
  5. **Given** any combination of sections is off, **Then** no stray divider or gap is left where a
     hidden section was.

### Edge Cases

- Every section turned off → the page is empty apart from header and footer. Allowed; the visitor
  did it deliberately and can turn them back on.
- A section is turned off while the visitor is scrolled to it → the browser keeps a sensible scroll
  position; nothing scrolls on its own.
- Reduced motion → anchor navigation jumps rather than smooth-scrolls.

## Requirements *(mandatory)*

- **FR-101**: System MUST present, in the header, a control listing every section of the page.
- **FR-102**: Each listed section MUST be a real link to that section's anchor, so it works without
  client-side routing.
- **FR-103**: Users MUST be able to turn each section's display on and off from that same list.
- **FR-104**: WHEN a section is turned off, the system SHALL remove it from the page and from the
  accessibility tree.
- **FR-105**: System MUST indicate which section is currently in view, by a means that is not colour
  alone.
- **FR-106**: System MUST report how many sections are shown out of the total.
- **FR-107**: WHEN the panel is open and the visitor presses Escape or activates anything outside it,
  the system SHALL close the panel; on Escape, focus SHALL return to the trigger.
- **FR-108**: System MUST expose the panel's open state and the element it controls to assistive
  technology.
- **FR-109**: System MUST keep every section in the server-rendered HTML regardless of selection, so
  that search engines index the whole page.
- **FR-110**: The selection state MUST be readable by other consumers of the content model — the PDF
  export reads exactly this state (`steering/tech.md` §Selection).
- **FR-111**: System MUST encode the selection in the page address, so a copied link reproduces the
  same set of sections for whoever opens it.
- **FR-112**: WHEN every section is shown, the system SHALL leave the address clean — no parameter.
- **FR-113**: Changing the selection MUST NOT add browser history entries; Back must return to the
  previous page, not step through toggles.
- **FR-114**: System MUST offer a visible share action that hands the current address to the device's
  share sheet, falling back to copying it to the clipboard.
- **FR-115**: WHEN an anchor is followed, the target section's heading MUST NOT be obscured by the
  sticky header.
- **FR-116**: System MUST allow parts of a section to be turned off independently of the section
  itself — the photo in the intro, and each field of an experience entry.
- **FR-117**: Part controls MUST appear nested under their section in the menu, and MUST NOT offer
  navigation — a part has no anchor of its own.
- **FR-118**: WHEN a section is off, its parts MUST NOT be listed — there is nothing to configure in
  a section that is not shown.
- **FR-119**: System MUST let a long prose block be shown shortened or in full, without maintaining a
  separate shortened copy of the text.
- **FR-120**: The address MUST encode only what differs from the default state, so that a link to the
  site as intended carries no parameter at all.
- **FR-121**: System MUST offer named presets that set the whole selection in one action, covering the
  common CV conventions (Europe, US/ATS, one-pager, everything), plus a reset to the default state.
- **FR-122**: The control MUST indicate which preset, if any, the current selection equals; changing
  any single toggle afterwards SHALL simply stop matching, without discarding the selection.
- **FR-124**: The visitor MUST be able to produce a PDF of the current selection from the same
  control that holds the selection, and MUST be able to see on the page where the sheet boundaries
  fall before doing so.
- **FR-123**: A section MAY offer its own switch for one of its parts, in place, so the visitor can
  change what that section shows without opening the menu. Both surfaces MUST drive the same state:
  whatever is switched in the section is reflected in the menu, in the address and in the PDF.

## Key Entities

- **Section**: an identified block of the page. Has a stable id, a position in a fixed order, a
  translated label, an ordered list of parts, and a shown/hidden state.
- **Part**: a named piece of a section that can be turned off on its own. Has no anchor.
- **Toggle**: a section or a part — anything with an on/off state, a short URL code, and a default.
- **Experience Entry**: one position. Company, role, period, project, responsibilities, tech stack,
  other technologies used, link, and what was interesting about it. Each of the last six is a part
  and can be turned off across all entries at once.

## Success Criteria

- **SC-101**: A visitor can reach any section in at most two interactions from anywhere on the page.
- **SC-102**: Turning a section off removes it from the accessibility tree, verified with a screen
  reader or the accessibility inspector.
- **SC-103**: The server-rendered HTML contains all sections at all times.
- **SC-104**: Panel and rows are fully operable by keyboard, with focus never lost.

## Assumptions

- Selection lives in the address, not in storage — the same choice as language (001, FR-009). A
  reload reproduces what the address says; nothing is remembered behind the visitor's back.
- A shared link applies its selection after hydration, so the recipient may see the full page for a
  moment before the hidden sections disappear. Accepted: reading the parameter on the server would
  make the page dynamic and give up static generation (FR-109 keeps all sections in the HTML anyway).
- The section list is fixed in code (`content/sections.ts`). Visitors reorder nothing.
- The footer and header are not sections and cannot be turned off.
- The PDF export is not part of this feature; FR-110 only requires the state be readable when it
  arrives.

- **FR-230**: The panel MUST state, in one line beside the presets, that switching a part off
  also removes it from the shared link and the PDF - the reach of the control is the one thing a
  visitor cannot infer from the switches themselves.
- **FR-231**: A preset note MUST describe what the preset actually does. A note that outlives the
  toggle it described is worse than no note.
