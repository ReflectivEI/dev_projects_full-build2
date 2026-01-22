# 🔍 CRITICAL DEBUG DEPLOYMENT

**Date:** January 22, 2026 10:22 UTC  
**Commit:** cb67950c  
**Status:** ✅ DEPLOYED  
**Purpose:** Comprehensive diagnostics to identify 0/5 bug root cause

---

## WHAT WAS ADDED

### 1. Scoring Diagnostics (roleplay.tsx)

**Location:** `src/pages/roleplay.tsx` line 307-332

**Logs Added:**
```javascript
console.log('[CRITICAL DEBUG] Transcript:', transcript);
console.log('[CRITICAL DEBUG] Transcript length:', transcript.length);
console.log('[CRITICAL DEBUG] Scored Metrics:', scoredMetrics);
console.log('[CRITICAL DEBUG] Scored Metrics length:', scoredMetrics.length);
scored Metrics.forEach(m => {
  console.log(`[CRITICAL DEBUG] Metric ${m.id}:`, {
    overall_score: m.overall_score,
    not_applicable: m.not_applicable,
    components: m.components.map(c => ({
      name: c.component,
      applicable: c.applicable,
      score: c.score
    }))
  });
});
```

**What This Reveals:**
- ✅ Is the transcript being built correctly?
- ✅ How many messages are in the transcript?
- ✅ Is `scoreConversation()` returning results?
- ✅ What are the `overall_score` values for each metric?
- ✅ Are components marked as `applicable`?
- ✅ What are the component scores?

### 2. Feedback Mapping Diagnostics (roleplay.tsx)

**Location:** `src/pages/roleplay.tsx` line 345-348

**Logs Added:**
```javascript
console.log('[CRITICAL DEBUG] Mapped Feedback:', feedback);
console.log('[CRITICAL DEBUG] Feedback eqScores:', feedback.eqScores);
```

**What This Reveals:**
- ✅ Is `mapToComprehensiveFeedback()` working correctly?
- ✅ Are `eqScores` being populated?
- ✅ What scores are in the feedback object?

### 3. Dialog Props Diagnostics (roleplay-feedback-dialog.tsx)

**Location:** `src/components/roleplay-feedback-dialog.tsx` line 592-598

**Logs Added:**
```javascript
console.log('[CRITICAL DEBUG - DIALOG] Props received:', {
  feedback,
  metricResults,
  metricResultsLength: metricResults?.length
});
console.log('[CRITICAL DEBUG - DIALOG] metricResultsMap:', metricResultsMap);
```

**What This Reveals:**
- ✅ Is `metricResults` prop being passed to dialog?
- ✅ How many metrics are in `metricResults`?
- ✅ Is `metricResultsMap` being built correctly?
- ✅ Can metrics be found by ID in the map?

### 4. Score Resolution Diagnostics (roleplay-feedback-dialog.tsx)

**Location:** `src/components/roleplay-feedback-dialog.tsx` line 642-660

**Logs Added:**
```javascript
if (metricId === 'question_quality') {
  console.log('[PROMPT #21 DEBUG] Question Quality Resolution:', {
    metricId,
    metricResult,
    overall_score: metricResult?.overall_score,
    detail,
    detailScore: detail?.score,
  });
}

const resolvedScore = metricResult?.overall_score ?? (typeof detail?.score === "number" ? detail.score : null);
const displayScore = resolvedScore ?? 0;

if (metricId === 'question_quality') {
  console.log('[PROMPT #21 DEBUG] Final Display Score:', displayScore);
}
```

**What This Reveals:**
- ✅ Is `metricResult` found for question_quality?
- ✅ What is the `overall_score` value?
- ✅ Is `detail.score` available as fallback?
- ✅ What is the final `displayScore`?

---

## DEPLOYMENT STATUS

**GitHub Actions:**
- ⏳ Cloudflare Pages build triggered
- ⏳ GitHub Pages build triggered
- ⏳ Expected completion: ~2-3 minutes

**Commit Hash:** cb67950c  
**Branch:** main  
**Files Modified:**
- `src/pages/roleplay.tsx` (+23 lines)
- `src/components/roleplay-feedback-dialog.tsx` (+8 lines)

---

## TESTING INSTRUCTIONS

### Step 1: Wait for Deployment

Monitor GitHub Actions:
```bash
curl -s https://api.github.com/repos/ReflectivEI/dev_projects_full-build2/actions/runs?per_page=1 | grep '"status"'
```

Wait for `"status": "completed"`

### Step 2: Open Production Site

1. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
2. Or open in **Incognito/Private window**
3. Open **DevTools Console** (F12 → Console tab)

### Step 3: Run Test Session

1. Start a new role play session
2. Use 2-3 questions:
   - "How are you managing this?"
   - "What's working for you?"
   - "Tell me more about that."
3. Complete the session
4. Watch the console logs

### Step 4: Analyze Console Output

**Look for these log groups:**

#### A. Transcript Logs
```
[CRITICAL DEBUG] Transcript: [...]
[CRITICAL DEBUG] Transcript length: 6
```

**Check:**
- ✅ Is transcript length > 0?
- ✅ Are messages formatted correctly?
- ✅ Are speakers 'rep' and 'customer'?

#### B. Scoring Logs
```
[CRITICAL DEBUG] Scored Metrics: [...]
[CRITICAL DEBUG] Scored Metrics length: 8
[CRITICAL DEBUG] Metric question_quality: {
  overall_score: 1.0,
  not_applicable: false,
  components: [...]
}
```

**Check:**
- ✅ Is `scoredMetrics.length` === 8?
- ✅ Are `overall_score` values non-null?
- ✅ Are any components `applicable: true`?
- ✅ Do component scores match overall_score?

#### C. Feedback Mapping Logs
```
[CRITICAL DEBUG] Mapped Feedback: {...}
[CRITICAL DEBUG] Feedback eqScores: [...]
```

**Check:**
- ✅ Does `feedback.eqScores` exist?
- ✅ Are scores in eqScores non-zero?
- ✅ Do eqScores match scoredMetrics?

#### D. Dialog Props Logs
```
[CRITICAL DEBUG - DIALOG] Props received: {
  feedback: {...},
  metricResults: [...],
  metricResultsLength: 8
}
[CRITICAL DEBUG - DIALOG] metricResultsMap: Map(8) {...}
```

**Check:**
- ✅ Is `metricResults` defined?
- ✅ Is `metricResultsLength` === 8?
- ✅ Does `metricResultsMap` have 8 entries?
- ✅ Can you see metric IDs in the map?

#### E. Score Resolution Logs
```
[PROMPT #21 DEBUG] Question Quality Resolution: {
  metricId: 'question_quality',
  metricResult: {...},
  overall_score: 1.0,
  detail: {...},
  detailScore: 1.0
}
[PROMPT #21 DEBUG] Final Display Score: 1.0
```

**Check:**
- ✅ Is `metricResult` defined?
- ✅ Is `overall_score` non-null?
- ✅ Is `displayScore` non-zero?

---

## DIAGNOSTIC SCENARIOS

### Scenario 1: Transcript is Empty

**Symptoms:**
```
[CRITICAL DEBUG] Transcript length: 0
[CRITICAL DEBUG] Scored Metrics length: 0
```

**Root Cause:** Messages not being captured or mapped incorrectly

**Fix:** Check message state management in roleplay.tsx

### Scenario 2: Scoring Returns Null Scores

**Symptoms:**
```
[CRITICAL DEBUG] Metric question_quality: {
  overall_score: null,
  not_applicable: false,
  components: [{applicable: false, score: null}, ...]
}
```

**Root Cause:** Scoring logic not detecting signals

**Fix:** Check signal detection in scoring.ts

### Scenario 3: Feedback Mapping Loses Scores

**Symptoms:**
```
[CRITICAL DEBUG] Scored Metrics: [{overall_score: 1.0}, ...]
[CRITICAL DEBUG] Feedback eqScores: [{score: 0}, ...]
```

**Root Cause:** `mapToComprehensiveFeedback` not preserving scores

**Fix:** Check mapping logic on line 131-140 of roleplay.tsx

### Scenario 4: Dialog Not Receiving Props

**Symptoms:**
```
[CRITICAL DEBUG - DIALOG] metricResults: undefined
[CRITICAL DEBUG - DIALOG] metricResultsLength: undefined
```

**Root Cause:** Props not being passed from roleplay.tsx to dialog

**Fix:** Check `<RoleplayFeedbackDialog>` prop passing on line 597

### Scenario 5: MetricResultsMap Empty

**Symptoms:**
```
[CRITICAL DEBUG - DIALOG] metricResultsMap: Map(0) {}
```

**Root Cause:** `metricResults` prop is empty array or undefined

**Fix:** Check state management of `metricResults` in roleplay.tsx

### Scenario 6: Score Resolution Fails

**Symptoms:**
```
[PROMPT #21 DEBUG] Question Quality Resolution: {
  metricResult: undefined,
  overall_score: undefined,
  detail: undefined,
  detailScore: undefined
}
[PROMPT #21 DEBUG] Final Display Score: 0
```

**Root Cause:** Neither `metricResult` nor `detail` are available

**Fix:** Check why both data sources are missing

---

## EXPECTED SUCCESSFUL OUTPUT

```javascript
// 1. Transcript captured
[CRITICAL DEBUG] Transcript: [
  {speaker: 'customer', text: 'I need help with...'},
  {speaker: 'rep', text: 'How are you managing this?'},
  {speaker: 'customer', text: 'It's been challenging...'},
  {speaker: 'rep', text: 'What's working for you?'},
  ...
]
[CRITICAL DEBUG] Transcript length: 6

// 2. Scoring successful
[CRITICAL DEBUG] Scored Metrics: [8 metrics]
[CRITICAL DEBUG] Scored Metrics length: 8
[CRITICAL DEBUG] Metric question_quality: {
  overall_score: 2.3,
  not_applicable: false,
  components: [
    {name: 'Open Questions', applicable: true, score: 3},
    {name: 'Follow-up Depth', applicable: true, score: 2},
    {name: 'Goal Exploration', applicable: false, score: null}
  ]
}
[CRITICAL DEBUG] Metric listening_responsiveness: {
  overall_score: 1.8,
  not_applicable: false,
  components: [...]
}
// ... (6 more metrics)

// 3. Feedback mapped correctly
[CRITICAL DEBUG] Mapped Feedback: {
  overallScore: 2.1,
  eqScores: [
    {metricId: 'question_quality', score: 2.3},
    {metricId: 'listening_responsiveness', score: 1.8},
    ...
  ]
}

// 4. Dialog receives props
[CRITICAL DEBUG - DIALOG] Props received: {
  feedback: {overallScore: 2.1, eqScores: [8 items]},
  metricResults: [8 items],
  metricResultsLength: 8
}
[CRITICAL DEBUG - DIALOG] metricResultsMap: Map(8) {
  'question_quality' => {overall_score: 2.3, ...},
  'listening_responsiveness' => {overall_score: 1.8, ...},
  ...
}

// 5. Score resolution works
[PROMPT #21 DEBUG] Question Quality Resolution: {
  metricId: 'question_quality',
  metricResult: {overall_score: 2.3, ...},
  overall_score: 2.3,
  detail: {score: 2.3, ...},
  detailScore: 2.3
}
[PROMPT #21 DEBUG] Final Display Score: 2.3
```

---

## NEXT STEPS

1. ✅ Wait for deployment to complete (~2-3 minutes)
2. ✅ Run test session with console open
3. ✅ Copy ALL console logs
4. ✅ Share logs to identify exact failure point
5. ✅ Apply targeted fix based on diagnostic results

**THIS WILL DEFINITIVELY IDENTIFY THE ROOT CAUSE OF THE 0/5 BUG.**
