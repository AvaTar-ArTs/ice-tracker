/*
 * AI integration module — supports Gemini API.
 * API key is stored in localStorage (never sent to any server except the AI provider).
 */

const STORAGE_KEY = "ice-tracker-v10-ai-key";
const PROVIDER_KEY = "ice-tracker-v10-ai-provider";

export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function setApiKey(key) {
  localStorage.setItem(STORAGE_KEY, key.trim());
}

export function getProvider() {
  return localStorage.getItem(PROVIDER_KEY) ?? "gemini";
}

export function setProvider(provider) {
  localStorage.setItem(PROVIDER_KEY, provider);
}

/**
 * Send a prompt to the configured AI provider.
 * @param {string} prompt
 * @returns {Promise<string>} The AI's text response.
 */
export async function queryAI(prompt) {
  const key = getApiKey();
  if (!key) throw new Error("No API key configured. Add your key in the AI Insights settings.");

  const provider = getProvider();

  if (provider === "gemini") {
    return queryGemini(key, prompt);
  }
  throw new Error(`Unknown provider: ${provider}`);
}

async function queryGemini(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Gemini API error (${res.status})`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini.");
  return text;
}

/**
 * Build a prompt for summarising ICE news items.
 * @param {Array} newsItems
 * @returns {string}
 */
export function buildSummaryPrompt(newsItems) {
  const headlines = newsItems
    .slice(0, 25)
    .map((n, i) => `${i + 1}. [${n.state ?? "US"}] ${n.title} (${n.source})`)
    .join("\n");

  return `You are an analyst reviewing the latest U.S. Immigration and Customs Enforcement (ICE) news headlines. Provide a concise analysis in 3 sections:

1. **Key Trends** — What patterns do you see across these headlines?
2. **Geographic Focus** — Which states or regions are most active?
3. **Notable Items** — Highlight 2-3 items that stand out and why.

Keep the tone factual and neutral. Use bullet points. Be concise.

Headlines:
${headlines}`;
}

/**
 * Build a prompt for state-specific analysis.
 */
export function buildStatePrompt(state, newsItems) {
  const stateItems = newsItems.filter((n) => n.state === state);
  if (stateItems.length === 0) return null;

  const headlines = stateItems
    .slice(0, 15)
    .map((n, i) => `${i + 1}. ${n.title}`)
    .join("\n");

  return `Summarize ICE enforcement activity in ${state} based on these recent headlines. Include: what types of operations are occurring, any notable arrests or actions, and how this compares to typical activity. Be factual and concise.

Headlines from ${state}:
${headlines}`;
}
