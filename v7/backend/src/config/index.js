const config = {
  port: process.env.PORT || 3007,
  iceRssFeeds: {
    enforcement: "https://www.ice.gov/rss/news/356",
    breaking: "https://www.ice.gov/rss/ice-breaking-news",
    // Add state-specific feeds as needed later
  },
  cacheTTL: parseInt(process.env.ICE_NEWS_CACHE_TTL || "60", 10) * 1000, // seconds to ms
};

export default config;
