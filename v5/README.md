# ICE Activity Tracker — v5 (vanilla HTML/CSS/JS)

Same features as v4, built with **plain HTML, CSS, and JavaScript** — no React, no Next.js. Good if you want a classic, framework-free stack or to host on any server that can run a small Node app and serve static files.

## Stack

- **Frontend**: One HTML page (`public/index.html`), one stylesheet (`public/styles.css`), and vanilla JS modules (`public/js/app.js`, `public/js/map.js`). Leaflet from CDN for the map.
- **Backend**: Minimal Express server (`server.js`) that serves `public/` and provides `GET /api/ice-news` (same RSS aggregation as v4).
- **Data**: Static JSON in `public/data/` (ERO offices, state coordinates, hotlines). Know Your Rights text is in `app.js`.
- **AI**: In-browser summarization via dynamic `import("https://esm.sh/@huggingface/transformers@3")` when the user clicks “Summarize with AI (in-browser)”. No server API keys.

## Run

```bash
cd v5
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). Port is `process.env.PORT` or 3000.

## Project layout

```
v5/
  server.js           # Express: static + /api/ice-news
  package.json
  public/
    index.html
    styles.css
    data/
      ero-offices.json
      state-coords.json
      hotlines.json
    js/
      app.js          # Feed, filters, URL state, reports, KYR, hotlines, AI
      map.js          # Leaflet map (uses global L)
```

## Comparison with v4

| | v4 | v5 |
|-|----|----|
| **UI** | React (Next.js) | Vanilla HTML/CSS/JS |
| **Build** | `next build` | None for frontend |
| **Server** | Next.js API routes | Express (static + one API) |
| **AI** | Transformers.js (bundled) | Transformers.js (esm.sh dynamic import) |

Use v5 when you prefer a non-React, HTML-first setup and a single small Node server.
