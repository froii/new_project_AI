# Structure

One git repository, **one Next.js application at the repo root**. There is no separate backend
service: server work (PDF is client-side, AI and email are not) lives in Next.js route handlers.

## Layout

```
/
├── app/
│   ├── globals.css       # custom properties + layout primitives
│   ├── [locale]/         # root layout; locale is a root param, statically generated
│   └── api/contact/      # route handler: contact form → email
├── i18n/                 # config.ts, routing.ts, navigation.ts, request.ts
├── content/              # structure only: ids, dates, images, proper nouns
│   └── links.ts          # every external URL — certificates and projects
│                         # contacts are constants too: nothing here is a secret
├── components/
│   ├── ui/<name>/        # accordion, button, card, field-list, input, social-links,
│   │                     # switch, tag-list, textarea — folder per component
│   ├── controls/<name>/  # locale-switcher, photo-switcher, section-menu, share-button,
│   │                     # theme-toggle — folder per component
│   ├── sections/<name>/  # page blocks — folder per component
│   ├── landing/<name>/   # intro, highlights, footer — blocks the landing alone uses
│   ├── visibility/<name>/# part, section-slot, expandable-text — the hiding mechanics
│   ├── providers/        # client boundaries for third-party providers
│   └── pdf/              # the PDF document — a separate renderer
├── lib/
│   └── contact-message.ts # the form's rules, shared by the form and the route handler
├── messages/<locale>/    # all translatable text, one JSON file per block
├── public/fonts/
├── .claude/              # agent settings + /spec:* commands + project skills
└── .kiro/                # steering context + specs
```

No middleware: both locales are prerendered. Every page is static; `app/api/contact` is the one
dynamic route, which is why the host has to run server code.

Two levels of components, not five. `ui/` holds primitives, `sections/` composes them into page
blocks. Full atomic design was considered and dropped: at this size most of its folders would hold a
single file, and every new component would cost an "atom or molecule?" argument.

`content/` holds structure — ids, dates, links, images, proper nouns. `messages/<locale>/` holds every
translatable string, keyed by entry id, split per block. Structure is edited once; translations are
edited once per language.

The pre-Next.js `backend/` + `frontend/` split is gone — both folders were empty and are removed.

## Boundaries

The rule that keeps the product's core value true — one fact, one place:

| Layer | May depend on | Must never |
|---|---|---|
| `content/` | nothing | import React, Next, or any renderer |
| `lib/` | `content/` | import components or reach the network |
| `components/ui/` | `lib/` | know what a project or a job title is |
| `components/sections/` | `ui/`, `lib/`, `content/` | hold content or UI strings as literals |
| `components/landing/` | `sections/`, `ui/`, `controls/`, `lib/`, `content/` | restate a fact the CV already renders |
| `components/pdf/` | `lib/`, `content/` | **import from `components/ui/`** |
| `app/api/` | `lib/`, `content/` | expose a secret to the client bundle |

`components/pdf/` is barred from `ui/` by physics, not taste: `@react-pdf/renderer` renders its own
primitives (`View`, `Text`) through its own layout engine. A `div` from `ui/` does not render there
at all.

`content/` staying renderer-agnostic is what lets web, PDF and the future AI bot read it. A component
that hardcodes a job title breaks the model silently — the PDF will disagree with the page.

## Component layout

`ui/` and `controls/` use **folder per component**: `ui/switch/index.tsx` +
`ui/switch/switch.module.css`. Everything one element owns sits together, and deleting the element is
deleting one folder. Import paths stay short — `@/components/ui/switch`.

`sections/` stays flat. A section is used once, on one page; it is page composition, not a library,
and a folder holding a single file is filing for its own sake.

A `ui/` primitive must not know what it is used for. Where a caller needs to influence appearance, the
primitive exposes a **CSS custom property** and accepts a `className` — never a purpose-named prop.
`ui/switch` publishes `--switch-knob-offset` and `--switch-track-bg` for exactly this reason.

A control is not automatically a styled primitive. `controls/theme-toggle` is its own button, not a
`ui/switch` in disguise: switching theme is one action, not a bound on/off value, and forcing it into
a checkbox raises the unanswerable question of what "checked" means.

## Naming

- Files and folders `kebab-case`; React components `PascalCase`; types `PascalCase`.
- Each component folder exposes `index.tsx`; its styles are `<name>.module.css`, not `styles.module.css`.
- Route handlers live at `app/api/<thing>/route.ts`.
- Content entries are typed exports, not loose JSON blobs — the type is the schema.
