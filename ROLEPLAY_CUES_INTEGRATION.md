# ReflectivAI Enhanced Roleplay Integration - Situational Cues System

## ✅ Integration Complete

The enhanced roleplay system with **situational cues** has been successfully integrated into the ReflectivAI platform.

---

## 🎯 What's New

### 1. **Situational Cues** (Body Language & Environmental Context)

HCP responses now include **observable behaviors** wrapped in `*asterisks*`:

**Example:**
```
*Leans forward slightly* I see. Can you provide more specific data on the efficacy? 
*Picks up pen* I need to see head-to-head comparisons.
```

**Types of Cues:**
- **Body Language**: `*crosses arms*`, `*leans forward*`, `*glances at watch*`, `*nods slowly*`
- **Environmental**: `*phone buzzes on desk*`, `*nurse enters briefly*`, `*pager goes off*`
- **Micro-expressions**: `*slight frown*`, `*raises eyebrow*`, `*brief smile*`
- **Actions**: `*picks up prescription pad*`, `*sets down coffee*`, `*adjusts glasses*`

---

### 2. **Signal Intelligence Extraction**

Cues are automatically **parsed and interpreted** to provide coaching guidance:

**Signal Structure:**
```typescript
{
  id: string,
  type: 'verbal' | 'engagement' | 'contextual' | 'conversational',
  signal: string,  // The cue text
  interpretation: string,  // What it means
  suggestedResponse: string,  // How to respond
  timestamp: string
}
```

**Example Signal:**
```json
{
  "id": "uuid",
  "type": "engagement",
  "signal": "Leans forward slightly",
  "interpretation": "HCP is showing increased interest in this topic",
  "suggestedResponse": "Good opportunity to provide more detail or ask a discovery question",
  "timestamp": "2024-12-29T..."
}
```

---

### 3. **Enhanced Scenarios**

New scenario fields for richer context:

```typescript
interface EnhancedScenario {
  // Existing fields
  id: string;
  title: string;
  diseaseState: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  stakeholder: string;
  objective: string;
  context: string;
  challenges: string[];
  keyMessages: string[];
  impact: string;
  
  // NEW FIELDS
  initialCue?: string;  // Opening body language
  environmentalContext?: string;  // Setting description
  hcpMood?: string;  // HCP's current state
  potentialInterruptions?: string[];  // Possible interruptions
}
```

**Example Enhanced Scenario:**
```typescript
{
  id: 'hiv-descovy-share',
  title: 'Descovy for PrEP Share Growth',
  diseaseState: 'HIV/PrEP',
  difficulty: 'intermediate',
  stakeholder: 'Dr. Sarah Chen - ID Specialist',
  // ... other fields ...
  initialCue: '*Dr. Chen is reviewing lab results on her computer as you enter, a stack of patient charts beside her*',
  environmentalContext: 'Busy HIV clinic between patient appointments, 10-15 minutes available',
  hcpMood: 'Professional but time-conscious, slightly distracted by pending cases',
  potentialInterruptions: ['Nurse with urgent lab question', 'Pager for patient callback', 'Phone call from pharmacy']
}
```

---

## 📁 Files Created

### Frontend Components

1. **`src/components/RoleplayCueParser.tsx`** (235 lines)
   - `parseRoleplayResponse()` - Parses text to extract cues
   - `SituationalCue` - Renders cues with amber styling
   - `RoleplayMessageContent` - Full message renderer with inline cues
   - `RoleplayMessageWithBlockCues` - Alternative block-style display
   - `extractSignalsFromCues()` - Extracts signals for Signal Intelligence panel
   - `interpretCue()` - Interprets cue meaning and provides coaching

2. **`src/lib/enhanced-scenarios.ts`** (189 lines)
   - 6 enhanced scenarios with situational cue fields
   - `getScenarioById()` - Retrieve scenario by ID
   - `getScenarioContext()` - Extract context for API calls

### Backend API Updates

3. **`src/server/api/roleplay/start/POST.ts`** (Updated)
   - Initial messages now include situational cues
   - Supports scenario-specific initial cues
   - Fallback to random cues if no scenario provided

4. **`src/server/api/roleplay/respond/POST.ts`** (Updated)
   - HCP responses include 1-2 situational cues per message
   - Automatic cue extraction and signal generation
   - `interpretCue()` function for real-time signal intelligence

---

## 🎨 Visual Design

### Cue Styling (Amber Theme)

**Inline Cues:**
```tsx
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 mx-1 rounded-md bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20">
  <Eye className="h-3 w-3 text-amber-600 dark:text-amber-400" />
  <span className="text-amber-700 dark:text-amber-300 text-sm italic">
    {cueContent}
  </span>
</span>
```

**Visual Appearance:**
- 👁️ Eye icon (lucide-react)
- Amber/gold color scheme
- Italic text for cues
- Subtle background and border
- Dark mode support

---

## 🔌 API Contract

### POST /api/roleplay/start

**Request:**
```json
{
  "scenarioId": "hiv-descovy-share",
  "difficulty": "intermediate",
  "scenario": {
    "id": "hiv-descovy-share",
    "title": "Descovy for PrEP Share Growth",
    "stakeholder": "Dr. Sarah Chen - ID Specialist",
    "environmentalContext": "Busy HIV clinic between patient appointments",
    "hcpMood": "Professional but time-conscious",
    "potentialInterruptions": ["Nurse with lab question", "Pager"],
    "challenges": ["Time constraints", "Established prescribing habits"],
    "initialCue": "*Dr. Chen is reviewing lab results as you enter*"
  }
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "scenarioId": "hiv-descovy-share",
  "difficulty": "intermediate",
  "session": {
    "messages": [
      {
        "role": "stakeholder",
        "content": "*Dr. Chen is reviewing lab results as you enter* Good to see you. I have about 15 minutes before my next patient. What would you like to discuss?",
        "timestamp": 1234567890
      }
    ],
    "active": true
  }
}
```

### POST /api/roleplay/respond

**Request:**
```json
{
  "message": "Thank you for your time, Dr. Chen. I wanted to discuss some new data on bone and renal safety..."
}
```

**Response:**
```json
{
  "message": "*Leans back slightly, sets down pen* That's interesting. We haven't had many issues with our current regimen, but I'm always interested in safety data. What did the trials show?",
  "eqAnalysis": {
    "score": 82,
    "empathy": 78,
    "adaptability": 75,
    "curiosity": 70,
    "resilience": 80
  },
  "signals": [
    {
      "id": "uuid",
      "type": "engagement",
      "signal": "Leans back slightly, sets down pen",
      "interpretation": "HCP is showing openness to listen",
      "suggestedResponse": "Continue with the clinical data, maintain professional tone",
      "timestamp": "2024-12-29T..."
    },
    {
      "id": "uuid",
      "type": "engagement",
      "signal": "sets down pen",
      "interpretation": "HCP taking action - may indicate readiness to engage",
      "suggestedResponse": "Allow moment to complete, then continue or transition",
      "timestamp": "2024-12-29T..."
    }
  ],
  "session": { ... }
}
```

---

## 🧪 Testing the Integration

### 1. Start a Roleplay Session

```bash
curl -X POST http://localhost:20000/api/roleplay/start \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "hiv-descovy-share",
    "difficulty": "intermediate"
  }'
```

**Expected:** Initial message includes situational cue wrapped in `*asterisks*`

### 2. Send a Response

```bash
curl -X POST http://localhost:20000/api/roleplay/respond \
  -H "Content-Type: application/json" \
  -H "x-session-id: <session-id-from-start>" \
  -d '{
    "message": "I wanted to discuss the improved bone and renal safety profile of Descovy."
  }'
```

**Expected:**
- HCP response includes 1-2 situational cues
- `signals` array contains extracted cues with interpretations
- `eqAnalysis` includes EQ metrics

### 3. Verify Cue Parsing (Frontend)

```typescript
import { parseRoleplayResponse, extractSignalsFromCues } from '@/components/RoleplayCueParser';

const response = "*Leans forward* That's interesting. *Picks up pen* Tell me more.";
const segments = parseRoleplayResponse(response);
const signals = extractSignalsFromCues(response);

console.log(segments);
// [
//   { type: 'cue', content: 'Leans forward' },
//   { type: 'text', content: " That's interesting. " },
//   { type: 'cue', content: 'Picks up pen' },
//   { type: 'text', content: ' Tell me more.' }
// ]

console.log(signals);
// [
//   { id: '...', type: 'engagement', signal: 'Leans forward', interpretation: '...', suggestedResponse: '...' },
//   { id: '...', type: 'engagement', signal: 'Picks up pen', interpretation: '...', suggestedResponse: '...' }
// ]
```

---

## 🚀 Next Steps

### Frontend Integration (To Do)

1. **Update Roleplay Page** (`src/pages/roleplay.tsx`)
   - Import `RoleplayMessageContent` from `RoleplayCueParser`
   - Replace plain text rendering with `<RoleplayMessageContent content={message.content} />`
   - Display extracted signals in Signal Intelligence panel

2. **Update Signal Intelligence Panel** (`src/components/signal-intelligence-panel.tsx`)
   - Accept `signals` prop from roleplay respond API
   - Display signal type, interpretation, and suggested response
   - Use amber theme for consistency with cues

3. **Scenario Selection**
   - Import enhanced scenarios from `src/lib/enhanced-scenarios.ts`
   - Pass scenario context to `/api/roleplay/start` endpoint
   - Display scenario details (environmental context, HCP mood, etc.)

### Backend Enhancement (Optional)

4. **Cloudflare Worker Integration**
   - Copy `roleplay-prompts.ts`, `roleplay-functions.ts`, `index-routes-update.ts` to worker
   - Replace mock responses with real AI-generated cues using Groq API
   - Implement comprehensive feedback analysis with 10 EI metrics + 5 Sales Skills

---

## 📊 Cue Interpretation Logic

### Engagement Signals
- **"lean forward"** → Increased interest, provide more detail
- **"nod"** → Agreement/understanding, continue building
- **"smile" / "laugh"** → Positive rapport, good moment to transition
- **"picks up" / "reaches for"** → Taking action, readiness to engage

### Disengagement Signals
- **"glance at watch/clock"** → Time pressure, summarize key points
- **"cross arms"** → Resistance/skepticism, ask open-ended question
- **"frown" / "furrow"** → Confusion/concern, clarify the point

### Environmental Signals
- **"phone" / "pager" / "buzz"** → External interruption, offer to pause
- **"nurse" / "staff" / "enter"** → Clinical interruption, remain patient

### Curiosity/Skepticism
- **"raise eyebrow"** → Curiosity or skepticism, provide evidence

---

## 🎓 Benefits of Situational Cues

1. **Realistic Training**: Mimics real-world HCP interactions with non-verbal communication
2. **Signal Intelligence**: Teaches reps to read and respond to body language
3. **Coaching Feedback**: Provides actionable guidance based on observable behaviors
4. **Engagement Tracking**: Measures how well reps notice and act on signals
5. **Comprehensive Analysis**: Post-roleplay feedback includes signal intelligence metrics

---

## 📚 Additional Resources

- **Architecture Review**: See `ARCHITECTURE_REVIEW.md` for full platform overview
- **Mock API Testing**: See `MOCK_API_TESTING.md` for endpoint testing guide
- **Cloudflare Worker Setup**: See `CLOUDFLARE_WORKER_SETUP.md` for production deployment

---

## ✅ Integration Checklist

- [x] Create `RoleplayCueParser.tsx` component
- [x] Create `enhanced-scenarios.ts` with 6 scenarios
- [x] Update `/api/roleplay/start` to support initial cues
- [x] Update `/api/roleplay/respond` to generate cues and extract signals
- [x] Add `interpretCue()` function for signal intelligence
- [ ] Update `roleplay.tsx` to use `RoleplayMessageContent`
- [ ] Update `signal-intelligence-panel.tsx` to display extracted signals
- [ ] Test cue parsing and signal extraction
- [ ] Deploy to Cloudflare Worker (optional, for real AI)

---

**The enhanced roleplay system is now ready for frontend integration!** 🎉
