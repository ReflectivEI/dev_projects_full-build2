# 🧪 TESTING GUIDE — PROMPT #21 FIX

**Date:** January 22, 2026 11:12 UTC  
**Commit:** 9ad3285b  
**Fix:** Worker Response Contract Adapter  
**Status:** 🚀 DEPLOYED

---

## 🎯 WHAT TO TEST

**The 0/5 bug should now be fixed!**

We added a response adapter that normalizes Cloudflare Worker responses to match what the UI expects.

---

## 📝 STEP-BY-STEP TESTING

### Step 1: Wait for Deployment (2-3 minutes)

Check: https://github.com/ReflectivEI/dev_projects_full-build2/actions

Look for green checkmark ✅ on latest workflow

### Step 2: Open Production Site

**IMPORTANT:** Clear your browser cache!

**Option A:** Hard refresh
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Option B:** Open in Incognito/Private window

### Step 3: Open DevTools Console

1. Press `F12` (or right-click → Inspect)
2. Click **Console** tab
3. Clear existing logs (trash icon)
4. Keep console open

### Step 4: Run Role Play Session

**Start Session:**
1. Go to "Role Play" page
2. Select any scenario
3. Click "Start Session"

**Ask Questions:**
1. "How are you managing this situation?"
2. "What's working well for you?"
3. "Tell me more about that."

**End Session:**
1. Click "End Session" button
2. Wait for feedback dialog

### Step 5: Check Console Logs

**Look for these logs:**

```
[WORKER ADAPTER] Raw response: {...}
[WORKER ADAPTER] Detected Worker response, normalizing...
[WORKER ADAPTER] Normalized data: {...}
```

**And:**

```
[CRITICAL DEBUG] Scored Metrics length: 8
[CRITICAL DEBUG] Metric question_quality: {
  overall_score: 2.8,  ← Should be a NUMBER, not null
  not_applicable: false,
  components: [...]
}
```

**And:**

```
[PROMPT #21 DEBUG] Final Display Score: 2.8  ← Should be NON-ZERO
```

### Step 6: Check UI Display

**In the feedback dialog:**

✅ **Overall Score:** Should show something like "3.5/5" (NOT "0/5")  
✅ **Question Quality:** Should show a score like "2.8/5"  
✅ **Listening:** Should show a score  
✅ **Empathy:** Should show a score  
✅ **Other metrics:** Should show scores (except Objection Navigation may be N/A)

---

## ✅ SUCCESS = Scores Display Correctly

**If you see:**
- ✅ Console logs showing `[WORKER ADAPTER]` messages
- ✅ `overall_score` values are numbers (not null)
- ✅ `Final Display Score` is non-zero
- ✅ UI shows scores like "2.8/5" (not "0/5")

**Then the fix is working! 🎉**

---

## ❌ FAILURE = Still Showing 0/5

**If you see:**
- ❌ No `[WORKER ADAPTER]` logs
- ❌ `overall_score: null` in console
- ❌ `Final Display Score: 0`
- ❌ UI shows "0/5" for all metrics

**Then:**
1. Copy ALL console logs
2. Take screenshot of feedback dialog
3. Share with me for diagnosis

---

## 📊 WHAT TO SHARE WITH ME

**Please provide:**

1. **Console logs** - Everything from `[WORKER ADAPTER]`, `[CRITICAL DEBUG]`, `[PROMPT #21 DEBUG]`
2. **Screenshot** of the feedback dialog
3. **Specific scores shown:**
   - Overall: ?
   - Question Quality: ?
   - Listening: ?
   - Empathy: ?
   - etc.

**You can:**
- Copy/paste console logs directly
- Right-click in console → "Save as..." to export
- Use screenshot tool for dialog

---

## ⏱️ TIMING

**Deployment pushed:** 11:10 UTC  
**Expected live:** 11:13 UTC (2-3 minutes)  
**Test after:** 11:15 UTC to be safe

---

## 🔗 USEFUL LINKS

**GitHub Actions:** https://github.com/ReflectivEI/dev_projects_full-build2/actions  
**Latest Commit:** https://github.com/ReflectivEI/dev_projects_full-build2/commit/9ad3285b  
**Documentation:** See `PROMPT_21_MINIMUM_VIABLE_SIGNAL_SEEDING_COMPLETE.md`

---

**I'm ready to help diagnose if you share the test results!**
