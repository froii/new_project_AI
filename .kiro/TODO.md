# TODO — deliberately not built yet

Ideas parked on purpose. Each row is here because its trigger has not fired, not because it was
forgotten. Building any of them early would be the `yagni:` we tell ourselves not to write.
Delete a row once it is done or once it stops making sense.

| Idea | Build it after | Why not now |
|---|---|---|
| Third and further interface languages | Owner has translations to add | Mechanism already supports N locales; adding one is a data change (SC-007) |
| Tooltip primitive | There are 3+ icon-only controls | Today there is one (theme toggle) and `aria-label` already covers screen readers. Tooltips are hover-only, so phone visitors — the majority here — never see them. If built: trigger on `:focus-visible` too, which the nedyx implementation does not |

## Open, unproven

Written but never actually exercised — verify before trusting.

- LinkedIn handle `oleksa-t-90a050a8` taken from the owner; the CVs carry
  `oleksa-tyshchenko-90a050a8`. Neither was opened — LinkedIn returns 999 to automated requests.
- `NEXT_PUBLIC_SITE_URL` still points at `localhost`. `robots.txt`, `sitemap.xml` and every Open
  Graph URL are built from it — set it before the first deploy or search engines index localhost.
- `public/photos/portrait-{1,2,3}.svg` are placeholders. Replace with real portraits and switch
  `controls/photo-switcher` from `<img>` to `next/image`.
- `content/index.ts` holds one real entry (Adraba). Its dates were given as `09.01.2018 – 07.08.2018`
  and read as day-first: `2018-01` → `2018-08`. Confirm before this goes public.
