# ICE Activity Tracker — v2

This folder is **v2** of the [ICE Activity Tracker](../README.md): same features with structural and UX improvements.

## What’s in v2

- **Shareable filter links** — State and source filters are reflected in the URL (`?state=CA&source=breaking`). Sharing the link opens the app with those filters applied.
- **API response cache** — In-memory cache for `/api/ice-news` (default 60s TTL, configurable via `ICE_NEWS_CACHE_TTL`) to reduce load on ICE.gov and speed up repeated requests (e.g. StructuredNewsLd + client).
- **Stale on error** — If the ICE news fetch fails, the API returns the last cached result when available (`cached: true, stale: true`).
- **Error state + retry** — When the news fetch fails, the sidebar shows an error message and a “Retry” button.
- **Security headers** — `next.config.js` adds `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection`.
- **Centralized types** — `app/types/index.ts` defines `IceNewsItem`, `EROOffice`, `CommunityReport`, `FilterSource`, `StateCoords`.
- **Constants** — `app/lib/constants.ts` holds `REFRESH_INTERVALS`, `DEFAULT_REFRESH_MS`, `US_STATES` (used by the main page).
- **URL state helpers** — `app/lib/url-state.ts` for reading/writing filter state to the URL.
- **Accessibility** — Skip link (“Skip to main content”), `aria-label` on feed and map, `aria-live`/`aria-busy` on loading, `role="group"` and labels on zoom controls.
- **MapView** — Uses `useMap()` from `react-leaflet` instead of `require` inside the component; zoom buttons have proper aria labels.

## Run v2

From the **project root** (ice-tracker), run v2 with:

```bash
cd v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Or from the repo root, run the app from the v2 directory:

```bash
npm run dev --prefix v2
```

(You may need to run `npm install` in `v2` first.)

## Config

- Copy `v2/.env.example` to `v2/.env.local` and set:
  - `NEXT_PUBLIC_SITE_URL` — Production canonical URL (optional).
  - `NEXT_PUBLIC_GA_ID` — GA4 Measurement ID (optional).
  - `ICE_NEWS_CACHE_TTL` — Cache TTL in seconds for the ICE news API (optional; default 60).

## Build

```bash
cd v2
npm run build
npm start
```

## Merging v2 into the main app

To bring v2 improvements into the root app:

1. **Config** — Merge `next.config.js` (security headers) and `.env.example` (optional `ICE_NEWS_CACHE_TTL`).
2. **New files** — Add `app/types/index.ts`, `app/lib/constants.ts`, `app/lib/url-state.ts`.
3. **API** — Replace `app/api/ice-news/route.ts` with the v2 version (cache + stale fallback).
4. **Page** — Update `app/page.tsx` (URL state, error UI, constants, types, skip link, aria).
5. **MapView** — Update `app/components/MapView.tsx` (useMap import, types, zoom aria).
6. **StructuredNewsLd** — Use shared `IceNewsItem` type if desired.
7. **Community reports** — Optionally import `CommunityReport` from `@/app/types` in `app/lib/community-reports.ts`.
8. **CSS** — Add `.sr-only` / `.focus\:not-sr-only:focus` in `globals.css` if you add the skip link.

See [v2/CHANGELOG.md](CHANGELOG.md) for a version history of v2.
