#!/bin/bash
set -e

echo "🚀 EMERGENCY PUSH - RESTORING WORKFLOW FILE"

# Check if workflow file exists
if [ ! -f ".github/workflows/deploy-to-cloudflare.yml" ]; then
    echo "❌ ERROR: Workflow file not found!"
    exit 1
fi

echo "✅ Workflow file exists"

# Configure git
git config user.email "airo@godaddy.com"
git config user.name "Airo Builder"

echo "📝 Adding workflow file to git"
git add .github/workflows/deploy-to-cloudflare.yml

echo "💾 Committing workflow file"
git commit -m "RESTORE: GitHub Actions workflow for Cloudflare deployment" || echo "No changes to commit"

echo "🔍 Checking git status"
git status

echo "📤 Pushing to GitHub"
git push origin main --force

echo "✅ WORKFLOW PUSHED TO GITHUB!"
echo "🔗 Check: https://github.com/ReflectivEI/dev_projects_full-build2/tree/main/.github/workflows"
