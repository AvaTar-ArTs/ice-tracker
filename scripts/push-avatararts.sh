#!/usr/bin/env bash
# Push to AvaTar-ArTs/ice-tracker using token from ~/.env.d/github.env
# Usage: ./scripts/push-avatararts.sh
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "${HOME}/.env.d/github.env"
cd "$REPO_DIR"
git push "https://${GITHUB_TOKEN_AVATARARTS}@github.com/AvaTar-ArTs/ice-tracker.git" master
git branch -u origin/master master 2>/dev/null || true
