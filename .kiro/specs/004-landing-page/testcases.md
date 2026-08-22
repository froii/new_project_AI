# Test Cases: 004-landing-page

| ID | Requirement | Given | When | Then |
|---|---|---|---|---|
| TC-001 | FR-001 | a production build | pages are generated | `/en`, `/uk`, `/en/cv`, `/uk/cv` are all prerendered |
| TC-002 | FR-003 | the landing at any width | it renders | no `site-header`, no `section-menu`, no `.progress` element is in the markup |
| TC-003 | FR-004 | the landing at `/uk` | the primary action is read | its href is `/uk/cv`, not `/en/cv` |
| TC-004 | FR-005 | the CV at 360px | the header identity is read by assistive tech | it is a link to `/{locale}` with the accessible name from `common.home` |
| TC-005 | FR-006 | the landing footer | it renders | one working link per entry in `owner.contacts`, plus the three messengers built from the phone |
| TC-006 | FR-007 | `/uk/cv` | the head is read | canonical is `/uk/cv` and the alternates point at `/{locale}/cv` |
| TC-007 | FR-009 | `messages/uk` | it is type-checked | `satisfies Messages` holds, i.e. `landing.json` is complete in both locales |
| TC-008 | SC-004 | the landing in English | the footer language control is used | every visible string is Ukrainian and the route is still the landing |
| TC-009 | FR-010 | the landing footer | it renders | the contact band is identical to the CV's: address, outline toggle, messengers, form |
| TC-012 | FR-004, FR-012 | the landing, form closed | the intro write action is used | the form opens, the name field has focus, the page is scrolled to its end and the whole form is visible |
| TC-013 | FR-012 | the landing, form already open, page scrolled back up | the intro write action is used | the page scrolls to its end again and the name field takes focus |
| TC-014 | FR-012 | reduced motion is requested | the intro write action is used | the page jumps to the end without an animated scroll |
| TC-010 | FR-011, mobile | a 360px viewport | the intro renders | the portrait is at least 14rem wide and the two actions are the same width |
| TC-011 | SC-005 | the repository | `components/sections/contact` is searched for | one definition, imported by the CV page and the landing footer |
