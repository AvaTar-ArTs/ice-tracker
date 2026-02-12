import express from "express";
import cors from "cors";
import { initializeDataIngestion, processRssFeeds } from "./modules/data-ingestion/index.js";
import config from "./config/index.js";

const app = express();
const PORT = config.port;

app.use(cors());
app.use(express.json());

// Store connected SSE clients
const sseClients = new Set();

// Function to broadcast SSE messages
function broadcastSSE(event, data) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  sseClients.forEach((res) => {
    try {
      res.write(`event: ${event}\ndata: ${payload}\n\n`);
    } catch (e) {
      console.error("Error broadcasting SSE:", e);
      sseClients.delete(res); // Remove broken connections
    }
  });
}

// Initialize data ingestion, passing the broadcast function
initializeDataIngestion(broadcastSSE); // Pass broadcastSSE

app.get("/", (req, res) => {
  res.send("ICE Activity Tracker v7 Backend is running!");
});

// Endpoint for processed and location-enriched news
app.get("/api/news", async (req, res) => {
  const { page = 1, limit = 10, state: filterState } = req.query;
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  if (isNaN(parsedPage) || parsedPage < 1) {
    return res.status(400).json({ error: "Invalid 'page' parameter." });
  }
  if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) { // Limit max limit to 100
    return res.status(400).json({ error: "Invalid 'limit' parameter. Must be between 1 and 100." });
  }

  try {
    const allItems = await processRssFeeds(); // Get all processed items

    let filteredItems = allItems;
    if (filterState) {
      const upperFilterState = filterState.toUpperCase();
      filteredItems = allItems.filter(item => item.state === upperFilterState);
    }

    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = startIndex + parsedLimit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    res.json({
      page: parsedPage,
      limit: parsedLimit,
      total: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / parsedLimit),
      items: paginatedItems,
    });
  } catch (error) {
    console.error("Error fetching processed news:", error);
    res.status(500).json({ error: "Failed to fetch processed news." });
  }
});

// SSE endpoint
app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Ensure headers are sent immediately

  sseClients.add(res); // Add client to the set

  req.on("close", () => {
    sseClients.delete(res); // Remove client on disconnect
    console.log("SSE client disconnected.");
  });

  console.log("New SSE client connected.");
});


app.listen(PORT, () => {
  console.log(`v7 Backend running on http://localhost:${PORT}`);
});
