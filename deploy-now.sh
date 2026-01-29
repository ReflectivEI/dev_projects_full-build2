#!/bin/bash

# GitHub Deploy Script
set -e

echo "🚀 Starting deployment to GitHub..."

# Configure git
git config --global user.email "airo@reflectivai.com"
git config --global user.name "Airo Deploy"

# Get the repository URL from the remote
REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$REPO_URL" ]; then
  echo "❌ No git remote found. Please provide your GitHub repository URL."
  exit 1
fi

# Extract repo info
if [[ $REPO_URL == *"github.com"* ]]; then
  # Already has github.com
  REPO_PATH=$(echo $REPO_URL | sed 's/.*github\.com[:/]\(.*\)/\1/' | sed 's/\.git$//')
else
  echo "❌ Remote URL doesn't appear to be a GitHub repository: $REPO_URL"
  exit 1
fi

# Construct authenticated URL
GITHUB_TOKEN="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"
AUTH_URL="https://${GITHUB_TOKEN}@github.com/${REPO_PATH}.git"

echo "📦 Repository: ${REPO_PATH}"
echo "🔍 Checking git status..."

# Check if there are any changes
if git diff-index --quiet HEAD --; then
  echo "✅ No uncommitted changes"
else
  echo "📝 Committing changes..."
  git add -A
  git commit -m "Deploy: Behavioral metrics real-time calculation and HCP mood/opening scene display"
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push "$AUTH_URL" main

if [ $? -eq 0 ]; then
  echo "✅ Successfully pushed to GitHub!"
  echo "🚀 Cloudflare Pages will auto-deploy from GitHub Actions"
  echo "🌐 Your site: https://reflectivai-app-prod.pages.dev"
  echo ""
  echo "⏱️  Deployment usually takes 2-3 minutes"
  echo "📊 Check status: https://github.com/${REPO_PATH}/actions"
else
  echo "❌ Push failed. Check your GitHub token and repository access."
  exit 1
fi
