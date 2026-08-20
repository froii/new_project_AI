# Implementation Plan: 002-section-selection

## Summary

A contents panel that is both an anchor menu and the selection surface: each row is a real anchor
link plus a `ui/switch`. From 80rem it is a sticky sidebar beside the document; below that width it
collapses to a disclosure under the header, driven by the same trigger. Sections stay server-rendered at all times; the switch toggles the `hidden`
attribute on a client wrapper. The active section is tracked with `IntersectionObserver` and reported
as `aria-current="location"`.

## Technical Context

- **Dependencies**: none added. `ui/switch`, built earlier with no consumer, is the consumer here.
- **Storage**: none. Selection is React state for the session.
- **Testing**: `tsc --noEmit`; the observable behaviour is DOM state (`hidden`, `aria-current`,
  `aria-expanded`), so tests would assert those.

## Constitution Check

- [x] `structure.md` — folder-per-component under `controls/`; `content/sections.ts` holds structure
      only; labels live in `messages/<locale>/sections.json`.
- [x] `tech.md` §Selection — one selection state, read by the page today and by the PDF later.
- [x] `preferences.md` — no new dependency, no persistence nobody asked for, no reordering.

**Violations**: none.

## Design

### Data model

`content/sections.ts` is the ordered list and the source of the id union:

```ts
export const sectionIds = ["hero", "about", "experience", "projects"] as const;
export type SectionId = (typeof sectionIds)[number];
```

Everything else is derived from it: the page's render order, the menu rows, the observer targets, and
`Record<SectionId, boolean>` for visibility. Adding a section is one entry here, one component in the
page map, and one label per locale — the menu and the observer need no change.

### Components

| Module | Role |
|---|---|
| `providers/sections-provider` | context: `visible: Record<ToggleId, boolean>`, `toggle(id)`, `apply(next)` |
| `sections/section-slot` | client wrapper hiding a whole section |
| `sections/part` | client wrapper hiding one part of a section |
| `visibility/part-toggle` | in-section segmented switch for one part |
| `sections/expandable-text` | clamps prose to three lines unless its toggle is on |
| `controls/section-menu` | trigger + panel; section rows, nested part rows |
| `controls/section-menu/use-active-section` | `IntersectionObserver` → active id |

**A part can be switched from inside its own section.** Skills carries a Core / Full segmented
control; it writes to `skills.full` through the same `toggle()` as the menu row, so there is one
state, one URL encoding and one thing the PDF reads. A local `useState` in the section would have
been fewer lines and a second source of truth — the menu would then disagree with the page.

**Short text is a clamp, not a second string.** `expandable-text` applies `line-clamp: 3`; the full
text is always in the DOM. Writing an abridged variant per locale would double the translation work
and guarantee the two drift.

**Part switches are the same `ui/switch`, shrunk by CSS.** The primitive publishes
`--switch-width` / `--switch-height` / `--switch-knob-size`, and the menu sets smaller values for
nested rows. No `size` prop — consistent with the `structure.md` rule that primitives expose custom
properties instead of purpose-named props.

**The portrait is a `controls/photo-switcher`**: one large image plus thumbnails, built on a native
`<fieldset>` of visually hidden radios with the thumbnails as their labels. Radios give arrow-key
navigation and the roving focus of a radio group for free — a set of `<button role="radio">` would
mean reimplementing both.

Its selection is local component state, not part of the toggle registry: nothing outside the intro
reads it today. If the PDF later needs to export the chosen portrait, it moves into the provider.

Photos are referenced by path with explicit `width`/`height` rather than static imports, so the owner
can drop files into `public/photos/` without touching a component. The declared dimensions are what
prevent layout shift (FR-023 in 001). Plain `<img>` for now because the placeholders are SVG, which
`next/image` refuses without `dangerouslyAllowSVG` — switch to `next/image` when real raster
portraits land.

**Hiding the photo collapses the intro to one column** via `.layout:has(> [hidden])`, overriding the
container query. Without it the text would stay in the narrow first column with an empty gap beside
it.

### Presets

Four named selections live beside the toggles in `content/sections.ts` as override maps over
`defaultVisibility` — Europe, US/ATS, one-pager, everything. They are structure only, no prose: the
labels come from `messages/*/sections.json`.

```ts
export const presets = { eu: { "experience.interest": true, ... } } as const
  satisfies Record<PresetId, Partial<Record<ToggleId, boolean>>>;
```

`lib/section-visibility` turns one into a full `Visibility` (`presetVisibility`) and answers which
preset the current selection equals (`matchPreset`, `null` when it matches none). That is what drives
`aria-pressed` on the preset buttons — a preset is a shortcut, not a mode: touching any switch after
applying one simply stops matching, and nothing has to be un-set.

Applying a preset replaces the whole map at once, so the provider needed `apply(next)` next to
`toggle(id)`; Reset is `apply({ ...defaultVisibility })` rather than a third method. The URL encoding
is unchanged — it already serialises deltas from the defaults, so a preset round-trips as the deltas
it happens to produce, with no preset id in the query.

### Why hide rather than not render

The sections are Server Components holding the translated content. Conditionally rendering them from
client state would mean either moving them to the client or dropping them from the server HTML.
Dropping them would take the content out of the page a crawler sees, and FR-109 exists because this
site's whole purpose is being found.

So every section is always rendered and the wrapper carries `hidden`. `hidden` — not
`visibility`/opacity — because it removes the element from the accessibility tree as well as from
layout (FR-104). A visually hidden section that a screen reader still reads is not hidden.

Consequence for the divider rule: `.section + .section` no longer works, since sections are now
nested in slots. It became:

```css
.section-slot:not([hidden]) ~ .section-slot:not([hidden]) .section {
  border-block-start: var(--border-width) solid var(--color-border);
}
```

`:not([hidden])` on both sides is what stops a stray divider appearing where a hidden section used to
be (FR-104 scenario 4).

### The guard that makes `hidden` trustworthy

`[hidden]` is a **UA** rule. Any author rule that sets `display` on the same element beats it,
whatever the specificity. This is not theoretical: `field-list`'s `.list > * { display: grid }`
silently resurrected every hidden experience field — visible on screen, absent from the accessibility
tree, which is the worst possible split of the two.

`globals.css` therefore carries one guard:

```css
[hidden] {
  display: none !important;
}
```

That `!important` is deliberate and is the only one in the codebase. Without it every container that
styles its children must remember not to break hiding, and one day one of them will not.

### Toggles: sections and parts, one flat registry

`content/sections.ts` declares the order, the parts, the URL codes and the defaults. Everything else
is derived:

```ts
export const sectionParts = { hero: ["photo"], about: ["full"] } as const satisfies
  Record<SectionId, readonly string[]>;
export type PartId = { [S in SectionId]: `${S}.${(typeof sectionParts)[S][number]}` }[SectionId];
export type ToggleId = SectionId | PartId;
```

The mapped type is what keeps `hero.photo` valid and `about.techStack` a type error. A plain
`${SectionId}.${string}` would accept any pairing.

That correlation is lost the moment a template literal is built inside a loop over
`sectionParts[id]` — TypeScript widens across all sections. `partsOf(section)` exists to return
`PartId[]` with the pairing intact; the menu iterates that, not the raw string list.

### Selection in the address

Encoded as the set of toggles **differing from their default**, not the set that is on:
`?x=af.et`. Defaults ⇒ no parameter at all (FR-120), so an ordinary shared link is clean even though
some parts (full text, "also worked with", "what was interesting") start off.

Codes are declared explicitly rather than derived from the name, so a collision is a compile error:

```ts
export const toggleCodes = { hero: "h", "hero.photo": "hp" } as const satisfies
  Record<ToggleId, string>;
```

A collapsed panel carries `inert`, not merely zero height. Collapsing with
`grid-template-rows: 0fr` leaves the form tabbable and submittable while `aria-expanded="false"`
claims it is closed — Tab lands in an invisible field and Enter sends the message.

The locale switcher builds its href from the **current selection**, not from `usePathname()` alone:
that returns the path without the query, so switching language would silently reset every toggle
(FR-111). It encodes `visible` directly, so the link always matches what is on screen.

Written with `history.replaceState`, never `pushState` — toggling is not navigation, and Back must
leave the page rather than walk back through switch flips (FR-113).

The URL is written from an effect on `visible`, gated by a `readFromUrl` flag. Writing it inside the
state updater would have been shorter, but updaters must stay pure — React can call them twice, and
under StrictMode it does.

### Sticky header vs anchors

The header is `position: sticky`, so a plain anchor jump lands with the section heading underneath
it. Fixed by `scroll-margin-block-start: calc(var(--header-height) + var(--space-m))` on `.section`.

That only works if the header's height is knowable, so the header is a fixed `--header-height` and
its contents never wrap — the owner's name truncates with an ellipsis and, below 40rem, the name and
the share label drop out entirely. A wrapping header would make the offset a guess.

### Active section

`IntersectionObserver` with `rootMargin: "-20% 0px -70% 0px"` — a band across the upper third of the
viewport. Entries intersecting that band are sorted by position and the topmost wins, so scrolling
past a boundary changes the answer once, not twice.

Rejected: the CSS-only `:target-current` approach. It is genuinely simpler, but not Baseline yet, so
it would need the observer as a fallback anyway — two implementations for one behaviour.

The active id drives `aria-current="location"` on the row and the trigger's label, and is shown by a
filled dot plus bold weight, never colour alone (FR-105).

### Panel behaviour

Trigger carries `aria-expanded` and `aria-controls`; the panel is a plain element with `data-open`,
not `hidden` — the sidebar layout has to override the collapsed state by media query, and the global
`[hidden] { display: none !important }` cannot be overridden. Escape closes and returns focus to the
trigger; a `pointerdown` outside closes without moving focus. Both listeners only bind while the
panel is collapsed, so the sidebar does not close itself when the visitor clicks the document.

Part rows sit behind a per-section disclosure. Showing all 13 of them at once made the panel taller
than a laptop viewport; one section is expanded at a time, and the panel scrolls inside a
`max-height` bounded by the viewport minus the header.
Anchors for a section that is switched off carry `aria-disabled` and their click is prevented — the
row stays readable and the state stays visible, rather than the row vanishing under the cursor.

**Below 80rem the same panel is a bottom sheet.** One DOM tree, two layouts: the trigger becomes a
fixed pill at the bottom of the viewport (thumb reach, and it carries the active section label as a
"where am I" cue), the panel becomes a `position: fixed` sheet capped at 80dvh, and a scrim closes it
on tap. `touch-action: none` on the scrim is what stops the page scrolling behind it — cheaper and
less breakable than locking `document.body`. The sheet reserves room for the pill in its own bottom
padding so the two never overlap, and the footer gets the same clearance so the end of the page stays
reachable at full scroll.

**The list comes first and the list is the panel.** Everything that is not a section row was pushed
below it: presets are small chips and the count sits beside Reset, both in a `tools` strip pinned to
the bottom edge. The panel carries no visible heading, kicker or hint — the aside is named for
assistive technology with `aria-label` instead, and the three lines of prose that explained the
switches were paying rent on the most valuable column of the layout. Preset notes moved into
`title`; the label alone already says which convention it is.

Rows grow to 44px on a phone and the switches scale with them via their custom properties — no size
prop. The active row is marked by an accent bar via `.row:has(.link[aria-current])`, so the panel
answers "where am I" without a second mechanism.

On a desktop the column runs the full height of the page: `.root` stretches with the grid row so its
background and border reach the footer, and the panel inside is `position: sticky` at
`calc(100dvh - header)` with the list scrolling inside it. Capping the aside itself — the earlier
shape — left bare canvas below the fold.

The grip drags: pointer capture on the handle, the sheet follows the finger, past 80px it closes and
otherwise snaps back. A grip that cannot be dragged promises an affordance the sheet does not have,
and on a phone that is the first thing a thumb tries.

## Risks & open points

| Risk | Consequence | Handling |
|---|---|---|
| All sections switched off | Page looks broken | Accepted — deliberate act, reversible from the same menu |
| Observer never fires when every section is hidden | Trigger falls back to the generic label | Intended: `active` is `null`, the trigger shows "Sections" |
| Selection is session-only | Reload restores everything | Intended (Assumptions). Revisit only if the PDF flow needs to survive a reload |
