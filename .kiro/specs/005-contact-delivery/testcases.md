# Test Cases: 005-contact-delivery

| ID | Requirement | Given | When | Then |
|---|---|---|---|---|
| TC-001 | FR-001, FR-002 | credentials set | a valid draft is posted | `200`, mail in the owner's inbox, `Reply-To` is the visitor |
| TC-002 | FR-002 | two drafts, one with a phone | the mails are read | same From and subject on both; each body opens with `Name:` / `Email:` and, where given, `Phone:` |
| TC-003 | FR-004 | a draft with an empty name, a bad address and a 2-character message | it is posted | `400` and `invalid: ["name","email","message"]` |
| TC-004 | FR-004 | a message of 5001 characters | it is posted | `400`, `invalid: ["message"]` |
| TC-005 | FR-004 | a body that is not JSON | it is posted | `400` |
| TC-006 | FR-006 | five requests already made in the window | the sixth arrives | `429`, nothing sent |
| TC-007 | FR-007 | `company` carries a value | it is posted | `200`, nothing sent |
| TC-008 | FR-008 | a name containing `\r\nBcc:` | the mail is built | the header holds one line |
| TC-009 | FR-010 | no credentials in the environment | a valid draft is posted | `503`, and the form shows the failure and the address |
| TC-010 | FR-009 | a request in flight | the visitor presses send again | the button is disabled, no second request |
| TC-011 | SC-003 | a production build | client assets are searched | `GMAIL_APP_PASSWORD` and its value appear nowhere |
| TC-012 | FR-003 | `GMAIL_APP_PASSWORD` pasted as four groups of four | a valid draft is posted | the mail is sent; the spaces never reach SMTP |
