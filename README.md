Personal CV site with a chat that answers questions about me. Next.js 16 (App Router), React 19, next-intl (en, uk).

## Pages

- `/` - landing
- `/cv` - the CV. Sections can be hidden, the choice is kept in the `?x=` query param, so a trimmed CV is just a link.
- `/questions` - FAQ plus a chat. The question goes through a MiniSearch keyword retriever over the FAQ and CV content, top chunks go into the prompt, the answer streams from a free OpenRouter model (`lib/ask/models.ts`).

## Layout

- `content/` - CV data (experience, skills, links, question list)
- `messages/{en,uk}/` - all copy
- `lib/ask/` - chat pipeline: chunks, retriever, prompt, SSE
- `app/api/ask`, `app/api/contact` - chat and contact form, both rate-limited per IP

## Run

Node >= 22.18.

```sh
cp .env.example .env.local
npm install
npm run dev
```

Env (see `.env.example`):

- `NEXT_PUBLIC_SITE_URL` - absolute origin for sitemap, robots, OpenGraph. Defaults to localhost.
- `GMAIL_USER`, `GMAIL_APP_PASSWORD` - contact form via Gmail SMTP. Unset -> `/api/contact` returns 503.
- `OPENROUTER_API_KEY` - chat. Unset -> `/api/ask` returns 503.

## Checks

- `npm run check` - format, typecheck, lint, copy lint, tests
- `npm run lint:copy` - spelling and grammar of `messages/` via the LanguageTool API

## License

MIT
