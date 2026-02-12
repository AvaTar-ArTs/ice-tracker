# ICE Activity Tracker — v3

Enhanced version with **in-app Know Your Rights**, **rapid response hotlines by state**, and all core content built in (no “link out to tools” for the main experience).

## What’s in v3

- **Know Your Rights (in-app)** — Full section in the sidebar: door/warrant, remain silent, lawyer, consent to search, documents, family plan. Content lives in `data/know-your-rights.ts`; no external link required.
- **Rapid response & hotlines (in-app)** — Sidebar section with national hotlines (e.g. text REPORT for alerts) and state-specific rapid response numbers. Data in `data/hotlines.json`; state filter drives which hotlines show. Phone numbers are clickable `tel:` links.
- **Ways to get live updates (in-app)** — Expandable section that points to in-app features (refresh, Know Your Rights, Rapid response & hotlines, community report) and briefly to official ICE; no reliance on external tool links for the core flow.
- **Report form** — Includes a line: “If someone needs help now, open Rapid response & hotlines above for hotline numbers.”
- **v2 features** — URL state for filters, API cache, error + retry, security headers, shared types/constants, a11y (skip link, aria), `useMap` fix in MapView.

## Run v3

```bash
cd v3
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Config

Copy `v3/.env.example` to `v3/.env.local`. Options: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `ICE_NEWS_CACHE_TTL`. **AI is off by default**: do not set `NEXT_PUBLIC_AI_ENABLED` and you can go live without any OpenAI/Gemini keys. To enable “Summarize with AI”, set `NEXT_PUBLIC_AI_ENABLED=true` and one of `OPENAI_API_KEY` or `GEMINI_API_KEY`. See [../docs/ENV_AND_PUBLIC_API.md](../docs/ENV_AND_PUBLIC_API.md).

## Data (create within)

- **`data/know-your-rights.ts`** — KYR sections (title + body paragraphs). Edit to add or change content.
- **`data/hotlines.json`** — `national` (array of { name, phone, description, action?, url? }) and `byState` (state code → { stateName, hotlines }). Add or update states/hotlines here; the app uses the state filter to show the relevant block.

## Build

```bash
cd v3
npm run build
npm start
```

## Merging v3 into main

1. Copy v3 `data/know-your-rights.ts` and `data/hotlines.json` into the main app.
2. Add `app/lib/resources.ts`, `app/components/KnowYourRights.tsx`, `app/components/ResourcesHotlines.tsx`.
3. Update the main page to add Know Your Rights and Rapid response & hotlines toggles and the in-app “Ways to get live updates” content; add the hotline note to the report form.
4. Copy v3 `app/lib/seo.ts` (or extend description/FAQ in main app if desired).
5. Add analytics events `know_your_rights_toggle` and `resources_hotlines_toggle` in the main app.

**Deploy & monetize**: See [../docs/DEPLOY_AND_MONETIZE.md](../docs/DEPLOY_AND_MONETIZE.md) for deploy options (e.g. Vercel) and ways to fund or sell the app.

See [v3/CHANGELOG.md](CHANGELOG.md) for version history.
