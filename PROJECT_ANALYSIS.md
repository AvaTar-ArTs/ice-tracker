## Ice-Tracker Project Analysis

### Project Overview
The ice-tracker project is a comprehensive ICE (U.S. Immigration and Customs Enforcement) activity tracking system that provides:

1. **Live news feed** from ICE.gov RSS feeds (Enforcement & Removal and Breaking News)
2. **Interactive US map** showing ERO field offices and recent enforcement news
3. **Filtering capabilities** by state and source
4. **Direct links** to official ICE news releases and field office information

### Technical Stack
- **Next.js 14** with App Router
- **React 18** and **TypeScript**
- **Leaflet** with **react-leaflet** for mapping
- **rss-parser** for consuming ICE RSS feeds

### Project Structure
The project includes multiple variants across different versions (v2-v7):
- **v2**: Next 14 with URL state, API cache, security headers
- **v3**: v2 + Know Your Rights, hotlines, server AI
- **v4**: v3 + in-browser AI via Transformers.js
- **v5**: Express + vanilla JS with same features as v4
- **v6**: Enhanced version with frost theme, search, timeline, CSV export, SSE, PWA, map clustering

### Git AI Integration
The project has comprehensive Git AI integration:
- Line-level attribution tracking for AI vs human contributions
- Checkpoint system for tracking AI-assisted development
- CI workflow for maintaining attribution during squash/rebase merges
- Integration with Cursor and other AI development tools

### Key Features
1. **Real-time Tracking**: Polls ICE RSS feeds every minute for updates
2. **Geographic Visualization**: Interactive map with blue markers for ERO offices and red markers for enforcement news
3. **Community Reporting**: Optional pin system for community-sourced reports
4. **Extensive Documentation**: Comprehensive guides for setup and usage

### Security & Privacy
- Community reports stored locally in browser only
- Proper credential management using ~/.env.d/github.env
- Secure token handling for GitHub operations

### Development Workflow
- Standard Next.js development workflow (npm install, npm run dev)
- Git AI integration for tracking AI-assisted development
- Automated push script for GitHub operations
- Comprehensive documentation for all processes
