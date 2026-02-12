# ICE Activity Tracker - Hostinger Deployment Version

This is a simplified static version of the ICE Activity Tracker designed specifically for deployment on Hostinger shared hosting.

## Architecture
- Static React frontend (built and deployed as static files)
- Connected to an external API service (to be hosted separately)
- Compatible with Hostinger's shared hosting environment

## Features
- Interactive map showing ICE activity locations
- Activity listings with filtering
- Basic analytics and trend visualization
- Responsive design for all devices

## Prerequisites
- Node.js and npm installed on your local machine
- Hostinger hosting account with domain access
- An external service for the backend API (see deployment guide)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

### 3. Run the Build Script for Hostinger
```bash
./build-for-hostinger.sh
```

This will create a `dist` folder with all the static files and a zip file for easy upload to Hostinger.

## Deployment
See the `deployment-guide.md` file for detailed instructions on deploying to your Hostinger account.

## Configuration
Before building, you may need to update the API endpoint in `vite.config.ts` to point to your external backend service.

## Support
For questions about this deployment version, refer to the deployment guide or contact your hosting provider for assistance with uploading files to your Hostinger account.