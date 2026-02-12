# ICE Activity Tracker v7 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the `v7` design for a smarter, more proactive, and user-friendly ICE Activity Tracker, focusing on enhanced information synthesis, contextual support, and improved usability.

**Architecture:** The architecture leverages a Node.js/Express.js backend for data ingestion, enhanced processing (NLP, geospatial analysis, AI integration), and API services, paired with a highly performant PWA frontend built with Vanilla JS/Web Components or a lightweight framework for interactive dashboards, advanced visualizations, and real-time alerts via SSE.

**Tech Stack:** Node.js, Express.js, AI Models (external/local), potentially SQLite/PostgreSQL/NoSQL for contextual data, Vanilla JS/Web Components/Preact, Leaflet/Mapbox GL, PWA technologies (Service Workers, Cache API).

---

### Task 1: Backend Setup and Core Data Ingestion Module Enhancement

**Goal:** Establish the `v7` backend project structure and enhance the data ingestion module to support multiple RSS feeds and initial data validation.

**Files:**
- Create: `backend/package.json`
- Create: `backend/src/server.js`
- Create: `backend/src/config/index.js`
- Create: `backend/src/modules/data-ingestion/index.js`
- Create: `backend/src/modules/data-ingestion/data-ingestion.test.js`

**Step 1: Write failing test for basic data ingestion**

```javascript
// backend/src/modules/data-ingestion/data-ingestion.test.js
import { assert } from 'console'; // Using a simple assert for now

// Mock RSS feeds for testing
const mockRssFeeds = {
    'enforcement': '<?xml version="1.0"?><rss version="2.0"><channel><item><title>Test Enforcement</title><link>http://enforcement.com</link></item></channel></rss>',
    'breaking': '<?xml version="1.0"?><rss version="2.0"><channel><item><title>Test Breaking</title><link>http://breaking.com</link></item></channel></rss>',
};

// Mock the fetch function to return our mock RSS feeds
global.fetch = async (url) => {
    if (url.includes('enforcement')) {
        return { text: async () => mockRssFeeds.enforcement };
    }
    if (url.includes('breaking')) {
        return { text: async () => mockRssFeeds.breaking };
    }
    return { text: async () => '' };
};

// Test to ensure multiple RSS feeds are processed
async function testProcessMultipleRssFeeds() {
    console.log("Running testProcessMultipleRssFeeds...");
    // Assuming processRssFeeds will be exported from index.js
    const { processRssFeeds } = await import('../../src/modules/data-ingestion/index.js');
    const items = await processRssFeeds();
    assert(items.length >= 2, `Expected at least 2 items, got ${items.length}`);
    assert(items[0].title === 'Test Enforcement', `Expected 'Test Enforcement', got '${items[0].title}'`);
    assert(items[1].title === 'Test Breaking', `Expected 'Test Breaking', got '${items[1].title}'`);
    console.log("testProcessMultipleRssFeeds PASSED");
}

(async () => {
    try {
        await testProcessMultipleRssFeeds();
    } catch (error) {
        console.error("TEST FAILED:", error.message);
        process.exit(1);
    }
})();
```

**Step 2: Run test to verify it fails**

Run in worktree terminal:
`node backend/src/modules/data-ingestion/data-ingestion.test.js`

Expected: Fails with `ReferenceError: processRssFeeds is not defined` or similar, as the module does not exist yet.

**Step 3: Write minimal implementation for core data ingestion**

```javascript
// backend/package.json
{
  "name": "v7-backend",
  "version": "1.0.0",
  "description": "Backend for ICE Activity Tracker v7",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --detectOpenHandles"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "rss-parser": "^3.13.0"
  },
  "devDependencies": {
    "jest": "^29.7.0"
  }
}

// backend/src/server.js
import express from 'express';
import cors from 'cors';
import { initializeDataIngestion } from './modules/data-ingestion/index.js';
import config from './config/index.js';

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

// Initialize data ingestion
initializeDataIngestion();

app.get('/', (req, res) => {
  res.send('ICE Activity Tracker v7 Backend is running!');
});

app.listen(PORT, () => {
  console.log(`v7 Backend running on http://localhost:${PORT}`);
});

// backend/src/config/index.js
const config = {
  port: process.env.PORT || 3007,
  iceRssFeeds: {
    enforcement: "https://www.ice.gov/rss/news/356",
    breaking: "https://www.ice.gov/rss/ice-breaking-news",
    // Add state-specific feeds as needed later
  },
  cacheTTL: parseInt(process.env.ICE_NEWS_CACHE_TTL || '60', 10) * 1000, // seconds to ms
};

export default config;

// backend/src/modules/data-ingestion/index.js
import Parser from 'rss-parser';
import config from '../../config/index.js';

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
  fetchAndProcessFeeds(); // Don't await, let it run in background
  setInterval(fetchAndProcessFeeds, config.cacheTTL);
  console.log('Data ingestion initialized and polling for updates.');
}
```

**Step 4: Run test to verify it passes**

First, install new dependencies for the backend, as the `package.json` for the backend is new.
Run in worktree terminal:
`cd backend && npm install`
Then, run the test:
`node backend/src/modules/data-ingestion/data-ingestion.test.js`
Expected: `testProcessMultipleRssFeeds PASSED`

**Step 5: Commit**

```bash
cd ~/.config/superpowers/worktrees/ice-tracker/v7-implementation
git add backend/package.json backend/src/server.js backend/src/config/index.js backend/src/modules/data-ingestion/index.js backend/src/modules/data-ingestion/data-ingestion.test.js
git commit -m "feat: setup v7 backend and core data ingestion module"
```

---
