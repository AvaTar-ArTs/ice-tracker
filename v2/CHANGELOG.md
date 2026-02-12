# Changelog — v2

All notable changes for the **v2** variant of ICE Activity Tracker.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-02-12

### Added

- **Shareable filter URLs** — State and source filters sync to query params (`?state=CA&source=breaking`). Initial state is read from the URL on load.
- **ICE news API cache** — In-memory cache with configurable TTL (`ICE_NEWS_CACHE_TTL`, default 60s). Responses include `cached: true` when served from cache.
- **Stale-while-error** — On fetch failure, the API returns the last cached payload when available (`stale: true`).
- **Error state and retry** — Sidebar shows an error message and “Retry” button when the news request fails.
- **Security headers** — `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection` in `next.config.js`.
- **Shared types** — `app/types/index.ts`: `IceNewsItem`, `EROOffice`, `CommunityReport`, `FilterSource`, `StateCoords`.
- **Constants module** — `app/lib/constants.ts`: `REFRESH_INTERVALS`, `DEFAULT_REFRESH_MS`, `US_STATES`.
- **URL state helpers** — `app/lib/url-state.ts`: `getFilterStateFromSearchParams`, `buildFilterSearchParams`, `updateUrlFilters`.
- **Skip link** — “Skip to main content” link (visible on focus) for keyboard/screen-reader users.
- **A11y** — `aria-label` on feed and map, `aria-live`/`aria-busy` on loading, `aria-label` on filter selects and zoom buttons; `role="group"` and “Map zoom” label on zoom controls.
- **Optional env** — `.env.example` documents `ICE_NEWS_CACHE_TTL`. `.gitignore` includes `prompts.db` and `*.db`.

### Changed

- **MapView** — Uses `useMap()` from `react-leaflet` instead of `require("react-leaflet").useMap` inside the zoom component.
- **API route** — Uses shared `IceNewsItem` type; User-Agent set to `ICE-Tracker/2.0 (Transparency)`.
- **StructuredNewsLd** — Uses `IceNewsItem` from `app/types`.
- **Community reports** — Imports `CommunityReport` from `app/types`.
- **Page** — Uses constants and types from `app/lib` and `app/types`; filter state and source synced to URL; error UI and retry; skip link and improved aria.

### Technical

- **Stack** — Same as v1: Next.js 14 (App Router), React 18, TypeScript, Leaflet, react-leaflet, rss-parser.
- **Version** — `package.json` set to `0.2.0` for v2.

---

[0.2.0]: https://github.com/AvaTar-ArTs/ice-tracker/compare/v0.1.0...v0.2.0
