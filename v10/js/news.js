/* News fetching module — uses rss2json.com as a CORS-friendly proxy */

const RSS_FEEDS = [
  { label: "Enforcement & Removal", url: "https://www.ice.gov/rss/news/356", source: "enforcement" },
  { label: "Breaking News", url: "https://www.ice.gov/rss/ice-breaking-news", source: "breaking" },
  { label: "California", url: "https://www.ice.gov/rss/news/state/CA", source: "state", state: "CA" },
  { label: "Texas", url: "https://www.ice.gov/rss/news/state/TX", source: "state", state: "TX" },
  { label: "Florida", url: "https://www.ice.gov/rss/news/state/FL", source: "state", state: "FL" },
  { label: "New York", url: "https://www.ice.gov/rss/news/state/NY", source: "state", state: "NY" },
  { label: "Arizona", url: "https://www.ice.gov/rss/news/state/AZ", source: "state", state: "AZ" },
  { label: "Georgia", url: "https://www.ice.gov/rss/news/state/GA", source: "state", state: "GA" },
  { label: "North Carolina", url: "https://www.ice.gov/rss/news/state/NC", source: "state", state: "NC" },
  { label: "New Jersey", url: "https://www.ice.gov/rss/news/state/NJ", source: "state", state: "NJ" },
];

const STATE_NAMES = {
  Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",Colorado:"CO",Connecticut:"CT",
  Delaware:"DE","District of Columbia":"DC",Florida:"FL",Georgia:"GA",Hawaii:"HI",Idaho:"ID",Illinois:"IL",
  Indiana:"IN",Iowa:"IA",Kansas:"KS",Kentucky:"KY",Louisiana:"LA",Maine:"ME",Maryland:"MD",
  Massachusetts:"MA",Michigan:"MI",Minnesota:"MN",Mississippi:"MS",Missouri:"MO",Montana:"MT",
  Nebraska:"NE",Nevada:"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY",
  "North Carolina":"NC","North Dakota":"ND",Ohio:"OH",Oklahoma:"OK",Oregon:"OR",Pennsylvania:"PA",
  "Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD",Tennessee:"TN",Texas:"TX",Utah:"UT",
  Vermont:"VT",Virginia:"VA",Washington:"WA","West Virginia":"WV",Wisconsin:"WI",Wyoming:"WY","Puerto Rico":"PR",
};

const ALL_ABBREVS = Object.values(STATE_NAMES);
const ABBREV_RE = new RegExp(`\\b(${ALL_ABBREVS.join("|")})\\b`);
const NAME_RE = new RegExp(`\\b(${Object.keys(STATE_NAMES).join("|")})\\b`, "i");

function extractState(text) {
  const nameMatch = text.match(NAME_RE);
  if (nameMatch) return STATE_NAMES[nameMatch[1]] ?? nameMatch[1];
  const abbrMatch = text.match(ABBREV_RE);
  if (abbrMatch) return abbrMatch[1].toUpperCase();
  return null;
}

let cachedItems = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

/**
 * Fetch all RSS feeds and return merged, deduplicated, sorted items.
 * Uses rss2json.com public API as a CORS proxy.
 * @returns {Promise<Array>}
 */
export async function fetchAllNews() {
  if (cachedItems && Date.now() - cacheTime < CACHE_TTL) return cachedItems;

  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(apiUrl);
      if (!res.ok) return [];
      const data = await res.json();
      if (data.status !== "ok" || !Array.isArray(data.items)) return [];
      return data.items.map((item) => {
        const text = `${item.title ?? ""} ${item.description ?? ""}`;
        return {
          id: item.link || item.title?.slice(0, 80) || Math.random().toString(36),
          title: item.title?.trim() ?? "",
          link: item.link ?? "",
          description: (item.description ?? "").replace(/<[^>]*>/g, "").slice(0, 400),
          pubDate: item.pubDate ?? new Date().toISOString(),
          state: extractState(text) ?? feed.state ?? null,
          source: feed.source,
        };
      });
    })
  );

  const seen = new Set();
  const items = [];
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const item of r.value) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      items.push(item);
    }
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  cachedItems = items.slice(0, 150);
  cacheTime = Date.now();
  return cachedItems;
}

export function formatDate(s) {
  try {
    const d = new Date(s);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86_400_000) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    if (diff < 172_800_000) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch { return ""; }
}

export { ALL_ABBREVS };
