# ✅ CORRECT LIVE SITE - CLOUDFLARE PAGES

**Date:** January 22, 2026 15:10 UTC

---

## 🎯 CORRECT LIVE PRODUCTION SITE

**✅ LIVE SITE:** https://reflectivai-app-prod.pages.dev/

### Direct Page Links:
- **Role Play:** https://reflectivai-app-prod.pages.dev/roleplay
- **EI Metrics:** https://reflectivai-app-prod.pages.dev/ei-metrics
- **Dashboard:** https://reflectivai-app-prod.pages.dev/dashboard
- **Frameworks:** https://reflectivai-app-prod.pages.dev/frameworks
- **Knowledge:** https://reflectivai-app-prod.pages.dev/knowledge
- **Modules:** https://reflectivai-app-prod.pages.dev/modules
- **Exercises:** https://reflectivai-app-prod.pages.dev/exercises

---

## ❌ INCORRECT URLS (DO NOT USE)

**❌ GitHub Repository (NOT the live site):**
- https://github.com/ReflectivEI/dev_projects_full-build2

**❌ GitHub Pages (NOT used for this project):**
- https://reflectivei.github.io/dev_projects_full-build2/

**❌ Preview URL (Development only):**
- http://uo4alx2j8w.preview.c24.airoapp.ai

---

## 🚀 DEPLOYMENT ARCHITECTURE

### Production Deployment:
- **Platform:** Cloudflare Pages
- **Project Name:** `reflectivai-app-prod`
- **Branch:** `main`
- **Build Command:** `npm run build:vite`
- **Output Directory:** `dist/`
- **Deployment Trigger:** Push to `main` branch or manual workflow dispatch

### Deployment Workflow:
1. **Push to GitHub** → `main` branch
2. **GitHub Actions** → `.github/workflows/deploy-to-cloudflare.yml`
3. **Build Process:**
   - Install dependencies: `npm ci`
   - Clean cache: `rm -rf dist/ node_modules/.vite`
   - Build: `npm run build:vite`
   - Environment variables:
     - `STATIC_BUILD='true'`
     - `GITHUB_PAGES='false'`
     - `VITE_WORKER_URL='https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev'`
4. **Deploy to Cloudflare** → `reflectivai-app-prod` project
5. **Live Site Updated** → https://reflectivai-app-prod.pages.dev/

### Backend API:
- **Worker URL:** https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev
- **Platform:** Cloudflare Workers
- **Purpose:** Role Play AI responses, scoring, feedback generation

---

## 📊 DEPLOYMENT STATUS

### Latest Deployment:
- **Commit:** e7c1e5b3 (PROMPT #20 - Metric Applicability Promotion)
- **Date:** January 22, 2026
- **Status:** ⚠️ NEEDS VERIFICATION
- **Changes:**
  - Metric applicability promotion implemented
  - `not_applicable` flag now checks for applicable components OR metric signals
  - Frontend/backend scoring in sync

### Previous Deployments:
- **PROMPT #19:** Metric-scoped signal attribution
- **PROMPT #18:** Weak signal applicability fix
- **PROMPT #17:** 0-of-5 bug fix
- **PROMPT #16:** Metrics version alignment

---

## 🧪 HOW TO TEST THE LIVE SITE

### Quick Test:
1. Go to: https://reflectivai-app-prod.pages.dev/roleplay
2. Start a Role Play
3. Have a conversation (5-10 exchanges)
4. End session
5. Check feedback dialog for scores
6. Navigate to: https://reflectivai-app-prod.pages.dev/ei-metrics
7. Verify scores are displayed

### Full Test:
See: `LIVE_SITE_SCORING_TEST_PLAN.md`

---

## 🔍 HOW TO CHECK DEPLOYMENT STATUS

### GitHub Actions:
1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2/actions
2. Look for "Deploy to Cloudflare Pages" workflow
3. Check latest run status
4. Click on run to see build logs

### Cloudflare Dashboard:
1. Log in to Cloudflare
2. Go to Pages
3. Select `reflectivai-app-prod` project
4. Check deployment history
5. View build logs

### Live Site:
1. Visit: https://reflectivai-app-prod.pages.dev/
2. Open browser DevTools (F12)
3. Check Console for build info:
   ```javascript
   // Should see build timestamp and git SHA
   console.log('Build:', import.meta.env.VITE_BUILD_TIME)
   console.log('Commit:', import.meta.env.VITE_GIT_SHA)
   ```

---

## 🐛 DEBUGGING TIPS

### If Live Site Doesn't Match Local:

1. **Check GitHub Actions:**
   - https://github.com/ReflectivEI/dev_projects_full-build2/actions
   - Look for failed deployments
   - Check build logs for errors

2. **Check Cloudflare Deployment:**
   - Log in to Cloudflare Dashboard
   - Check `reflectivai-app-prod` project
   - Verify latest deployment succeeded
   - Check deployment timestamp

3. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear cache in DevTools
   - Or use incognito/private window

4. **Check Build Output:**
   - In GitHub Actions, check "Verify build output" step
   - Look for file listings
   - Check for grep results (new code detection)

5. **Check Environment Variables:**
   - Verify `VITE_WORKER_URL` is set correctly
   - Check `STATIC_BUILD='true'`
   - Verify `GITHUB_PAGES='false'`

---

## 📝 DEPLOYMENT CHECKLIST

### Before Deploying:
- [ ] All changes committed to `main` branch
- [ ] Local build succeeds: `npm run build:vite`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No console errors in local preview

### After Deploying:
- [ ] GitHub Actions workflow completes successfully
- [ ] Cloudflare deployment shows "Success"
- [ ] Live site loads: https://reflectivai-app-prod.pages.dev/
- [ ] No console errors in browser DevTools
- [ ] Test critical features (Role Play, EI Metrics)
- [ ] Verify scoring system works

---

## 🚨 EMERGENCY ROLLBACK

### If Live Site is Broken:

1. **Identify Last Working Commit:**
   - Check GitHub Actions history
   - Find last successful deployment
   - Note commit SHA

2. **Revert to Last Working Version:**
   ```bash
   git revert <broken-commit-sha>
   git push origin main
   ```

3. **Or Rollback in Cloudflare:**
   - Go to Cloudflare Dashboard
   - Select `reflectivai-app-prod` project
   - Find last working deployment
   - Click "Rollback to this deployment"

4. **Verify Rollback:**
   - Check live site: https://reflectivai-app-prod.pages.dev/
   - Test critical features
   - Confirm site is working

---

## 📞 SUPPORT

### If You Need Help:

**Provide:**
1. **Live Site URL:** https://reflectivai-app-prod.pages.dev/
2. **Specific Page:** (e.g., /roleplay, /ei-metrics)
3. **What's Broken:** Describe the issue
4. **Console Errors:** From browser DevTools
5. **GitHub Actions Link:** Link to failed workflow run
6. **Screenshots:** Visual evidence of the issue

**Do NOT provide:**
- GitHub repository URL (that's not the live site)
- GitHub Pages URL (not used for this project)
- Preview URL (that's development only)

---

## ✅ SUMMARY

**REMEMBER:**
- ✅ **LIVE SITE:** https://reflectivai-app-prod.pages.dev/
- ✅ **Platform:** Cloudflare Pages
- ✅ **Deployment:** Automatic on push to `main`
- ✅ **Backend:** Cloudflare Worker at https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev

**ALWAYS use the Cloudflare Pages URL when testing the live production site!**

---

**End of Document**
