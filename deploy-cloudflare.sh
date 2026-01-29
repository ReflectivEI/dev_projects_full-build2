#!/bin/bash

# Deploy to Cloudflare Pages
# Run this script with: bash deploy-cloudflare.sh

set -e

echo "🔨 Building application..."
npm run build:vite

echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=reflectivai-app-prod

echo "✅ Deployment complete!"
echo "🌐 Site: https://reflectivai-app-prod.pages.dev/"
echo ""
echo "Verifying deployment..."
curl -s "https://reflectivai-app-prod.pages.dev/version.json"
echo ""
echo "✅ Done!"
