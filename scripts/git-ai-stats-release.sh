#!/usr/bin/env bash
# Optional: print git-ai stats for a range (e.g. since last tag or last N commits).
# Usage: ./scripts/git-ai-stats-release.sh [base]
#   base = git ref (tag or commit); default: first commit (full history).
# Example: ./scripts/git-ai-stats-release.sh v0.1.0
set -e
cd "$(dirname "$0")/.."
BASE="${1:-4b825dc642cb6eb9a060e54bf8d69288fbee4904}"
git-ai stats "$BASE..HEAD" --ignore "*.lock" "package-lock.json" 2>/dev/null || true
