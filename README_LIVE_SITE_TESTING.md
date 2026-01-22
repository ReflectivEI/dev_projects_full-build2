# 🚀 LIVE SITE TESTING - QUICK START

**Last Updated:** January 22, 2026 15:20 UTC

---

## ⚡ QUICK START (30 seconds)

### ✅ CORRECT LIVE SITE:
**https://reflectivai-app-prod.pages.dev/**

### 🧪 Quick Test:
1. Go to: https://reflectivai-app-prod.pages.dev/roleplay
2. Start a Role Play
3. Have a conversation (5-10 exchanges)
4. End session
5. Check feedback dialog for scores

---

## 📍 IMPORTANT URLS

### ✅ CORRECT (Use These):
- **Live Site:** https://reflectivai-app-prod.pages.dev/
- **Role Play:** https://reflectivai-app-prod.pages.dev/roleplay
- **EI Metrics:** https://reflectivai-app-prod.pages.dev/ei-metrics
- **GitHub Actions:** https://github.com/ReflectivEI/dev_projects_full-build2/actions

### ❌ WRONG (Don't Use):
- ❌ GitHub Repo: https://github.com/ReflectivEI/dev_projects_full-build2
- ❌ GitHub Pages: https://reflectivei.github.io/dev_projects_full-build2/
- ❌ Preview: http://uo4alx2j8w.preview.c24.airoapp.ai

---

## 📊 WHAT TO TEST

### Priority 1: Scoring System
- ✅ Do metrics show scores (not all 3.0)?
- ✅ Do metrics with signals show scores > 1?
- ✅ Are "Not Applicable" metrics truly non-applicable?
- ✅ Do components show scores > 0?
- ✅ Is observable evidence displayed?

### Priority 2: Score Persistence
- ✅ Do scores save to EI Metrics page?
- ✅ Do scores persist after page refresh?

### Priority 3: AI Pages
- ✅ Do Frameworks, Knowledge, Modules, Exercises pages load?
- ✅ Are AI coaching features working?

---

## 📝 DETAILED DOCUMENTATION

### Full Test Plan:
- **File:** `LIVE_SITE_SCORING_TEST_PLAN.md`
- **What:** Comprehensive test scenarios, checklists, debugging tips

### Deployment Info:
- **File:** `CORRECT_LIVE_SITE_CLOUDFLARE.md`
- **What:** Deployment architecture, status, troubleshooting

### Verification Guide:
- **File:** `PROMPT_20_DEPLOYMENT_VERIFICATION.md`
- **What:** What was deployed, expected behavior, debugging

---

## 🐛 HOW TO REPORT ISSUES

### Quick Report:

**Issue:** [Brief description]

**URL:** https://reflectivai-app-prod.pages.dev/[page]

**Expected:** [What should happen]

**Actual:** [What actually happened]

**Console Errors:** [Paste from DevTools]

**localStorage:** [Run: `console.log(localStorage.getItem('roleplay_scores_latest'))`]

---

## ✅ DEPLOYMENT STATUS

### Latest Changes:
- **PROMPT #20:** Metric Applicability Promotion
- **PROMPT #19:** Metric-Scoped Signal Attribution
- **PROMPT #18:** Weak Signal Applicability Fix
- **PROMPT #17:** 0-of-5 Bug Fix

### Current Status:
- **Workspace:** ✅ All fixes applied
- **GitHub:** ✅ Pushed to main (commit e7c1e5b3)
- **Cloudflare:** ⚠️ NEEDS VERIFICATION
- **Live Site:** ⚠️ NEEDS TESTING

---

## 🚀 NEXT STEPS

### If Testing Passes:
1. ✅ Mark PROMPT #20 as verified
2. ✅ Move to PROMPT #21 (Minimum Viable Signal Seeding)

### If Testing Fails:
1. 🐛 Report issues with details
2. 🔍 Analyze root cause
3. 🔧 Apply fixes
4. 🚀 Redeploy

---

**REMEMBER: Always test on https://reflectivai-app-prod.pages.dev/ (Cloudflare Pages)**
