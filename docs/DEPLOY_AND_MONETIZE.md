# Deploy & Monetize: ICE Activity Tracker

How to **deploy** the app and options for **selling or funding** it.

---

## 1. Deploy

### Recommended: Vercel (Next.js native)

- **Why**: Zero-config for Next.js, serverless API routes, env vars in dashboard, free tier.
- **Steps**:
  1. Push repo to GitHub (or connect Git provider).
  2. [vercel.com](https://vercel.com) → Import project → select repo, root or `v3` folder.
  3. Set **Root Directory** to `v3` if you deploy v3 only.
  4. Add env vars: `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-app.vercel.app`), optional `NEXT_PUBLIC_GA_ID`, `OPENAI_API_KEY` or `GEMINI_API_KEY` for AI.
  5. Deploy. Custom domain in Project Settings → Domains.

**Note**: API routes run as serverless; in-memory ICE news cache is per-instance and may cold-start. For heavier traffic, consider a short cache TTL or external cache (e.g. Vercel KV).

### Other hosts

| Platform   | Pros                          | Cons / notes                                      |
|-----------|--------------------------------|---------------------------------------------------|
| **Netlify** | Good free tier, env vars      | Next.js support via plugin; use `v3` as base dir. |
| **Railway** | Simple, Docker or Nixpacks    | Paid after trial; good for API + DB if you add one. |
| **Fly.io**  | Run anywhere, scale to zero  | More ops; use Dockerfile for Next.js.             |
| **Self-host** | Full control, no vendor lock-in | You manage Node, process manager (PM2), reverse proxy (Caddy/Nginx), HTTPS (e.g. Let’s Encrypt). |

### Env vars to set in production

- `NEXT_PUBLIC_SITE_URL` — Canonical URL (sitemap, OG, canonical).
- `NEXT_PUBLIC_GA_ID` — Optional GA4 ID.
- `ICE_NEWS_CACHE_TTL` — Optional; default 60 (seconds).
- `OPENAI_API_KEY` or `GEMINI_API_KEY` — Optional; enables “Summarize with AI”.

Never expose API keys to the client; only use them in API routes or server code.

---

## 2. Sell / Monetize

This is a **civic and transparency** tool. Monetization should fit that and avoid selling to parties that could misuse it (e.g. targeting individuals).

### Options that fit the project

1. **Donations & grants**
   - **Donations**: Stripe, Open Collective, GitHub Sponsors, or a simple “Support this project” link. No paywall; optional one-time or monthly.
   - **Grants**: Civic tech, journalism, or human-rights funders (e.g. Knight, Ford, ACLU-affiliated, immigrant-rights orgs). Position as “public-interest transparency and Know Your Rights.”

2. **“Pro” or supporter tier (optional features)**
   - **Free**: Current app (news, map, KYR, hotlines, community reports, optional AI if you set keys).
   - **Supporters**: “Support this project” → one-time or monthly; in return: badge, early access to new features, or **supporter-only** features such as:
     - Faster or more frequent refresh.
     - Export feed (JSON/CSV).
     - Email digest (if you add a backend).
   - Keep core safety (KYR, hotlines, news) free for everyone.

3. **B2B / institutional**
   - **Who might pay**: Newsrooms, NGOs, law firms, researchers — for **internal or public-facing** use (dashboards, reports, alerts).
   - **How**: License or white-label; you host or they self-host. Fee per seat, annual license, or one-time for a custom deploy.
   - **Ethics**: Sell to organizations that use it for transparency, legal support, or research — not for enforcement or surveillance of individuals.

4. **White-label / custom deploys**
   - You run the codebase; client gets a branded instance (their domain, their GA, optional custom hotlines or KYR). Charge setup + annual maintenance.

5. **Keep it free and use as portfolio**
   - No direct monetization; use the live app and code in your portfolio to land consulting or employment in civic tech, journalism, or dev.

### What to avoid

- **Selling to enforcement or surveillance** use cases (e.g. ICE or contractors using it to target people).
- **Paywalling** core safety content (Know Your Rights, hotlines). If you add “pro,” keep those free.
- **Ads** that could be hostile to immigrant communities; if you ever run ads, keep them strictly vetted.

### Practical next steps

- **Deploy free first**: Get v3 (or main) on Vercel with a clear “This is a transparency tool” tagline.
- **Add a “Support” or “Donate” link** in the footer; connect Stripe or Open Collective when ready.
- **If you want to sell**: Draft a one-pager (what it does, who it’s for, pricing for B2B/white-label) and reach out to newsrooms or NGOs that already cover immigration.

---

## 3. AI usage and cost

- **Summarize with AI** uses either OpenAI (`gpt-4o-mini`) or Google Gemini (e.g. `gemini-1.5-flash`). Costs are per request and small at low volume.
- **Controlling cost**: Rate-limit the `/api/ai/summarize` route (e.g. by IP or user) if you open it to the public; or enable AI only for supporters / behind a key.
- **Keys**: Store `OPENAI_API_KEY` or `GEMINI_API_KEY` only in server env; never in client or repo.

---

*Summary: Deploy on Vercel (or Netlify/Railway/Fly/self-host); fund via donations/grants or a supporter tier; consider B2B/white-label for orgs that align with the project’s mission; keep core safety content free and avoid selling to enforcement or surveillance use cases.*
