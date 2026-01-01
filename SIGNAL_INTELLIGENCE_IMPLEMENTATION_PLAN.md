# Signal Intelligence™ Implementation Plan

**ReflectivAI Platform Alignment with Marketing Site**

**Date:** January 1, 2026  
**Status:** Ready for Implementation  
**Priority:** Critical - Complete Platform Overhaul

---

## Executive Summary

This document provides a complete implementation plan to align the ReflectivAI platform with the approved Signal Intelligence™ methodology and marketing site. This is a **complete overhaul** that replaces the legacy "Live EI Analysis" system with the new Signal Intelligence™ framework.

### Critical Changes

1. **Remove ALL EI/EQ Language** → Replace with Signal Intelligence™ terminology
2. **Replace 10 EI Metrics** → Implement 8 Signal Intelligence™ Capabilities
3. **Delete Live EQ Analysis Component** → Build new Behavioral Metrics system
4. **Redesign Roleplay Right Panel** → Match marketing site Interactive Demo
5. **Update Final Evaluation Dialog** → Align with Signal Intelligence™ methodology
6. **Consistent Language Across Platform** → Zero inconsistencies with marketing site

---

## Part 1: Current State Analysis

### Current Implementation (LEGACY - TO BE REMOVED)

#### 10 EI Metrics (src/lib/data.ts)

**Current metrics that MUST be removed:**

1. **Empathy** (empathy) - "Recognizing and responding to HCP emotions"
2. **Clarity** (clarity) - "Clear, concise communication"
3. **Compliance** (compliance) - "Adherence to regulatory guidelines"
4. **Discovery** (discovery) - "Asking insightful questions"
5. **Objection Handling** (objection-handling) - "Addressing concerns effectively"
6. **Confidence** (confidence) - "Professional presence and conviction"
7. **Active Listening** (active-listening) - "Demonstrating understanding"
8. **Adaptability** (adaptability) - "Adjusting approach based on feedback"
9. **Action Insight** (action-insight) - "Proposing relevant next steps"
10. **Resilience** (resilience) - "Maintaining composure under pressure"

#### Live EQ Analysis Component (src/components/live-eq-analysis.tsx)

**Current component that MUST be deleted:**

- 323 lines of code
- Displays 10 EI metrics in 2 rows (5 metrics each)
- Shows "Live EI Analysis" header
- Uses "EI rubric v2.0" badge
- Scoring guide with "EI Scoring (1-5 scale)"
- Performance levels: Exceptional, Strong, Developing, Emerging, Needs Focus
- Overall EI score calculation

**Problems with current implementation:**

- ❌ Uses "EI" and "EQ" terminology (prohibited)
- ❌ 10 metrics instead of 8 capabilities
- ❌ Metric names don't match Signal Intelligence™ framework
- ❌ No connection to Human Decision Drivers Framework
- ❌ No observable behavior focus
- ❌ Missing "illustrative score" disclaimer
- ❌ No "AI identifies patterns; interpretation remains with professional" language

#### Signal Intelligence Panel (src/components/signal-intelligence-panel.tsx)

**Current component (KEEP but UPDATE):**

- 286 lines of code
- Displays observable signals: verbal, conversational, engagement, contextual
- Shows signal type, interpretation, suggested response
- Includes disclaimer: "Observable signals only"
- Tooltip: "Signal Intelligence observes verbal, conversational, and engagement cues"

**What needs updating:**

- ✅ Core structure is correct (observable signals)
- ⚠️ Needs integration with 8 Behavioral Metrics
- ⚠️ Needs to show real-time capability evaluation
- ⚠️ Missing connection to specific capabilities

---

## Part 2: Target State - Signal Intelligence™ Framework

### The 8 Signal Intelligence™ Capabilities

**Authoritative mapping (DO NOT MODIFY):**

#### 1. Signal Awareness

**Behavioral Metric:** Question Quality  
**Example Score (Illustrative):** 4.3 / 5

**Definition:**  
The ability to notice what matters in the conversation and ask purposeful, customer-centric questions.

**How It's Evaluated:**  
How consistently questions surface customer priorities rather than gathering surface-level information.

**What Good Looks Like:**
- Open-ended, diagnostic questions
- Follow-ups that build on prior answers
- Logical sequencing without interrogation

**How It's Calculated:**
- Open vs. closed question ratio
- Relevance to stated customer goals
- Depth of follow-up questioning

**Score Calculation (Example):**
```
(Open Questions Ratio: 0.92 × 2.0)
+ (Goal Relevance Score: 0.88 × 2.0)
+ (Follow-Up Depth Score: 0.85 × 1.0)
= 4.30 / 5
```

**How It's Measured:**  
Question structure classification, topic–goal alignment detection, turn-to-turn continuity analysis.

---

#### 2. Signal Interpretation

**Behavioral Metric:** Listening & Responsiveness  
**Example Score (Illustrative):** 4.1 / 5

**Definition:**  
The ability to accurately acknowledge, reflect, and build on customer input without inferring intent or emotion.

**How It's Evaluated:**  
How consistently the professional acknowledges input and adjusts based on new information.

**What Good Looks Like:**
- Paraphrasing customer statements
- Explicit acknowledgment of concerns
- Adjustments based on customer input

**How It's Calculated:**
- Paraphrase accuracy
- Acknowledgment frequency
- Responsiveness latency

**Score Calculation (Example):**
```
(Paraphrase Accuracy: 0.90 × 2.0)
+ (Acknowledgment Rate: 0.85 × 1.5)
+ (Adjustment Responsiveness: 0.82 × 1.5)
= 4.10 / 5
```

**How It's Measured:**  
Semantic similarity analysis, acknowledgment markers, response adaptation tracking.

---

#### 3. Value Connection

**Behavioral Metric:** Value Framing (Making It Matter)  
**Example Score (Illustrative):** 4.0 / 5

**Definition:**  
The ability to connect information to customer-relevant outcomes rather than features.

**How It's Evaluated:**  
How consistently messaging reflects customer priorities and impact.

**What Good Looks Like:**
- Outcome-based language
- Clear linkage to customer goals
- Avoidance of feature dumping

**How It's Calculated:**
- Outcome vs. feature language ratio
- Priority alignment score
- Message relevance weighting

**Score Calculation (Example):**
```
(Outcome Language Ratio: 0.88 × 2.0)
+ (Priority Alignment: 0.80 × 2.0)
+ (Relevance Weighting: 0.84 × 1.0)
= 4.00 / 5
```

**How It's Measured:**  
Language classification, outcome mapping, priority reference detection.

---

#### 4. Customer Engagement Monitoring

**Behavioral Metric:** Customer Engagement Cues  
**Example Score (Illustrative):** 4.2 / 5

**Definition:**  
Observable indicators of customer participation and momentum that inform how a professional adjusts pacing, focus, or next steps.

**How It's Evaluated:**  
How consistently engagement cues are noticed and appropriately responded to during the conversation.

**What Good Looks Like:**
- Monitoring customer talk time
- Recognizing forward-looking statements
- Adjusting responses when momentum shifts

**How It's Calculated:**
- Customer talk ratio
- Forward-looking cue detection
- Engagement-shift response rate

**Score Calculation (Example):**
```
(Talk Ratio Balance: 0.85 × 1.5)
+ (Forward Cue Detection: 0.90 × 2.0)
+ (Response Timeliness: 0.88 × 1.5)
= 4.20 / 5
```

**How It's Measured:**  
Turn-taking analysis, cue classification, engagement trend detection.

---

#### 5. Objection Navigation

**Behavioral Metric:** Objection Handling  
**Example Score (Illustrative):** 3.9 / 5

**Definition:**  
The ability to respond constructively to resistance without defensiveness.

**How It's Evaluated:**  
Quality of acknowledgment and composure during objections.

**What Good Looks Like:**
- Acknowledgment before rebuttal
- Calm pacing
- Exploratory questioning

**How It's Calculated:**
- Acknowledgment presence
- Rebuttal timing
- Defensive language absence

**Score Calculation (Example):**
```
(Acknowledgment Score: 0.85 × 2.0)
+ (Rebuttal Timing Score: 0.75 × 1.5)
+ (Defensive Language Avoidance: 0.80 × 1.5)
= 3.90 / 5
```

**How It's Measured:**  
Objection–response sequencing, tone marker detection.

---

#### 6. Conversation Management

**Behavioral Metric:** Conversation Control & Structure  
**Example Score (Illustrative):** 4.4 / 5

**Definition:**  
The ability to guide conversations with purpose and clarity.

**How It's Evaluated:**  
How well the professional structures, transitions, and summarizes the interaction.

**What Good Looks Like:**
- Clear purpose setting
- Smooth transitions
- Summarized next steps

**How It's Calculated:**
- Purpose clarity score
- Transition smoothness
- Summary completeness

**Score Calculation (Example):**
```
(Purpose Clarity: 0.92 × 2.0)
+ (Transition Quality: 0.90 × 1.5)
+ (Summary Completeness: 0.88 × 1.5)
= 4.40 / 5
```

**How It's Measured:**  
Intent modeling, transition detection, summary extraction.

---

#### 7. Adaptive Response

**Behavioral Metric:** Adaptability  
**Example Score (Illustrative):** 4.1 / 5

**Definition:**  
The ability to adjust approach based on observable conversational signals.

**How It's Evaluated:**  
How consistently tone, depth, or pacing changes are appropriate to the situation.

**What Good Looks Like:**
- Adjusting depth based on cues
- Shifting tone when needed
- Modifying pace appropriately

**How It's Calculated:**
- Adaptation frequency
- Contextual appropriateness
- Timing accuracy

**Score Calculation (Example):**
```
(Adaptation Frequency: 0.85 × 1.5)
+ (Appropriateness Score: 0.88 × 2.0)
+ (Timing Accuracy: 0.84 × 1.5)
= 4.10 / 5
```

**How It's Measured:**  
Signal–response matching, timing analysis, context evaluation.

---

#### 8. Commitment Generation

**Behavioral Metric:** Commitment Gaining  
**Example Score (Illustrative):** 4.5 / 5

**Definition:**  
The ability to secure clear, voluntary next actions with mutual agreement.

**How It's Evaluated:**  
How consistently next steps are explicit and mutually owned.

**What Good Looks Like:**
- Specific next steps
- Mutual agreement language
- Ownership clarity

**How It's Calculated:**
- Next-step specificity
- Agreement confirmation rate
- Ownership language presence

**Score Calculation (Example):**
```
(Specificity Score: 0.92 × 2.0)
+ (Agreement Rate: 0.90 × 2.0)
+ (Ownership Clarity: 0.88 × 1.0)
= 4.50 / 5
```

**How It's Measured:**  
Action extraction, agreement detection, ownership phrasing analysis.

---

## Part 3: Implementation Requirements

### Global UI & Copy Rules (MANDATORY)

**Hard Constraints (DO NOT VIOLATE):**

1. ✅ Use "Capability", not "competency"
2. ✅ Use "Behavioral Metric", not "EI analysis" or "EQ metric"
3. ✅ Do not surface Human Decision Drivers directly in the UI
4. ✅ Do not show Compliance as a metric (it's a guardrail, not a capability)
5. ✅ Scores must always be labeled "Example score (illustrative)"
6. ✅ Never imply automation of judgment or decision-making
7. ✅ No inference of emotion, intent, motivation, or mindset
8. ✅ Always include disclaimer: "AI identifies patterns; interpretation remains with the professional"

### Mandatory Footer Language

**Must appear on all expanded project cards and evaluation screens:**

> Signal Intelligence™ scores reflect observable communication behaviors during structured practice.  
> They are not assessments of personality, intent, emotional state, or professional competence, and are not used for automated decision-making.  
> AI identifies behavioral patterns; interpretation and judgment remain with the professional.

---

## Part 4: Component Architecture

### New Components to Create

#### 1. `src/components/behavioral-metrics-panel.tsx`

**Purpose:** Replace Live EQ Analysis with Signal Intelligence™ Behavioral Metrics

**Features:**
- Display 8 Signal Intelligence™ Capabilities
- Show Behavioral Metric name for each capability
- Display "Example score (illustrative)" with 1-5 scale
- Expandable detail view with:
  - Definition
  - How It's Evaluated
  - What Good Looks Like
  - How It's Calculated
  - How It's Measured
- Mandatory footer with disclaimer
- No "overall score" (each capability is independent)
- No performance level labels (Exceptional, Strong, etc.)

**Visual Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Signal Intelligence™ Behavioral Metrics                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Signal Awareness]           [Signal Interpretation]       │
│  Question Quality             Listening & Responsiveness    │
│  4.3 / 5 (illustrative)       4.1 / 5 (illustrative)       │
│                                                             │
│  [Value Connection]           [Customer Engagement...]      │
│  Value Framing                Customer Engagement Cues      │
│  4.0 / 5 (illustrative)       4.2 / 5 (illustrative)       │
│                                                             │
│  [Objection Navigation]       [Conversation Management]     │
│  Objection Handling           Conversation Control          │
│  3.9 / 5 (illustrative)       4.4 / 5 (illustrative)       │
│                                                             │
│  [Adaptive Response]          [Commitment Generation]       │
│  Adaptability                 Commitment Gaining            │
│  4.1 / 5 (illustrative)       4.5 / 5 (illustrative)       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ ⓘ Signal Intelligence™ scores reflect observable           │
│   communication behaviors during structured practice.       │
│   AI identifies patterns; interpretation remains with       │
│   the professional.                                         │
└─────────────────────────────────────────────────────────────┘
```

#### 2. `src/components/capability-detail-card.tsx`

**Purpose:** Expandable detail view for each capability (project card style)

**Features:**
- Capability name (large, bold)
- Behavioral Metric name (subtitle)
- Example score (illustrative) with visual indicator
- Definition section
- "How It's Evaluated" section
- "What Good Looks Like" bullet list
- "How It's Calculated" breakdown
- "How It's Measured" technical details
- Score calculation example (formula)
- Mandatory footer disclaimer

#### 3. Update `src/components/signal-intelligence-panel.tsx`

**Changes needed:**
- Add capability tagging to signals
- Show which capability each signal relates to
- Add real-time capability evaluation
- Connect signals to behavioral metrics
- Update header: "Signal Intelligence™" (with trademark)
- Keep existing signal types (verbal, conversational, engagement, contextual)
- Keep existing disclaimer language

---

## Part 5: Data Structure Changes

### New Data Model: `src/lib/signal-intelligence-data.ts`

**Create new file with authoritative capability definitions:**

```typescript
export interface SignalIntelligenceCapability {
  id: string;
  name: string;
  behavioralMetric: string;
  definition: string;
  howEvaluated: string;
  whatGoodLooksLike: string[];
  howCalculated: string[];
  scoreCalculationExample: {
    components: Array<{
      name: string;
      value: number;
      weight: number;
    }>;
    total: number;
  };
  howMeasured: string;
  exampleScore: number;
}

export const signalIntelligenceCapabilities: SignalIntelligenceCapability[] = [
  {
    id: 'signal-awareness',
    name: 'Signal Awareness',
    behavioralMetric: 'Question Quality',
    definition: 'The ability to notice what matters in the conversation and ask purposeful, customer-centric questions.',
    howEvaluated: 'How consistently questions surface customer priorities rather than gathering surface-level information.',
    whatGoodLooksLike: [
      'Open-ended, diagnostic questions',
      'Follow-ups that build on prior answers',
      'Logical sequencing without interrogation'
    ],
    howCalculated: [
      'Open vs. closed question ratio',
      'Relevance to stated customer goals',
      'Depth of follow-up questioning'
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Open Questions Ratio', value: 0.92, weight: 2.0 },
        { name: 'Goal Relevance Score', value: 0.88, weight: 2.0 },
        { name: 'Follow-Up Depth Score', value: 0.85, weight: 1.0 }
      ],
      total: 4.30
    },
    howMeasured: 'Question structure classification, topic–goal alignment detection, turn-to-turn continuity analysis.',
    exampleScore: 4.3
  },
  // ... (repeat for all 8 capabilities)
];
```

### Update `src/lib/data.ts`

**Remove legacy EI metrics:**

```typescript
// DELETE THIS ENTIRE SECTION:
export const eqMetrics: EQMetric[] = [
  {
    id: "empathy",
    name: "Empathy",
    description: "Recognizing and responding to HCP emotions and concerns",
    icon: Heart,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  // ... (all 10 metrics)
];
```

**Replace with:**

```typescript
import { signalIntelligenceCapabilities } from './signal-intelligence-data';

// Re-export for backward compatibility during migration
export { signalIntelligenceCapabilities };
```

---

## Part 6: Roleplay Right Panel Redesign

### Current Layout (INCORRECT)

```
┌─────────────────────────────────┐
│ Live EI Analysis                │
│ ├─ 10 EI Metrics (2 rows)       │
│ └─ Overall EI Score             │
├─────────────────────────────────┤
│ Signal Intelligence             │
│ └─ Observable signals list      │
└─────────────────────────────────┘
```

### Target Layout (CORRECT - Match Marketing Site)

```
┌─────────────────────────────────────────────────────┐
│ Situational Cues                                    │
│ ├─ Initial Cue: "*Dr. Chen glances at watch*..."   │
│ ├─ Environmental Context: "Busy clinic, 2pm"       │
│ ├─ HCP Mood: "Rushed, slightly distracted"         │
│ └─ Potential Interruptions: "Nurse may interrupt"  │
├─────────────────────────────────────────────────────┤
│ Signal Intelligence™ Indicators (Real-Time)         │
│ ├─ [Verbal] Tone shift detected                    │
│ ├─ [Engagement] Reduced eye contact                │
│ └─ [Contextual] Time pressure evident              │
├─────────────────────────────────────────────────────┤
│ Behavioral Metrics (Live Evaluation)                │
│ ├─ Signal Awareness: 4.3/5 (illustrative)          │
│ ├─ Signal Interpretation: 4.1/5 (illustrative)     │
│ ├─ Value Connection: 4.0/5 (illustrative)          │
│ ├─ Customer Engagement: 4.2/5 (illustrative)       │
│ ├─ Objection Navigation: 3.9/5 (illustrative)      │
│ ├─ Conversation Management: 4.4/5 (illustrative)   │
│ ├─ Adaptive Response: 4.1/5 (illustrative)         │
│ └─ Commitment Generation: 4.5/5 (illustrative)     │
├─────────────────────────────────────────────────────┤
│ Coaching Feedback                                   │
│ └─ Real-time suggestions based on signals          │
└─────────────────────────────────────────────────────┘
```

### Implementation Changes

**File:** `src/pages/roleplay.tsx`

**Changes:**

1. **Add Situational Cues Section (Top)**
   - Display `initialCue` from scenario
   - Display `environmentalContext`
   - Display `hcpMood`
   - Display `potentialInterruptions`
   - Use italic text for cues (match RoleplayCueParser style)
   - Add eye icon for visual cues

2. **Update Signal Intelligence Section**
   - Change header to "Signal Intelligence™ Indicators (Real-Time)"
   - Keep existing signal display
   - Add capability tagging

3. **Replace Live EQ Analysis with Behavioral Metrics**
   - Remove `<LiveEQAnalysis />` component
   - Add `<BehavioralMetricsPanel />` component
   - Show all 8 capabilities with live scores
   - Add "(illustrative)" label to all scores
   - Compact view (no expandable details in right panel)

4. **Add Coaching Feedback Section (Bottom)**
   - Real-time coaching suggestions
   - Based on detected signals
   - Capability-specific guidance

---

## Part 7: Final Evaluation Dialog Redesign

### Current Dialog (INCORRECT)

**File:** `src/components/roleplay-feedback-dialog.tsx`

**Current structure:**
- "Role Play Complete" header
- Overall EI Score
- 10 EI Metrics with scores
- "What Worked Well" section
- "Areas to Improve" section
- "Key Takeaways" section

**Problems:**
- ❌ Uses "EI" terminology
- ❌ Shows "overall EI score"
- ❌ 10 metrics instead of 8 capabilities
- ❌ No Signal Intelligence™ language
- ❌ Missing mandatory disclaimer

### Target Dialog (CORRECT)

**New structure:**

```
┌───────────────────────────────────────────────────────────┐
│ Practice Session Complete                                 │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Signal Intelligence™ Behavioral Metrics                   │
│                                                           │
│ [Signal Awareness]           [Signal Interpretation]      │
│ Question Quality             Listening & Responsiveness   │
│ 4.3 / 5 (illustrative)       4.1 / 5 (illustrative)      │
│ ✓ Strong follow-up depth     ⚠ Acknowledgment timing     │
│                                                           │
│ [Value Connection]           [Customer Engagement...]     │
│ Value Framing                Customer Engagement Cues     │
│ 4.0 / 5 (illustrative)       4.2 / 5 (illustrative)      │
│ ✓ Outcome-focused language   ✓ Noticed momentum shifts   │
│                                                           │
│ [Objection Navigation]       [Conversation Management]    │
│ Objection Handling           Conversation Control         │
│ 3.9 / 5 (illustrative)       4.4 / 5 (illustrative)      │
│ ⚠ Rebuttal timing            ✓ Clear transitions         │
│                                                           │
│ [Adaptive Response]          [Commitment Generation]      │
│ Adaptability                 Commitment Gaining           │
│ 4.1 / 5 (illustrative)       4.5 / 5 (illustrative)      │
│ ✓ Adjusted to time pressure  ✓ Specific next steps       │
│                                                           │
├───────────────────────────────────────────────────────────┤
│ Observable Signals Detected                               │
│ ├─ [Verbal] Tone shift when discussing side effects      │
│ ├─ [Engagement] Increased questions about efficacy        │
│ └─ [Contextual] Time pressure evident throughout          │
├───────────────────────────────────────────────────────────┤
│ Coaching Feedback                                         │
│                                                           │
│ Strengths:                                                │
│ • Strong question sequencing surfaced key priorities      │
│ • Effective adaptation to time constraints                │
│ • Clear commitment with specific next steps               │
│                                                           │
│ Areas to Focus On:                                        │
│ • Acknowledge concerns before responding to objections    │
│ • Allow more processing time after data presentation      │
│ • Validate assumptions before proposing solutions         │
│                                                           │
├───────────────────────────────────────────────────────────┤
│ ⓘ Signal Intelligence™ scores reflect observable          │
│   communication behaviors during structured practice.      │
│   They are not assessments of personality, intent,        │
│   emotional state, or professional competence, and are    │
│   not used for automated decision-making.                 │
│   AI identifies behavioral patterns; interpretation       │
│   remains with the professional.                          │
└───────────────────────────────────────────────────────────┘
```

**Key Changes:**

1. **Header:** "Practice Session Complete" (not "Role Play Complete")
2. **No Overall Score:** Each capability is independent
3. **8 Capabilities:** Replace 10 EI metrics
4. **Behavioral Metric Names:** Show under each capability
5. **Illustrative Scores:** Always labeled "(illustrative)"
6. **Evidence-Based Feedback:** Specific behaviors, not general praise
7. **Observable Signals Section:** Show detected signals
8. **Coaching Feedback:** Strengths and areas to focus on
9. **Mandatory Disclaimer:** Full footer language

---

## Part 8: Language & Terminology Updates

### Global Find & Replace

**Search and replace across ALL files:**

| Current (REMOVE) | New (USE) |
|------------------|----------|
| "EI Analysis" | "Signal Intelligence™ Behavioral Metrics" |
| "EQ Analysis" | "Signal Intelligence™ Behavioral Metrics" |
| "EI Metrics" | "Behavioral Metrics" |
| "EQ Metrics" | "Behavioral Metrics" |
| "Emotional Intelligence" | "Signal Intelligence™" |
| "EI Score" | "Behavioral Metric Score (illustrative)" |
| "Overall EI" | (Remove - no overall score) |
| "EI rubric" | "Signal Intelligence™ framework" |
| "Live EI Analysis" | "Signal Intelligence™ Behavioral Metrics" |
| "EI-related scores" | "Behavioral metric scores" |
| "EI-based" | "Signal Intelligence™-based" |

### Page Headers & Navigation

**Update navigation labels:**

| Current | New |
|---------|-----|
| "EI Metrics" | "Signal Intelligence™" |
| "Emotional Intelligence" | "Signal Intelligence™" |
| "EI Frameworks" | "Behavioral Frameworks" |

**Update page headers:**

- Dashboard: "Signal Intelligence™ Development"
- Roleplay: "Interactive Practice Session"
- Exercises: "Skill Development Exercises"
- Frameworks: "Behavioral Frameworks"

---

## Part 9: Implementation Checklist

### Phase 1: Data & Core Components (Priority 1)

- [ ] Create `src/lib/signal-intelligence-data.ts` with 8 capabilities
- [ ] Update `src/lib/data.ts` to remove legacy EI metrics
- [ ] Create `src/components/behavioral-metrics-panel.tsx`
- [ ] Create `src/components/capability-detail-card.tsx`
- [ ] Update `src/components/signal-intelligence-panel.tsx`
- [ ] Delete `src/components/live-eq-analysis.tsx`
- [ ] Delete `src/components/eq-metric-card.tsx`

### Phase 2: Roleplay Integration (Priority 1)

- [ ] Update `src/pages/roleplay.tsx` right panel layout
- [ ] Add Situational Cues section at top
- [ ] Replace Live EQ Analysis with Behavioral Metrics
- [ ] Update Signal Intelligence section header
- [ ] Add Coaching Feedback section at bottom
- [ ] Update `src/components/roleplay-feedback-dialog.tsx`
- [ ] Remove overall EI score
- [ ] Replace 10 metrics with 8 capabilities
- [ ] Add Observable Signals section
- [ ] Add mandatory disclaimer footer

### Phase 3: Language & Terminology (Priority 1)

- [ ] Global find & replace: "EI" → "Signal Intelligence™"
- [ ] Global find & replace: "EQ" → "Signal Intelligence™"
- [ ] Update all page headers
- [ ] Update navigation labels
- [ ] Update tooltips and help text
- [ ] Update API response types
- [ ] Update mock data

### Phase 4: Dashboard & Other Pages (Priority 2)

- [ ] Update `src/pages/dashboard.tsx`
- [ ] Update `src/pages/ei-metrics.tsx` (rename to `signal-intelligence.tsx`)
- [ ] Update `src/pages/frameworks.tsx`
- [ ] Update `src/pages/exercises.tsx`
- [ ] Update `src/pages/chat.tsx`
- [ ] Update `src/components/app-sidebar.tsx`

### Phase 5: Testing & Validation (Priority 1)

- [ ] Test roleplay flow end-to-end
- [ ] Verify all 8 capabilities display correctly
- [ ] Verify no EI/EQ language remains
- [ ] Verify mandatory disclaimers appear
- [ ] Verify "(illustrative)" labels on all scores
- [ ] Test responsive design
- [ ] Test accessibility
- [ ] Cross-browser testing

---

## Part 10: Success Criteria

### Zero Tolerance Requirements

**The implementation is successful ONLY if:**

1. ✅ **Zero EI/EQ references** - No "Emotional Intelligence" or "EQ" language anywhere
2. ✅ **Exactly 8 capabilities** - No more, no less
3. ✅ **Correct capability names** - Match specification exactly
4. ✅ **Behavioral Metric names** - Show under each capability
5. ✅ **Illustrative score labels** - All scores labeled "(illustrative)"
6. ✅ **Mandatory disclaimers** - Footer appears on all evaluation screens
7. ✅ **No overall scores** - Each capability is independent
8. ✅ **Observable signals only** - No emotion/intent inference
9. ✅ **Signal Intelligence™ trademark** - Use ™ symbol consistently
10. ✅ **Marketing site alignment** - Zero inconsistencies

### Validation Checklist

**Before marking complete, verify:**

- [ ] Run global search for "EI" - zero results (except in comments/docs)
- [ ] Run global search for "EQ" - zero results (except in comments/docs)
- [ ] Run global search for "Emotional Intelligence" - zero results
- [ ] Count capabilities in UI - exactly 8
- [ ] Check all score displays - all have "(illustrative)" label
- [ ] Check evaluation screens - all have mandatory disclaimer
- [ ] Check roleplay right panel - matches marketing site layout
- [ ] Check final evaluation dialog - matches specification
- [ ] Test with real roleplay session - end-to-end flow works
- [ ] Compare with marketing site screenshots - pixel-perfect match

---

## Part 11: Risk Mitigation

### Breaking Changes

**This is a breaking change that affects:**

1. **Data structures** - EQScore → BehavioralMetricScore
2. **API responses** - Worker must return 8 capabilities, not 10 metrics
3. **Component props** - LiveEQAnalysis → BehavioralMetricsPanel
4. **Type definitions** - EQMetric → SignalIntelligenceCapability
5. **Mock data** - Update all mock responses

### Backward Compatibility

**NOT REQUIRED** - This is a complete overhaul, not an incremental update.

**Strategy:**

1. Delete old components (don't deprecate)
2. Replace data structures (don't migrate)
3. Update all references (don't support both)
4. Deploy as single atomic change

### Rollback Plan

**If implementation fails:**

1. Git revert to commit before changes
2. Restore `live-eq-analysis.tsx` from git history
3. Restore `src/lib/data.ts` EI metrics
4. Restore roleplay page layout
5. Test that platform works with legacy system

**Prevention:**

- Create feature branch: `feature/signal-intelligence-overhaul`
- Test thoroughly before merging to main
- Deploy to staging environment first
- Get stakeholder approval before production

---

## Part 12: Timeline & Effort Estimate

### Implementation Phases

**Phase 1: Data & Core Components (4-6 hours)**
- Create signal-intelligence-data.ts (1 hour)
- Create behavioral-metrics-panel.tsx (2 hours)
- Create capability-detail-card.tsx (1 hour)
- Update signal-intelligence-panel.tsx (1 hour)
- Delete legacy components (30 min)

**Phase 2: Roleplay Integration (3-4 hours)**
- Update roleplay.tsx right panel (2 hours)
- Update roleplay-feedback-dialog.tsx (2 hours)

**Phase 3: Language & Terminology (2-3 hours)**
- Global find & replace (1 hour)
- Update navigation (30 min)
- Update page headers (30 min)
- Update tooltips (1 hour)

**Phase 4: Dashboard & Other Pages (2-3 hours)**
- Update dashboard (1 hour)
- Update ei-metrics page (1 hour)
- Update other pages (1 hour)

**Phase 5: Testing & Validation (2-3 hours)**
- End-to-end testing (1 hour)
- Cross-browser testing (30 min)
- Accessibility testing (30 min)
- Marketing site comparison (1 hour)

**Total Estimated Time: 13-19 hours**

### Recommended Approach

**Day 1: Core Implementation**
- Phase 1: Data & Core Components
- Phase 2: Roleplay Integration

**Day 2: Polish & Testing**
- Phase 3: Language & Terminology
- Phase 4: Dashboard & Other Pages
- Phase 5: Testing & Validation

---

## Part 13: Next Steps

### Immediate Actions

1. **Review this document** with stakeholders
2. **Approve specification** (no changes after approval)
3. **Create feature branch** in git
4. **Begin Phase 1 implementation**
5. **Daily progress updates** via todo list

### Questions to Resolve

1. **Worker API alignment** - Does production worker return 8 capabilities or 10 metrics?
2. **Mock data** - Should mock API return illustrative scores for all 8 capabilities?
3. **Staging deployment** - Test on staging before production?
4. **Marketing site access** - Need screenshots of Interactive Demo for pixel-perfect match?

---

## Appendix A: File Inventory

### Files to Create

1. `src/lib/signal-intelligence-data.ts` (NEW)
2. `src/components/behavioral-metrics-panel.tsx` (NEW)
3. `src/components/capability-detail-card.tsx` (NEW)

### Files to Delete

1. `src/components/live-eq-analysis.tsx` (DELETE)
2. `src/components/eq-metric-card.tsx` (DELETE)

### Files to Update

1. `src/lib/data.ts` (MAJOR CHANGES)
2. `src/components/signal-intelligence-panel.tsx` (MODERATE CHANGES)
3. `src/pages/roleplay.tsx` (MAJOR CHANGES)
4. `src/components/roleplay-feedback-dialog.tsx` (MAJOR CHANGES)
5. `src/pages/dashboard.tsx` (MODERATE CHANGES)
6. `src/pages/ei-metrics.tsx` (RENAME & MAJOR CHANGES)
7. `src/pages/frameworks.tsx` (MINOR CHANGES)
8. `src/pages/exercises.tsx` (MINOR CHANGES)
9. `src/pages/chat.tsx` (MINOR CHANGES)
10. `src/components/app-sidebar.tsx` (MINOR CHANGES)
11. `src/lib/eiMetricSettings.ts` (RENAME & UPDATE)

### Files to Review (No Changes Expected)

1. `src/components/RoleplayCueParser.tsx` (KEEP AS-IS)
2. `src/lib/enhanced-scenarios.ts` (KEEP AS-IS)
3. `src/server/api/roleplay/*` (KEEP AS-IS)

---

## Appendix B: Type Definitions

### New Types

```typescript
// src/lib/signal-intelligence-data.ts

export interface SignalIntelligenceCapability {
  id: string;
  name: string;
  behavioralMetric: string;
  definition: string;
  howEvaluated: string;
  whatGoodLooksLike: string[];
  howCalculated: string[];
  scoreCalculationExample: {
    components: Array<{
      name: string;
      value: number;
      weight: number;
    }>;
    total: number;
  };
  howMeasured: string;
  exampleScore: number;
}

export interface BehavioralMetricScore {
  capabilityId: string;
  score: number;
  maxScore: number;
  feedback?: string;
  evidence?: string[];
}

export interface BehavioralMetricsResult {
  scores: BehavioralMetricScore[];
  observableSignals: ObservableSignal[];
  coachingFeedback: {
    strengths: string[];
    areasToFocusOn: string[];
  };
  timestamp: string;
}
```

### Deprecated Types (Remove)

```typescript
// DELETE THESE:
export interface EQMetric { ... }
export interface EQScore { ... }
export interface EQAnalysisResult { ... }
```

---

## Appendix C: Mandatory Disclaimer Text

**Full version (evaluation screens):**

> Signal Intelligence™ scores reflect observable communication behaviors during structured practice. They are not assessments of personality, intent, emotional state, or professional competence, and are not used for automated decision-making. AI identifies behavioral patterns; interpretation and judgment remain with the professional.

**Short version (tooltips):**

> Signal Intelligence™ observes communication behaviors. AI identifies patterns; interpretation remains with the professional.

**Micro version (badges):**

> Illustrative scores for practice only

---

## Document Control

**Version:** 1.0  
**Date:** January 1, 2026  
**Author:** AI Agent (Airo)  
**Status:** Ready for Implementation  
**Approval Required:** Yes  
**Changes After Approval:** Not permitted without re-approval  

**Authoritative Sources:**
1. Signal Intelligence™ Capability & Behavioral Metrics Specification (provided by user)
2. ReflectivAI Core Intelligence, DISC Integration & EI Metrics Framework (provided by user)
3. Marketing site screenshots and content (provided by user)

**Implementation Authority:**

This document is the **single source of truth** for the Signal Intelligence™ implementation. Any deviation from this specification must be flagged and approved before proceeding.

---

**END OF DOCUMENT**