#!/bin/bash
# CRITICAL DEPLOYMENT SCRIPT
set -e

echo "🚀 DEPLOYING TO GITHUB NOW..."

# GitHub credentials
GITHUB_TOKEN="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"
GITHUB_REPO="https://github.com/ReflectivEI/dev_projects_full-build2.git"
AUTH_URL="https://${GITHUB_TOKEN}@github.com/ReflectivEI/dev_projects_full-build2.git"

echo "📦 Repository: ReflectivEI/dev_projects_full-build2"

# Configure git
echo "⚙️ Configuring git..."
git config --global user.email "airo@reflectivai.com"
git config --global user.name "Airo Deploy"

# Check if remote exists
if ! git remote | grep -q origin; then
  echo "➕ Adding remote..."
  git remote add origin "$GITHUB_REPO"
else
  echo "✅ Remote already exists"
  git remote set-url origin "$GITHUB_REPO"
fi

# Check for changes
echo "🔍 Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "📝 Committing changes..."
  git add -A
  git commit -m "CRITICAL: Deploy behavioral metrics and HCP mood/opening scene display"
else
  echo "✅ No uncommitted changes"
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push "$AUTH_URL" main --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ✅ ✅ SUCCESSFULLY PUSHED TO GITHUB! ✅ ✅ ✅"
  echo ""
  echo "🚀 Cloudflare Pages will auto-deploy from GitHub Actions"
  echo "🌐 Your site: https://reflectivai-app-prod.pages.dev"
  echo ""
  echo "⏱️  Deployment takes 2-3 minutes"
  echo "📊 Check status: https://github.com/ReflectivEI/dev_projects_full-build2/actions"
  echo ""
  echo "🎉 ALL YOUR WORK IS NOW DEPLOYING!"
else
  echo "❌ Push failed"
  exit 1
fi
