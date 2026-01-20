# P0 PRODUCTION VERIFICATION CHECKLIST

**Timestamp:** 2026-01-20 16:40 UTC  
**Status:** ⏳ AWAITING DEPLOYMENT

---

## PRE-DEPLOYMENT SUMMARY

### Changes Deployed

**1. Workflow Hardening** (`.github/workflows/deploy-frontend.yml`)
- ✅ Added auto-detection of build output directory
- ✅ Uses `${{ env.OUTPUT_DIR }}` instead of hard-coded `dist`
- ✅ Comprehensive verification of required files
- ✅ Clear error messages if build output changes

**2. API Configuration Logging** (`client/src/lib/queryClient.ts`)
- ✅ Added production diagnostic logging (safe - no secrets)
- ✅ Logs resolved API base URL on app load
- ✅ Shows sample URL for debugging
- ✅ Confirms VITE_WORKER_URL is set

**3. Universal Response Normalization** (ALL AI features)
- ✅ `client/src/pages/knowledge.tsx` - Already fixed
- ✅ `client/src/pages/exercises.tsx` - Already fixed
- ✅ `client/src/pages/modules.tsx` - Already fixed
- ✅ `client/src/pages/frameworks.tsx` - Already fixed (2 mutations)
- ✅ `client/src/pages/chat.tsx` - Fixed 3 locations
- ✅ `client/src/pages/heuristics.tsx` - Fixed
- ✅ `client/src/pages/sql.tsx` - Fixed (2 locations)
- ✅ `client/src/pages/data-reports.tsx` - Fixed (2 locations)

**4. Normalization Utility** (`client/src/lib/normalizeAIResponse.ts`)
- ✅ Already exists and working
- ✅ Handles JSON, markdown, plain text
- ✅ Never throws errors
- ✅ Always returns displayable text

---

## BUILD VERIFICATION

### Local Build Test

```bash
STATIC_BUILD=true GITHUB_PAGES=false VITE_WORKER_URL=https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev npm run build:vite
```

**Result:** ✅ SUCCESS

```
vite v6.4.1 building for production...
transforming...
✓ 2169 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                    3.10 kB │ gzip:   1.24 kB
dist/assets/main-CTwCGS8u.css     84.61 kB │ gzip:  14.16 kB
dist/assets/index-D1BLqv1K.js      2.17 kB │ gzip:   1.11 kB
dist/assets/main-BZWj-f4c.js   1,260.51 kB │ gzip: 325.14 kB
✓ built in 9.91s
```

**Output Directory:** `dist/` (verified)
**Required Files:** ✅ index.html, ✅ _redirects, ✅ 404.html

---

## POST-DEPLOYMENT VERIFICATION

### Step 1: Check Console Logs

**URL:** https://reflectivai-app-prod.pages.dev

**Open browser console (F12) and look for:**

```
[ReflectivAI] 🔍 API Configuration:
  - MODE: production
  - VITE_WORKER_URL: ✅ SET
  - RUNTIME_BASE (window.WORKER_URL): ❌ NOT SET (or ✅ SET)
  - Final API_BASE_URL: https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev
  - Sample URL: https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev/api/health
```

**Expected:**
- [ ] MODE is "production"
- [ ] VITE_WORKER_URL is "✅ SET"
- [ ] Final API_BASE_URL is the Worker URL (not relative /api)
- [ ] Sample URL starts with Worker domain

---

### Step 2: Test Knowledge Base

**URL:** https://reflectivai-app-prod.pages.dev/knowledge

**Steps:**
1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Select any article (e.g., "Active Listening Techniques")
3. Scroll to "Ask AI" section
4. Type: "What is active listening?"
5. Click: "Get Answer"

**Expected Result:**
- [ ] Answer displays (no "Could not parse AI response" error)
- [ ] Network tab shows request to: `https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev/api/knowledge/ask`
- [ ] Response status: 200 OK
- [ ] Console: No red errors

**If Error Occurs:**
- [ ] Record exact error message
- [ ] Record HTTP status code
- [ ] Record response body (first 140 chars)
- [ ] Check if request went to Worker URL or relative /api

---

### Step 3: Test Exercises

**URL:** https://reflectivai-app-prod.pages.dev/exercises

**Steps:**
1. Select any module
2. Click: "Generate Exercise"

**Expected Result:**
- [ ] Exercise questions display
- [ ] No "Unable to generate" error
- [ ] Network request to Worker URL
- [ ] Response status: 200 OK

**If Error Occurs:**
- [ ] Record error message
- [ ] Record status code
- [ ] Check request URL

---

### Step 4: Test Modules (Coaching)

**URL:** https://reflectivai-app-prod.pages.dev/modules

**Steps:**
1. Select any module
2. Click: "Get AI Coaching"

**Expected Result:**
- [ ] Coaching guidance displays
- [ ] No generic error
- [ ] Network request to Worker URL
- [ ] Response status: 200 OK

---

### Step 5: Test Frameworks

**URL:** https://reflectivai-app-prod.pages.dev/frameworks

**Steps:**
1. Select any framework
2. Enter a situation (e.g., "difficult conversation with team member")
3. Click: "Get Advice"
4. Try: "Customize" feature

**Expected Result:**
- [ ] Advice displays
- [ ] Customization displays
- [ ] Both requests go to Worker URL
- [ ] Both return 200 OK

---

### Step 6: Test AI Coach

**URL:** https://reflectivai-app-prod.pages.dev/chat

**Steps:**
1. Type message: "Help me with active listening"
2. Send message

**Expected Result:**
- [ ] AI responds
- [ ] No parse errors
- [ ] Network request to Worker URL
- [ ] Response status: 200 OK

---

### Step 7: Test SQL Features

**URL:** https://reflectivai-app-prod.pages.dev/sql

**Steps:**
1. Enter natural language query: "Show top 10 prescribers"
2. Click: "Translate to SQL"

**Expected Result:**
- [ ] SQL query displays
- [ ] No parse errors
- [ ] Network request to Worker URL
- [ ] Response status: 200 OK

---

### Step 8: Network Verification

**Open Network Tab (F12 → Network)**

**Filter:** XHR/Fetch

**Check ALL AI requests:**
- [ ] ALL requests go to: `https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev/api/*`
- [ ] NO requests go to: `https://reflectivai-app-prod.pages.dev/api/*` (relative)
- [ ] ALL responses are 200 OK (or expected error codes)
- [ ] Response headers include: `x-session-id`

---

### Step 9: Mobile Testing

**Device:** Mobile Safari or Chrome

**Test:**
1. Open: https://reflectivai-app-prod.pages.dev/knowledge
2. Ask AI a question

**Expected Result:**
- [ ] Works on mobile
- [ ] No CORS errors
- [ ] Response displays correctly

---

## ISSUE TRACKING

### Issue Template

If any test fails, record:

```
**Feature:** [Knowledge Base / Exercises / etc.]
**URL:** [exact URL tested]
**Action:** [what you did]
**Expected:** [what should happen]
**Actual:** [what actually happened]
**Status Code:** [HTTP status]
**Request URL:** [full URL from Network tab]
**Response Preview:** [first 140 chars]
**Console Errors:** [any red errors]
**Timestamp:** [when tested]
```

---

## SUCCESS CRITERIA

### All Tests Pass ✅

- [ ] Console shows correct API configuration
- [ ] Knowledge Base works
- [ ] Exercises work
- [ ] Modules work
- [ ] Frameworks work (both advice and customize)
- [ ] AI Coach works
- [ ] SQL features work
- [ ] All requests go to Worker URL (not relative /api)
- [ ] No "Could not parse" errors
- [ ] No "Unable to generate" errors
- [ ] No console errors
- [ ] Works on mobile

### Performance

- [ ] Responses display within 2-5 seconds
- [ ] No visible errors to users
- [ ] Smooth user experience

### Production Ready

- [ ] All features functional
- [ ] Error handling robust
- [ ] Mobile compatible
- [ ] Console clean (no red errors)
- [ ] Network requests correct

---

## ROLLBACK PLAN

If critical issues found:

```bash
# Revert all changes
git revert HEAD~10..HEAD --no-edit
git push origin main
```

This will restore the previous version while we debug.

---

## DEPLOYMENT TIMELINE

- [ ] **16:40 UTC** - Code committed
- [ ] **16:42 UTC** - Pushed to GitHub
- [ ] **16:43 UTC** - GitHub Actions triggered
- [ ] **16:45 UTC** - Deployment complete
- [ ] **16:46 UTC** - Hard refresh + testing begins
- [ ] **16:50 UTC** - All tests complete
- [ ] **16:51 UTC** - Production verified ✅

---

**Status:** ⏳ READY FOR DEPLOYMENT  
**Next Action:** Commit and push to trigger deployment  
**Confidence:** 🟢 HIGH (all parsing logic fixed + workflow hardened)
