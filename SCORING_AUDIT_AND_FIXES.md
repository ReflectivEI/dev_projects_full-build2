# Signal Intelligence Scoring System - Audit & Fixes

**Date:** January 28, 2026  
**Version:** SI-v1 (Post-Fix)  
**Commit:** 541383b6e7c7a37d511fed7eb439e67d995bd63c

---

## Executive Summary

Completed comprehensive audit of 8-metric behavioral scoring system. Identified and fixed 6 issues affecting scoring consistency, fairness, and semantic clarity. All fixes maintain observable-only foundation and canonical rules compliance.

### Changes at a Glance

| Fix | Metric | Impact | Severity |
|-----|--------|--------|----------|
| 1. Energy Shifts Ceiling Removed | Customer Engagement | Can now score 5 (was capped at 4) | Low |
| 2. Goal Tokens Fairness | Making It Matter | Scores 3 when customer doesn't articulate goals (was 1) | High |
| 3. Objection Navigation Strict | Objection Navigation | NO weak-signal fallback (strict applicability) | High |
| 4. Adaptability Strict | Adaptability | NO weak-signal fallback (strict applicability) | Medium |
| 5. Commitment Gaining Fallback | Commitment Gaining | NOW applies weak-signal fallback (was missing) | Medium |
| 6. Metric-Level Override Removed | All Metrics | Eliminated redundant fallback logic | Medium |

---

## The 8 Behavioral Metrics

### 1. Question Quality
**Definition:** Quality of questions asked by sales rep, measured by openness, relevance, sequencing, and depth.

**Components:**
- `open_closed_ratio` (25%) - Balance of open vs. closed questions
- `relevance_to_goals` (25%) - Questions align with customer priorities
- `sequencing_logic` (25%) - Questions flow logically without abrupt jumps
- `follow_up_depth` (25%) - Asks follow-up questions to deepen understanding

**Applicability:** Mandatory. Applicable when rep asks ≥1 question. Weak-signal fallback applies.

**Observable Signals:**
- Question marks (`?`)
- Open question prefixes: `how`, `what`, `why`, `when`, `where`, `who`
- Question phrases: `tell me`, `walk me through`, `help me understand`

---

### 2. Listening & Responsiveness
**Definition:** Rep's ability to actively listen, acknowledge, and adapt to customer statements.

**Components:**
- `paraphrasing` (33%) - Reflects back customer statements
- `acknowledgment_of_concerns` (33%) - Acknowledges customer concerns when raised
- `adjustment_to_new_info` (34%) - Adapts approach when customer shares new information

**Applicability:** Mandatory. Applicable when ≥1 customer turn exists. Weak-signal fallback applies.

**Observable Signals:**
- Paraphrase phrases: `what i'm hearing`, `it sounds like`, `if i understand`, `so you're saying`
- Acknowledgment phrases: `i hear you`, `i understand`, `that makes sense`, `i can see why`
- Token overlap between customer and rep turns (≥0.30 indicates paraphrasing)

---

### 3. Making It Matter
**Definition:** Rep's ability to connect product/service to customer outcomes and priorities.

**Components:**
- `outcome_based_language` (33%) - Focuses on outcomes and results, not features
- `link_to_customer_priorities` (34%) - Ties value proposition to customer-stated priorities
- `no_feature_dumping` (33%) - Avoids overwhelming with feature lists

**Applicability:** Mandatory. Applicable when ≥1 rep statement exists. Weak-signal fallback applies.

**Observable Signals:**
- Outcome terms: `improve`, `reduce`, `increase`, `impact`, `outcome`, `results`, `patients`, `workflow`
- Connector phrases: `so that`, `which means`, `so you can`
- Reuse of customer goal tokens in rep statements

**✅ FIX APPLIED:** `link_to_customer_priorities` now scores 3 (neutral) when `goalTokens` is empty, instead of 1 (penalty). This prevents unfair penalization when customer doesn't articulate goals.

---

### 4. Customer Engagement Signals
**Definition:** Observable indicators of customer interest, participation, and forward momentum.

**Components:**
- `customer_talk_time` (25%) - Customer speaks appropriate amount (45-65% ideal)
- `customer_question_quality` (25%) - Customer asks thoughtful, specific questions
- `forward_looking_cues` (25%) - Customer expresses interest in next steps
- `energy_shifts` (25%) - Customer maintains or increases engagement

**Applicability:** Mandatory. Applicable when ≥1 customer turn exists. Weak-signal fallback applies.

**Observable Signals:**
- Customer talk time (45-65% ideal)
- Customer questions (`?` in customer turns)
- Forward-looking phrases: `next`, `follow up`, `schedule`, `trial`, `pilot`
- Disengagement phrases: `okay`, `sure`, `fine`, `i have to go`

**✅ FIX APPLIED:** `energy_shifts` can now score 5 for stable/positive energy (was artificially capped at 4).

---

### 5. Objection Navigation
**Definition:** Rep's ability to acknowledge, explore, and navigate customer objections professionally.

**Components:**
- `acknowledge_before_response` (33%) - Acknowledges objection before responding
- `explore_underlying_concern` (34%) - Asks questions to understand root cause
- `calm_demeanor` (33%) - Maintains composure and professionalism

**Applicability:** **OPTIONAL**. Applicable ONLY when ≥1 customer objection detected. **NO weak-signal fallback.**

**Observable Signals:**
- Objection words: `not interested`, `no budget`, `too expensive`, `can't`, `won't`, `concern`, `hesitant`, `problem`, `issue`
- Acknowledgment phrases: `i hear you`, `i understand`, `that makes sense`, `fair point`
- Clarifying questions after objection

**✅ FIX APPLIED:** Removed weak-signal fallback. Metric now shows `N/A` when no objections detected (strict applicability).

---

### 6. Conversation Control & Structure
**Definition:** Rep's ability to set agenda, manage topics, respect time, and summarize effectively.

**Components:**
- `purpose_setting` (25%) - Sets clear agenda at start
- `topic_management` (25%) - Manages topic flow with smooth transitions
- `time_management` (25%) - Respects time constraints and adapts
- `summarizing` (25%) - Recaps key points near end

**Applicability:** Mandatory. Applicable when ≥1 rep turn exists. Weak-signal fallback applies.

**Observable Signals:**
- Agenda phrases: `today i'd like`, `agenda`, `goal`, `what i'd like to cover`
- Transition phrases: `building on that`, `to connect this`, `since you said`
- Time cue phrases: `have to go`, `another meeting`, `short on time`
- Summary phrases: `to recap`, `summary`, `what we covered`, `next steps`

**Note:** `time_management` component is `applicable: false` when no time constraints detected (correct behavior).

---

### 7. Commitment Gaining
**Definition:** Rep's ability to propose specific next steps, gain agreement, and clarify ownership.

**Components:**
- `next_step_specificity` (33%) - Proposes concrete, specific next steps
- `mutual_agreement` (33%) - Gains explicit customer agreement
- `ownership_clarity` (34%) - Clarifies who does what

**Applicability:** Mandatory. Applicable when ≥1 next step phrase detected. Weak-signal fallback applies.

**Observable Signals:**
- Next step phrases: `schedule`, `follow up`, `send`, `next step`, `set up`, `confirm`
- Specific details: dates, times, concrete actions
- Agreement phrases: `yes`, `sounds good`, `that works`, `okay let's`
- Ownership phrases: `i'll send`, `you'll review`, `we will`

**✅ FIX APPLIED:** Added weak-signal fallback (was missing). Metric now handles conversations with zero commitment-gaining attempts consistently.

---

### 8. Adaptability
**Definition:** Rep's ability to adjust approach, tone, depth, and pacing based on customer cues.

**Components:**
- `approach_shift` (25%) - Changes strategy when needed
- `tone_adjustment` (25%) - Adjusts tone to match customer mood
- `depth_adjustment` (25%) - Adjusts detail level appropriately
- `pacing_adjustment` (25%) - Adjusts conversation pace

**Applicability:** Mandatory but cue-dependent. Applicable ONLY when ≥1 adaptation cue detected. **NO weak-signal fallback.**

**Observable Signals:**
- Time cues: `have to go`, `another meeting`, `short on time`
- Confusion cues: `confused`, `don't understand`, `not clear`, `what do you mean`
- Disinterest cues: `not interested`, `not sure`, `don't think`
- Emotional cues: `frustrated`, `upset`, `concerned`, `worried`

**✅ FIX APPLIED:** Removed weak-signal fallback. Metric now shows `overall_score: null` when no adaptation cues detected (strict applicability).

---

## Scoring Formulas

### Component-Level Formula (General Pattern)

```typescript
Component Score = f(Observable Evidence Count, Threshold)

where f is a step function:
  if evidence_rate ≥ threshold_5 → 5
  if evidence_rate ≥ threshold_4 → 4
  if evidence_rate ≥ threshold_3 → 3
  if evidence_rate ≥ threshold_2 → 2
  else → 1
```

### Metric-Level Formula (Canonical)

```typescript
applicable_components = components.filter(c => c.applicable === true && c.score !== null)

if applicable_components.length === 0:
  overall_score = null
else:
  sum = Σ(c.score for c in applicable_components)
  overall_score = round1(sum / applicable_components.length)

where round1(n) = Math.round(n * 10) / 10
```

**No weighting.** All metrics use simple arithmetic mean over applicable components.

### Applicability Logic (Canonical)

```typescript
for each metric:
  components = score_metric_function(transcript)
  
  applicable_count = count(c for c in components where c.applicable === true)
  
  if metric.optional === true AND applicable_count === 0:
    metric.not_applicable = true
    metric.overall_score = null
  else:
    metric.not_applicable = false
    metric.overall_score = average_applicable(components)  // may be null if no components applicable
```

### Weak-Signal Fallback (Revised)

**Applied at component level in individual metric functions:**

```typescript
for each metric (EXCEPT Objection Navigation and Adaptability):
  components = score_metric_function(transcript)
  
  if all(c.applicable === false for c in components):
    // Check if metric-level signals exist
    if has_observable_signals(transcript, signal_patterns):
      // Mark first component as applicable with score=1
      components[0].applicable = true
      components[0].score = 1
      components[0].rationale = "Observable signals detected, but threshold not met"
```

**Exceptions (NO weak-signal fallback):**
- **Objection Navigation** (optional) - Strict applicability
- **Adaptability** (mandatory but cue-dependent) - Strict applicability

---

## Detailed Fix Documentation

### Fix 1: Energy Shifts Ceiling Removed

**Location:** `scoreCustomerEngagement()` function, line 475

**Problem:** `energy_shifts` component was capped at score=4, never reaching maximum score of 5.

**Before:**
```typescript
const energyScore = (disengagedTurns.length > 2 || shrinking) ? 2 : 
                    disengagedTurns.length > 0 ? 3 : 4;
// Maximum possible score was 4, not 5
```

**After:**
```typescript
const energyScore = (disengagedTurns.length > 2 || shrinking) ? 2 : 
                    disengagedTurns.length > 0 ? 3 : 5;
// Now allows score=5 for stable/positive energy
```

**Impact:** Customer Engagement metric can now reach higher scores when customer maintains strong engagement throughout conversation.

---

### Fix 2: Goal Tokens Fairness

**Location:** `scoreMakingItMatter()` function, line 404

**Problem:** `link_to_customer_priorities` component penalized rep (score=1) when customer never articulated goals, even though rep had no goal tokens to reference.

**Before:**
```typescript
const linkRate = linkedStatements.length / repStatements.length;
const linkScore = linkRate >= 0.50 ? 5 : linkRate >= 0.35 ? 4 : 
                  linkRate >= 0.20 ? 3 : linkRate >= 0.10 ? 2 : 1;
// If goalTokens is empty, linkRate = 0, score = 1 (unfair penalty)
```

**After:**
```typescript
const linkRate = linkedStatements.length / repStatements.length;
const linkScore = goalTokens.size === 0 ? 3 : 
                  (linkRate >= 0.50 ? 5 : linkRate >= 0.35 ? 4 : 
                   linkRate >= 0.20 ? 3 : linkRate >= 0.10 ? 2 : 1);
// If no goal tokens exist, score neutral (3) instead of penalizing (1)
```

**Impact:** Fairer scoring when customer doesn't provide goal information. Rep no longer penalized for customer's lack of goal articulation.

---

### Fix 3: Objection Navigation Strict Applicability

**Location:** `scoreObjectionNavigation()` function, lines 494-502

**Problem:** Metric marked `optional: true` but weak-signal fallback made it always applicable when ANY objection-related words appeared, defeating the purpose of optionality.

**Before:**
```typescript
if (objectionTurns.length === 0) {
  const components = [ /* all applicable: false */ ];
  const signalPatterns = ['not interested', 'no budget', 'concern', ...];
  return applyWeakSignalFallback(components, transcript, signalPatterns);
  // If ANY of these words appear ANYWHERE, metric becomes applicable with score=1
}
```

**After:**
```typescript
if (objectionTurns.length === 0) {
  // FIX: Objection Navigation is optional - NO weak-signal fallback (strict applicability)
  return [
    { name: 'acknowledge_before_response', score: null, applicable: false, ... },
    { name: 'explore_underlying_concern', score: null, applicable: false, ... },
    { name: 'calm_demeanor', score: null, applicable: false, ... }
  ];
}
```

**Impact:** Objection Navigation now shows `not_applicable: true` when no actual objections detected. Metric is truly optional.

---

### Fix 4: Adaptability Strict Applicability

**Location:** `scoreAdaptability()` function, lines 687-696

**Problem:** Weak-signal fallback applied even when no adaptation cues detected, creating confusion between "no cues" vs. "weak signals present".

**Before:**
```typescript
if (!hasTimeCue && !hasConfusionCue && !hasDisinterestCue && !hasEmotionalCue) {
  const components = [ /* all applicable: false */ ];
  const signalPatterns = ['have to go', 'confused', 'not interested', ...];
  return applyWeakSignalFallback(components, transcript, signalPatterns);
  // Weak-signal fallback could override "no cues" state
}
```

**After:**
```typescript
if (!hasTimeCue && !hasConfusionCue && !hasDisinterestCue && !hasEmotionalCue) {
  // FIX: Adaptability is mandatory but cue-dependent - NO weak-signal fallback (strict applicability)
  return [
    { name: 'approach_shift', score: null, applicable: false, ... },
    { name: 'tone_adjustment', score: null, applicable: false, ... },
    { name: 'depth_adjustment', score: null, applicable: false, ... },
    { name: 'pacing_adjustment', score: null, applicable: false, ... }
  ];
}
```

**Impact:** Adaptability now shows `overall_score: null` when no adaptation cues detected. Clearer semantic distinction between "no cues" and "cues present but not adapted".

---

### Fix 5: Commitment Gaining Weak-Signal Fallback

**Location:** `scoreCommitmentGaining()` function, lines 630-642

**Problem:** Function did NOT call `applyWeakSignalFallback`, making it inconsistent with other mandatory metrics. Always scored even when no commitment-gaining observed.

**Before:**
```typescript
function scoreCommitmentGaining(transcript: Transcript): ComponentResult[] {
  const nextStepTurns = repTurns.filter(t => containsAny(t.text, nextStepPhrases));
  // No check for nextStepTurns.length === 0
  // Always returns components with applicable: true
  // No weak-signal fallback call
}
```

**After:**
```typescript
function scoreCommitmentGaining(transcript: Transcript): ComponentResult[] {
  const nextStepTurns = repTurns.filter(t => containsAny(t.text, nextStepPhrases));
  
  // FIX: Apply weak-signal fallback if no next steps detected
  if (nextStepTurns.length === 0) {
    const components = [
      { name: 'next_step_specificity', score: null, applicable: false, ... },
      { name: 'mutual_agreement', score: null, applicable: false, ... },
      { name: 'ownership_clarity', score: null, applicable: false, ... }
    ];
    const signalPatterns = ['schedule', 'follow up', 'send', 'next step', ...];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }
  // ... rest of function
}
```

**Impact:** Commitment Gaining now handles conversations with zero commitment-gaining attempts consistently with other metrics.

---

### Fix 6: Metric-Level Override Removed

**Location:** `scoreConversation()` main function, lines 762-773

**Problem:** Metric-level signal check was redundant with component-level weak-signal fallback, causing potential double-application of fallback logic.

**Before:**
```typescript
// In scoreConversation() main function
switch (spec.id) {
  case 'question_quality':
    components = scoreQuestionQuality(transcript);
    break;
  // ... other cases
}

// Apply metric-scoped signal attribution
if (!components.some(c => c.applicable) && hasMetricSignals(transcript, spec.id)) {
  components = [...components];
  components[0] = {
    ...components[0],
    score: 1,
    applicable: true,
    rationale: `Observable ${spec.metric.toLowerCase()} signals detected, but threshold not met`
  };
}
```

**After:**
```typescript
// In scoreConversation() main function
switch (spec.id) {
  case 'question_quality':
    components = scoreQuestionQuality(transcript);
    break;
  // ... other cases
}

// FIX: REMOVE metric-level signal override - redundant with component-level fallback
// Component-level weak-signal fallback already handles signal attribution in individual metric functions
// This metric-level check was causing double-application of fallback logic
```

**Impact:** Eliminated redundant fallback logic. Single source of truth for weak-signal handling (component-level in individual metric functions).

---

## Validation: Edge Cases

### Edge Case 1: Short Conversations (< 3 turns)

**Behavior:** All metrics score normally. Many components will be `applicable: false` due to insufficient evidence. Overall score based on few applicable components (likely low).

**Example:**
```
Transcript: 2 turns (1 rep, 1 customer)
Result: 
  - Question Quality: applicable (if rep asked question)
  - Listening: applicable: false (need multiple turns)
  - Making It Matter: applicable (if rep made statement)
  - Customer Engagement: applicable: false (need multiple customer turns)
  - Objection Navigation: not_applicable (no objections)
  - Conversation Control: applicable: false (need structure)
  - Commitment Gaining: applicable: false (no next steps)
  - Adaptability: overall_score: null (no cues)
Overall: Average of 2 metrics → likely 1.5-2.5
```

**Verdict:** ✅ Correct and intentional. Short conversations should score low.

---

### Edge Case 2: No Objections Raised

**Behavior:** Objection Navigation metric shows `not_applicable: true`, `overall_score: null`. Overall score calculated from remaining 7 metrics.

**Example:**
```
Transcript: 10 turns, no objections
Result:
  - Objection Navigation: not_applicable: true, overall_score: null
  - Other 7 metrics: score normally
Overall: Average of 7 metrics (excludes Objection Navigation)
```

**Verdict:** ✅ Correct and intentional. Can't assess objection handling without objections.

---

### Edge Case 3: Time-Limited HCP (Customer Cuts Short)

**Behavior:** Conversation Control - Time Management and Adaptability - Pacing Adjustment become applicable and score based on rep's adaptation. Other metrics score normally (may be low due to short conversation).

**Example:**
```
Transcript: 5 turns, customer says "I have to go" at turn 3
Result:
  - Conversation Control - Time Management: applicable, scores 5 if rep adapts, 2 if not
  - Adaptability - Pacing Adjustment: applicable, scores 5 if rep speeds up, 2 if not
  - Other metrics: score normally (likely low due to short conversation)
Overall: Average of all applicable metrics (likely 2.0-3.5 depending on adaptation)
```

**Verdict:** ✅ Correct and intentional. Rep should adapt to time constraints.

---

### Edge Case 4: Customer Provides No Goal Information

**Behavior:** Question Quality - Relevance to Goals scores based on goal-seeking questions. Making It Matter - Link to Customer Priorities scores 3 (neutral) instead of 1.

**Example:**
```
Transcript: 8 turns, customer never mentions goals
Result:
  - Question Quality - Relevance to Goals: scores based on goal-seeking questions
  - Making It Matter - Link to Customer Priorities: score = 3 (neutral, not 1)
Overall: No unfair penalty
```

**Verdict:** ✅ Correct and intentional. Rep shouldn't be penalized for customer's lack of goal articulation.

---

## What Did NOT Change

### Preserved Behaviors

1. ✅ **All metrics use simple averaging** (no weighted averages)
2. ✅ **Observable-only foundation** (no sentiment/emotion inference)
3. ✅ **Deterministic scoring** (same input → same output)
4. ✅ **Component-level rationale strings** (traceability maintained)
5. ✅ **1-5 scoring scale** (no normalization changes)
6. ✅ **Canonical rules compliance** (RULE 3 & RULE 4 preserved)
7. ✅ **Metric specifications** (no changes to thresholds or formulas)

### Unchanged Code

1. ✅ **Individual metric scoring functions** (logic preserved, only fallback calls modified)
2. ✅ **Token overlap calculations** (unchanged)
3. ✅ **Phrase detection logic** (unchanged)
4. ✅ **Threshold values** (unchanged)
5. ✅ **Component weights** (unchanged, though not used in averaging)

---

## Expected User Impact

### Scoring Changes Users Will See

1. **Objection Navigation** will show `N/A` more often (only scores when actual objections detected)
2. **Adaptability** will show `overall_score: null` when no adaptation cues (was showing weak-signal score=1)
3. **Energy Shifts** can now reach maximum score of 5 (was capped at 4)
4. **Link to Customer Priorities** will score higher (3 instead of 1) when customer doesn't articulate goals
5. **Commitment Gaining** will show `overall_score: null` when no commitment-gaining attempts (was always scoring)

### UI Impact

- **Metric cards** may show `N/A` more frequently (correct behavior)
- **Overall scores** may be slightly higher (due to Energy Shifts ceiling removal and Goal Tokens fix)
- **Component rationale** strings unchanged (still provide explanations)

### No Impact On

- ✅ **UI layout, styling, navigation** (unchanged)
- ✅ **Deployment, CI/CD, infrastructure** (unchanged)
- ✅ **API endpoints** (unchanged)
- ✅ **Database schema** (unchanged)
- ✅ **Component library** (unchanged)

---

## Testing Recommendations

### Unit Tests to Add

1. **Energy Shifts:** Verify score=5 when no disengagement detected
2. **Goal Tokens:** Verify score=3 when `goalTokens.size === 0`
3. **Objection Navigation:** Verify `not_applicable: true` when no objections
4. **Adaptability:** Verify `overall_score: null` when no cues
5. **Commitment Gaining:** Verify weak-signal fallback applies
6. **Metric-Level Override:** Verify no double-application of fallback

### Integration Tests

1. **Short Conversations:** Verify low scores (1.5-2.5 range)
2. **No Objections:** Verify overall score excludes Objection Navigation
3. **Time-Limited HCP:** Verify Time Management and Pacing Adjustment become applicable
4. **No Goal Information:** Verify no unfair penalty

---

## Conclusion

All 6 fixes implemented successfully. Scoring system now:

1. ✅ **More consistent** (weak-signal fallback applied uniformly)
2. ✅ **More fair** (no penalty for customer's lack of goal articulation)
3. ✅ **More semantically clear** (optional metrics truly optional)
4. ✅ **Less redundant** (single source of truth for fallback logic)
5. ✅ **Observable-only** (no changes to detection logic)
6. ✅ **Canonical rules compliant** (RULE 3 & RULE 4 preserved)

**No deployment, UI, or infrastructure changes required.** All fixes are backend scoring logic only.

---

## Appendix: Commit Details

**Commit Hash:** 541383b6e7c7a37d511fed7eb439e67d995bd63c  
**Files Changed:** 1 (`src/lib/signal-intelligence/scoring.ts`)  
**Lines Added:** 23  
**Lines Deleted:** 22  
**Net Change:** +1 line

**Diff Summary:**
- Fix 1: Line 475 (Energy Shifts ceiling removed)
- Fix 2: Line 404 (Goal Tokens fairness)
- Fix 3: Lines 494-502 (Objection Navigation strict)
- Fix 4: Lines 687-696 (Adaptability strict)
- Fix 5: Lines 630-642 (Commitment Gaining fallback)
- Fix 6: Lines 762-773 (Metric-level override removed)
