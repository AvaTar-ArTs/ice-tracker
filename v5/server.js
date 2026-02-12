/**
 * v5: Minimal Node server — static files + /api/ice-news
 * No React, no Next; frontend is vanilla HTML/CSS/JS.
 */
import express from "express";
import cors from "cors";
import Parser from "rss-parser";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "ICE-Tracker/5.0 (Transparency)" },
});

const ENFORCEMENT_RSS = "https://www.ice.gov/rss/news/356";
const BREAKING_RSS = "https://www.ice.gov/rss/ice-breaking-news";
const STATE_FEEDS = [
  { state: "CA", url: "https://www.ice.gov/rss/news/state/CA" },
  { state: "TX", url: "https://www.ice.gov/rss/news/state/TX" },
  { state: "FL", url: "https://www.ice.gov/rss/news/state/FL" },
  { state: "NY", url: "https://www.ice.gov/rss/news/state/NY" },
  { state: "AZ", url: "https://www.ice.gov/rss/news/state/AZ" },
  { state: "GA", url: "https://www.ice.gov/rss/news/state/GA" },
  { state: "NC", url: "https://www.ice.gov/rss/news/state/NC" },
  { state: "NJ", url: "https://www.ice.gov/rss/news/state/NJ" },
  { state: "MA", url: "https://www.ice.gov/rss/news/state/MA" },
  { state: "MN", url: "https://www.ice.gov/rss/news/state/MN" },
];

const US_STATE_ABBREV = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  "Puerto Rico": "PR",
};

function extractLocation(text) {
  const stateMatch = text.match(new RegExp(`\\b(${Object.keys(US_STATE_ABBREV).join("|")})\\b`, "i"));
  const abbrevMatch = text.match(/\b(AZ|CA|CO|CT|DC|FL|GA|IL|IN|LA|MA|MD|MN|NC|NJ|NM|NY|OH|OK|OR|PA|TX|UT|VA|WA|WV)\b/i);
  const state = stateMatch ? (US_STATE_ABBREV[stateMatch[1]] ?? stateMatch[1]) : abbrevMatch ? abbrevMatch[1].toUpperCase() : undefined;
  const cityPatterns = [
    /(?:in|at|from)\s+([A-Za-z\s]+?),?\s*(?:AZ|CA|CO|CT|DC|FL|GA|IL|IN|LA|MA|MD|MN|NC|NJ|NM|NY|OH|OK|OR|PA|TX|UT|VA|WA|WV)/,
    /(?:arrested|operation in|raids? in)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/,
    /([A-Za-z\s]+?),?\s*(?:California|Texas|Florida|New York|Arizona)/,
  ];
  for (const re of cityPatterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const city = m[1].trim();
      if (city.length > 1 && city.length < 40) return { state, city };
    }
  }
  return { state };
}

const CACHE_TTL_MS = (parseInt(process.env.ICE_NEWS_CACHE_TTL, 10) * 1000) || 60_000;
let cache = null;

async function fetchIceNews() {
  const stateFeedPromises = STATE_FEEDS.map(({ url }) => parser.parseURL(url));
  const [enforcementFeed, breakingFeed, ...stateFeeds] = await Promise.allSettled([
    parser.parseURL(ENFORCEMENT_RSS),
    parser.parseURL(BREAKING_RSS),
    ...stateFeedPromises,
  ]);

  const items = [];
  const seen = new Set();

  function processFeed(result, source, defaultState) {
    if (result.status !== "fulfilled" || !result.value?.items) return;
    for (const item of result.value.items) {
      const title = (item.title || "").trim();
      const link = item.link || "";
      const id = link || title.slice(0, 80);
      if (seen.has(id)) continue;
      seen.add(id);
      const text = [title, item.contentSnippet || item.content || ""].join(" ");
      const { state, city } = extractLocation(text);
      items.push({
        id,
        title,
        link,
        description: (item.contentSnippet || item.content || "").slice(0, 400),
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        state: state || defaultState,
        city,
        source,
      });
    }
  }

  processFeed(enforcementFeed, "enforcement");
  processFeed(breakingFeed, "breaking");
  stateFeeds.forEach((result, i) => processFeed(result, "state", STATE_FEEDS[i]?.state));

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  return { items: items.slice(0, 100), updated: new Date().toISOString() };
}

app.get("/api/ice-news", async (req, res) => {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return res.json({ items: cache.items, updated: cache.updated, cached: true });
  }
  try {
    const { items, updated } = await fetchIceNews();
    cache = { items, updated, expiresAt: now + CACHE_TTL_MS };
    res.json({ items, updated, cached: false });
  } catch (e) {
    console.error("ICE news fetch error:", e);
    if (cache) {
      return res.json({ items: cache.items, updated: cache.updated, cached: true, stale: true });
    }
    res.status(502).json({ error: "Failed to fetch ICE news", items: [], updated: new Date().toISOString() });
  }
});

app.listen(PORT, () => {
  console.log(`ICE Tracker v5 at http://localhost:${PORT}`);
});
