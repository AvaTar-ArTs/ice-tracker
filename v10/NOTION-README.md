# ICE Activity Tracker v10

## Overview

A standalone, dark-themed web application that tracks U.S. Immigration and Customs Enforcement (ICE) activity through real-time news aggregation, interactive mapping, AI-powered analysis, and community reporting.

**Live URL:** `https://ice-tracker.avatararts.org/`
**Version:** 10
**Stack:** Pure HTML/CSS/JS (no build step, no framework)
**AI Provider:** Google Gemini 2.0 Flash (free tier)

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Dashboard | `index.html` | Stats overview, quick-access cards, latest headlines |
| News Feed | `pages/news.html` | Filterable news from ICE.gov RSS feeds (enforcement, breaking, state) |
| Interactive Map | `pages/map.html` | Leaflet.js dark map with ERO offices, news markers, community reports |
| AI Insights | `pages/analytics.html` | Gemini-powered trend analysis, state bar chart, per-state deep dives |
| Community Reports | `pages/reports.html` | Submit/view local ICE activity reports (localStorage, no server) |
| Know Your Rights | `pages/rights.html` | Constitutional rights info for ICE encounters (door, public, workplace, detention) |

---

## Features

### Real-Time News Aggregation
- Pulls from 8 ICE.gov RSS feeds via `rss2json.com` CORS proxy
- Covers: Enforcement & Removal, Breaking News, and state feeds (CA, TX, FL, NY, AZ, GA, NC, NJ)
- Auto-detects state from headlines using regex matching
- Deduplicates by link/title, caches for 60 seconds
- Filterable by state and source type

### Interactive Map (Leaflet.js)
- Dark CARTO basemap tiles
- 25 ERO field office markers (blue) with popup details
- News items plotted at state centroids with jitter (red)
- Community reports plotted (orange)
- State filter zooms to selected state
- Color-coded legend

### AI-Powered Analysis (Gemini)
- Users provide their own free Gemini API key (stored in localStorage only)
- "Generate Summary" — sends top 25 headlines for trend analysis
- "Analyze State" — state-specific enforcement breakdown
- Markdown-to-HTML rendering of AI responses
- State activity bar chart (top 15 states by news count)

### Community Reports
- Submit reports with state, city, and description
- All data stored in browser localStorage (never sent to any server)
- Delete individual reports or clear all
- Reports appear on the interactive map

### Know Your Rights
- Rights at your door (judicial vs. ICE administrative warrants)
- Rights if stopped in public
- Rights if detained
- Checkpoint and traffic stop rights
- Workplace raid rights
- Emergency hotlines (ACLU, United We Dream, RAICES, NIJC)
- Safety plan checklist

---

## File Structure

```
ice-tracker/               ← Upload contents to public_html/ice-tracker/
├── index.html             ← Dashboard (entry point)
├── css/
│   └── styles.css         ← Shared dark theme styles
├── js/
│   ├── ai.js              ← Gemini API integration
│   ├── map-data.js        ← 25 ERO offices + 50 state coordinate centroids
│   ├── nav.js             ← Shared navigation bar renderer
│   ├── news.js            ← RSS feed fetching, parsing, caching
│   └── reports.js         ← localStorage-backed community reports CRUD
└── pages/
    ├── analytics.html     ← AI Insights page
    ├── map.html           ← Interactive Map page
    ├── news.html          ← News Feed page
    ├── reports.html       ← Community Reports page
    └── rights.html        ← Know Your Rights page
```

---

## Deployment to avatararts.org

### FTP Upload (FileZilla)

1. **Connect** to FTP:
   - Host: `82.29.199.248` (or `ftp.avatararts.org`)
   - Port: `21`
   - Protocol: FTPS (Explicit FTP over TLS)
   - Username: `u365102102.avatararts.org`
   - Password: (set in hPanel)

2. **Navigate** remote side to: `public_html/ice-tracker/`

3. **Upload** the contents of the zip (not the zip itself):
   - `index.html` → `public_html/ice-tracker/index.html`
   - `css/` → `public_html/ice-tracker/css/`
   - `js/` → `public_html/ice-tracker/js/`
   - `pages/` → `public_html/ice-tracker/pages/`

4. **Visit** `https://ice-tracker.avatararts.org/`

---

## Data Sources

| Source | URL | Type |
|--------|-----|------|
| ICE Enforcement & Removal | `ice.gov/rss/news/356` | RSS |
| ICE Breaking News | `ice.gov/rss/ice-breaking-news` | RSS |
| State feeds (CA, TX, FL, NY, AZ, GA, NC, NJ) | `ice.gov/rss/news/state/{STATE}` | RSS |
| CORS Proxy | `api.rss2json.com` | API |
| Map Tiles | `basemaps.cartocdn.com` (dark_all) | Tiles |
| Leaflet.js | `unpkg.com/leaflet@1.9.4` | CDN |
| Gemini AI | `generativelanguage.googleapis.com` | API |

---

## Design

- **Theme:** Dark mode only (`#0c0e12` background)
- **Font:** System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Colors:** Blue (#3b82f6), Red (#ef4444), Orange (#f59e0b), Green (#10b981), Purple (#8b5cf6)
- **Layout:** Sticky nav, responsive grid, max-width 1400px content area
- **Mobile:** Fully responsive — stacks to single column at 640px

---

## Privacy & Security

- **No backend server** — entirely client-side
- **No cookies or tracking**
- **API keys** stored in localStorage, sent only to the AI provider
- **Community reports** stored in localStorage only
- **RSS feeds** fetched via public rss2json.com proxy (no auth required)
- **No user accounts or login**

---

## ERO Field Offices (25)

Atlanta, Baltimore, Boston, Buffalo, Chicago, Dallas, Denver, Detroit, El Paso, Houston, Los Angeles, Miami, Newark, New Orleans, New York City, Philadelphia, Phoenix, Sacramento, Salt Lake City, San Antonio, San Francisco, Seattle, St. Paul, Tampa, Washington D.C.
