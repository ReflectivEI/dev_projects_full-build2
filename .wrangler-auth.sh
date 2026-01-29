#!/bin/bash
# Paste your Cloudflare API token when prompted
read -sp "Enter your Cloudflare API Token: " CF_TOKEN
echo ""
export CLOUDFLARE_API_TOKEN="$CF_TOKEN"
echo "✅ Token set! Now deploying..."
npm run build:vite && npx wrangler pages deploy dist --project-name=reflectivai-app-prod
