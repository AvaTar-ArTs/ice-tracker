# Project Context: ICE Activity Tracker

This repository contains the **ICE Activity Tracker**, a web application designed to live-track U.S. Immigration and Customs Enforcement (ICE) activity. It provides a news feed from ICE.gov RSS, displays ERO field offices and recent enforcement news on an interactive map, and allows filtering by state and news source. The application emphasizes community reporting and integrates with "Git AI" for tracking AI-generated code.

## Project Overview

The ICE Activity Tracker is a web application that offers:
- A live news feed from ICE.gov RSS (Enforcement & Removal and Breaking News), refreshed every 5 minutes.
- An interactive US map using Leaflet, showing ERO field offices (blue markers) and recent enforcement news (red markers by state).
- Filters for news by state and source.
- Links to official ICE news releases and field office information.
- Integration with "Git AI" to track AI-generated code.

The repository appears to maintain multiple versions of the application in separate directories (`v2/`, `v3/`, `v4/`, `v5/`), suggesting an iterative development process or different feature sets for each version.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18
- **Language:** TypeScript
- **Mapping:** Leaflet + react-leaflet (Carto Dark basemap)
- **RSS Parsing:** rss-parser (used in a server-side API route)

## Folder Structure Highlights

- `app/`: Contains the core application logic, pages, global CSS, layout, API routes (`api/ice-news/`), components (`components/`), and utility libraries (`lib/`).
- `data/`: Stores static JSON data like `ero-offices.json` and `state-coords.json`. `v3/` and `v4/` also contain `hotlines.json` and `know-your-rights.ts`.
- `public/`: For static assets, including `manifest.json`.
- `scripts/`: Contains utility scripts like `git-ai-stats-release.sh` and `push-avatararts.sh`.
- `docs/`: Comprehensive documentation including deployment, environment setup, Git AI research, and review notes.
- `v2/`, `v3/`, `v4/`, `v5/`: These directories represent distinct versions or iterations of the application, each with its own `package.json`, `app/` structure, and potentially different features or configurations. This structure indicates a versioned approach to development.

## Building and Running

To set up and run the project locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run in development mode:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3000`.

To build and start the production-ready application:

1.  **Build the project:**
    ```bash
    npm run build
    ```
2.  **Start the application:**
    ```bash
    npm start
    ```

## Development Conventions

- **Git AI Integration:** The project utilizes [Git AI](https://usegitai.com/) to track AI-generated code, indicating a practice of monitoring and attributing AI contributions. Key commands include `git-ai status` and `git-ai blame <file>`.
- **Git Credentials Management:** Git credentials for pushing to GitHub are managed externally via `~/.env.d/github.env` and the `scripts/push-avatararts.sh` script, ensuring sensitive information is not stored in the repository.
- **Environment Variables:** Configuration for public-facing variables like `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_GA_ID` is handled via `.env.local` (referencing `.env.example`).
