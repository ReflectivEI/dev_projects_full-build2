# PROMPT #26 — DIAGNOSTIC + FIX DEPLOYED

**Status:** ✅ Deployed (commit: 1ebe797e)  
**Timestamp:** 2026-01-23 03:50 HST  
**Mode:** Implementation + Diagnostic (no "final fix" claims)

---

## 🎯 OBJECTIVE

Prove and fix the root cause: Behavioral Metrics show numbers in UI, but Signal Intelligence capabilities show "—/0" because derivation reads from wrong score source.

---

## 🔍 DIAGNOSTIC INSTRUMENTATION

### 1. Debug Snapshot (window.__SI_DEBUG__)

Added to `roleplay-feedback-dialog.tsx` before rendering capability cards:

```typescript
(window as any).__SI_DEBUG__ = {
  metricResultsRaw: metricResults,
  metricResultsIds: (metricResults ?? []).map((m:any)=>m?.id),
  metricResultsScores: (metricResults ?? []).map((m:any)=>({id:m?.id, overall:m?.overall_score, score:(m as any)?.score})),
  detailScoresUsedInUI: { ...behavioralScoresMap },
  derivedCapabilityScores: { ...Object.fromEntries(metricOrder.map(id => [id, deriveSignalCapabilityScore(id, behavioralScoresMap)])) },
};
```

### 2. Visual Debug Panel

Added temporary debug panel at bottom of modal:

```tsx
<Card className="mt-6 border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
  <CardHeader className="pb-2">
    <CardTitle className="text-sm font-mono">🔍 SI Debug Snapshot</CardTitle>
  </CardHeader>
  <CardContent className="text-xs font-mono space-y-1">
    <div><strong>Behavioral IDs count:</strong> {BEHAVIORAL_IDS.length}</div>
    <div><strong>Behavioral IDs:</strong> {BEHAVIORAL_IDS.join(", ")}</div>
    <div><strong>question_quality exists:</strong> {behavioralScoresMap.question_quality !== undefined ? `✅ ${behavioralScoresMap.question_quality}` : "❌"}</div>
    <div><strong>listening_responsiveness exists:</strong> {behavioralScoresMap.listening_responsiveness !== undefined ? `✅ ${behavioralScoresMap.listening_responsiveness}` : "❌"}</div>
    <div><strong>making_it_matter exists:</strong> {behavioralScoresMap.making_it_matter !== undefined ? `✅ ${behavioralScoresMap.making_it_matter}` : "❌"}</div>
    <div><strong>commitment_gaining exists:</strong> {behavioralScoresMap.commitment_gaining !== undefined ? `✅ ${behavioralScoresMap.commitment_gaining}` : "❌"}</div>
    <div className="pt-2"><strong>Check console for:</strong> window.__SI_DEBUG__</div>
  </CardContent>
</Card>
```

**Purpose:** Confirm why signal-awareness is "—" even though Behavioral Metrics show 1.0 / 1.0.

---

## 🔧 FIX IMPLEMENTATION

### 1. Resolve Behavioral Scores from SAME Source as UI

**Problem:** UI uses `detail.score`, derivation uses `metricResults[].overall_score` (which may be null/undefined).

**Solution:** Create canonical resolution helper:

```typescript
function resolveBehavioralScoreById(
  id: string,
  metricResults: any[] | undefined,
  detailsById: Map<string, any>
): number | null {
  const fromMetricResults =
    metricResults?.find(m => m?.id === id)?.overall_score;

  const fromDetails =
    typeof detailsById?.get(id)?.score === "number" ? detailsById.get(id).score : null;

  const v =
    (typeof fromMetricResults === "number" ? fromMetricResults : null) ??
    fromDetails;

  return typeof v === "number" && !Number.isNaN(v) ? v : null;
}
```

### 2. Build Behavioral Scores Map

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
];

const behavioralScoresMap: Record<string, number> = {};
for (const id of BEHAVIORAL_IDS) {
  const v = resolveBehavioralScoreById(id, metricResults, byId);
  if (typeof v === "number") behavioralScoresMap[id] = v;
}
```

### 3. Canonical Derivation (No Changes to Logic)

```typescript
function deriveSignalCapabilityScore(
  capabilityId: string,
  behavioralScores: Record<string, number>
): number | null {
  const map: Record<string, string[]> = {
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

### 4. Aggregate Score (No Fallbacks, No Defaults)

```typescript
const derivedScores = metricOrder
  .map(id => deriveSignalCapabilityScore(id, behavioralScoresMap))
  .filter((v): v is number => typeof v === "number");

const aggregateScore = derivedScores.length
  ? Math.round((derivedScores.reduce((a,b)=>a+b,0) / derivedScores.length) * 10) / 10
  : null;
```

**No fallbacks. No default 0. No default 3.0.**

### 5. Fix EI Metrics Page (3.0 Placeholder)

**Changed:**
```typescript
// BEFORE
{metric.score === 3.0 ? (

// AFTER
{metric.score === null ? (
```

**Rationale:** Don't treat 3.0 as a placeholder. Only `null` means "not yet scored".

---

## 📊 CHANGES SUMMARY

### Files Modified:

1. **src/components/roleplay-feedback-dialog.tsx** (+87, -43)
   - Added `resolveBehavioralScoreById()` helper
   - Build `behavioralScoresMap` from resolved scores
   - Added `window.__SI_DEBUG__` snapshot
   - Added visual debug panel
   - Updated aggregate score calculation
   - No changes to derivation logic (already correct)

2. **src/pages/ei-metrics.tsx** (+1, -1)
   - Fixed 3.0 placeholder check to `null` check

---

## ✅ ACCEPTANCE CHECKS

### On Production (After Deploy + Cache Clear):

1. **If Behavioral shows question_quality=1.0 and listening_responsiveness=1.0:**
   - ✅ signal-awareness MUST show 1.0 (not "—")

2. **If commitment_gaining=1.0:**
   - ✅ commitment-generation MUST show 1.0

3. **If `__SI_DEBUG__.detailScoresUsedInUI` contains the two numbers:**
   - ✅ And derived is still null → mapping is wrong (fix immediately)

4. **Debug Panel Shows:**
   - ✅ Behavioral IDs count: 8
   - ✅ Behavioral IDs list
   - ✅ question_quality exists: ✅ [value]
   - ✅ listening_responsiveness exists: ✅ [value]

---

## 🚀 DEPLOYMENT

```bash
$ git checkout main
$ git merge 20260123034553-uo4alx2j8w --no-edit
$ git push origin main

Updating fe35efd1..1ebe797e
Fast-forward
 src/components/roleplay-feedback-dialog.tsx | 128 +++++++++++++++++++---------
 src/pages/ei-metrics.tsx                    |   2 +-
 2 files changed, 87 insertions(+), 43 deletions(-)

To https://github.com/ReflectivEI/dev_projects_full-build2.git
   fe35efd1..1ebe797e  main -> main
```

**Commit:** 1ebe797e  
**Status:** ✅ Deployed to production

---

## 📸 NEXT STEPS

1. **Clear browser cache** (critical)
2. **Complete Role-Play session**
3. **Open feedback modal**
4. **Check debug panel** at bottom
5. **Screenshot `window.__SI_DEBUG__` values**
6. **Verify scores:**
   - Behavioral Metrics tab: All 8 show numbers
   - Signal Intelligence tab: All 8 show numbers (not "—")
7. **If scores are correct:** Remove debug panel (keep `window.__SI_DEBUG__` if desired)
8. **If scores are still "—":** Check `__SI_DEBUG__.detailScoresUsedInUI` and `derivedCapabilityScores` to diagnose mapping issue

---

## 🔗 ALIGNMENT WITH BLUEPRINT

**From Blueprint:**
- Behavioral metrics are scored primitives
- Higher layers are derived
- No placeholders
- 3.0 is a meaningful anchor, not a default

**This Prompt:**
- ✅ Forces derivation from observed behavioral scores
- ✅ Eliminates fake 3.0 defaults
- ✅ Resolves scores from same source as UI
- ✅ Adds diagnostic instrumentation to prove root cause
- ✅ No "final fix" claims — instrument → prove → patch

---

**END OF PROMPT #26**
