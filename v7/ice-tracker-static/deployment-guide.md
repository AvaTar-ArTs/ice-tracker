# Deployment Guide: ICE Activity Tracker on Hostinger

## Overview
This guide explains how to deploy the simplified ICE Activity Tracker application to your Hostinger shared hosting account. Since shared hosting doesn't support Node.js backend services, this version uses a static React frontend that connects to an external API service.

## Prerequisites
- Hostinger hosting account with avatararts.org domain
- FTP access to your Hostinger account
- Basic knowledge of FTP/file manager usage

## Step-by-Step Deployment

### Part 1: Prepare the Application

1. **Build the Application**
   ```bash
   cd /Users/steven/ice-tracker/v7/ice-tracker-static
   npm install
   npm run build
   ```
   
   This creates a `dist` folder with all the static files needed for deployment.

2. **Prepare for Upload**
   The build process creates optimized static files in the `dist` directory. These are the files you'll upload to your Hostinger account.

### Part 2: Set Up External Backend Service

Since Hostinger shared hosting doesn't support Node.js backend services, you'll need an external service for the API:

1. **Choose a Backend Hosting Option**:
   - **Railway** (free tier available): https://railway.app
   - **Render** (free tier available): https://render.com
   - **Heroku** (limited free tier): https://heroku.com
   - **DigitalOcean App Platform** (credit available): https://digitalocean.com

2. **Deploy the Backend**:
   You'll need to deploy the backend portion (from the enhanced version) to one of these services. The backend includes:
   - Node.js/Express server
   - PostgreSQL database
   - Background job processing
   - RSS feed processing

3. **Get the Backend URL**:
   Once deployed, note the URL of your backend service (e.g., `https://your-app-name.onrender.com`)

### Part 3: Configure API Endpoints

Before uploading to Hostinger, you need to update the frontend to point to your external backend:

1. **Update the Vite Configuration**:
   Modify the proxy target in `vite.config.ts` to point to your external backend:
   ```typescript
   server: {
     proxy: {
       '/api': {
         target: 'https://your-external-backend.com', // Replace with your actual backend URL
         changeOrigin: true,
         secure: true,
       }
     }
   }
   ```

2. **Rebuild the Application**:
   After updating the configuration, rebuild:
   ```bash
   npm run build
   ```

### Part 4: Upload Files to Hostinger

Choose one of these methods:

#### Method A: Using File Manager (Recommended for beginners)
1. Log into your Hostinger hPanel: https://hpanel.hostinger.com
2. Go to Websites → avatararts.org → File Manager
3. Navigate to the `public_html` directory
4. Create a new folder called `ice-tracker`
5. Upload all files from the `dist` folder to the `ice-tracker` directory
6. Make sure to upload all files, including hidden files like `.htaccess` if present

#### Method B: Using FTP
1. Get your FTP credentials from Hostinger hPanel:
   - Go to Websites → avatararts.org → Dashboard → FTP Accounts
   - Note your FTP hostname, username, and set a password if needed
2. Use an FTP client (FileZilla, WinSCP, Cyberduck, etc.)
3. Connect to your Hostinger account
4. Upload all files from the `dist` folder to the `public_html/ice-tracker` directory

### Part 5: Configure Subdomain (Optional)

To access the application via `ice-tracker.avatararts.org`:

1. In Hostinger hPanel, go to Websites → avatararts.org → Subdomains
2. Create a new subdomain:
   - Subdomain: `ice-tracker`
   - Directory: `/public_html/ice-tracker` (the directory where you uploaded the files)
3. Click Create

### Part 6: Environment Variables and Configuration

If your frontend needs specific environment variables:

1. **Mapbox Token**: If you want to use your own Mapbox account instead of the demo token:
   - Sign up at https://www.mapbox.com/
   - Get your access token
   - In your frontend code, update the token in the ActivityMap component

2. **API Configuration**: The frontend will automatically connect to your external backend API.

### Part 7: Testing and Verification

1. Visit your application:
   - If using subdomain: `https://ice-tracker.avatararts.org`
   - If in subfolder: `https://avatararts.org/ice-tracker`

2. Check browser console for any errors
3. Verify that:
   - The map loads correctly
   - Data is being fetched from the API
   - All interactive elements work

### Part 8: Setting Up API Connection

The frontend expects the backend API to be available at `/api` path. Make sure your external backend:

1. Has CORS enabled for your Hostinger domain
2. Has the correct endpoints available:
   - GET `/api/activities`
   - GET `/api/locations`
   - GET `/api/analytics/trends`
   - GET `/api/analytics/location-distribution`
   - GET `/api/analytics/keyword-frequency`
   - etc.

### Troubleshooting

**Issue**: Blank page after upload
- Solution: Check that all files were uploaded, especially `index.html` and the `assets` folder

**Issue**: API calls failing
- Solution: Verify your external backend is running and accessible
- Check browser console for CORS errors

**Issue**: Maps not loading
- Solution: Verify your Mapbox token is correctly set

**Issue**: Slow loading
- Solution: Check if your external backend is responding quickly
- Consider optimizing images and assets

### Maintenance

1. **Updates**: To update the application:
   - Make changes to the source code
   - Run `npm run build`
   - Upload new files to Hostinger

2. **Monitoring**: Set up monitoring for your external backend service to ensure it stays online

3. **Backups**: Regularly backup your external database if you're storing data there

This deployment approach allows you to leverage Hostinger's reliable static hosting while using external services for the dynamic backend functionality.