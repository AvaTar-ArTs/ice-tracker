# ICE Activity Tracker — v4

Same feature set as v3 (ICE news feed, ERO map, Know Your Rights, rapid response hotlines, community reports) with **AI summarization that runs entirely in the browser**. No server API keys required.

## In-browser AI (v4 difference)

- **Summarize with AI** uses [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) in the client.
- The summarization model runs in the user’s browser (WebAssembly); nothing is sent to your server or to OpenAI/Gemini.
- **No API keys** — deploy and share the app without setting `OPENAI_API_KEY` or `GEMINI_API_KEY`.
- First time a user clicks **Summarize with AI (in-browser)**, the model is downloaded and cached in the browser; the first run can take 10–30+ seconds depending on device and connection. Later runs are faster.
- Input is capped at 2000 characters (current filtered feed items, concatenated) to keep inference time and memory reasonable.

## Run locally

```bash
cd v4
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Environment (optional)

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 (optional).
- `NEXT_PUBLIC_SITE_URL` — Canonical URL (optional; default `https://ice-tracker.app`).
- `ICE_NEWS_CACHE_TTL` — Cache TTL in seconds for the ICE news API (optional; default 60).

No AI-related env vars are needed; AI runs in the browser.

## Comparison with v3

| Feature | v3 | v4 |
|--------|----|----|
| ICE news, map, Know Your Rights, hotlines, community reports | ✓ | ✓ |
| AI summarization | Server (OpenAI or Gemini; requires API key and `NEXT_PUBLIC_AI_ENABLED=true`) | In-browser (Transformers.js; no keys) |
| Deploy without any API keys | Yes (AI block hidden) | Yes (AI always available, runs in browser) |

Use v4 when you want AI summarization available to everyone without managing or paying for server-side API keys.
