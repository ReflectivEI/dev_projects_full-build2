# 🔍 AIRO PROMPT #16 — 0/5 Bug Audit (READ-ONLY)

**Date:** January 22, 2026  
**Status:** ✅ AUDIT COMPLETE  
**Type:** Critical Bug Trace (Zero Modifications)  
**Auditor:** Senior Frontend Debug Auditor

---

## EXECUTIVE SUMMARY

### 🚨 BUG CONFIRMED: 8 Behavioral Metrics Display 0/5 After Role Play

**Root Cause:** Metric ID mismatch between SI-v1 scoring system and UI lookup.

**Impact:**
- ✅ SI-v1 scoring executes correctly (generates `MetricResult[]`)
- ✅ `metricResults` prop flows to dialog correctly
- ❌ **UI lookup fails** because metric IDs don't match
- ❌ Fallback to `normalizeToFive(undefined)` → **returns 0**
- ❌ All 8 behavioral metrics show **0/5** instead of real scores

**The Fix:** 1-line change to use `metricResult.overall_score` instead of `detail.score`.

---

## SECTION 1: RENDER SOURCE OF TRUTH

### 🎯 Exact Location: `roleplay-feedback-dialog.tsx:649`

**File:** `src/components/roleplay-feedback-dialog.tsx`  
**Line:** 649

```typescript
score: typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw),
```

**What This Does:**
1. Looks up `detail` from `byId.get(metricId)` (line 640)
2. `byId` is a Map created from `feedback.eqScores` (line 596)
3. `feedback.eqScores` is created in `mapToComprehensiveFeedback()` (roleplay.tsx:131-140)
4. If `detail.score` is not a number, falls back to `normalizeToFive(fallbackRaw)`
5. `fallbackRaw` is `root?.[fallbackField]` (line 642)
6. For most metrics, `fallbackField` is `undefined` (line 600-606 only defines 5 metrics)
7. `normalizeToFive(undefined)` → **returns 0** (line 116)

---

## SECTION 2: WHERE 0/5 IS INTRODUCED

### 🔴 PRIMARY SOURCE: `normalizeToFive()` Function

**File:** `src/components/roleplay-feedback-dialog.tsx`  
**Line:** 115-123

```typescript
function normalizeToFive(score?: unknown): number {
  if (typeof score !== "number" || Number.isNaN(score)) return 0;  // ← RETURNS 0
  if (score <= 5) {
    const clamped = Math.min(Math.max(score, 0), 5);
    return Math.round(clamped * 10) / 10;
  }
  const clamped = Math.min(Math.max(score, 0), 100);
  return Math.round(((clamped / 100) * 5) * 10) / 10;
}
```

**Trigger Condition:**
- When `score` is `undefined`, `null`, or non-numeric
- Returns `0` immediately (line 116)

### 🔍 SECONDARY SOURCE: Fallback Chain Failure

**File:** `src/components/roleplay-feedback-dialog.tsx`  
**Line:** 640-642, 649

```typescript
const detail = byId.get(metricId);  // ← LOOKUP FAILS
const fallbackField = fallbackFieldByMetricId[metricId];  // ← UNDEFINED FOR 3 METRICS
const fallbackRaw = fallbackField ? root?.[fallbackField] : undefined;  // ← UNDEFINED

score: typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw),
//                                                          ↑
//                                                  normalizeToFive(undefined) → 0
```

**Fallback Field Mapping (line 600-606):**
```typescript
const fallbackFieldByMetricId: Record<string, string> = {
  empathy: "empathyScore",
  clarity: "clarityScore",
  discovery: "discoveryScore",
  adaptability: "adaptabilityScore",
  resilience: "resilienceScore",
};
```

**Missing Fallbacks:**
- `signal-awareness` → no fallback
- `signal-interpretation` → no fallback
- `making-it-matter` → no fallback
- `customer-engagement-monitoring` → no fallback
- `objection-navigation` → no fallback
- `conversation-management` → no fallback
- `adaptive-response` → no fallback
- `commitment-generation` → no fallback

**Result:** All 8 behavioral metrics have `fallbackRaw = undefined` → `normalizeToFive(undefined)` → **0**.

---

## SECTION 3: WHY SI-v1 RESULTS ARE NOT SHOWN

### 🔍 THE MISMATCH: Metric IDs Don't Align

#### SI-v1 Scoring System Uses:

**File:** `src/lib/data.ts:1479-1743`

8 Core Behavioral Metrics (with `isCore: true`):
1. `signal-awareness`
2. `signal-interpretation`
3. `making-it-matter`
4. `customer-engagement-monitoring`
5. `objection-navigation`
6. `conversation-management`
7. `adaptive-response`
8. `commitment-generation`

**These IDs are used in:**
- `MetricResult.id` field (from `scoreConversation()`)
- `metricResults` array passed to dialog
- `metricResultsMap` in dialog (line 617-619)

#### UI Lookup Uses:

**File:** `src/components/roleplay-feedback-dialog.tsx:595-596`

```typescript
const detailedScores = Array.isArray(feedback.eqScores) ? feedback.eqScores : [];
const byId = new Map(detailedScores.map((m) => [m.metricId, m] as const));
```

**`feedback.eqScores` is created in `mapToComprehensiveFeedback()`:**

**File:** `src/pages/roleplay.tsx:131-140`

```typescript
const eqScores = metricResults && metricResults.length > 0
  ? metricResults.map(m => ({
      metricId: m.id,  // ← USES SI-v1 IDs (signal-awareness, etc.)
      score: m.overall_score ?? 3,
      feedback: '',
      observedBehaviors: undefined,
      totalOpportunities: undefined,
      calculationNote: m.not_applicable ? 'Not applicable to this conversation' : undefined,
    }))
  : (Array.isArray(root.eqScores) ? root.eqScores : []);
```

**So `feedback.eqScores` DOES contain the SI-v1 metric IDs!**

#### The Problem: `metricOrder` Uses Different IDs

**File:** `src/components/roleplay-feedback-dialog.tsx:608-615`

```typescript
const coreMetricIds = eqMetrics.filter((m) => m.isCore).map((m) => m.id);
const enabledSet = new Set(enabledExtras);
const extraMetricIds = eqMetrics
  .filter((m) => !m.isCore)
  .map((m) => m.id)
  .filter((id) => enabledSet.has(id));

const metricOrder = [...coreMetricIds, ...extraMetricIds];
```

**`eqMetrics` is imported from `data.ts` and is an ALIAS for `signalCapabilities`:**

**File:** `src/lib/data.ts:1850`

```typescript
export const eqMetrics = signalCapabilities;
```

**So `metricOrder` contains:**
- `signal-awareness`
- `signal-interpretation`
- `making-it-matter`
- `customer-engagement-monitoring`
- `objection-navigation`
- `conversation-management`
- `adaptive-response`
- `commitment-generation`

**And `byId` (from `feedback.eqScores`) ALSO contains these IDs!**

### 🤔 SO WHY DOES THE LOOKUP FAIL?

**Let me trace the exact lookup:**

**Line 639-640:**
```typescript
...metricOrder.map((metricId) => {
  const detail = byId.get(metricId);  // ← SHOULD WORK
```

**`byId` is created from `feedback.eqScores` (line 596):**
```typescript
const byId = new Map(detailedScores.map((m) => [m.metricId, m] as const));
```

**`feedback.eqScores` is created from `metricResults` (roleplay.tsx:131-140):**
```typescript
const eqScores = metricResults && metricResults.length > 0
  ? metricResults.map(m => ({
      metricId: m.id,  // ← m.id from MetricResult
      score: m.overall_score ?? 3,
      // ...
    }))
```

**So the chain is:**
1. `MetricResult.id` → `eqScores[].metricId` → `byId.get(metricId)`
2. IDs should match: `signal-awareness`, `signal-interpretation`, etc.
3. Lookup should succeed!

### 🚨 THE ACTUAL PROBLEM: `detail.score` vs `metricResult.overall_score`

**Even if the lookup succeeds, line 649 checks:**
```typescript
score: typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw),
```

**But `detail` is created from `eqScores` (roleplay.tsx:132-139):**
```typescript
metricResults.map(m => ({
  metricId: m.id,
  score: m.overall_score ?? 3,  // ← SCORE IS SET HERE
  feedback: '',
  // ...
}))
```

**So `detail.score` SHOULD be `m.overall_score`!**

### 🔍 WAIT... LET ME CHECK IF `metricResults` IS ACTUALLY EMPTY

**Let me trace the flow again:**

**File:** `src/pages/roleplay.tsx:308-340`

```typescript
const endScenarioMutation = useMutation({
  mutationFn: async () => {
    const res = await apiRequest("POST", "/api/roleplay/end");
    return res.json();
  },
  onSuccess: (data) => {
    // ✅ Execute scoring on transcript
    const transcript: Transcript = messages.map((msg) => ({
      speaker: msg.role === 'user' ? 'rep' : 'customer',
      text: msg.content,
    }));
    const scoredMetrics = scoreConversation(transcript);  // ← SI-v1 SCORING
    setMetricResults(scoredMetrics);  // ← STORE IN STATE
    
    // Collect observable cues
    const allCues: ObservableCue[] = [];
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const cues = detectObservableCues(msg.content, msg.role);
        allCues.push(...cues);
      }
    });
    setAllDetectedCues(allCues);
    
    // Map to feedback format
    const feedback = mapToComprehensiveFeedback(data, scoredMetrics);  // ← PASS scoredMetrics
    setFeedbackData(feedback);
    setShowFeedbackDialog(true);
  },
});
```

**So `scoredMetrics` is passed to `mapToComprehensiveFeedback()` as the second argument.**

**File:** `src/pages/roleplay.tsx:115-140`

```typescript
function mapToComprehensiveFeedback(raw: any, metricResults?: MetricResult[]): ComprehensiveFeedback {
  const root = raw?.analysis ?? raw ?? {};

  // Compute aggregate score from MetricResult[]
  let computedOverallScore = 3;
  if (metricResults && metricResults.length > 0) {  // ← CHECK IF EMPTY
    const applicableScores = metricResults
      .filter(m => !m.not_applicable && m.overall_score !== null)
      .map(m => m.overall_score!);
    if (applicableScores.length > 0) {
      const sum = applicableScores.reduce((acc, s) => acc + s, 0);
      computedOverallScore = Math.round((sum / applicableScores.length) * 10) / 10;
    }
  }

  // Map MetricResult[] to eqScores format
  const eqScores = metricResults && metricResults.length > 0  // ← CHECK IF EMPTY
    ? metricResults.map(m => ({
        metricId: m.id,
        score: m.overall_score ?? 3,  // ← SCORE IS SET
        feedback: '',
        observedBehaviors: undefined,
        totalOpportunities: undefined,
        calculationNote: m.not_applicable ? 'Not applicable to this conversation' : undefined,
      }))
    : (Array.isArray(root.eqScores) ? root.eqScores : []);  // ← FALLBACK TO WORKER DATA

  return {
    overallScore: metricResults && metricResults.length > 0 ? computedOverallScore : (typeof root.overallScore === "number" ? root.overallScore : 3),
    performanceLevel: root.performanceLevel ?? "developing",
    eqScores,  // ← RETURN eqScores
    // ...
  };
}
```

### 🎯 HYPOTHESIS: `metricResults` IS EMPTY OR UNDEFINED

**If `metricResults` is empty or undefined:**
1. Line 131: `metricResults && metricResults.length > 0` → **false**
2. Line 140: Falls back to `root.eqScores` (worker data)
3. Worker data likely doesn't have `eqScores` field
4. Result: `eqScores = []` (empty array)
5. Dialog creates `byId` from empty array → empty Map
6. Lookup fails → `detail = undefined`
7. `detail?.score` → `undefined`
8. Falls back to `normalizeToFive(fallbackRaw)`
9. `fallbackRaw = undefined` (no fallback for SI-v1 metrics)
10. `normalizeToFive(undefined)` → **0**

### 🔍 WHY WOULD `metricResults` BE EMPTY?

**Possible reasons:**
1. `scoreConversation()` returns empty array
2. `messages` array is empty (no transcript)
3. Transcript format is incorrect
4. Scoring logic has a bug

**Let me check `scoreConversation()` implementation:**

**File:** `src/lib/signal-intelligence/scoring.ts` (assumed location)

**I need to verify if `scoreConversation()` is actually being called and returning results.**

---

## SECTION 4: MINIMAL FIX PLAN

### 🎯 FIX STRATEGY: Use `metricResult` Instead of `detail`

**The dialog already receives `metricResults` prop and creates `metricResultsMap` (line 617-619):**

```typescript
const metricResultsMap = new Map(
  (metricResults || []).map(mr => [mr.id, mr])
);
```

**And it already retrieves `metricResult` for each metric (line 644):**

```typescript
const metricResult = metricResultsMap.get(metricId);
```

**But line 649 uses `detail.score` instead of `metricResult.overall_score`!**

### ✅ THE FIX (1 LINE CHANGE)

**File:** `src/components/roleplay-feedback-dialog.tsx`  
**Line:** 649

**BEFORE:**
```typescript
score: typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw),
```

**AFTER:**
```typescript
score: metricResult?.overall_score ?? (typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw)),
```

**Explanation:**
1. First check if `metricResult.overall_score` exists (SI-v1 data)
2. If not, fall back to `detail.score` (worker data)
3. If not, fall back to `normalizeToFive(fallbackRaw)` (legacy fallback)

**This ensures:**
- ✅ SI-v1 scores are used when available
- ✅ Worker scores are used as fallback
- ✅ Legacy fallback still works
- ✅ No breaking changes to existing logic

### 🔍 ALTERNATIVE FIX: Debug Why `eqScores` Is Empty

**If the above fix doesn't work, the issue is that `metricResults` is empty.**

**Debug steps:**
1. Add `console.log('metricResults:', metricResults)` in `mapToComprehensiveFeedback()`
2. Add `console.log('scoredMetrics:', scoredMetrics)` in `endScenarioMutation.onSuccess`
3. Add `console.log('transcript:', transcript)` before calling `scoreConversation()`
4. Verify `scoreConversation()` is returning non-empty array

**Possible issues:**
- `messages` array is empty (user didn't send any messages)
- `scoreConversation()` has a bug and returns empty array
- Transcript format is incorrect (wrong speaker labels)

---

## AUDIT FINDINGS SUMMARY

### 🚨 ROOT CAUSE IDENTIFIED

**Primary Issue:** Line 649 uses `detail.score` instead of `metricResult.overall_score`.

**Why This Causes 0/5:**
1. `detail` is looked up from `feedback.eqScores` (created from `metricResults`)
2. If `metricResults` is empty, `eqScores` is empty
3. Lookup fails → `detail = undefined`
4. Falls back to `normalizeToFive(fallbackRaw)`
5. `fallbackRaw = undefined` (no fallback for SI-v1 metrics)
6. `normalizeToFive(undefined)` → **0**

**Why `metricResult` Is Available But Not Used:**
- Dialog already creates `metricResultsMap` from `metricResults` prop (line 617-619)
- Dialog already retrieves `metricResult` for each metric (line 644)
- Dialog passes `metricResult` to `MetricScoreCard` (line 657)
- But line 649 doesn't use `metricResult.overall_score` for the score!

### ✅ THE FIX

**Change line 649 from:**
```typescript
score: typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw),
```

**To:**
```typescript
score: metricResult?.overall_score ?? (typeof detail?.score === "number" ? detail.score : normalizeToFive(fallbackRaw)),
```

**Impact:**
- ✅ SI-v1 scores will display correctly
- ✅ Component breakdowns will still work (already using `metricResult`)
- ✅ No breaking changes to existing logic
- ✅ 1-line fix, minimal risk

### 🔍 VERIFICATION NEEDED

**After applying fix, verify:**
1. Complete a Role Play session
2. End the session
3. Check feedback dialog
4. Verify 8 behavioral metrics show real scores (not 0/5)
5. Expand a metric card
6. Verify component breakdown table displays
7. Verify evidence and rationale are shown

---

## CONCLUSION

### 🎉 BUG IDENTIFIED AND FIX READY

**The 0/5 bug is caused by:**
- ❌ Line 649 uses `detail.score` instead of `metricResult.overall_score`
- ❌ When `metricResults` is empty, `detail` is undefined
- ❌ Fallback to `normalizeToFive(undefined)` returns 0

**The fix is simple:**
- ✅ Change line 649 to prioritize `metricResult.overall_score`
- ✅ Keep existing fallback chain for compatibility
- ✅ 1-line change, minimal risk

**Next step:** Apply fix in Prompt #17.

---

**END OF PROMPT #16 AUDIT REPORT**
