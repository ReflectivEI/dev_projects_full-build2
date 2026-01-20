#!/bin/bash

# P0 INCIDENT RESOLUTION - DEPLOYMENT SCRIPT
# Run this to push all fixes to production

set -e

echo "🚨 P0 INCIDENT RESOLUTION - DEPLOYING FIXES"
echo "============================================"
echo ""
echo "Repository: ReflectivEI/dev_projects_full-build2"
echo "Branch: main"
echo "Commits: 6 (all AI parsing fixes)"
echo ""

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ ERROR: Not on main branch (currently on: $CURRENT_BRANCH)"
    exit 1
fi

echo "✅ On main branch"
echo ""

# Show commits to be pushed
echo "📊 Commits to be pushed:"
git log origin/main..HEAD --oneline 2>/dev/null || git log --oneline -6
echo ""

# Confirm
read -p "🚀 Push these commits to production? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ PUSH SUCCESSFUL!"
    echo ""
    echo "📊 Monitor deployment:"
    echo "   https://github.com/ReflectivEI/dev_projects_full-build2/actions"
    echo ""
    echo "⏱️  Expected deployment time: 2-3 minutes"
    echo ""
    echo "🔍 After deployment:"
    echo "   1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)"
    echo "   2. Test: https://reflectivai-app-prod.pages.dev/knowledge"
    echo "   3. Ask AI a question"
    echo "   4. ✅ Should work without errors!"
    echo ""
    echo "📄 Full details: See P0_INCIDENT_RESOLUTION_COMPLETE.md"
else
    echo ""
    echo "❌ PUSH FAILED!"
    echo ""
    echo "Common fixes:"
    echo "   1. GitHub CLI: gh auth login"
    echo "   2. Or use PAT: git remote set-url origin https://TOKEN@github.com/ReflectivEI/dev_projects_full-build2.git"
    echo ""
    exit 1
fi
