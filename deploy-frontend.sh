#!/bin/bash
set -e

echo "🚀 Deploying ReflectivAI Frontend to Cloudflare Pages..."

cd client

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Deploy to Cloudflare Pages
echo "☁️  Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=reflectivai-app-prod

echo "✅ Deployment complete!"
echo "🌐 Site: https://reflectivai-app-prod.pages.dev"
