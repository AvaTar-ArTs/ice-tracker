# SEO, GEO, XEO/DEO & trending optimizations

The app is optimized for **top 1–5%** visibility and **trending/rising (+200%)** search intent.

## SEO & GEO

- **Metadata**: Title template, description, long-tail keywords, canonical URL, Open Graph, Twitter Card.
- **GEO**: `geo.region` (US), `geo.placename`, ICBM meta tags; JSON-LD `Place` with US coverage.
- **Keywords**: Primary + trending phrases (e.g. *ICE news today*, *ICE raids today*, *ERO arrests*, *ICE by state*, *ICE California/Texas/Florida*, *ICE activity map*, *ICE raids near me*) in `app/lib/seo.ts`.
- **Sitemap**: `/sitemap.xml` with `changeFrequency: daily` for freshness.
- **Robots**: `/robots.txt` allows indexing; `/api/` disallowed.
- **Manifest**: `/manifest.json` for install and theme.

**Config note**: `app/lib/seo.ts` is SEO, GEO, XEO/DEO & trending/rising keyword config. Use `NEXT_PUBLIC_SITE_URL` in production (e.g. https://ice-tracker.example.com). Geographic coverage constants are for GEO SEO (USA). FAQ array is for FAQPage schema (trending Q&A intent).

## Trending / freshness (rising search)

- **ItemList + NewsArticle JSON-LD**: Server component fetches latest ICE news and outputs Schema.org `ItemList` of `NewsArticle` so crawlers see fresh, topical content. See `app/components/StructuredNewsLd.tsx` — fetches `/api/ice-news` and outputs ItemList + NewsArticle JSON-LD for trending/freshness SEO.
- **Visible "Latest ICE activity"** heading and `role="feed"` for semantic clarity.
- **FAQ**: `FAQPage` schema + visible FAQ section (same Q&As) for question-based search.

**Keywords in seo.ts**: Primary + Ahrefs-style keywords — informational intent (what is, how to), "also rank for" / phrase-match (state, today, near me), commercial/navigational (tracker, map, offices).

## XEO/DEO (experience & performance)

- **Preconnect** to CARTO tile servers and **dns-prefetch** for ice.gov to improve LCP/load.
- **Map placeholder** with `min-h-[400px]` to reduce CLS.
- **Config**: All strings and keywords in `app/lib/seo.ts`. Set `NEXT_PUBLIC_SITE_URL` in production.

---

## Google Analytics, Ahrefs & Search Console

### Google Analytics 4 (GA4)

- Set **`NEXT_PUBLIC_GA_ID`** to your GA4 Measurement ID (e.g. `G-XXXXXXXXXX`) to enable.
- **Page views** and **Enhanced measurement** (scrolls, outbound clicks) work via the default gtag config.
- **Custom events** sent to GA4: `filter_state`, `filter_source`, `community_report_submit`, `news_click`, `refresh_click`, `faq_toggle`, `live_tips_toggle`, `report_form_open`. Use these in GA4 **Reports → Engagement → Events** and for **conversions** if you mark them as key events.
- **Web Vitals** (LCP, FID, CLS, INP, etc.) are sent as events when GA is enabled; use them in **Reports → Engagement → Events** (filter by event name: `LCP`, `CLS`, etc.) or in **Explore** for custom analyses.
- Copy `.env.example` to `.env.local` and add your IDs.

### Google Search Console (GSC)

1. Add your property at [search.google.com/search-console](https://search.google.com/search-console) (URL prefix or domain).
2. Verify via HTML tag (add the meta tag to `app/layout.tsx` under `metadata.other` if needed) or DNS.
3. Submit **sitemap**: `https://your-domain.com/sitemap.xml`.
4. Use **Performance** to see queries, clicks, impressions, and average position. Use this to refine keywords in `app/lib/seo.ts` and to find new "also rank for" ideas.

### Ahrefs (keywords & competitors)

- **Keywords Explorer**: Use seed keywords from `app/lib/seo.ts` (e.g. *ICE tracker*, *ICE news today*, *ERO arrests*) to get **Matching terms**, **Related terms**, **Keyword Difficulty (KD)**, and **Traffic Potential**. Prioritize low-KD, informational-intent keywords and add strong variants to `SEO_KEYWORDS`.
- **Site Explorer**: Enter your live URL to see **organic keywords** and **traffic**. Use **Content Gap** with competitor sites (e.g. other immigration- or government-tracking tools) to find keywords they rank for that you don't.
- **Ahrefs Webmaster Tools (AWT)**: Connect your site (free) for GSC-like data plus **KD** and **search volume** on the queries you rank for. Use it to decide which rankings to improve and which new keywords to target.
- **Search intent**: In Keywords Explorer, filter by **Informational** (or **Navigational**) so on-page content and FAQs stay aligned with intent. The in-app FAQ and "Latest ICE activity" section target question and news intent.

---

## Research doc references (findability)

From `docs/INTERNET_RESEARCH_ICE_TRACKING_TOOLS_AND_SEARCH.md`:

- Search phrases (by geography, agency, discovery, understanding) align with **SEO_KEYWORDS** and FAQ strategy in this repo (informational + "also rank for" state/today/near me).
- **SEO / findability** — Targeted keywords, GEO, FAQ schema, sitemap, ItemList/NewsArticle JSON-LD align with how people search.
- "What's the latest ICE news?" → **Core**: RSS feed + filters + freshness SEO.
- **Differentiate clearly** — README/SEO already lean into "news today," "by state," "ERO offices."
- **Discovery** — SEO and v2 shareable URLs already target "ICE tracker," "ICE news today," "ICE by state"; consistent with what people search.
