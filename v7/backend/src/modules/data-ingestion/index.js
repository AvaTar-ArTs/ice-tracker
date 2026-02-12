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
  // City extraction is disabled for now due to complexity and inaccuracy
  // let city = undefined;

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

  const result = {};
  if (state) result.state = state;
  // The 'city' field will not be set for now.
  // if (city) result.city = city;
  return result;
}

const parser = new Parser({
  timeout: 10000,
  headers: { "User-Agent": "ICE-Tracker/7.0 (Transparency)" },
});

let cachedNews = { items: [], updated: null };
let lastFetchTime = 0;

let globalBroadcastSSE; // To store the broadcast function passed from server.js

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
                const textForLocation = item.title + (item.contentSnippet ? " " + item.contentSnippet : "");
                const { state, city } = extractLocation(textForLocation); // Call extractLocation

                newItems.push({
                    id: item.link || item.guid,
                    title: item.title,
                    link: item.link,
                    pubDate: item.pubDate || item.isoDate,
                    source: Object.keys(config.iceRssFeeds)[index], // Infer source
                    description: item.contentSnippet || item.content,
                    state: state, // Add extracted state
                    city: city,   // Add extracted city (will be undefined for now)
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
    // After updating cachedNews, broadcast an event
    if (globalBroadcastSSE) {
        globalBroadcastSSE("newsUpdate", { updated: cachedNews.updated, newItemsCount: newItems.length });
        console.log(`Broadcasted newsUpdate event. New items: ${newItems.length}`);
    }
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

export function initializeDataIngestion(broadcastFn) { // Accept broadcastFn as argument
  globalBroadcastSSE = broadcastFn; // Store it for later use
  fetchAndProcessFeeds(); // Don"t await, let it run in background
  setInterval(fetchAndProcessFeeds, config.cacheTTL);
  console.log("Data ingestion initialized and polling for updates.");
}
