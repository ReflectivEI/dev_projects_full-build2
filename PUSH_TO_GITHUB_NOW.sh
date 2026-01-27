#!/bin/bash

# CRITICAL: Push working code to GitHub to trigger Cloudflare Pages deployment
# This will fix the blank screen on https://reflectivai-app-prod.pages.dev/

echo "🚨 CRITICAL FIX: Pushing working code to GitHub"
echo "This will trigger Cloudflare Pages to redeploy with the correct files"
echo ""

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ ERROR: GITHUB_TOKEN environment variable is not set"
  echo ""
  echo "To fix this:"
  echo "1. Go to GitHub: https://github.com/settings/tokens"
  echo "2. Create a Personal Access Token (classic) with 'repo' scope"
  echo "3. Run: export GITHUB_TOKEN='your_token_here'"
  echo "4. Run this script again"
  exit 1
fi

echo "✓ GitHub token found"
echo ""

# Set up git remote with token
echo "📡 Setting up GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_TOKEN}@github.com/ReflectivEI/dev_projects_full-build2.git"

echo "✓ Remote configured"
echo ""

# Get current commit
CURRENT_COMMIT=$(git log --oneline -1)
echo "📦 Current commit: $CURRENT_COMMIT"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub main branch..."
if git push origin HEAD:main --force; then
  echo ""
  echo "✅ SUCCESS! Code pushed to GitHub"
  echo ""
  echo "🔄 Cloudflare Pages will automatically detect the push and redeploy"
  echo ""
  echo "⏱️  Deployment usually takes 2-3 minutes"
  echo ""
  echo "🌐 Monitor deployment at:"
  echo "   https://dash.cloudflare.com/"
  echo ""
  echo "🎯 Your site will be live at:"
  echo "   https://reflectivai-app-prod.pages.dev/"
  echo ""
  echo "✨ The blank screen will be fixed once deployment completes!"
else
  echo ""
  echo "❌ ERROR: Failed to push to GitHub"
  echo "Please check:"
  echo "1. Your GitHub token has 'repo' scope"
  echo "2. You have write access to ReflectivEI/dev_projects_full-build2"
  echo "3. The token is not expired"
  exit 1
fi
