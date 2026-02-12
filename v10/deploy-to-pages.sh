#!/usr/bin/env bash
# Deploy ICE Activity Tracker v10 to AvaTar-ArTs.github.io
# Usage: ./v10/deploy-to-pages.sh
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAGES_REPO="https://github.com/AvaTar-ArTs/AvaTar-ArTs.github.io.git"
TMP_DIR=$(mktemp -d)

echo "Cloning ${PAGES_REPO}..."
git clone "$PAGES_REPO" "$TMP_DIR"

echo "Copying v10 files..."
cp -r "$SCRIPT_DIR/css" "$TMP_DIR/"
cp -r "$SCRIPT_DIR/js" "$TMP_DIR/"
cp -r "$SCRIPT_DIR/pages" "$TMP_DIR/"
cp "$SCRIPT_DIR/index.html" "$TMP_DIR/"

# Fix nav paths: remove /v10/ prefix for root deployment
sed -i 's|/v10/||g' "$TMP_DIR/js/nav.js"

cd "$TMP_DIR"
git add .
git commit -m "Deploy ICE Activity Tracker v10 to GitHub Pages"
git push origin main

echo ""
echo "Deployed! Site will be live at: https://avatar-arts.github.io"
echo "Cleaning up..."
rm -rf "$TMP_DIR"
