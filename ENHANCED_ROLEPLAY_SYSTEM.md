# Enhanced Roleplay System with HCP Cues & Sales Rep Evaluation

## Overview

The ReflectivAI roleplay simulator now features **real-time behavioral cue detection** and **instant sales rep performance evaluation** based on the 8 Signal Intelligence behavioral metrics.

## Key Features

### 1. HCP Behavioral Cue Detection (10 Observable Cues)

The system detects and displays 10 real-world HCP behavioral signals:

| Cue | Category | Severity | Description |
|-----|----------|----------|-------------|
| **Time Pressure** | Stress | High | Repeated glances at clock or doorway |
| **Low Engagement** | Engagement | Medium | Short, clipped responses with minimal elaboration |
| **Frustration** | Resistance | High | Sighing or exhaling audibly before answering |
| **Defensive** | Resistance | Medium | Arms crossed tightly or shoulders hunched forward |
| **Distracted** | Engagement | Medium | Multitasking behavior (typing, signing forms, checking phone) |
| **Hesitant** | Resistance | Low | Delayed responses or long pauses before replying |
| **Uncomfortable** | Resistance | Medium | Avoidance of eye contact while listening |
| **Impatient** | Stress | High | Interrupting mid-sentence to redirect or move on |
| **Disinterested** | Engagement | Medium | Flat or monotone vocal delivery despite neutral words |
| **Withdrawn** | Engagement | High | Physically turning body away (chair angled, half-standing posture) |

### 2. Rich Behavioral Descriptions

When HCP cues are detected, the system generates **narrative descriptions** of observable behaviors:

**Example:**
> *"The HCP glances at the clock repeatedly and shifts in their chair, a visible sigh escapes before they respond, and their arms cross tightly across their chest."*

These descriptions appear in **amber-colored boxes** below HCP messages, helping sales reps understand the full context of the interaction.

### 3. Sales Rep Metric Detection (8 Behavioral Metrics)

The system evaluates sales rep responses against the 8 Signal Intelligence metrics:

| Metric | Category | What It Detects |
|--------|----------|----------------|
| **Question Quality** | Question | Open-ended, relevant questions that uncover needs |
| **Listening & Responsiveness** | Listening | Paraphrasing, acknowledging, and adjusting based on HCP input |
| **Making It Matter** | Value | Connecting to patient outcomes and HCP priorities |
| **Customer Engagement** | Engagement | Encouraging dialogue and forward-looking conversation |
| **Objection Navigation** | Objection | Recognizing, reframing, and resolving concerns |
| **Conversation Control** | Control | Setting purpose, managing topics, respecting time |
| **Commitment Gaining** | Commitment | Proposing clear next steps with mutual agreement |
| **Adaptability** | Adaptability | Adjusting approach based on HCP cues and context |

### 4. Real-Time Performance Feedback

After each sales rep response, the system provides:

#### Green Metric Badges
Shows which metrics the rep demonstrated:
- ✓ Question Quality
- ✓ Listening & Responsiveness
- ✓ Adaptability

#### Blue Feedback Box
Provides instant coaching:
- **Positive feedback** for demonstrated behaviors
- **Coaching tips** for missed opportunities based on HCP cues

**Example Feedback:**
```
✓ Asked an open-ended question to uncover needs
✓ Adapted approach based on HCP cues
→ Consider acknowledging time constraints explicitly
```

## User Interface

### Message Display Structure

```
┌─────────────────────────────────────────┐
│ HCP Message                             │
│ "I'm really pressed for time today..." │
├─────────────────────────────────────────┤
│ 📋 Observable Behavior:                 │
│ The HCP glances at the clock repeatedly │
│ and shifts in their chair.              │
├─────────────────────────────────────────┤
│ [Time Pressure] [Low Engagement]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Sales Rep Response                      │
│ "I understand time is tight. Let me..." │
├─────────────────────────────────────────┤
│ ✓ Adaptability  ✓ Conversation Control │
├─────────────────────────────────────────┤
│ 💡 Quick Feedback:                      │
│ ✓ Adapted approach based on HCP cues    │
│ ✓ Managed conversation flow             │
└─────────────────────────────────────────┘
```

### Color Coding

- **Amber boxes**: HCP behavioral cue descriptions (observable behaviors)
- **Green badges**: Sales rep metrics demonstrated
- **Blue boxes**: Real-time performance feedback and coaching tips

### Toggle Control

Users can show/hide all cues and feedback using the **eye icon** button in the bottom toolbar.

## Technical Implementation

### Core Functions

#### `detectObservableCues(message: string): BehavioralCue[]`
Detects HCP behavioral cues from message text using pattern matching.

**Location:** `src/lib/observable-cues.ts`

#### `generateCueDescription(cues: BehavioralCue[]): string`
Generates rich narrative descriptions from detected cues.

**Example:**
```typescript
const cues = detectObservableCues(hcpMessage);
const description = generateCueDescription(cues);
// "The HCP glances at the clock repeatedly..."
```

#### `detectRepMetrics(message: string, previousHcpMessage?: string): RepMetricCue[]`
Detects which of the 8 metrics a sales rep message demonstrates.

**Context-aware:** Uses previous HCP message to detect adaptability and objection navigation.

#### `generateRepFeedback(metrics: RepMetricCue[], hcpCues: BehavioralCue[]): string`
Generates instant coaching feedback based on:
- Metrics the rep demonstrated (positive reinforcement)
- HCP cues that weren't addressed (coaching opportunities)

**Example:**
```typescript
const repMetrics = detectRepMetrics(repMessage, prevHcpMessage);
const hcpCues = detectObservableCues(prevHcpMessage);
const feedback = generateRepFeedback(repMetrics, hcpCues);
```

### UI Integration

**Location:** `src/pages/roleplay.tsx` (lines 656-750)

The message rendering loop:
1. Detects HCP cues for assistant messages
2. Generates behavioral descriptions
3. Detects rep metrics for user messages
4. Generates performance feedback
5. Displays everything in color-coded boxes

## Detection Logic

### HCP Cue Detection Patterns

**Time Pressure:**
- Keywords: "busy", "time", "quick", "hurry", "clock", "late"

**Frustration:**
- Keywords: "sigh", "exhale", "frustrated", "annoyed"

**Low Engagement:**
- Very short responses (< 5 words) + disengaged keywords ("okay", "fine", "sure", "whatever")

**Defensive:**
- Keywords: "already", "know that", "aware", "defensive"

### Rep Metric Detection Patterns

**Question Quality:**
- Open-ended question words ("how", "what", "why", "tell me", "describe", "explain")
- Has question mark
- Message length > 5 words

**Listening & Responsiveness:**
- Acknowledgment phrases ("I hear", "I understand", "you mentioned", "you said", "sounds like")
- Message length > 8 words

**Adaptability:**
- HCP showed time pressure + Rep used time-respecting language ("briefly", "quick", "respect your time")

**Objection Navigation:**
- HCP had concern in previous message + Rep used empathy language ("concern", "understand your", "valid point", "appreciate")

## Best Practices

### For Sales Reps Using the System

1. **Watch for amber boxes** - These show HCP behavioral cues you should respond to
2. **Aim for green badges** - Try to demonstrate multiple metrics in each response
3. **Read blue feedback boxes** - Instant coaching on what to do next
4. **Practice adaptability** - When you see time pressure cues, acknowledge them explicitly
5. **Address resistance** - When you see defensive/frustrated cues, use empathy and reframing

### For Developers Extending the System

1. **Add new cues** - Extend `HCP_CUES` in `observable-cues.ts`
2. **Refine detection** - Update pattern matching in `detectObservableCues()`
3. **Enhance descriptions** - Add more narrative templates in `generateCueDescription()`
4. **Improve feedback** - Extend coaching tips in `generateRepFeedback()`
5. **Test thoroughly** - Verify cues trigger correctly with various message patterns

## Future Enhancements

### Planned Features

1. **Cue Intensity Levels** - Show how strong each cue is (mild, moderate, severe)
2. **Cue Trends** - Track if HCP engagement is improving or declining over conversation
3. **Metric Scoring** - Show numeric scores (1-5) for each demonstrated metric
4. **Personalized Coaching** - Tailor feedback based on rep's historical weak areas
5. **Scenario-Specific Cues** - Different cue sets for different HCP types/scenarios

### Backend Integration (Cloudflare Worker)

The current implementation is **client-side only**. For production:

1. **Move detection to backend** - Run cue/metric detection in Cloudflare Worker
2. **AI-enhanced descriptions** - Use LLM to generate richer behavioral narratives
3. **Contextual feedback** - Leverage full conversation history for better coaching
4. **Store cue history** - Track which cues appeared and how rep responded
5. **Analytics** - Aggregate cue/metric data for performance dashboards

## API Endpoints (Future)

```typescript
// POST /api/roleplay/respond
{
  message: string,
  // Response includes:
  hcpCues: BehavioralCue[],
  cueDescription: string,
  repMetrics: RepMetricCue[],
  repFeedback: string
}
```

## Testing

### Manual Testing Scenarios

**Test 1: Time Pressure Detection**
- HCP says: "I'm really busy today, can we make this quick?"
- Expected: Time Pressure cue + description about clock-watching

**Test 2: Adaptability Recognition**
- HCP shows time pressure
- Rep says: "I understand you're pressed for time. Let me focus on the key points."
- Expected: Adaptability badge + positive feedback

**Test 3: Missed Opportunity Coaching**
- HCP shows frustration
- Rep doesn't acknowledge it
- Expected: Coaching tip to address HCP's concerns

**Test 4: Multiple Metrics**
- Rep asks open question + acknowledges HCP concern + connects to patient outcomes
- Expected: 3 green badges (Question Quality, Listening, Making It Matter)

## Performance Considerations

- **Client-side detection** - No API latency, instant feedback
- **Pattern matching** - Fast keyword-based detection (< 1ms per message)
- **Memoization** - Cue descriptions cached per message
- **Lazy rendering** - Only visible messages trigger detection

## Accessibility

- **Color + text** - All cues have both color coding and text labels
- **Semantic HTML** - Proper heading hierarchy for screen readers
- **Keyboard navigation** - Toggle button accessible via keyboard
- **High contrast** - Amber/green/blue boxes meet WCAG AA standards

## Conclusion

The enhanced roleplay system provides **real-time, actionable feedback** to help sales reps:
- Recognize HCP behavioral cues
- Understand what those cues mean
- Respond appropriately with the right skills
- Improve performance through instant coaching

This creates a **dynamic, realistic training experience** that mirrors real-world HCP interactions.
