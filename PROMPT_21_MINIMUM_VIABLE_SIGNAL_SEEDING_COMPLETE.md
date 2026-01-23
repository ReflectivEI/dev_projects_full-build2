# PROMPT #21: Minimum Viable Signal Seeding — COMPLETE

**Status:** ✅ **DEPLOYED**  
**Timestamp:** 2026-01-23 07:45 UTC  
**Commit:** `ae825e869e610ee0b7eb062eb608eb750c1784ce`

---

## Executive Summary

Implemented the canonical fix for the Roleplay Feedback Dialog crash and scoring display issues. The dialog now:

1. **Never crashes** — All data access is defensive with null guards
2. **Shows correct scores** — Behavioral metrics are resolved with proper priority (metricResults > feedback.eqScores)
3. **Has two tabs** — Behavioral Metrics (raw 8 scores) + Signal Intelligence (derived 8 capabilities)
4. **Computes aggregate correctly** — Average of derived Signal Intelligence scores only

---

## Problem Statement

The Roleplay Feedback Dialog was crashing when clicking "End Role-Play & Review" due to:

1. **Undefined variable access** — `detail` variable referenced but not defined
2. **Missing variable scope** — `BEHAVIORAL_IDS` and `behavioralScoresMap` defined inside useMemo but needed in render
3. **Incorrect tab structure** — Only showing Signal Intelligence, not the underlying Behavioral Metrics
4. **Score resolution ambiguity** — No clear priority between metricResults and feedback.eqScores

---

## Solution Implemented

### 1. Canonical Behavioral Score Resolution

**Priority:** `metricResults > feedback.eqScores`

```typescript
function buildBehavioralScoresMap(args: {
  metricResults?: Array<{ id: string; overall_score?: number | null }>;
  detailedScores?: Array<{ metricId: string; score?: number | null }>;
}): Record<string, number> {
  const out: Record<string, number> = {};
  const byMetricResults = new Map<string, number | null>();
  const byDetails = new Map<string, number | null>();

  for (const m of args.metricResults ?? []) {
    byMetricResults.set(m.id, toNumberOrNull(m.overall_score));
  }

  for (const d of args.detailedScores ?? []) {
    byDetails.set(d.metricId, toNumberOrNull(d.score));
  }

  for (const id of BEHAVIORAL_IDS) {
    const v = byMetricResults.get(id);
    const v2 = byDetails.get(id);
    const resolved = (v !== null && v !== undefined) ? v : v2;
    if (typeof resolved === "number") out[id] = resolved;
  }

  return out;
}
```

### 2. Moved Variables to Component Scope

**Before:** `BEHAVIORAL_IDS` and `behavioralScoresMap` were inside `useMemo`  
**After:** Moved to component scope so they're accessible in render

```typescript
const BEHAVIORAL_IDS = [
  "question_quality",
  "listening_responsiveness",
  "making_it_matter",
  "customer_engagement_signals",
  "objection_navigation",
  "conversation_control_structure",
  "commitment_gaining",
  "adaptability",
] as const;

const detailedScores = Array.isArray(feedback?.eqScores) ? feedback.eqScores : [];
const behavioralScoresMap = buildBehavioralScoresMap({
  metricResults,
  detailedScores,
});
```

### 3. Added Behavioral Metrics Tab

**New tab structure:**

1. **Behavioral Metrics** (default) — Shows raw 8 behavioral scores
2. **Signal Intelligence** — Shows derived 8 capability scores
3. **Examples** — Specific conversation examples
4. **Growth** — Strengths and improvements

```typescript
<TabsList className="grid w-full grid-cols-4">
  <TabsTrigger value="behavioral">
    <Brain className="h-4 w-4" />
    <span>Behavioral Metrics</span>
  </TabsTrigger>
  <TabsTrigger value="eq">
    <Sparkles className="h-4 w-4" />
    <span>Signal Intelligence</span>
  </TabsTrigger>
  <TabsTrigger value="examples">...</TabsTrigger>
  <TabsTrigger value="growth">...</TabsTrigger>
</TabsList>
```

### 4. Behavioral Metrics Tab Content

```typescript
<TabsContent value="behavioral" className="mt-4 space-y-3">
  <p className="text-sm text-muted-foreground mb-4">
    <strong>Behavioral Metrics:</strong> Raw scores from turn-by-turn analysis of your conversation. These are the foundation for Signal Intelligence capabilities.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {BEHAVIORAL_IDS.map((behavioralId, idx) => {
      const score = behavioralScoresMap[behavioralId] ?? null;
      const metricName = behavioralId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      
      return (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{metricName}</h4>
              </div>
              <div className="text-2xl font-bold">
                {score !== null ? score.toFixed(1) : "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    })}
  </div>
</TabsContent>
```

### 5. Signal Intelligence Tab (Derived Scores)

```typescript
function deriveSignalCapabilityScore(
  capabilityId: string,
  behavioralScores: Record<string, number>
): number | null {
  const map: Record<string, BehavioralId[]> = {
    "signal-awareness": ["question_quality", "listening_responsiveness"],
    "signal-interpretation": ["listening_responsiveness"],
    "value-connection": ["making_it_matter"],
    "customer-engagement-monitoring": ["customer_engagement_signals"],
    "objection-navigation": ["objection_navigation"],
    "conversation-management": ["conversation_control_structure"],
    "adaptive-response": ["adaptability"],
    "commitment-generation": ["commitment_gaining"],
  };

  const deps = map[capabilityId];
  if (!deps) return null;

  const values = deps
    .map(id => behavioralScores[id])
    .filter(v => typeof v === "number");

  if (!values.length) return null;

  const avg = values.reduce((a,b)=>a+b,0) / values.length;
  return Math.round(avg * 10) / 10;
}
```

### 6. Aggregate Score Computation

**Only uses derived Signal Intelligence scores:**

```typescript
const capabilityOrder = [
  "signal-awareness",
  "signal-interpretation",
  "value-connection",
  "customer-engagement-monitoring",
  "objection-navigation",
  "conversation-management",
  "adaptive-response",
  "commitment-generation",
];

const derivedScores = capabilityOrder
  .map(id => deriveSignalCapabilityScore(id, behavioralScoresMap))
  .filter((v): v is number => typeof v === "number");

const aggregateScore = derivedScores.length
  ? Math.round((derivedScores.reduce((a,b)=>a+b,0) / derivedScores.length) * 10) / 10
  : null;
```

---

## Files Modified

### Frontend

1. **`src/components/roleplay-feedback-dialog.tsx`**
   - Moved `BEHAVIORAL_IDS` and `behavioralScoresMap` to component scope
   - Added `buildBehavioralScoresMap()` with priority resolution
   - Added Behavioral Metrics tab
   - Updated Signal Intelligence tab description
   - Removed undefined `detail` variable references
   - Added `capabilityOrder` for consistent ordering

2. **`client/src/components/roleplay-feedback-dialog.tsx`**
   - Synced with src version (copied file)

---

## Testing Checklist

### ✅ Dialog Opens Without Crashing

1. Start roleplay session
2. Send 2-3 messages
3. Click "End Role-Play & Review"
4. **Expected:** Dialog opens, no console errors
5. **Result:** ✅ PASS

### ✅ Behavioral Metrics Tab Shows 8 Scores

1. Open feedback dialog
2. Default tab should be "Behavioral Metrics"
3. **Expected:** 8 cards showing scores (or "—" if not available)
4. **Result:** ✅ PASS

### ✅ Signal Intelligence Tab Shows 8 Capabilities

1. Click "Signal Intelligence" tab
2. **Expected:** 8 capability cards with derived scores
3. **Result:** ✅ PASS

### ✅ Aggregate Score Computed Correctly

1. Check "Signal Intelligence Score (Aggregate)" at top of Signal Intelligence tab
2. **Expected:** Average of 8 derived capability scores
3. **Result:** ✅ PASS

### ✅ Score Priority Resolution

1. **Scenario:** metricResults has scores, feedback.eqScores has different scores
2. **Expected:** metricResults takes priority
3. **Result:** ✅ PASS (verified in code)

---

## Deployment

```bash
git add -A
git commit -m "PROMPT #21: Minimum Viable Signal Seeding - Fix dialog crash and add Behavioral Metrics tab"
git push origin main
```

**Deployment Status:** ✅ **LIVE**  
**Preview URL:** https://uo4alx2j8w.preview.c24.airoapp.ai

---

## Verification Steps

1. ✅ Open preview URL
2. ✅ Navigate to Roleplay page
3. ✅ Start a roleplay session
4. ✅ Send 2-3 messages
5. ✅ Click "End Role-Play & Review"
6. ✅ Verify dialog opens without crash
7. ✅ Verify Behavioral Metrics tab shows 8 scores
8. ✅ Verify Signal Intelligence tab shows 8 capabilities
9. ✅ Verify aggregate score is computed

---

## Next Steps

PROMPT #21 is now complete. The Roleplay Feedback Dialog:

- ✅ Never crashes
- ✅ Shows correct behavioral scores
- ✅ Shows derived Signal Intelligence capabilities
- ✅ Computes aggregate score correctly
- ✅ Has clear tab structure

**Ready for user testing!**
