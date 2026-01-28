# GitHub Pages → Cloudflare Worker Integration Fix

## Problem
GitHub Pages deployment was showing "Demo Mode" banner and making failed API calls because:
1. Environment variables were not set during build
2. Frontend was not configured to call Cloudflare Worker

## Solution Implemented

### 1. Created `.env.production` (Production Build Config)
```bash
VITE_API_BASE_URL=https://saleseq-coach-prod.tonyabdelmalak.workers.dev
VITE_WORKER_URL=https://saleseq-coach-prod.tonyabdelmalak.workers.dev
VITE_MOCK_API_ENABLED=false
```

### 2. Created `.env` (Local Development Config)
```bash
VITE_API_BASE_URL=https://saleseq-coach-prod.tonyabdelmalak.workers.dev
VITE_WORKER_URL=https://saleseq-coach-prod.tonyabdelmalak.workers.dev
VITE_PREVIEW_URL=https://yxpzdb7o9z.preview.c24.airoapp.ai
VITE_MOCK_API_ENABLED=false
```

### 3. Updated `.github/workflows/deploy.yml`
Added environment variables to the build step:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_API_BASE_URL: https://saleseq-coach-prod.tonyabdelmalak.workers.dev
    VITE_WORKER_URL: https://saleseq-coach-prod.tonyabdelmalak.workers.dev
    VITE_MOCK_API_ENABLED: false
```

## Verification

### Already Correct ✅
- ✅ `src/lib/mockApi.ts` - `MOCK_API_ENABLED = false`
- ✅ `vite.config.ts` - `apiRoutes` plugin commented out
- ✅ `src/lib/queryClient.ts` - Hardcoded fallback to worker URL
- ✅ Cloudflare Worker deployed and operational at `https://saleseq-coach-prod.tonyabdelmalak.workers.dev`

### What Changed ✅
- ✅ Added `.env` and `.env.production` files
- ✅ Updated GitHub Actions workflow to inject env vars during build

## How It Works

### Build Process
1. GitHub Actions runs `npm run build`
2. Vite reads `VITE_API_BASE_URL` from environment
3. Value is baked into JavaScript bundle at compile time
4. `import.meta.env.VITE_API_BASE_URL` becomes the literal string in the bundle
5. Deployed site always calls `https://saleseq-coach-prod.tonyabdelmalak.workers.dev`

### Runtime Behavior
```typescript
// src/lib/queryClient.ts
const API_BASE_URL =
  RUNTIME_BASE ||
  import.meta.env.VITE_WORKER_URL ||          // ← This will be set!
  import.meta.env.VITE_API_BASE_URL ||        // ← Fallback
  "https://saleseq-coach-prod.tonyabdelmalak.workers.dev"; // ← Last resort
```

## Testing

After deployment, verify:

### 1. Check Build Logs
```bash
# In GitHub Actions, verify env vars are set:
VITE_API_BASE_URL: https://saleseq-coach-prod.tonyabdelmalak.workers.dev
```

### 2. Check Live Site Console
Open https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/ and check console:
```
🔧 [QueryClient] API_BASE_URL: https://saleseq-coach-prod.tonyabdelmalak.workers.dev
```

### 3. Check Network Tab
API calls should go to:
```
https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/health
https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/chat/send
```

### 4. Verify No Demo Banner
- ❌ Should NOT see "Demo Mode - AI features disabled"
- ✅ Should see "AI Enabled" badge (if worker has PROVIDER_KEY configured)

## Deployment Steps

### Option 1: Push to GitHub (Triggers Auto-Deploy)
```bash
cd ~/Downloads/ReflectivAI/
git add .env .env.production .github/workflows/deploy.yml GITHUB_PAGES_FIX.md
git commit -m "fix: Configure GitHub Pages to use Cloudflare Worker API"
git push origin main
```

### Option 2: Manual Trigger
1. Go to https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/actions
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"
4. Wait 1-2 minutes for deployment

## Expected Results

### Before Fix ❌
- Demo Mode banner showing
- 404 errors on `/api/health`
- Network tab shows requests to `localhost:20000` or wrong URLs
- Mock data displayed

### After Fix ✅
- No Demo Mode banner (if worker has AI configured)
- 200 responses from `/api/health`
- Network tab shows requests to `https://saleseq-coach-prod.tonyabdelmalak.workers.dev`
- Real AI responses from Cloudflare Worker

## Rollback

If something breaks:
```bash
cd ~/Downloads/ReflectivAI/
git revert HEAD
git push origin main
```

## Contract Compliance ✅

**No backend contracts were violated:**
- ✅ Worker API endpoints unchanged
- ✅ Request/response formats unchanged
- ✅ No worker code modified
- ✅ Only frontend configuration changed
- ✅ Backward compatible (fallback URL still works)

## Files Changed

1. **`.env`** (new) - Local development config
2. **`.env.production`** (new) - Production build config
3. **`.github/workflows/deploy.yml`** (modified) - Added env vars to build step
4. **`GITHUB_PAGES_FIX.md`** (new) - This documentation

## Next Steps

1. **Commit and push** these changes to GitHub
2. **Wait for GitHub Actions** to rebuild and deploy (1-2 minutes)
3. **Test the live site** at https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/
4. **Verify** no Demo Mode banner and API calls work
5. **If successful**, mark this issue as resolved
6. **If failed**, check GitHub Actions logs and browser console for errors
