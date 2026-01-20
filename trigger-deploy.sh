#!/bin/bash
# Trigger Cloudflare Pages deployment via GitHub Actions

echo "Triggering deployment to Cloudflare Pages..."

curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${GITHUB_TOKEN}" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/ReflectivEI/dev_projects_full-build2/actions/workflows/deploy-to-cloudflare.yml/dispatches \
  -d '{"ref":"main"}'

if [ $? -eq 0 ]; then
  echo "✅ Deployment triggered successfully!"
  echo "Check status at: https://github.com/ReflectivEI/dev_projects_full-build2/actions"
else
  echo "❌ Failed to trigger deployment"
  exit 1
fi
