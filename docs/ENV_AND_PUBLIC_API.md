# .env and Running as a Public API

When **random strangers** can use your app (or call your API), you need to know what’s safe in `.env` and how to limit abuse and cost.

---

## 1. What’s Safe in .env

### Never exposed to the client (safe for secrets)

These are **only** read on the server (API routes, server components). They are **not** bundled into the browser:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ICE_NEWS_CACHE_TTL`
- `AI_RATE_LIMIT_PER_HOUR`

So even if the site is public, **strangers cannot see these values**. They only risk **using** them by calling your API (e.g. hitting `/api/ai/summarize` and burning your AI quota).

### Exposed to the client (do not put secrets here)

Any variable prefixed with **`NEXT_PUBLIC_`** is inlined into the JavaScript that runs in the browser. Anyone can see it in DevTools or “View Source”:

- `NEXT_PUBLIC_SITE_URL` — Fine to be public (your site’s URL).
- `NEXT_PUBLIC_GA_ID` — Fine to be public (Google expects the Measurement ID to be visible).

**Rule:** Never put API keys, passwords, or other secrets in `NEXT_PUBLIC_*`. Use plain `OPENAI_API_KEY` / `GEMINI_API_KEY` (no prefix) so they stay server-only.

---

## 2. When the App Is a Public API (Strangers Can Use It)

### Risks

1. **AI endpoint** — Someone (or a bot) can spam `POST /api/ai/summarize` and burn your OpenAI/Gemini quota → **rate limit by IP** (see below).
2. **ICE news endpoint** — `GET /api/ice-news` is read-only and uses your in-memory cache; heavy traffic mainly costs bandwidth and CPU. Optional: rate limit or cache at the edge (e.g. Vercel).
3. **No auth** — If you don’t require login, anyone can use every feature. That’s normal for a public transparency tool; you control cost with rate limits and optional feature flags.

### What This Repo Does

- **Rate limit on AI** — `POST /api/ai/summarize` is limited by **IP** (via `X-Forwarded-For` / `X-Real-IP` when behind a proxy). Default: **10 requests per hour per IP**. Configurable with `AI_RATE_LIMIT_PER_HOUR`.
- **In-memory limit** — The limit is per process. On Vercel (serverless), each instance has its own map; so effective limit is “per IP per instance.” For stricter global limits across all instances, use Redis or your host’s rate limiting (e.g. Vercel Pro, Cloudflare).

### Going live without your own API (default)

**By default, the AI section is hidden.** Do not set `NEXT_PUBLIC_AI_ENABLED` (or set it to `false`). No OpenAI or Gemini keys are required. The app goes live with news, map, Know Your Rights, hotlines, and community reports—no AI, no API cost.

To enable AI later (and use your own or a sponsor’s key): set `NEXT_PUBLIC_AI_ENABLED=true` and one of `OPENAI_API_KEY` or `GEMINI_API_KEY`. The “Summarize with AI” block will then appear and the route will use the key (and rate limit).

---

## 3. Env Vars Cheat Sheet (Public Deployment)

| Variable                     | Server-only? | Safe for public app? | Notes                                      |
|-----------------------------|-------------|-----------------------|--------------------------------------------|
| `NEXT_PUBLIC_SITE_URL`      | No (client) | Yes                   | Canonical URL; visible in browser.          |
| `NEXT_PUBLIC_GA_ID`         | No (client) | Yes                   | GA Measurement ID; visible in browser.     |
| `NEXT_PUBLIC_AI_ENABLED`    | No (client) | Yes                   | Set to `"true"` to show AI section. Omit or `false` = no AI, no keys needed (default). |
| `OPENAI_API_KEY`            | Yes         | Yes                   | Only used when AI enabled. Rate-limit applies. |
| `GEMINI_API_KEY`            | Yes         | Yes                   | Same as above.                             |
| `ICE_NEWS_CACHE_TTL`        | Yes         | Yes                   | Server-only config.                        |
| `AI_RATE_LIMIT_PER_HOUR`    | Yes         | Yes                   | Server-only; default 10 per IP per hour.   |

---

## 4. Summary

- **Secrets (API keys)** stay in **server-only** env vars (no `NEXT_PUBLIC_`). Strangers cannot read them.
- **Public use** can still **cost you** (e.g. AI calls). Mitigations: **rate limit** the AI endpoint (done in this repo by IP), optionally **disable AI** in production, or add **auth** for heavy/AI features.
- For a **live API that random strangers can use**, keep keys server-side, set `AI_RATE_LIMIT_PER_HOUR` if you want (default 10), and monitor usage in your OpenAI/Gemini dashboards.
