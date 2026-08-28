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
- ~~**FR-221**~~: *Withdrawn 2026-08-23.* Experience carried a line saying the product code is
  private and pointing at LinkedIn references. On paper it was a paragraph of apology above the
  record itself, and the LinkedIn address is already in the intro contacts. A CV that lists no
  repositories does not need to explain the absence.
- **FR-222**: The record MUST show the owner working directly with EU and US clients and owning the
  logic end to end - the contractor's differentiator, which a stack list cannot carry.
- **FR-202**: Every block MUST render in both locales with no untranslated string and no key present
  in one locale but missing in the other.
- **FR-203**: Structural facts (companies, dates, technology names, URLs) MUST live in `content/`;
  all prose MUST live in `messages/<locale>/<block>.json`.
- **FR-204**: Contact details and links MUST be plain constants in `content/`, not environment
  variables. Every one of them is printed on the published page, so `NEXT_PUBLIC_*` bought no
  secrecy and cost a silent failure: a name typed wrong reads as empty and the link disappears with
  the build still green. A link the owner has not supplied yet is written as `""` and its control
  is not rendered.
- **FR-225**: The owner's name MUST exist once per locale (`common.name`) and be interpolated
  wherever it appears - it is locale-dependent prose, so env cannot hold it without a variable per
  locale.
- **FR-205**: WHERE sources disagree, the more recent record wins and the discrepancy is recorded
  rather than silently resolved.

**Display**
- **FR-206**: Experience MUST render as an accordion, one entry per position, the newest open by
  default. Which entries are open MUST survive a reload and a shared link, and MUST be reachable in
  one action for all of them at once (Expand / Collapse).
- **FR-241**: The PDF MUST print an entry the way the screen shows it: an open role prints its
  fields, a closed one prints its header and the stack preview only. The sheet a visitor exports is
  the document they were looking at, so the length of the CV is theirs to choose.
- **FR-232**: Every experience entry MUST carry a **result** - one line naming what the role
  produced, distinct from the responsibilities that describe what it involved. It renders directly
  under the project, is set in the text weight the surrounding fields are not, and is its own
  switchable part (`experience.result`, code `eo`, on by default). A reader who skims one line per
  role must read an outcome, not a job description.
- **FR-233**: A result MUST NOT state a figure the record cannot support. An unverifiable metric on
  a CV is a liability at the first interview; the honest form is the scope that was owned.
- **FR-229**: A record list sliced for a Recent view MUST be sorted before it is sliced - an
  unsorted slice silently hides the newer entry and shows an older one.
- **FR-228**: Experience and Education MUST show only the recent entries by default, with the
  earlier ones behind a Recent/All toggle - a reader spends their attention on the last few roles,
  and the older ones are context, not the pitch.
- **FR-229**: The page preview MUST render in the printed typography and spacing, not merely the
  printed geometry: a ruler drawn over screen-sized type predicts a cut that will not happen there.
- **FR-230**: Page breaks MUST be forbidden inside a record (a job, a degree, a credential, a field
  row) and permitted everywhere else. A section that refuses to break is what leaves half a page
  empty; a record split across the fold is what costs the reader the context.
- **FR-207**: Skills MUST be grouped and ordered current-first, split into a **core** set shown by
  default and the rest behind the Core/Full switch. Revised 2026-08-27: superseded technologies no
  longer get their own group, they are dropped - a list of what the owner no longer uses is not an
  argument, and the groups that only named a library (UI kits, form and styling libraries, test
  runners) went with it. Testing tools moved into Tooling. The split is per entry as well as per
  group: every group carries a core list plus an optional `more` list that appears only under Full,
  so the default view stays a senior-level shortlist instead of a catalogue.
- **FR-234**: The **last** group, outside the core set, MUST name the libraries that are actually
  unusual in the record, read from the real projects rather than guessed: the CodeMirror/Lezer/
  Chevrotain stack behind the low-code editor and its language, both rich-text editors, the chart
  and virtualisation layer, and the animation and functional helpers behind the older work. A stack
  list every candidate can write is not what a reader is scanning for. It is last because it is evidence for the
  groups above it, not a headline of its own.
- **FR-237**: A skill entry MUST NOT carry a version number or a parenthesised sub-list. "CodeMirror
  6" and "JavaScript (ES6+)" date the document and say nothing a reader needs; the library name is
  the fact. A parenthesised depth marker is the one exception, and only where the depth is the point:
  `AWS (basics)` says what a bare `AWS` would overclaim.
- **FR-238**: A tool MUST NOT be listed unless it was actually worked with. Corrected 2026-08-27:
  `AWS (Lambda, S3, EC2)` claimed two services neither project uses - only `@aws-sdk/client-s3` and
  `client-sts` appear - and omitted Jenkins, which was. EKS, Helm and Kubernetes were considered and
  rejected: the owner has not worked with them. Revised 2026-08-27: reads `AWS (basics)` - naming one
  service implied more focus on it than the work carried, and the depth is part of the claim.
- **FR-235**: ~~Backend MUST name the warehouse connectors and the enterprise SSO.~~ Withdrawn
  2026-08-27 by the owner: Snowflake, BigQuery, SAP HANA and SAML / Azure AD / LDAP are out of the
  list entirely, along with Accessibility (WCAG), i18n, Tool calling, Streaming responses, SWR,
  class-validator, Vitest, Mapbox GL, Mux and Orama. The record of that work stays in the experience
  entries, where it sits next to the project it belongs to.
- **FR-239**: Vue and PHP MUST NOT appear anywhere in the CV, skills and experience stacks alike. The
  owner is not applying for that work, and a stack he will not take is a lead he has to decline. The
  Adraba and MacKiev entries name what the work shared with the rest of the record - JavaScript,
  SCSS, jQuery - so the roles stay checkable without advertising the framework.
- **FR-240**: The skill list MUST be read back against the owner's LinkedIn endorsements before it is
  called done, so a technology he was endorsed for is either in the list or deliberately out. Added
  2026-08-27 from that pass: D3.js, Figma, Scrum. Endorsed but rejected the same day as tooling the
  owner has left behind: jQuery, Handlebars, SQLite, Gulp, SVN - an endorsement is not a reason to
  carry a tool he is not hired for. Kept out:
  soft and umbrella entries (Web Development, Problem Solving, Communication, Project Management,
  Cross-browser Compatibility, Database knowledge, Development Platforms, AJAX, Microsoft Office) -
  they are claims no reader can check, and the ones worth keeping are already carried by the
  certifications and education blocks.
- **FR-236**: A skill group whose contents appear on every second CV MUST NOT exist. Withdrawn
  2026-08-27: the *Ways of working* group (Agile / Scrum, code review, Figma) said nothing the
  experience entries do not already show, and the groups that only named a UI kit, a form library or
  a test runner went with it.
- **FR-208**: Education entries MUST carry the skills they produced, toggleable as a part.
- **FR-209**: Certifications MUST show the credential source and identifier, both derived from the
  verification URL rather than typed by hand, and link to the issuer for verification. They MUST NOT
  show an issue date: only two of them carry one, so it read as missing data on the rest.
- **FR-227**: Every external URL MUST live in `content/links.ts`, grouped as certificates and
  projects, so a dead link is checkable in one pass over one file.
- **FR-210**: The results block MUST state what the owner owned end to end, not self-reported
  figures: unverifiable percentages read as inflated and are indistinguishable from every other CV.
- **FR-223**: Each result MUST carry a short claim and an expandable detail naming the mechanism,
  on the same Core/Full toggle Skills uses - the claim alone is unfalsifiable, the detail alone is
  unreadable at a glance. That detail level is About's only toggle: the results and the personal
  note are the block, not options within it.
- **FR-224**: The experience span MUST be computed from development roles only, so it cannot
  contradict the years claimed in the intro.

**Contact**
- **FR-211**: The message form MUST be hidden until asked for, and MUST open in place. Its own button is the whole
  mechanism. Contact carries no visibility toggle at all - it is screen-only, never reaches the
  PDF, and always renders.
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
- **FR-226**: The hyphen MUST be reserved for structural separators (role - company, name - gloss)
  and true parentheticals. A list takes a colon and an appositive takes a comma: a hyphen doing all
  three jobs at once flattens the prose.
- **FR-242**: Copy MUST state a fact about the work, never a general maxim about learning, effort
  or understanding. A sentence a stranger could have written about their own career carries no
  information and reads as machine-written.
- **FR-243**: Every Highlight MUST name a concrete thing - a system, a class of bug, a constraint -
  and MUST NOT restate what the same entry's Project or Result already says, in either its facts or
  its adjectives. A Highlight that paraphrases the fields above it costs a row and returns nothing.
- **FR-244**: A sentence MUST NOT assert something that is true by default of anyone in the role.
  "I read every message myself" from a one-person business, "we agree the scope before building" -
  the reader learns nothing, and the line reads as filler written to fill a slot.
- **FR-245**: Within one entry, Project, Result, Scope and Highlight MUST each carry something the
  others do not. Restating a field in different words costs a row and returns nothing; if a field
  has nothing of its own to say, it is dropped, not padded.
- **FR-246**: Visible copy MUST use ASCII punctuation only - the straight apostrophe and the straight
  double quote, never guillemets or curly pairs, in either language. Two reasons: the typographic
  glyphs are what a generated document looks like, and a visitor searching the page matches only the
  one glyph they typed.

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

- ~~Sending is by `mailto:`.~~ Superseded: the form posts to `app/api/contact` and the message is
  sent server-side. See `005-contact-delivery`.
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
| Email spelling | PDFs `lestyshchenko@` vs account `lestyschenko@` | **PDFs** — confirmed by the owner 2026-08-22: `lestyshchenko@` is the working mailbox, `lestyschenko@` is a separate one kept for AI tools and subscriptions |
| Years of experience | CVs say "9+" (written 2025) | **11+** — first professional work Apr 2015 |

Overlapping periods (BechaCant with eTeam, the Academy with freelance and MacKiev) are real and
left as they are.
