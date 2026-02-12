#!/bin/bash

# Build Script for ICE Activity Tracker Static Version
# This script builds the React application for deployment to Hostinger shared hosting

echo "Building ICE Activity Tracker for Hostinger deployment..."

# Navigate to the project directory
cd /Users/steven/ice-tracker/v7/ice-tracker-static

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Create a zip file for easy upload to Hostinger
echo "Creating deployment package..."
cd dist
zip -r ../ice-tracker-deployment.zip .

echo "Build complete!"
echo "Files are located in the 'dist' directory"
echo "A zip file 'ice-tracker-deployment.zip' has been created for easy upload to Hostinger"
echo ""
echo "Next steps:"
echo "1. Upload the contents of the 'dist' directory to your Hostinger public_html folder"
echo "2. Or extract the zip file and upload its contents via FTP/File Manager"
echo "3. Make sure to update the API endpoints in the built files if needed"