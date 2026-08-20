# Feature Specification: CV Content, Contact & Header Links

**Slug**: 003-cv-content
**Created**: 2026-08-18
**Status**: Implemented (records what was built from the owner's CVs and LinkedIn record)
**Input**: Three CV PDFs + LinkedIn experience, education, skills and certification lists

## Requirements

**Content**
- **FR-201**: System MUST present the owner's real career record: summary, personal note, skills,
  experience, education and certifications.
- **FR-220**: The intro MUST state the engagement model and availability, not only the location:
  contract shape and work eligibility are what a remote hire is screened on first.
- **FR-221**: Experience MUST say that the product code is private and point to the LinkedIn
  references instead, rather than leaving the missing code links unexplained.
- **FR-222**: The record MUST show the owner working directly with EU and US clients and owning the
  logic end to end - the contractor's differentiator, which a stack list cannot carry.
- **FR-202**: Every block MUST render in both locales with no untranslated string and no key present
  in one locale but missing in the other.
- **FR-203**: Structural facts (companies, dates, technology names, URLs) MUST live in `content/`;
  all prose MUST live in `messages/<locale>/<block>.json`.
- **FR-204**: Contact details MUST come from environment variables, not from committed source.
- **FR-205**: WHERE sources disagree, the more recent record wins and the discrepancy is recorded
  rather than silently resolved.

**Display**
- **FR-206**: Experience MUST render as an accordion, one entry per position, first open.
- **FR-207**: Skills MUST be grouped, each group collapsible, ordered current-first with superseded
  technologies in their own group so they do not read as the present stack.
- **FR-208**: Education entries MUST carry the skills they produced, toggleable as a part.
- **FR-209**: Certifications MUST show the credential source and identifier, both derived from the
  verification URL rather than typed by hand, and link to the issuer for verification.
- **FR-210**: The results block MUST state what the owner owned end to end, not self-reported
  figures: unverifiable percentages read as inflated and are indistinguishable from every other CV.

**Contact**
- **FR-211**: The message form MUST be hidden until asked for, and MUST open in place.
- **FR-212**: The owner's email MUST be visible as text next to the reveal control, and MUST be a
  working link without opening the form.
- **FR-213**: The form MUST collect name, email and message; a phone number MAY be given.
- **FR-214**: WHERE a phone number is published, the system SHALL offer WhatsApp, Viber and Telegram
  links to it.
- **FR-215**: The form MUST report which field is wrong, both visually and to assistive technology.

**Header**
- **FR-216**: The header MUST carry icon links to email, WhatsApp and LinkedIn beside the owner's
  name, each with an accessible name.
- **FR-217**: WHERE header space runs short, the name gives way before the links do - the links are
  what visitors act on.

**Copy style**
- **FR-219**: Visible copy MUST use a plain hyphen for asides and ranges, never an em or en dash:
  the long dash reads as machine-written and is the first thing a recruiter notices.

**Access**
- **FR-218**: A skip link MUST be the first focusable element, so a keyboard visitor can reach the
  content without traversing the header on every page load.

## Success Criteria

- **SC-201**: A visitor can read the whole career record without opening anything, except the parts
  deliberately collapsed.
- **SC-202**: Adding a job is one entry in `content/index.ts` plus one block per locale — no
  component changes.
- **SC-203**: Adding a certification is one URL — the source and identifier follow from it.
- **SC-204**: Removing the env file breaks no build; contacts simply do not render.
- **SC-205**: Locale files hold identical key sets, verified mechanically.

## Assumptions

- Sending is by `mailto:` — the form composes the message and hands it to the visitor's mail client.
  A server-side provider replaces this later (`tech.md` §Email).
- `NEXT_PUBLIC_*` keeps contact details out of the repository. It does **not** hide them: they are
  printed on the page.
- The personal note is written through events rather than adjectives: no self-описи like "calm" or
  "logical", only what happened and what it taught. Adjectives in a CV carry no information because
  everyone writes the same ones.
- The `projects` section was dropped — no source carries a project list separate from work history.

## Source discrepancies (resolved, kept on record)

| Fact | Sources disagree | Taken |
|---|---|---|
| eTeam start | ATS CV "May 2021" vs detailed CV `05.01.2021` vs LinkedIn "Jan 2021" | **Jan 2021** — the ATS CV misread its own day-first date |
| Adraba end | CV "07.08.2018" vs LinkedIn "Jul 2018" | **Jul 2018** |
| Software MacKiev | CV "Oct 2016 – Dec 2017" vs LinkedIn "Sep 2016 – Jan 2018" | **LinkedIn** |
| Freelance end | CV "Sept 2016" vs LinkedIn "Oct 2016" | **Oct 2016** |
| LinkedIn handle | PDFs `oleksa-tyshchenko-90a050a8` vs owner `oleksa-t-90a050a8` | **owner's** |
| Email spelling | PDFs `lestyshchenko@` vs account `lestyschenko@` | **PDFs** — unverified, see `TODO.md` |
| Years of experience | CVs say "9+" (written 2025) | **11+** — first professional work Apr 2015 |

Overlapping periods (BechaCant with eTeam, the Academy with freelance and MacKiev) are real and
left as they are.
