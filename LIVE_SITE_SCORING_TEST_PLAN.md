# 🎯 LIVE SITE SCORING SYSTEM TEST PLAN

**Live Production URL:** https://reflectivai-app-prod.pages.dev/

**Date:** January 22, 2026 15:05 UTC  
**Focus:** Signal Intelligence Scoring System (based on uploaded source of truth document)

---

## ⚠️ CRITICAL: CORRECT LIVE SITE URL

**✅ CORRECT LIVE SITE:** https://reflectivai-app-prod.pages.dev/  
**❌ WRONG (GitHub Repo):** https://github.com/ReflectivEI/dev_projects_full-build2  
**❌ WRONG (GitHub Pages):** https://reflectivei.github.io/dev_projects_full-build2/

**This is a Cloudflare Pages deployment, NOT GitHub Pages!**

---

## 📋 WHAT TO TEST

### Critical Scoring Features:

1. **Role Play Page** - Signal Intelligence scoring during conversations
2. **EI Metrics Page** - Display of scored metrics from Role Play sessions
3. **Signal Intelligence Panel** - Real-time signal detection and metric scoring
4. **Feedback Dialog** - Comprehensive scoring breakdown after Role Play
5. **Score Persistence** - Scores saved to localStorage and displayed on EI Metrics page

---

## 🧪 TEST SCENARIOS

### Test 1: Role Play - Complete Conversation with Scoring

**URL:** https://reflectivai-app-prod.pages.dev/roleplay

**Steps:**
1. Navigate to Role Play page
2. Select a scenario (e.g., "Skeptical Physician")
3. Click "Start Role Play"
4. Have a conversation (at least 5-10 exchanges)
5. Click "End Session"

**Expected Results:**
✅ **During Conversation:**
- Signal Intelligence Panel shows detected signals in real-time
- Signals categorized by type (verbal, conversational, engagement, contextual)
- Each signal has interpretation and evidence

✅ **After Ending Session:**
- Feedback dialog appears
- Shows overall score (1-5 scale)
- Shows individual metric scores for:
  - Active Listening
  - Empathy & Rapport
  - Objection Navigation
  - Value Communication
  - Adaptability
  - Stakeholder Insight
- Each metric shows:
  - Score (1-5)
  - Component breakdown
  - Observable evidence
  - Scoring method
- Metrics marked as "Not Applicable" if no signals detected

**What to Check:**
- ❌ Are all metrics showing default score of 3.0?
- ❌ Are metrics showing "Not Applicable" when they should have scores?
- ❌ Are component scores all 0 or null?
- ❌ Is the feedback dialog blank or missing data?
- ✅ Are scores calculated based on detected signals?
- ✅ Do metrics with signals show scores > 1?
- ✅ Do metrics without signals show "Not Applicable" (for optional metrics)?

---

### Test 2: EI Metrics Page - Score Display

**URL:** https://reflectivai-app-prod.pages.dev/ei-metrics

**Steps:**
1. Complete a Role Play session (Test 1)
2. Navigate to EI Metrics page
3. Check displayed scores

**Expected Results:**
✅ **Metrics Display:**
- Each metric card shows:
  - Metric name
  - Current score (from last Role Play)
  - Performance level badge (Exceptional/Strong/Developing/Emerging/Needs Focus)
  - "✓ Scored from recent Role Play" (if score ≠ 3.0)
  - "Not yet scored" (if score = 3.0)

✅ **Score Persistence:**
- Scores from Role Play session are saved
- Scores persist across page refreshes
- Scores stored in localStorage

**What to Check:**
- ❌ Are all metrics showing default 3.0?
- ❌ Are scores not updating after Role Play?
- ❌ Do scores reset after page refresh?
- ✅ Do metrics show actual scores from Role Play?
- ✅ Do scores persist after refresh?
- ✅ Can you click a metric to see details?

---

### Test 3: Signal Intelligence Panel - Real-Time Detection

**URL:** https://reflectivai-app-prod.pages.dev/roleplay

**Steps:**
1. Start a Role Play
2. Type messages that trigger specific signals:
   - "I understand your concern about..." (Active Listening)
   - "That makes sense, and..." (Empathy)
   - "I hear you saying..." (Paraphrasing)
   - "What matters most to you?" (Stakeholder Insight)
3. Watch Signal Intelligence Panel

**Expected Results:**
✅ **Signal Detection:**
- Signals appear in real-time as you type
- Each signal shows:
  - Type badge (Verbal/Conversational/Engagement/Contextual)
  - Signal description
  - Interpretation
  - Evidence (your actual text)

✅ **Metric Scoring:**
- Behavioral Metrics section shows:
  - List of metrics with scores
  - Scores update as signals are detected
  - Hover over metric to see "What influenced this?"
  - Click to see observable cues

**What to Check:**
- ❌ Are signals not appearing?
- ❌ Are metrics not updating?
- ❌ Are all metric scores showing 0 or null?
- ✅ Do signals appear as you type?
- ✅ Do metrics update with scores?
- ✅ Can you see evidence for each signal?

---

### Test 4: Feedback Dialog - Comprehensive Breakdown

**URL:** https://reflectivei.github.io/dev_projects_full-build2/roleplay

**Steps:**
1. Complete a Role Play session
2. Click "End Session"
3. Review feedback dialog
4. Check each tab:
   - Overview
   - Behavioral Metrics
   - Examples
   - Next Steps

**Expected Results:**
✅ **Overview Tab:**
- Overall score (1-5)
- Performance level
- Top strengths (3-5 items)
- Priority improvements (3-5 items)
- Overall summary

✅ **Behavioral Metrics Tab:**
- Table with all metrics
- Each row shows:
  - Metric name
  - Score (1-5 or "N/A")
  - Components (expandable)
  - Observable Evidence (with cue badges)
  - Definition
  - Scoring method

✅ **Components Breakdown:**
- Click to expand components
- Shows individual component scores
- Shows which components are applicable
- Shows evidence for each component

**What to Check:**
- ❌ Is the dialog blank?
- ❌ Are all metrics showing "N/A"?
- ❌ Are component scores all 0?
- ❌ Is observable evidence missing?
- ✅ Do metrics show actual scores?
- ✅ Can you expand components?
- ✅ Is evidence displayed with cue badges?
- ✅ Do definitions and scoring methods appear?

---

## 🔍 SPECIFIC BUGS TO CHECK

### Bug 1: Default Scores (3.0) Not Being Replaced
**Symptom:** All metrics show 3.0 even after Role Play  
**Root Cause:** Scoring logic not running or not detecting signals  
**Fix Applied:** PROMPT #19, #20, #21 (metric-scoped signal attribution)

**Test:**
1. Complete Role Play with clear signals
2. Check if metrics show scores other than 3.0
3. Check if metrics with signals show score ≥ 1

---

### Bug 2: "Not Applicable" Flag Incorrectly Set
**Symptom:** Metrics show "N/A" even when signals detected  
**Root Cause:** `not_applicable` flag not checking for signals  
**Fix Applied:** PROMPT #20 (metric applicability promotion)

**Test:**
1. Complete Role Play
2. Check feedback dialog
3. Verify metrics with signals do NOT show "N/A"
4. Verify only truly non-applicable metrics show "N/A"

---

### Bug 3: Component Scores All 0 or Null
**Symptom:** Components show 0 score even when applicable  
**Root Cause:** Signal attribution not promoting components to applicable  
**Fix Applied:** PROMPT #19 (metric-scoped signal attribution)

**Test:**
1. Complete Role Play
2. Expand components in feedback dialog
3. Check if components show scores > 0
4. Check if at least one component per metric is applicable

---

### Bug 4: Observable Evidence Missing
**Symptom:** "No observable evidence detected" even when signals exist  
**Root Cause:** Cue detection not running or not mapped to metrics  
**Fix Applied:** Observable cue system integrated

**Test:**
1. Complete Role Play
2. Check feedback dialog
3. Verify observable evidence section shows cue badges
4. Verify cues are mapped to correct metrics

---

## 📊 SCORING SYSTEM ARCHITECTURE

### How Scoring Works:

1. **Signal Detection** (`signal-detector.ts`)
   - Detects signals in conversation text
   - Categorizes by type (verbal, conversational, etc.)
   - Provides evidence and interpretation

2. **Metric Scoring** (`scoring.ts`)
   - Uses `scoreConversation(transcript)` function
   - Processes transcript into metric scores
   - Applies metric-scoped signal attribution
   - Calculates component scores
   - Determines applicability

3. **Score Storage** (`score-storage.ts`)
   - Saves scores to localStorage
   - Key: `roleplay_scores_latest`
   - Format: `{ scores: { metricId: score }, timestamp: ISO }`

4. **Score Display** (`ei-metrics.tsx`)
   - Loads scores from localStorage
   - Displays on metric cards
   - Shows performance levels
   - Provides improvement guidance

### Key Files:
- `src/lib/signal-intelligence/scoring.ts` - Core scoring logic
- `src/lib/signal-intelligence/metrics-spec.ts` - Metric definitions (source of truth)
- `src/lib/signal-intelligence/signal-detector.ts` - Signal detection
- `src/lib/signal-intelligence/score-storage.ts` - Score persistence
- `src/pages/roleplay.tsx` - Role Play page with scoring
- `src/pages/ei-metrics.tsx` - EI Metrics display
- `src/components/signal-intelligence-panel.tsx` - Real-time signal panel
- `src/components/roleplay-feedback-dialog.tsx` - Feedback dialog

---

## 🚨 KNOWN ISSUES

### Issue 1: AI Pages Going Blank
**Status:** ✅ FIXED (server restart applied)  
**Affected Pages:** Frameworks, Knowledge, Modules, Exercises  
**Cause:** Syntax error in roleplay.tsx  
**Fix:** Server restarted with clean code

### Issue 2: Scoring System Not Working
**Status:** ⚠️ NEEDS TESTING ON LIVE SITE  
**Affected Pages:** Role Play, EI Metrics  
**Cause:** Multiple fixes applied (PROMPT #19, #20, #21)  
**Fix:** Metric-scoped signal attribution, applicability promotion

---

## ✅ TESTING CHECKLIST

### Pre-Test Setup:
- [ ] Clear browser cache
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Open browser DevTools (F12)
- [ ] Open Console tab
- [ ] Open Network tab

### During Testing:
- [ ] Watch for console errors
- [ ] Check network requests to Worker API
- [ ] Monitor localStorage updates
- [ ] Take screenshots of issues

### Test 1: Role Play Scoring
- [ ] Start Role Play
- [ ] Have conversation (5-10 exchanges)
- [ ] Check Signal Intelligence Panel
- [ ] End session
- [ ] Review feedback dialog
- [ ] Check metric scores
- [ ] Check component breakdown
- [ ] Check observable evidence

### Test 2: EI Metrics Display
- [ ] Navigate to EI Metrics page
- [ ] Check if scores updated
- [ ] Refresh page
- [ ] Check if scores persisted
- [ ] Click on a metric
- [ ] Review detail dialog

### Test 3: Score Persistence
- [ ] Complete Role Play
- [ ] Note scores in feedback
- [ ] Navigate to EI Metrics
- [ ] Verify scores match
- [ ] Close browser
- [ ] Reopen browser
- [ ] Navigate to EI Metrics
- [ ] Verify scores still present

---

## 🐛 HOW TO REPORT ISSUES

### If Scoring is Broken:

**Provide:**
1. **URL:** Which page (Role Play, EI Metrics, etc.)
2. **Steps:** What you did
3. **Expected:** What should happen
4. **Actual:** What actually happened
5. **Console Errors:** Copy from browser console
6. **Screenshots:** Visual evidence
7. **localStorage Data:** Run in console:
   ```javascript
   console.log(localStorage.getItem('roleplay_scores_latest'))
   ```

### Console Commands for Debugging:

```javascript
// Check localStorage scores
console.log(JSON.parse(localStorage.getItem('roleplay_scores_latest')))

// Clear scores
localStorage.removeItem('roleplay_scores_latest')

// Check all localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

---

## 📈 SUCCESS CRITERIA

### Scoring System is Working If:

✅ **Role Play:**
- Signals appear during conversation
- Metrics show scores after session ends
- Feedback dialog displays comprehensive breakdown
- Component scores are calculated
- Observable evidence is displayed

✅ **EI Metrics:**
- Scores update after Role Play
- Scores persist across page refreshes
- Metrics show performance levels
- Detail dialogs display correctly

✅ **Score Accuracy:**
- Metrics with signals show scores > 1
- Metrics without signals show "N/A" (optional) or 1 (required)
- Component scores reflect detected signals
- Overall scores are calculated correctly

---

## 🎯 NEXT STEPS

### After Testing:

1. **If Everything Works:**
   - ✅ Mark scoring system as verified
   - ✅ Document any edge cases
   - ✅ Create user guide

2. **If Issues Found:**
   - 🐛 Document specific bugs
   - 🔍 Provide console errors
   - 📸 Include screenshots
   - 🔧 Request fixes

3. **If Major Issues:**
   - 🚨 Create emergency fix plan
   - 🔄 Rollback to last working version
   - 🛠️ Apply hotfixes
   - 🚀 Redeploy

---

**End of Test Plan**

**Please test the live site and report back with results!**
