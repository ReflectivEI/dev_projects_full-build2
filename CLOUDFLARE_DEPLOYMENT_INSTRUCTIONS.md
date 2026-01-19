# 🚀 CLOUDFLARE PAGES DEPLOYMENT INSTRUCTIONS

**CRITICAL**: Your live site is at: **https://reflectivai-app-prod.pages.dev/**

This site is deployed via **Cloudflare Pages** using a **MANUAL GitHub Actions workflow**.

---

## ✅ WORKFLOW FIXED!

**What was fixed:**
- ✅ Added `GITHUB_PAGES: 'false'` to ensure base path is `/` (root)
- ✅ Workflow now builds with correct asset paths for Cloudflare
- ✅ Removed environment requirement (uses repository secrets directly)

**Commit**: 45aa079

---

## 🎯 HOW TO DEPLOY TO CLOUDFLARE PAGES

### Step 1: Go to GitHub Actions

1. Visit: **https://github.com/ReflectivEI/dev_projects_full-build2/actions**
2. Click on **"Deploy Frontend to Cloudflare Pages (MANUAL ONLY)"** in the left sidebar
3. Click the **"Run workflow"** button (top right)

### Step 2: Configure Deployment

1. **Environment**: Select `production`
2. **Confirm**: Type `DEPLOY` (all caps)
3. Click **"Run workflow"** (green button)

### Step 3: Wait for Deployment

- ⏱️ **Build time**: ~1-2 minutes
- ⏱️ **Deploy time**: ~30 seconds
- ⏱️ **Total time**: ~2-3 minutes

### Step 4: Verify Deployment

1. Visit: **https://reflectivai-app-prod.pages.dev/**
2. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Check that changes are visible

---

## 🔍 CURRENT STATUS

### Last Deployment:
- **Time**: 2026-01-19T05:45:40Z (3+ hours ago)
- **Status**: ✅ Success
- **Issue**: Deployment is outdated - needs manual trigger

### Latest Changes (Not Yet Deployed):
- ✅ PROMPT 11 transparency features
- ✅ Improvement guidance on EI Metrics
- ✅ Performance badges in feedback
- ✅ Observable cues with metric impacts
- ✅ Component breakdown explanations
- ✅ GitHub Pages workflow fixes
- ✅ Cloudflare base path fix

**These changes are in the code but NOT YET DEPLOYED to Cloudflare Pages!**

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deploying:
- [x] Code changes committed to `main` branch
- [x] Build passes locally (`npm run build`)
- [x] Base path configured correctly (`GITHUB_PAGES=false`)
- [x] Workflow file updated (commit 45aa079)
- [ ] **YOU NEED TO**: Manually trigger the workflow

### After Deploying:
- [ ] Check GitHub Actions for green checkmark
- [ ] Visit https://reflectivai-app-prod.pages.dev/
- [ ] Hard refresh browser
- [ ] Verify changes are visible
- [ ] Test all features

---

## 🆘 TROUBLESHOOTING

### If workflow fails:

1. **Check secrets**: Ensure `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set in repository secrets
2. **Check logs**: Click on the failed workflow run to see error messages
3. **Verify confirmation**: Make sure you typed `DEPLOY` (all caps) in the confirmation field

### If changes don't appear:

1. **Hard refresh**: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. **Clear cache**: Clear browser cache completely
3. **Incognito mode**: Open site in private/incognito window
4. **Wait**: Cloudflare CDN can take 1-2 minutes to propagate
5. **Check deployment time**: Verify workflow completed successfully

### If assets fail to load:

1. **Check base path**: Ensure `GITHUB_PAGES=false` in workflow
2. **Check build output**: Verify `dist/client/index.html` has paths like `/assets/...` (not `/dev_projects_full-build2/assets/...`)
3. **Re-run workflow**: Sometimes a fresh deployment fixes CDN issues

---

## 🔄 WORKFLOW COMPARISON

### GitHub Pages (Auto-Deploy):
- **URL**: https://reflectivei.github.io/dev_projects_full-build2/
- **Trigger**: Automatic on push to `main`
- **Base Path**: `/dev_projects_full-build2/`
- **Status**: ✅ Working (auto-deploys)

### Cloudflare Pages (Manual Deploy):
- **URL**: https://reflectivai-app-prod.pages.dev/
- **Trigger**: Manual via GitHub Actions
- **Base Path**: `/` (root)
- **Status**: ⚠️ Outdated (needs manual trigger)

---

## 🎯 ACTION REQUIRED

**TO SEE YOUR CHANGES ON THE LIVE SITE:**

1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2/actions
2. Click: "Deploy Frontend to Cloudflare Pages (MANUAL ONLY)"
3. Click: "Run workflow"
4. Select: `production`
5. Type: `DEPLOY`
6. Click: "Run workflow" (green button)
7. Wait: 2-3 minutes
8. Visit: https://reflectivai-app-prod.pages.dev/
9. Hard refresh: `Ctrl+Shift+R`

**THAT'S IT!** Your changes will be live!

---

## 📊 WHAT WILL BE DEPLOYED

When you trigger the workflow, these features will go live:

### PROMPT 11 Transparency Features:
- ✅ "How to Improve This Score" sections on EI Metrics
- ✅ Performance badges (🔴 Needs Attention, 🟢 Strength)
- ✅ Component breakdown with inline explanations
- ✅ Observable cue tooltips with metric impacts
- ✅ Signal Intelligence Panel with score context

### Core Platform:
- ✅ AI-powered roleplay conversations
- ✅ 8 behavioral metrics with scoring
- ✅ Real-time observable cue detection
- ✅ AI-generated exercises
- ✅ Personalized coaching modules
- ✅ Selling frameworks
- ✅ Knowledge base

---

## ✅ SUMMARY

**Problem**: Cloudflare Pages site is outdated (last deployed 3+ hours ago)

**Solution**: Manually trigger the GitHub Actions workflow

**Fix Applied**: Base path corrected to `/` for Cloudflare (commit 45aa079)

**Action Required**: YOU need to manually trigger the workflow via GitHub Actions UI

**Result**: Your changes will be live at https://reflectivai-app-prod.pages.dev/ in 2-3 minutes

---

**END OF INSTRUCTIONS**
