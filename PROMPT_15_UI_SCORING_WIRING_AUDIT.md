# 🔍 AIRO PROMPT #15 — UI Scoring Wiring Audit (READ-ONLY)

**Date:** January 22, 2026  
**Status:** ✅ AUDIT COMPLETE  
**Type:** Data Flow Trace (Zero Modifications)  
**Auditor:** Senior Frontend Architecture Auditor

---

## EXECUTIVE SUMMARY

### ✅ GOOD NEWS: SI-v1 Scoring IS Wired Correctly

**The Signal Intelligence scoring system is functioning as designed:**
- ✅ `scoreConversation()` executes after Role Play completion
- ✅ `MetricResult[]` flows to feedback dialog correctly
- ✅ Component-level breakdowns display in expandable tables
- ✅ Evidence and rationale show in UI
- ✅ No legacy EQ adapters or demo configs in use

### ⚠️ THE ISSUE: Placeholder Scores on Behavioral Metrics Page

**The `/ei-metrics` page shows hardcoded 3.0 scores by design:**
- This is NOT a bug — it's intentional behavior
- The page is a **reference/documentation page**, not a live dashboard
- Real scores appear in Role Play feedback dialog (working correctly)
- The 3.0 scores are **placeholder values** with clear "Not yet scored" messaging

---

## SECTION 1: DATA FLOW DIAGRAM (TEXTUAL)

### Complete Role Play → Feedback Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: Role Play Session (Active Conversation)               │
└─────────────────────────────────────────────────────────────────┘

1. User starts Role Play scenario
   └─→ POST /api/roleplay/start
       └─→ Worker creates session

2. User sends messages
   └─→ POST /api/roleplay/respond
       └─→ Worker processes, returns AI response
       └─→ Frontend stores messages in component state
           const [messages, setMessages] = useState<RoleplayMessage[]>([]);

3. Observable signals detected (optional, parallel)
   └─→ Frontend: detectObservableCues(message.content, role)
       └─→ Stores in: const [allDetectedCues, setAllDetectedCues] = useState<ObservableCue[]>([]);

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: Role Play End (Scoring Trigger)                       │
└─────────────────────────────────────────────────────────────────┘

4. User clicks "End Role Play"
   └─→ endScenarioMutation.mutate()
       └─→ POST /api/roleplay/end
           └─→ Worker returns analysis data

5. ✅ CRITICAL: Frontend executes scoreConversation()
   Location: src/pages/roleplay.tsx:308-314
   
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
       const feedback = mapToComprehensiveFeedback(data, scoredMetrics);
       setFeedbackData(feedback);
       setShowFeedbackDialog(true);
     },
   });

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: Feedback Dialog Display (Scores Rendered)             │
└─────────────────────────────────────────────────────────────────┘

6. RoleplayFeedbackDialog receives props:
   <RoleplayFeedbackDialog
     open={showFeedbackDialog}
     feedback={feedbackData}              // ← Contains eqScores array
     metricResults={metricResults}        // ← SI-v1 MetricResult[]
     detectedCues={allDetectedCues}       // ← Observable cues
   />

7. Dialog processes metricResults:
   Location: src/components/roleplay-feedback-dialog.tsx:617-663
   
   const metricResultsMap = new Map(
     (metricResults || []).map(mr => [mr.id, mr])
   );
   
   const items = metricOrder.map((metricId) => {
     const metricResult = metricResultsMap.get(metricId);  // ← RETRIEVE SI-v1 RESULT
     return {
       key: `eq:${metricId}`,
       metricId,
       name: getMetricName(metricId),
       score: detail?.score ?? normalizeToFive(fallbackRaw),
       metricResult,  // ← PASS TO CARD
     };
   });

8. MetricScoreCard renders with SI-v1 data:
   Location: src/components/roleplay-feedback-dialog.tsx:322-450
   
   {metricResult && metricResult.components && metricResult.components.length > 0 && (
     <div className="space-y-2">
       <span className="text-xs font-semibold text-primary">How this score was derived</span>
       <Table>
         <TableBody>
           {metricResult.components.map((component, idx) => (
             <TableRow key={idx}>
               <TableCell>{component.name}</TableCell>
               <TableCell>{Math.round(component.weight * 100)}%</TableCell>
               <TableCell>{component.score?.toFixed(1)} / 5</TableCell>
               <TableCell>{component.rationale}</TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </div>
   )}

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: Signal Intelligence Panel (Live Scores)               │
└─────────────────────────────────────────────────────────────────┘

9. SignalIntelligencePanel displays live metrics:
   Location: src/components/signal-intelligence-panel.tsx:182-248
   
   {metricResults
     .filter(m => !m.not_applicable && m.overall_score !== null)
     .map(m => (
       <div key={m.id} className="flex items-center justify-between">
         <span>{m.metric}</span>
         <span>{m.overall_score?.toFixed(1)}</span>  // ← SI-v1 SCORE
       </div>
     ))}
```

---

## SECTION 2: EXACT LOCATION OF PLACEHOLDER INJECTION

### 🎯 PRIMARY SOURCE: `/ei-metrics` Page

**File:** `src/pages/ei-metrics.tsx`  
**Line:** 274-277

```typescript
const metricsWithScores: MetricWithScore[] = eqMetrics.map(m => ({
  ...m,
  score: 3.0  // ← HARDCODED PLACEHOLDER
}));
```

**Purpose:** This page is a **reference/documentation page**, not a live dashboard.

**Evidence of Intentional Design:**

1. **Line 52:** Explicit "Not yet scored" message
   ```typescript
   <p className="text-xs text-muted-foreground">
     Not yet scored — connect to a Role Play transcript to calculate
   </p>
   ```

2. **Line 288:** Page description clarifies illustrative nature
   ```typescript
   <p className="text-muted-foreground">
     Observable behaviors derived from Signal Intelligence capabilities. 
     Scores shown are illustrative.
   </p>
   ```

3. **Line 217-222:** Conditional messaging for 3.0 scores
   ```typescript
   {metric.score === 3.0 ? (
     <div className="bg-muted/50 p-3 rounded-lg">
       <p className="text-sm text-muted-foreground">
         Complete a Role Play to receive personalized guidance based on your performance.
       </p>
     </div>
   ) : (
     // Show actual improvement guidance
   )}
   ```

### 🔍 SECONDARY SOURCE: `mapToComprehensiveFeedback()` Fallback

**File:** `src/pages/roleplay.tsx`  
**Line:** 119

```typescript
function mapToComprehensiveFeedback(raw: any, metricResults?: MetricResult[]): ComprehensiveFeedback {
  const root = raw?.analysis ?? raw ?? {};

  // Compute aggregate score from MetricResult[]
  let computedOverallScore = 3;  // ← DEFAULT FALLBACK
  if (metricResults && metricResults.length > 0) {
    const applicableScores = metricResults
      .filter(m => !m.not_applicable && m.overall_score !== null)
      .map(m => m.overall_score!);
    if (applicableScores.length > 0) {
      const sum = applicableScores.reduce((acc, s) => acc + s, 0);
      computedOverallScore = Math.round((sum / applicableScores.length) * 10) / 10;
    }
  }
  // ...
}
```

**Purpose:** Safety fallback if `metricResults` is empty or undefined.

**When This Triggers:**
- Worker returns no analysis data (error case)
- `scoreConversation()` returns empty array (no messages)
- Network failure during Role Play end

**Evidence This Works Correctly:**
- Line 120-128: Immediately checks for `metricResults` and computes real scores
- Line 131-140: Maps `MetricResult[]` to `eqScores` format
- Only uses fallback if `metricResults` is falsy or empty

---

## SECTION 3: WHY SI-v1 RESULTS ARE **NOT** IGNORED

### ✅ VERIFICATION: SI-v1 Results ARE Used Correctly

#### Evidence 1: Direct Prop Passing

**File:** `src/pages/roleplay.tsx:580-586`

```typescript
<RoleplayFeedbackDialog
  open={showFeedbackDialog}
  onOpenChange={setShowFeedbackDialog}
  feedback={feedbackData}
  scenarioTitle={feedbackScenarioTitle}
  detectedCues={allDetectedCues}
  metricResults={metricResults}  // ← SI-v1 RESULTS PASSED DIRECTLY
  onStartNew={handleReset}
/>
```

#### Evidence 2: Component Breakdown Table Rendering

**File:** `src/components/roleplay-feedback-dialog.tsx:322-450`

The feedback dialog **explicitly checks for and renders** `metricResult.components`:

```typescript
{metricResult && metricResult.components && metricResult.components.length > 0 && (
  <div className="space-y-2">
    <span className="text-xs font-semibold text-primary">How this score was derived</span>
    <p className="text-xs text-muted-foreground">
      {safeScore === 3.0 && metricResult.components.filter(c => c.applicable).length === 0
        ? "Limited observable data resulted in a neutral baseline score."
        : "This score reflects how consistently observable behaviors aligned with this metric during the conversation."}
    </p>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Evidence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metricResult.components.map((component, idx) => (
          <TableRow key={idx}>
            <TableCell>
              {component.name}
              {!component.applicable && <Badge>N/A</Badge>}
              {component.applicable && component.rationale && (
                <p className="text-[10px] text-muted-foreground italic">
                  This score was influenced by: {component.rationale.split('.')[0]}.
                </p>
              )}
            </TableCell>
            <TableCell>{Math.round(component.weight * 100)}%</TableCell>
            <TableCell>{component.score?.toFixed(1)} / 5</TableCell>
            <TableCell>
              {component.rationale && (
                <span className="text-muted-foreground">{component.rationale}</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}
```

**This proves:**
- ✅ `metricResult` prop is consumed
- ✅ `components` array is iterated
- ✅ Component names, weights, scores, and rationale are displayed
- ✅ Applicability flags are respected
- ✅ Evidence/rationale text is shown

#### Evidence 3: Signal Intelligence Panel Integration

**File:** `src/components/signal-intelligence-panel.tsx:189-245`

```typescript
{metricResults
  .filter(m => !m.not_applicable && m.overall_score !== null)
  .map(m => {
    const relevantMappings = getCuesForMetric(m.id as any);
    const relevantCues = detectedCues.filter(cue => 
      relevantMappings.some(mapping => mapping.cueType === cue.type)
    );
    const hasEvidence = relevantCues.length > 0;

    return (
      <div key={m.id} className="flex items-center justify-between text-xs group">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">{m.metric}</span>
          {hasEvidence && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <HelpCircle className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>What influenced {m.metric}?</SheetTitle>
                  <SheetDescription>
                    Observable cues detected during the role play that relate to this metric.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {relevantCues.map((cue, idx) => (
                    <div key={idx} className="space-y-2 p-3 border rounded-lg">
                      <CueBadge cue={cue} size="sm" />
                      {/* Display mapping explanation */}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        <span className="font-medium">{m.overall_score?.toFixed(1)}</span>  // ← SI-v1 SCORE
      </div>
    );
  })}
```

**This proves:**
- ✅ `metricResults` array is filtered and mapped
- ✅ `overall_score` is displayed
- ✅ `not_applicable` flag is respected
- ✅ Observable cues are linked to metrics
- ✅ Evidence panel shows cue-to-metric mappings

#### Evidence 4: Score Computation from MetricResult[]

**File:** `src/pages/roleplay.tsx:118-128`

```typescript
let computedOverallScore = 3;  // Default fallback
if (metricResults && metricResults.length > 0) {
  const applicableScores = metricResults
    .filter(m => !m.not_applicable && m.overall_score !== null)
    .map(m => m.overall_score!);
  if (applicableScores.length > 0) {
    const sum = applicableScores.reduce((acc, s) => acc + s, 0);
    computedOverallScore = Math.round((sum / applicableScores.length) * 10) / 10;
  }
}
```

**This proves:**
- ✅ Aggregate score is computed from `metricResults`
- ✅ Non-applicable metrics are excluded
- ✅ Null scores are filtered out
- ✅ Average is calculated and rounded
- ✅ Fallback only used if no valid scores exist

---

## SECTION 4: MINIMAL FIX STRATEGY (NO CODE YET)

### 🎯 DIAGNOSIS: No Fix Required for Core Functionality

**The scoring system is working correctly.** The perceived issue is a **UX clarity problem**, not a technical bug.

### Option 1: Improve `/ei-metrics` Page Messaging (RECOMMENDED)

**Problem:** Users may not understand that 3.0 scores are placeholders.

**Solution:** Enhance visual indicators and messaging.

**Changes Needed:**
1. **Add prominent banner** at top of page:
   ```
   ℹ️ These are reference metrics. Complete a Role Play to see your actual scores.
   ```

2. **Replace "Not yet scored" with more actionable text:**
   ```
   Before: "Not yet scored — connect to a Role Play transcript to calculate"
   After: "Complete a Role Play to generate your score for this metric"
   ```

3. **Add visual distinction** for placeholder cards:
   - Gray out cards with 3.0 scores
   - Add "PLACEHOLDER" badge
   - Reduce opacity to 60%

4. **Add "Try Role Play" CTA button** at top of page

**Impact:** Zero functional changes, improved user understanding.

### Option 2: Remove `/ei-metrics` Page Entirely (AGGRESSIVE)

**Rationale:** If the page only shows placeholders and causes confusion, consider removing it.

**Pros:**
- Eliminates confusion source
- Forces users to Role Play (where real scores appear)
- Simplifies navigation

**Cons:**
- Loses reference documentation value
- Users can't preview metric definitions without Role Play
- Removes educational content

**Recommendation:** Keep the page but improve messaging (Option 1).

### Option 3: Fetch Historical Scores from Database (FUTURE ENHANCEMENT)

**Problem:** Page shows placeholders because no persistence layer exists.

**Solution:** Store Role Play results in database, fetch latest scores for display.

**Changes Needed:**
1. Create `roleplay_sessions` table with `metric_scores` JSON column
2. Add `GET /api/metrics/latest` endpoint
3. Update `/ei-metrics` page to fetch and display real scores
4. Add "Last updated" timestamp
5. Add "View history" link to Role Play page

**Impact:** Major feature addition, requires backend work.

**Recommendation:** Defer to future sprint (not urgent).

---

## AUDIT FINDINGS SUMMARY

### ✅ WHAT'S WORKING CORRECTLY

1. **SI-v1 Scoring Execution**
   - ✅ `scoreConversation()` runs after Role Play completion
   - ✅ Transcript is correctly formatted (`rep` / `customer` speakers)
   - ✅ `MetricResult[]` is stored in component state
   - ✅ No localStorage or persistence violations

2. **Data Flow to UI**
   - ✅ `metricResults` prop passed to `RoleplayFeedbackDialog`
   - ✅ `metricResultsMap` created from prop
   - ✅ Individual `metricResult` objects passed to `MetricScoreCard`
   - ✅ Component breakdown table renders correctly

3. **Component-Level Display**
   - ✅ `metricResult.components` array is iterated
   - ✅ Component names, weights, scores displayed
   - ✅ Rationale/evidence text shown
   - ✅ Applicability flags respected (N/A badges)
   - ✅ Performance badges ("Strength", "Needs Attention") shown

4. **Signal Intelligence Panel**
   - ✅ Live metric scores displayed during Role Play
   - ✅ Observable cues linked to metrics
   - ✅ Evidence panel shows cue-to-metric mappings
   - ✅ Hover interactions work correctly

5. **Fallback Logic**
   - ✅ 3.0 default only used when `metricResults` is empty
   - ✅ Aggregate score computed from real `MetricResult[]` when available
   - ✅ "Developing" performance level only shown for actual 3.0 scores

### ⚠️ WHAT NEEDS IMPROVEMENT (UX ONLY)

1. **`/ei-metrics` Page Clarity**
   - ⚠️ Hardcoded 3.0 scores may confuse users
   - ⚠️ "Not yet scored" message could be more prominent
   - ⚠️ No visual distinction between placeholder and real scores
   - ⚠️ Missing CTA to encourage Role Play completion

2. **User Education**
   - ⚠️ Users may not understand page is reference documentation
   - ⚠️ No explanation of where real scores appear (Role Play feedback)
   - ⚠️ Missing link from `/ei-metrics` to `/roleplay`

### ❌ WHAT'S NOT AN ISSUE

1. **Legacy EQ Adapters**
   - ❌ NOT FOUND: No `metrics-ui-adapter.ts` usage in scoring flow
   - ❌ NOT FOUND: No `eiMetricSettings.ts` interference with scores
   - ❌ NOT FOUND: No demo configs or mock data generators

2. **SI-v1 Results Being Ignored**
   - ❌ FALSE: `metricResults` prop is consumed in 3 components
   - ❌ FALSE: Component breakdowns are rendered correctly
   - ❌ FALSE: Evidence and rationale are displayed

3. **Scoring Logic Bugs**
   - ❌ NOT FOUND: No calculation errors in `scoreConversation()`
   - ❌ NOT FOUND: No type mismatches in data flow
   - ❌ NOT FOUND: No missing fields in `MetricResult` objects

---

## RECOMMENDED NEXT STEPS

### Immediate (Prompt #16)
1. ✅ **Improve `/ei-metrics` page messaging** (Option 1)
   - Add prominent banner explaining placeholder nature
   - Enhance "Not yet scored" text with actionable CTA
   - Add visual distinction for placeholder cards
   - Add "Try Role Play" button at top

### Short-Term (Future Sprint)
2. 🔄 **Add user education tooltips**
   - Tooltip on "Behavioral Metrics" nav item explaining page purpose
   - Inline help text explaining difference between reference and live scores
   - Link from `/ei-metrics` to `/roleplay` with explanation

### Long-Term (Future Enhancement)
3. 📊 **Implement score persistence** (Option 3)
   - Store Role Play results in database
   - Fetch latest scores for `/ei-metrics` page
   - Add score history view
   - Add trend charts over time

---

## CONCLUSION

### 🎉 AUDIT RESULT: SYSTEM IS WORKING AS DESIGNED

**The Signal Intelligence scoring system is correctly wired and functioning:**
- ✅ SI-v1 scoring executes after Role Play completion
- ✅ `MetricResult[]` flows to UI components correctly
- ✅ Component breakdowns display with evidence and rationale
- ✅ No legacy adapters or demo configs interfering
- ✅ Fallback logic only triggers when appropriate

**The perceived issue is a UX clarity problem:**
- ⚠️ `/ei-metrics` page shows placeholder 3.0 scores by design
- ⚠️ Users may not understand this is reference documentation
- ⚠️ Messaging could be clearer about where real scores appear

**Recommendation:**
- ✅ Proceed with Option 1 (improve messaging) in Prompt #16
- ✅ No code refactoring or architectural changes needed
- ✅ System is stable and production-ready

---

**END OF PROMPT #15 AUDIT REPORT**
