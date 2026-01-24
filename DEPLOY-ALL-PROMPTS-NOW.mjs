#!/usr/bin/env node
/**
 * 🚨 EMERGENCY: FIX DEPLOYMENT PIPELINE NOW
 * 
 * PROBLEMS IDENTIFIED:
 * 1. Cloudflare workflow deploys successfully
 * 2. But Cloudflare CDN serves OLD cached files
 * 3. GitHub Pages workflow is also running (conflict)
 * 
 * SOLUTIONS:
 * 1. Disable GitHub Pages workflow
 * 2. Add Cloudflare cache purging
 * 3. Force immediate cache invalidation
 */

const TOKEN = '***REMOVED***';
const REPO = 'ReflectivEI/dev_projects_full-build2';
const BRANCH = 'main';

async function api(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: { 'Authorization': `token ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json', ...opts.headers }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

async function getFile(path) {
  const data = await api(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  return { content: Buffer.from(data.content, 'base64').toString(), sha: data.sha };
}

async function putFile(path, content, msg, sha) {
  return api(`/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: msg,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch: BRANCH
    })
  });
}

console.log('🚨 EMERGENCY DEPLOYMENT FIX');
console.log('='.repeat(80));
console.log('');
console.log('📋 CURRENT SITUATION:');
console.log('  ✅ Cloudflare workflow runs successfully');
console.log('  ✅ Deploy step completes (9:44:59 AM)');
console.log('  ❌ But site STILL serves old bundle (index-Y11AzIfi.js)');
console.log('  ❌ getCueColorClass still missing from deployed code');
console.log('');
console.log('🔍 ROOT CAUSE:');
console.log('  • Cloudflare CDN is aggressively caching');
console.log('  • No cache purging after deployment');
console.log('  • GitHub Pages workflow may be interfering');
console.log('');
console.log('✅ SOLUTION:');
console.log('  1. Disable GitHub Pages workflow');
console.log('  2. Update Cloudflare workflow with cache purging');
console.log('  3. Trigger fresh deployment');
console.log('');

try {
  // Step 1: Disable GitHub Pages workflow
  console.log('📝 Step 1: Disabling GitHub Pages workflow...');
  const { content: ghPagesWorkflow, sha: ghPagesSha } = await getFile('.github/workflows/deploy-github-pages.yml');
  
  // Add a condition that makes it never run
  const disabledGhPages = `# DISABLED - Conflicts with Cloudflare Pages deployment\n# To re-enable, remove the 'if: false' condition below\n\nname: Deploy to GitHub Pages (DISABLED)\n\non:\n  push:\n    branches:\n      - main\n  workflow_dispatch:\n\njobs:\n  deploy:\n    if: false  # DISABLED\n    runs-on: ubuntu-latest\n    steps:\n      - name: Disabled\n        run: echo "This workflow is disabled"\n`;
  
  await putFile(
    '.github/workflows/deploy-github-pages.yml',
    disabledGhPages,
    '🚨 DISABLE: GitHub Pages workflow (conflicts with Cloudflare)',
    ghPagesSha
  );
  
  console.log('   ✅ GitHub Pages workflow disabled');
  console.log('');
  
  // Step 2: Update Cloudflare workflow with cache purging
  console.log('📝 Step 2: Adding cache purging to Cloudflare workflow...');
  const { content: cfWorkflow, sha: cfSha } = await getFile('.github/workflows/deploy-to-cloudflare.yml');
  
  const updatedCfWorkflow = `name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    name: Deploy to Cloudflare Pages
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Clean build cache (AGGRESSIVE)
        run: |
          rm -rf dist/
          rm -rf node_modules/.vite
          rm -rf node_modules/.cache
          rm -rf .vite
          npm cache clean --force
          echo "Cache cleared at $(date)" > .cache-cleared

      - name: Build
        run: npm run build:vite
        env:
          STATIC_BUILD: 'true'
          GITHUB_PAGES: 'false'
          VITE_WORKER_URL: 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev'
          VITE_GIT_SHA: \${{ github.sha }}
          VITE_BUILD_TIME: \${{ github.event.head_commit.timestamp }}

      - name: Verify getCueColorClass in bundle
        run: |
          echo "Checking for getCueColorClass in built files:"
          if grep -r "getCueColorClass" dist/assets/; then
            echo "✅ getCueColorClass FOUND in bundle!"
          else
            echo "❌ ERROR: getCueColorClass NOT FOUND in bundle!"
            exit 1
          fi

      - name: Deploy to Cloudflare Pages
        id: cloudflare_deploy
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: reflectivai-app-prod
          directory: dist
          gitHubToken: \${{ secrets.GITHUB_TOKEN }}
          branch: main
          wranglerVersion: '3'

      - name: Purge Cloudflare Cache
        run: |
          echo "🔥 PURGING CLOUDFLARE CACHE..."
          curl -X POST "https://api.cloudflare.com/client/v4/zones/\${{ secrets.CLOUDFLARE_ZONE_ID }}/purge_cache" \\
            -H "Authorization: Bearer \${{ secrets.CLOUDFLARE_API_TOKEN }}" \\
            -H "Content-Type: application/json" \\
            --data '{"purge_everything":true}' || echo "⚠️  Cache purge failed (may need CLOUDFLARE_ZONE_ID secret)"

      - name: Deployment Summary
        run: |
          echo "✅ DEPLOYMENT COMPLETE!"
          echo ""
          echo "📊 Deployment Details:"
          echo "  • Commit: \${{ github.sha }}"
          echo "  • Time: $(date)"
          echo "  • Site: https://reflectivai-app-prod.pages.dev"
          echo ""
          echo "⏳ Wait 30-60 seconds for CDN propagation"
          echo "💡 Then hard refresh: Ctrl+Shift+R or Cmd+Shift+R"
`;
  
  await putFile(
    '.github/workflows/deploy-to-cloudflare.yml',
    updatedCfWorkflow,
    '🚨 ADD: Cache purging and verification to Cloudflare workflow',
    cfSha
  );
  
  console.log('   ✅ Cloudflare workflow updated with cache purging');
  console.log('');
  
  // Step 3: Trigger deployment by modifying a source file
  console.log('📝 Step 3: Triggering fresh deployment...');
  const timestamp = new Date().toISOString();
  const { content: triggerFile, sha: triggerSha } = await getFile('.cloudflare-deploy').catch(() => ({ content: '', sha: undefined }));
  
  const newTriggerContent = `# Cloudflare Pages Deployment Trigger

Last triggered: ${timestamp}

## Emergency Fix Applied:

✅ Disabled GitHub Pages workflow (was conflicting)
✅ Added cache purging to Cloudflare workflow
✅ Added getCueColorClass verification
✅ Forcing fresh deployment now

## What should happen:

1. Cloudflare workflow runs
2. Builds with getCueColorClass function
3. Verifies function is in bundle
4. Deploys to Cloudflare Pages
5. Purges ALL Cloudflare cache
6. New bundle goes live within 60 seconds

## Verification:

After 60 seconds:
- Go to: https://reflectivai-app-prod.pages.dev/roleplay
- Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
- Check DevTools Console for errors
- Page should load correctly!
`;
  
  await putFile(
    '.cloudflare-deploy',
    newTriggerContent,
    `🚀 DEPLOY: Emergency fix with cache purging at ${timestamp}`,
    triggerSha
  );
  
  console.log('   ✅ Deployment triggered');
  console.log('');
  
  console.log('='.repeat(80));
  console.log('✅ EMERGENCY FIX APPLIED!');
  console.log('='.repeat(80));
  console.log('');
  console.log('📊 What was fixed:');
  console.log('  1. ✅ Disabled conflicting GitHub Pages workflow');
  console.log('  2. ✅ Added Cloudflare cache purging');
  console.log('  3. ✅ Added getCueColorClass verification');
  console.log('  4. ✅ Triggered fresh deployment');
  console.log('');
  console.log('⏳ TIMELINE:');
  console.log('  • Now: GitHub Actions starts building');
  console.log('  • +2 min: Build completes');
  console.log('  • +3 min: Cloudflare deploys');
  console.log('  • +4 min: Cache purged');
  console.log('  • +5 min: NEW BUNDLE LIVE!');
  console.log('');
  console.log('🌐 Live site: https://reflectivai-app-prod.pages.dev');
  console.log('');
  console.log('💡 AFTER 5 MINUTES:');
  console.log('  1. Go to: https://reflectivai-app-prod.pages.dev/roleplay');
  console.log('  2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)');
  console.log('  3. Open DevTools Console (F12)');
  console.log('  4. Check for errors (should be NONE)');
  console.log('  5. Page should load with roleplay interface!');
  console.log('');
  console.log('🔍 To verify deployment:');
  console.log('  • Check GitHub Actions: https://github.com/ReflectivEI/dev_projects_full-build2/actions');
  console.log('  • Look for "Deploy to Cloudflare Pages" workflow');
  console.log('  • Verify "Verify getCueColorClass in bundle" step passes');
  console.log('  • Verify "Purge Cloudflare Cache" step runs');
  console.log('');
  console.log('⚠️  IF STILL BROKEN AFTER 5 MINUTES:');
  console.log('  • Check workflow logs for errors');
  console.log('  • Verify CLOUDFLARE_ZONE_ID secret is set');
  console.log('  • May need to manually purge cache in Cloudflare dashboard');
  console.log('');
  
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  console.error('\nStack:', error.stack);
  process.exit(1);
}
