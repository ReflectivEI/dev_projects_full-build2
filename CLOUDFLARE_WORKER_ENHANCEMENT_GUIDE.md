# Cloudflare Worker Enhancement Guide
## HCP Behavioral Cues & Real-Time Rep Evaluation

## Overview

This guide documents the enhancements needed in the Cloudflare Worker backend to support:
1. **Rich HCP behavioral descriptions** (body language, vocal tone, physical cues)
2. **Real-time sales rep evaluation** across 8 behavioral metrics
3. **Dynamic HCP emotional state tracking** across conversation turns

## Current Implementation

The Cloudflare Worker currently handles:
- `POST /api/roleplay/start` - Initialize roleplay session
- `POST /api/roleplay/respond` - Process rep message, generate HCP response
- `POST /api/roleplay/end` - Finalize session and generate feedback
- `GET /api/roleplay/session` - Retrieve current session state

## Required Enhancements

### 1. Enhanced HCP Response Generation

**Current Behavior:**
The worker generates HCP text responses based on scenario context.

**Enhanced Behavior:**
Generate HCP responses WITH rich behavioral descriptions.

#### Implementation Pattern

```typescript
// In Cloudflare Worker: POST /api/roleplay/respond handler

interface HCPResponse {
  message: string; // The HCP's spoken words
  behavioralCues: {
    bodyLanguage: string[]; // e.g., ["Glancing at clock", "Arms crossed"]
    vocalTone: string[]; // e.g., ["Speaking rapidly", "Clipped responses"]
    physicalCues: string[]; // e.g., ["Sighing audibly", "Tapping fingers"]
    overallState: string; // Summary description
  };
  detectedCues: string[]; // IDs of cues: ["time-pressure", "frustration"]
}

// AI Prompt Enhancement
const systemPrompt = `
You are simulating an HCP (Healthcare Professional) in a sales roleplay.

IMPORTANT: Your response must include:
1. The HCP's spoken words
2. Observable behavioral cues (body language, vocal tone, physical actions)

Format your response as JSON:
{
  "message": "<HCP spoken words>",
  "behavioralCues": {
    "bodyLanguage": ["<observable body language>"],
    "vocalTone": ["<vocal characteristics>"],
    "physicalCues": ["<physical actions/expressions>"]
  },
  "emotionalState": "<engaged|neutral|resistant|stressed|interested>"
}

Behavioral Cue Guidelines:
- Body Language: Posture, gestures, eye contact, positioning
- Vocal Tone: Speed, pitch, inflection, pauses
- Physical Cues: Facial expressions, movements, actions

Example:
{
  "message": "I appreciate you stopping by, but I really only have a few minutes.",
  "behavioralCues": {
    "bodyLanguage": ["Glancing repeatedly at the clock on the wall", "Shifting weight from foot to foot"],
    "vocalTone": ["Speaking more rapidly than usual", "Slightly elevated pitch"],
    "physicalCues": ["Quick, darting eye movements toward the door", "Checking watch conspicuously"]
  },
  "emotionalState": "stressed"
}
`;
```

### 2. HCP Emotional State Tracking

**Track HCP state across conversation turns:**

```typescript
interface HCPEmotionalState {
  emotionalState: 'engaged' | 'neutral' | 'resistant' | 'stressed' | 'interested';
  energyLevel: 'high' | 'medium' | 'low';
  openness: 'open' | 'guarded' | 'closed';
  timeAwareness: 'relaxed' | 'aware' | 'pressured';
  conversationTurn: number;
}

// Store in session state
interface RoleplaySession {
  // ... existing fields
  hcpState: HCPEmotionalState;
  hcpStateHistory: HCPEmotionalState[];
}

// Update state after each HCP response
function updateHCPState(
  currentState: HCPEmotionalState,
  repMessage: string,
  detectedCues: string[]
): HCPEmotionalState {
  // Logic to evolve HCP state based on:
  // 1. Rep's response quality
  // 2. Detected behavioral cues
  // 3. Conversation progression
  
  // Example: If rep shows adaptability to time pressure, reduce stress
  if (currentState.emotionalState === 'stressed' && repShowsAdaptability(repMessage)) {
    return {
      ...currentState,
      emotionalState: 'neutral',
      timeAwareness: 'aware',
      conversationTurn: currentState.conversationTurn + 1,
    };
  }
  
  return {
    ...currentState,
    conversationTurn: currentState.conversationTurn + 1,
  };
}
```

### 3. Real-Time Rep Evaluation

**Evaluate rep responses immediately:**

```typescript
// In POST /api/roleplay/respond handler

interface RepEvaluationResult {
  detectedMetrics: string[]; // IDs of metrics demonstrated
  quickFeedback: string; // Brief feedback on this response
  suggestedImprovements: string[]; // 1-2 quick tips
}

function evaluateRepResponse(
  repMessage: string,
  hcpState: HCPEmotionalState,
  conversationHistory: Message[]
): RepEvaluationResult {
  const detectedMetrics = [];
  const feedback = [];
  
  // Check for question quality
  if (hasOpenEndedQuestion(repMessage)) {
    detectedMetrics.push('question_quality');
  }
  
  // Check for listening signals
  if (hasListeningSignals(repMessage)) {
    detectedMetrics.push('listening_responsiveness');
  }
  
  // Check for adaptability to HCP state
  if (hcpState.emotionalState === 'stressed' && showsTimeRespect(repMessage)) {
    detectedMetrics.push('adaptability');
    feedback.push('Good adaptation to time pressure!');
  }
  
  // Check for value connection
  if (mentionsPatientOutcomes(repMessage)) {
    detectedMetrics.push('making_it_matter');
  }
  
  return {
    detectedMetrics,
    quickFeedback: feedback.join(' '),
    suggestedImprovements: generateImprovements(detectedMetrics, hcpState),
  };
}
```

### 4. Response Format

**Enhanced API Response Structure:**

```typescript
// POST /api/roleplay/respond response
{
  "session": {
    "id": "session-123",
    "messages": [
      {
        "role": "user",
        "content": "<rep message>",
        "evaluation": {
          "detectedMetrics": ["question_quality", "listening_responsiveness"],
          "quickFeedback": "Strong open-ended question that shows active listening."
        }
      },
      {
        "role": "assistant",
        "content": "<HCP message>",
        "behavioralCues": {
          "bodyLanguage": ["Leaning forward slightly", "Maintaining eye contact"],
          "vocalTone": ["More relaxed pace", "Warmer tone"],
          "physicalCues": ["Nodding thoughtfully"]
        },
        "detectedCues": ["engaged"],
        "hcpState": {
          "emotionalState": "interested",
          "energyLevel": "medium",
          "openness": "open",
          "timeAwareness": "relaxed"
        }
      }
    ],
    "hcpState": { /* current state */ },
    "conversationMetrics": {
      "turnCount": 4,
      "repMetricsDetected": ["question_quality", "listening_responsiveness", "adaptability"],
      "hcpEngagementTrend": "improving"
    }
  }
}
```

## AI Prompt Templates

### System Prompt for HCP Simulation

```
You are an experienced Healthcare Professional (HCP) being approached by a pharmaceutical sales representative.

Your current emotional state: {emotionalState}
Your energy level: {energyLevel}
Your openness to conversation: {openness}
Time awareness: {timeAwareness}

Scenario Context:
{scenarioDescription}

Key Challenges:
{scenarioChallenges}

IMPORTANT INSTRUCTIONS:
1. Respond naturally as this HCP would, given their current state
2. Include observable behavioral cues in your response
3. Your behavior should reflect your emotional state:
   - If stressed: Show time pressure, impatience, distraction
   - If resistant: Display defensive body language, skepticism
   - If engaged: Show interest, ask questions, lean in
   - If neutral: Professional but reserved

4. Format your response as JSON:
{
  "message": "Your spoken words as the HCP",
  "behavioralCues": {
    "bodyLanguage": ["Observable body language"],
    "vocalTone": ["Vocal characteristics"],
    "physicalCues": ["Physical actions/expressions"]
  }
}

5. Be realistic - HCPs are busy, skeptical, and need clear value
6. React to the sales rep's approach:
   - Reward good questions with more openness
   - Show frustration with generic pitches
   - Engage when they connect to patient outcomes
   - Appreciate when they respect your time
```

### Evaluation Prompt for Rep Responses

```
Evaluate this sales rep response against 8 behavioral metrics:

Rep Message: "{repMessage}"

Previous HCP Message: "{hcpMessage}"
HCP Current State: {hcpState}

Metrics to Evaluate:
1. Question Quality - Open-ended, relevant questions
2. Listening & Responsiveness - Paraphrasing, acknowledging
3. Making It Matter - Connecting to patient outcomes
4. Customer Engagement - Encouraging dialogue
5. Objection Navigation - Addressing concerns
6. Conversation Control - Managing topics, time
7. Commitment Gaining - Proposing next steps
8. Adaptability - Adjusting to HCP cues

For each metric detected, provide:
- Metric ID
- Evidence from the message
- Brief rationale (1 sentence)

Return JSON:
{
  "detectedMetrics": [
    {
      "id": "question_quality",
      "evidence": "Asked 'How do you currently manage...?'",
      "rationale": "Open-ended question that invites detailed response"
    }
  ],
  "quickFeedback": "Strong opening question that shows genuine interest",
  "suggestedImprovements": ["Consider acknowledging the time pressure mentioned by HCP"]
}
```

## Frontend Integration

The frontend already has all components ready:
- `src/lib/hcp-behavioral-state.ts` - Processes behavioral descriptions
- `src/lib/rep-response-evaluator.ts` - Evaluates rep responses
- `src/components/rep-metric-evaluation.tsx` - Displays evaluations
- `src/pages/roleplay.tsx` - Integrated UI

**Frontend expects this response format from worker:**

```typescript
// The frontend will automatically:
1. Extract behavioralCues from HCP messages
2. Generate rich descriptions using hcp-behavioral-state.ts
3. Evaluate rep responses using rep-response-evaluator.ts
4. Display inline metrics using rep-metric-evaluation.tsx

// Worker should return:
{
  session: {
    messages: [
      {
        role: 'assistant',
        content: 'HCP spoken words',
        // Optional: Worker can include these, or frontend will detect
        behavioralCues: { /* ... */ },
        detectedCues: ['time-pressure', 'frustration']
      }
    ]
  }
}
```

## Testing Checklist

- [ ] HCP responses include behavioral cues
- [ ] Behavioral cues match HCP emotional state
- [ ] HCP state evolves based on rep responses
- [ ] Rep responses are evaluated in real-time
- [ ] Detected metrics are accurate
- [ ] Frontend displays behavioral descriptions correctly
- [ ] Frontend displays rep evaluations correctly
- [ ] Conversation flow feels natural and responsive

## Deployment Notes

1. **No frontend changes needed** - All components are already deployed
2. **Worker changes are additive** - Existing functionality preserved
3. **Backward compatible** - Frontend handles missing fields gracefully
4. **Gradual rollout** - Can deploy worker changes independently

## Example Full Conversation Flow

```
Turn 1:
Rep: "Hi Dr. Smith, I appreciate you taking the time to meet with me today."

Worker Response:
{
  "message": "I appreciate you stopping by, but I really only have a few minutes.",
  "behavioralCues": {
    "bodyLanguage": ["Glancing at clock", "Standing near door"],
    "vocalTone": ["Speaking quickly", "Slightly terse"],
    "physicalCues": ["Checking watch"]
  },
  "hcpState": {
    "emotionalState": "stressed",
    "timeAwareness": "pressured"
  }
}

Frontend Displays:
- HCP message with amber box showing behavioral cues
- Body Language: Glancing at clock; Standing near door
- Vocal Tone: Speaking quickly; Slightly terse
- Overall: "HCP is visibly stressed and time-pressured..."

Turn 2:
Rep: "I completely understand - I'll be brief. I wanted to quickly share how this could save you time with your Type 2 diabetes patients."

Worker Evaluates:
{
  "detectedMetrics": ["adaptability", "making_it_matter"],
  "quickFeedback": "Excellent adaptation to time pressure and immediate value connection"
}

Worker Responds:
{
  "message": "Okay, I'm listening. What specifically are you proposing?",
  "behavioralCues": {
    "bodyLanguage": ["Pausing movement", "Turning to face you"],
    "vocalTone": ["Slightly more engaged tone"],
    "physicalCues": ["Making brief eye contact"]
  },
  "hcpState": {
    "emotionalState": "neutral",
    "timeAwareness": "aware",
    "openness": "guarded"
  }
}

Frontend Displays:
- Rep evaluation in blue box: "📊 Your Response Evaluation"
- Badges: "Adaptability: 4.5" "Making It Matter: 4.0"
- HCP behavioral shift showing reduced stress
```

## Summary

This enhancement transforms the roleplay experience from simple text exchange to immersive behavioral simulation with real-time coaching. The frontend is ready - worker implementation is the final step.
