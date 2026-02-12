import Parser from "rss-parser";
import config from "../../config/index.js";

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

export function extractLocation(text) {
  let state = undefined;
  let city = undefined;

  // 1. Try to find a state abbreviation (more precise), exclude "IN" to prevent false positives with the word "in"
  const abbrevMatch = text.match(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|WA|WV|WI|WY|PR)\b/i);
  if (abbrevMatch && abbrevMatch[1]) {
    state = abbrevMatch[1].toUpperCase();
  }

  // 2. If no abbreviation, try to find a full state name
  if (!state) {
    const stateMatch = text.match(new RegExp(`\\b(${Object.keys(US_STATE_ABBREV).join("|")})\\b`, "i"));
    if (stateMatch && stateMatch[1]) {
      // Convert full name to abbreviation if found
      const fullStateName = Object.keys(US_STATE_ABBREV).find(key => key.toLowerCase() === stateMatch[1].toLowerCase());
      if (fullStateName) {
        state = US_STATE_ABBREV[fullStateName];
      }
    }
  }

  // 3. Try to find a city
  const CITY_WORD_BOUNDARY = '[A-Z][a-z]+(?:[\\s-][A-Z][a-z]+)*?';

  const cityPatterns = [
    // Pattern 1: "City, StateAbbrev" (e.g., "Miami, FL") - Most precise
    new RegExp(`\\b(${CITY_WORD_BOUNDARY}),\\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|WA|WV|WI|WY|PR)\\b`, 'i'),

    // Pattern 2: Explicitly capture "New York City" if present
    /\b(New York City)\b/i,

    // Pattern 3: "City in State Full Name" or "City in/at/from StateAbbrev"
    new RegExp(`\\b(${CITY_WORD_BOUNDARY})\\s+in\\s+(?:AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|TX|UT|VA|WA|WV|WI|WY|PR|${Object.keys(US_STATE_ABBREV).join("|")})\\b`, 'i'),

    // Pattern 4: Phrases like "arrested in City", "operation in City", "Arrests in City"
    new RegExp(`(?:[Aa]rrests? in|[Oo]peration in|[Rr]aids? in)\\s+(${CITY_WORD_BOUNDARY})(?:\\s|,|\\.|$)`, 'i'),

    // Pattern 5: Multi-word cities with "City" or "County" (e.g. "New York City" - general)
    new RegExp(`\\b(${CITY_WORD_BOUNDARY})\\s+(?:City|County)\\b`, 'i'),

    // Pattern 6: City followed by a comma or end of string, as a last resort
    new RegExp(`\\b(${CITY_WORD_BOUNDARY})(?:,\\s*|\\s*$)`, 'i'),
  ];

  for (const re of cityPatterns) {
    const m = text.match(re);
    if (m?.[1]) {
      const extractedCity = m[1].trim();
      // Refined validation for city length, and avoiding common noise words (adjusted list)
      if (extractedCity.length > 1 && extractedCity.length < 40 && 
          !['in', 'at', 'from', 'operation', 'raids', 'action', 'activity', 'arrests', 'the', 'a', 'an', 'no', 'specif', 'new', 'york', 'california'].includes(extractedCity.toLowerCase()) &&
          !extractedCity.toLowerCase().includes(' in ') && 
          !extractedCity.toLowerCase().startsWith('operation ') && 
          !extractedCity.toLowerCase().startsWith('arrests ') && 
          !extractedCity.toLowerCase().startsWith('activity ') && 
          !extractedCity.toLowerCase().startsWith('ice action ') &&
          !extractedCity.toLowerCase().startsWith('no specific') &&
          extractedCity.split(/\s+/).length <= 5) { // Limit to max 5 words
          city = extractedCity;
          break;
      }
    }
  }

  const result = {};
  if (state) result.state = state;
  if (city) result.city = city;
  return result;
}

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "ICE-Tracker/7.0 (Transparency)" },
});

let cachedNews = { items: [], updated: null };
let lastFetchTime = 0;

async function fetchAndProcessFeeds() {
    const feedUrls = Object.values(config.iceRssFeeds);
    const promises = feedUrls.map(url => parser.parseURL(url).catch(e => {
        console.error(`Error fetching RSS from ${url}:`, e);
        return { items: [] }; // Return empty items on error to prevent breaking
    }));

    const results = await Promise.all(promises);
    const newItems = [];
    const seenLinks = new Set();

    results.forEach((feed, index) => {
        feed.items.forEach(item => {
            if (item.link && !seenLinks.has(item.link)) {
                seenLinks.add(item.link);
                // Basic item structure; will enhance with location extraction, etc., in later tasks
                newItems.push({
                    id: item.link || item.guid,
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate || item.isoDate,
                    source: Object.keys(config.iceRssFeeds)[index], // Infer source
                    description: item.contentSnippet || item.content,
                });
            }
        });
    });

    newItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    cachedNews = {
        items: newItems.slice(0, 200), // Limit number of items
        updated: new Date().toISOString()
    };
    lastFetchTime = Date.now();
    return cachedNews.items;
}

export async function processRssFeeds() {
    if (Date.now() - lastFetchTime > config.cacheTTL || !cachedNews.updated) {
        return await fetchAndProcessFeeds();
    }
    return cachedNews.items;
}

export function getCachedNews() {
    return cachedNews;
}

export function initializeDataIngestion() {
  // Start initial fetch and then poll periodically
  fetchAndProcessFeeds(); // Don"t await, let it run in background
  setInterval(fetchAndProcessFeeds, config.cacheTTL);
  console.log("Data ingestion initialized and polling for updates.");
}
