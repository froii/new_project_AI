# Product

A personal business-card site (сайт-візитка) for a single owner: who they are, what they have built,
how to reach them.

## Who it serves

| Audience | What they came for |
|---|---|
| Recruiters / clients | Skim credibility fast, leave with a CV file |
| Peers | Look at specific projects |
| Owner | Publish once, hand out one link instead of a file |

## Core value

One typed content model is the single source of truth. The site, the PDF and (later) the AI bot are
three renderers over the same data — a fact is edited in one place and is instantly correct in all
three. No copy of the CV drifts out of sync with the site.

## In scope

- Responsive presentation of profile, experience and projects.
- Multiple interface languages, switchable by the visitor. Ships with two; adding a third is a
  content change, not a code change.
- Light and dark theme, following the OS preference by default and overridable by the visitor.
- On-demand PDF export: the visitor selects which sections/projects to include and downloads a CV
  assembled from site data.
- A contact form that mails the owner.
- Later: an AI assistant answering questions about the owner, grounded in the same content model.

## Out of scope

- Multi-user accounts, auth, roles. Exactly one owner, no login.
- A CMS or admin UI. Content is edited as typed source and shipped via git.
- Blog / comments / analytics dashboards.
- Newsletter: subscriber lists and broadcasts. Contact form only (see `tech.md` §Email).
- Pixel-perfect PDF snapshots of the rendered page (rejected — see `tech.md` §PDF).
