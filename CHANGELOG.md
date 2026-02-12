# Changelog

All notable changes to the ICE Activity Tracker project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

- No unreleased changes at this time.

---

## [0.1.0] - 2026-02-11

### Added

#### Core application
- **ICE Activity Tracker** – Single-page app to live-track U.S. Immigration and Customs Enforcement (ICE) activity.
- **Interactive US map** (Leaflet + react-leaflet) with dark Carto basemap:
  - Blue markers for 24 ERO (Enforcement and Removal Operations) field offices.
  - Red markers for recent enforcement news (positioned by state centroid).
  - Orange markers for user-submitted community reports.
- **Live news feed** from ICE.gov RSS:
  - Enforcement & Removal feed (`/rss/news/356`).
  - Breaking News feed (`/rss/ice-breaking-news`).
  - State-specific feeds for CA, TX, FL, NY, AZ, GA, NC, NJ, MA, MN (10 states).
- **API route** `GET /api/ice-news` – Fetches and parses ICE RSS; deduplicates; extracts state/city from titles and descriptions; returns JSON with `items` and `updated`.
- **ERO field office data** – `data/ero-offices.json` with id, name, city, state, lat/lng, and area of responsibility for 24 offices.
- **State coordinates** – `data/state-coords.json` for mapping news items to state centroids (all US states + DC, PR).
- **Filters** – By state (dropdown) and by source (All, Enforcement & Removal, Breaking news, State feeds).
- **Refresh** – Manual “Refresh” button and configurable auto-refresh interval (1 min, 5 min, 15 min).
- **“New updates” indicator** – Badge showing count of new items since last load; click to clear.

#### Community reports
- **Community reports** – Users can add a report (state required, city and description optional) via “+ Report” in the sidebar.
- Reports stored in **localStorage** only (no backend); shown as orange markers on the map.
- **Clear my reports** – Button to remove all community reports from the browser.
- **Unverified** label on map popups and form to set expectations.

#### Live tracking & discovery
- **“Ways to get live updates”** – Expandable section in the sidebar with tips: ICE.gov RSS, @ICEgov, local immigrant rights orgs, news alerts, community reports.
- **FAQ** – Expandable FAQ section (5 questions) plus **FAQPage** JSON-LD for question-intent search.
- **Semantic feed** – “Latest ICE activity & enforcement news” heading and `role="feed"` with `aria-label` for accessibility and crawlers.

#### SEO & GEO
- **Metadata** (`app/layout.tsx`):
  - Title template: `%s | ICE Activity Tracker` and default title.
  - Description, keywords, authors, creator.
  - Open Graph (type, locale, url, siteName, title, description).
  - Twitter card (summary_large_image, title, description).
  - Robots: index, follow; googleBot same.
  - Canonical URL via `metadataBase` and `alternates.canonical`.
  - Viewport and theme color.
- **GEO meta tags** – `geo.region` (US), `geo.placename` (United States), `ICBM` (continental US center).
- **Structured data (JSON-LD)**:
  - **WebApplication** – name, description, url, applicationCategory, offers (free).
  - **Place** – United States with GeoCoordinates and areaServed.
  - **FAQPage** – same Q&As as the visible FAQ.
- **ItemList + NewsArticle** – Server component `StructuredNewsLd` fetches `/api/ice-news` and outputs Schema.org `ItemList` of `NewsArticle` (up to 15 items) for freshness/news SEO.
- **Sitemap** – `app/sitemap.ts` generates `/sitemap.xml` with homepage URL, `lastModified`, `changeFrequency: daily`, `priority: 1`.
- **Robots** – `app/robots.ts` generates `/robots.txt`: allow `/`, disallow `/api/`, sitemap URL.
- **Manifest** – `public/manifest.json` (name, short_name, description, start_url, display, theme_color, background_color, lang, scope); linked in metadata.
- **SEO config** – `app/lib/seo.ts` centralizes `SITE_URL`, `SITE_NAME`, descriptions, `SEO_KEYWORDS`, `GEO_*`, `SEO_FAQS`; `SITE_URL` from `NEXT_PUBLIC_SITE_URL` when set.

#### Keywords (Ahrefs-style)
- **Primary and long-tail** – e.g. ICE tracker, ICE news today, ICE raids today, ERO arrests, ICE by state, ICE California/Texas/Florida, ICE activity map, ICE raids near me.
- **Informational / question intent** – what is ICE, what is ERO, how to track ICE activity.
- **“Also rank for” style** – ICE enforcement by state, ICE news by state, ICE arrests by state, ERO field office locations, ICE activity near me.

#### Performance & experience (XEO/DEO)
- **Preconnect** – To `a.basemaps.cartocdn.com`, `b.basemaps.cartocdn.com`, `c.basemaps.cartocdn.com` in layout `<head>`.
- **dns-prefetch** – For `https://www.ice.gov`.
- **Map placeholder** – Loading state with `min-h-[400px]` to reduce CLS before map renders.
- **Dynamic imports** – Map and react-leaflet components loaded client-side only (`ssr: false`).

#### Google Analytics 4
- **GA4 integration** – `app/components/GoogleAnalytics.tsx` loads gtag.js and configures GA4 when `NEXT_PUBLIC_GA_ID` is set (e.g. `G-XXXXXXXXXX`).
- **Web Vitals** – `app/components/WebVitals.tsx` uses `useReportWebVitals` to send LCP, FID, CLS, INP, etc. to GA4 as events with `non_interaction: true`.
- **Custom events** (via `app/lib/analytics.ts`):
  - `filter_state` – state filter change (param: `state`).
  - `filter_source` – source filter change (param: `source`).
  - `community_report_submit` – report submitted (param: `state`).
  - `news_click` – user clicked a news item link (params: `link`, `state`).
  - `refresh_click` – user clicked Refresh.
  - `faq_toggle` – user opened/closed FAQ.
  - `live_tips_toggle` – user opened/closed “Ways to get live updates”.
  - `report_form_open` – user opened the report form.
  - `map_interaction` – user clicked a news or community marker (params: `type`, `state`).
- **Analytics helper** – `trackEvent(name, params)` and `ANALYTICS_EVENTS` constant; no-op when GA ID is not set.

#### Documentation & config
- **README.md** – Project overview, data sources, ways to get live updates, run/build instructions, SEO/GEO/XEO/DEO section, Google Analytics / Search Console / Ahrefs section, stack.
- **.env.example** – `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID` with short descriptions.

### Technical details
- **Stack** – Next.js 14 (App Router), React 18, TypeScript, Leaflet, react-leaflet, rss-parser.
- **Routing** – Single route `/`; dynamic due to `StructuredNewsLd` server component.
- **Data** – No database; community reports in localStorage; ERO and state coords from static JSON.

### Security & privacy
- Community reports are stored only in the user’s browser; no server persistence.
- API route does not expose user data; it only proxies and parses public ICE.gov RSS.
- GA4 and Web Vitals run only when `NEXT_PUBLIC_GA_ID` is set; no analytics by default.

---

## Version history

| Version   | Date       | Summary |
|----------|------------|---------|
| **0.1.0** | 2026-02-11 | Initial release: map, ICE news feed, state feeds, community reports, SEO/GEO, GA4, Web Vitals, Ahrefs-style keywords. |

---

[Unreleased]: https://github.com/your-org/ice-tracker/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-org/ice-tracker/releases/tag/v0.1.0
