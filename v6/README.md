# ICE Activity Tracker v6

**Enhanced, advanced, and creatively independent** variant of the ICE Activity Tracker. Same mission — live U.S. ICE enforcement news, ERO map, Know Your Rights, hotlines — with a distinct stack, theme, and feature set.

## What’s different in v6

- **Frost theme** — Cool blue/slate palette, high contrast, print-friendly CSS.
- **Search** — Full-text search over the feed (title, description, state, city).
- **Timeline view** — Group feed by date; toggle between list and timeline.
- **Export** — Export visible items as CSV (state, city, source, date, link, title).
- **Live updates (SSE)** — Optional server-sent events so the server can notify the client when the feed refreshes; toast on new items.
- **Focus mode** — Minimal UI (hide extra buttons/panels) for a calmer reading experience.
- **Keyboard** — Escape closes panels and report form.
- **Map clustering** — Leaflet.markercluster for news and community reports so the map stays readable when zoomed out.
- **PWA** — Installable app: manifest, service worker caches static assets and last `/api/ice-news` response for offline.
- **In-browser AI** — Summary and “key points” (bullet-style) via Transformers.js; no server API keys.

Same as v5: vanilla HTML/CSS/JS, Express server, `/api/ice-news`, Know Your Rights, hotlines, community reports (localStorage), FAQ, live-update tips.

## Run locally

```bash
cd v6
npm install
npm start
```

Open [http://localhost:3006](http://localhost:3006). Default port is 3006 (override with `PORT`).

## Scripts

- `npm start` — run server
- `npm run dev` — run with `--watch` for development

## Stack

- **Node 18+** (ESM)
- **Express** — static files, `/api/ice-news`, `/api/events` (SSE)
- **rss-parser** — ICE.gov RSS aggregation (same sources as v5)
- **Leaflet** + **Leaflet.markercluster** — map and clustered markers
- **Vanilla JS** — no React/Next; AI via esm.sh `@huggingface/transformers`

## Env

- `PORT` — server port (default 3006)
- `ICE_NEWS_CACHE_TTL` — cache TTL in seconds (default 60)

## Repo context

v6 lives in the [ice-tracker](https://github.com/AvaTar-ArTs/ice-tracker) repo alongside root (Next) and v2–v5. See root [README](../README.md) for Git AI, push, and docs.
