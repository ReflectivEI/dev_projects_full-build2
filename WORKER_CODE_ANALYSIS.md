# Cloudflare Worker Code Analysis

## Production Worker vs Current Implementation

### ✅ API Endpoints Comparison

#### Production Worker (Your Stable Code) - 1,300+ lines

**Health & Status:**
- `GET /health` ✅
- `GET /status` ✅
- `GET /api/status` ✅

**Chat Endpoints:**
- `GET /api/chat/messages` ✅
- `POST /api/chat/send` ✅ (with context: diseaseState, specialty, hcpCategory, influenceDriver, discEnabled)
- `POST /api/chat/clear` ✅
- `GET|POST /api/chat/summary` ✅
- `GET|POST /summary` ✅ (alias)

**SQL Endpoints:**
- `GET /api/sql/history` ✅
- `POST /api/sql/translate` ✅

**Roleplay Endpoints:**
- `GET /api/roleplay/session` ✅
- `POST /api/roleplay/start` ✅
- `POST /api/roleplay/respond` ✅ (returns eqAnalysis + signals)
- `POST /api/roleplay/end` ✅ (comprehensive analysis)
- `POST /api/roleplay/eq-analysis` ✅

**Knowledge & Dashboard:**
- `POST /api/knowledge/ask` ✅
- `GET /api/dashboard/insights` ✅
- `GET /api/daily-focus` ✅

**Coach & Frameworks:**
- `GET|POST /api/coach/prompts` ✅ (context-aware)
- `POST /api/frameworks/advice` ✅
- `POST /api/heuristics/customize` ✅
- `POST /api/modules/exercise` ✅

**Total: 20 endpoints**

---

#### Current Implementation (worker/index.js) - 650 lines

**Missing Endpoints:**
- ❌ `GET /api/chat/messages`
- ❌ `POST /api/chat/clear`
- ❌ `GET|POST /api/chat/summary`
- ❌ `GET|POST /summary`
- ❌ `GET /api/sql/history`
- ❌ `POST /api/sql/translate`
- ❌ `POST /api/roleplay/eq-analysis`
- ❌ `POST /api/knowledge/ask`
- ❌ `GET /api/daily-focus`
- ❌ `GET|POST /api/coach/prompts`
- ❌ `POST /api/frameworks/advice`
- ❌ `POST /api/heuristics/customize`
- ❌ `POST /api/modules/exercise`

**Present Endpoints:**
- ✅ `GET /health`
- ✅ `GET /api/status`
- ✅ `POST /api/chat/send`
- ✅ `GET /api/roleplay/session`
- ✅ `POST /api/roleplay/start`
- ✅ `POST /api/roleplay/respond`
- ✅ `POST /api/roleplay/end`
- ✅ `GET /api/dashboard/insights`

**Total: 8 endpoints (40% coverage)**

---

## 🔍 Key Differences

### 1. Signal Intelligence Framework

Your production worker has a comprehensive Signal Intelligence system:

```javascript
var signalFrameworkPrompt = `You are ReflectivAI — an AI Sales Coach...

Signal Intelligence (Core, Always On):
Signal Intelligence is the ability to notice, interpret, and respond appropriately to OBSERVABLE interaction signals...

Valid signal types (strict):
- verbal: tone shifts, pacing, certainty vs hesitation
- conversational: deflection, repetition, topic avoidance
- engagement: silence, reduced responsiveness, abrupt closure
- contextual: urgency cues, alignment language, stakeholder presence

Hard guardrails (mandatory):
- Do NOT infer emotional state, intent, or personality.
- Do NOT assign permanent traits or labels.
- Signals must be framed as hypotheses ("may indicate...") not truths.
- Ground every signal in evidence: quote or closely paraphrase a snippet from the conversation.
`;
```

**Current implementation:** ❌ Missing this framework

---

### 2. Context-Aware Coaching

Production worker supports rich context in `/api/chat/send`:

```javascript
const context = body?.context;
const diseaseState = context?.diseaseState || context?.disease_state || context?.disease || "";
const specialty = context?.specialty || "";
const hcpCategory = context?.hcpCategory || context?.hcp_category || "";
const influenceDriver = context?.influenceDriver || context?.influence_driver || "";
const discEnabled = !!(context?.discEnabled ?? context?.disc_enabled);
```

**Current implementation:** ❌ Missing context support

---

### 3. Session State Management

Production worker has comprehensive state:

```javascript
var DEFAULT_STATE = { 
  chatMessages: [], 
  sqlQueries: [], 
  roleplay: null, 
  signals: [] 
};
```

With functions:
- `loadState(env, sessionId)`
- `saveState(env, sessionId, state, ctx)`
- `sanitizeSignals(signals)`
- `sanitizeChatMessages(messages)`

**Current implementation:** ✅ Has basic state, ❌ missing SQL queries, signals sanitization

---

### 4. EQ Analysis

Production worker has detailed EQ scoring:

```javascript
eqAnalysis: {
  empathy: number (0-5 scale),
  adaptability: number (0-5 scale),
  curiosity: number (0-5 scale),
  resilience: number (0-5 scale),
  strengths: string[],
  improvements: string[],
  frameworksUsed: string[]
}
```

With scoring guidelines:
- 0-1: No evidence or significant gaps
- 2: Emerging capability with room for growth
- 3: Adequate demonstration, meets baseline
- 4: Strong demonstration with minor refinement opportunities
- 5: Exceptional demonstration, natural and effective

**Current implementation:** ✅ Has EQ analysis, ❌ missing detailed scoring guidelines in prompts

---

### 5. Preset Fallbacks

Production worker has rich preset data:

```javascript
function getInsightPresets() {
  return [
    {
      dailyTip: "Take time today to research your client's recent activities...",
      focusArea: "Active Listening",
      suggestedExercise: {
        title: "5-Minute Sales Story Reflection",
        description: "After each client interaction, jot the main points..."
      },
      motivationalQuote: "Success is not just about making sales..."
    },
    // ... 4 more presets
  ];
}

function getFocusPresets() {
  return [
    {
      title: "Active Listening",
      focus: "Use open-ended questions and mirror one key phrase...",
      microTask: "In your next interaction, mirror one key phrase...",
      reflection: "Where did I assume, instead of clarifying?"
    },
    // ... 4 more presets
  ];
}
```

**Current implementation:** ❌ Missing preset systems

---

### 6. CORS Configuration

Production worker:

```javascript
var ALLOWED_ORIGINS = new Set([
  "https://reflectivai-app-prod.pages.dev",
  "https://production.reflectivai-app-prod.pages.dev"
]);
```

**Current implementation:** ✅ Has CORS, ❌ needs to add GitHub Pages URL

---

### 7. Provider Configuration

Production worker supports:
- Multiple provider keys (key rotation)
- Auto-detection of Groq vs OpenAI
- Configurable model selection

```javascript
function selectKey(env) {
  const pool = (env.PROVIDER_KEYS || "").split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  if (env.PROVIDER_KEY) return env.PROVIDER_KEY;
  return null;
}

const isGroq = key.startsWith("gsk_");
const url = env.PROVIDER_URL || (isGroq ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions");
const model = env.PROVIDER_MODEL || (isGroq ? "llama-3.3-70b-versatile" : "gpt-4o");
```

**Current implementation:** ✅ Has similar logic

---

## 🎯 Critical Missing Features

### 1. SQL Translation System

**Purpose:** Natural language to SQL for pharma sales data queries

**Endpoints:**
- `GET /api/sql/history` - Get query history
- `POST /api/sql/translate` - Translate natural language to SQL

**State:**
```javascript
sqlQueries: [
  {
    id: string,
    naturalLanguage: string,
    sqlQuery: string,
    explanation: string,
    timestamp: number
  }
]
```

---

### 2. Session Summary System

**Purpose:** Generate comprehensive coaching session summaries

**Endpoints:**
- `GET|POST /api/chat/summary`
- `GET|POST /summary`

**Response:**
```javascript
{
  summary: string,
  keyTakeaways: string[],
  skillsDiscussed: string[],
  actionItems: string[],
  nextSteps: string,
  objectionsSurfaced: string[],
  signalIntelligenceHighlights: Signal[]
}
```

---

### 3. Daily Focus System

**Purpose:** Personalized daily coaching focus

**Endpoint:** `GET /api/daily-focus`

**Query params:**
- `role` (optional)
- `specialty` (optional)

**Response:**
```javascript
{
  title: string,
  focus: string,
  microTask: string,
  reflection: string
}
```

---

### 4. Coach Prompts System

**Purpose:** Context-aware conversation starters and topics

**Endpoint:** `GET|POST /api/coach/prompts`

**Context:**
- diseaseState
- specialty
- hcpCategory
- influenceDriver

**Response:**
```javascript
{
  conversationStarters: string[3],
  suggestedTopics: string[6],
  timestamp: string
}
```

---

### 5. Frameworks & Heuristics

**Purpose:** Apply sales frameworks to specific situations

**Endpoints:**
- `POST /api/frameworks/advice` - Get framework-specific advice
- `POST /api/heuristics/customize` - Customize heuristic templates
- `POST /api/modules/exercise` - Generate training exercises

---

### 6. Knowledge Base

**Purpose:** Answer questions with factual rigor

**Endpoint:** `POST /api/knowledge/ask`

**Request:**
```javascript
{
  question: string,
  articleContext?: string
}
```

**Response:**
```javascript
{
  answer: string,
  relatedTopics: string[]
}
```

---

## 📝 Environment Variables

### Production Worker Requirements

**Secrets (via wrangler secret put):**

| Variable | Description | Required | Example |
|----------|-------------|----------|----------|
| `PROVIDER_KEY` | Single Groq API key | ✅ Yes (if not using PROVIDER_KEYS) | `gsk_...` |
| `PROVIDER_KEYS` | Multiple keys (semicolon/comma separated) | ✅ Yes (if not using PROVIDER_KEY) | `gsk_key1;gsk_key2;gsk_key3` |
| `OPENAI_API_KEY` | OpenAI key (fallback) | ⬜ Optional | `sk-...` |

**Public Variables (in wrangler.toml):**

| Variable | Description | Default | Example |
|----------|-------------|---------|----------|
| `PROVIDER_URL` | API endpoint | Auto-detected | `https://api.groq.com/openai/v1/chat/completions` |
| `PROVIDER_MODEL` | Model name | Auto-detected | `llama-3.3-70b-versatile` |

**KV Namespace:**

| Binding | Description | Required |
|---------|-------------|----------|
| `SESS` | Session storage | ✅ Yes |

---

## 🔧 Recommendation

### Option A: Use Production Worker Code (Recommended)

**Pros:**
- ✅ Complete feature set (20 endpoints)
- ✅ Signal Intelligence framework
- ✅ Context-aware coaching
- ✅ SQL translation
- ✅ Session summaries
- ✅ Daily focus system
- ✅ Preset fallbacks
- ✅ Battle-tested in production

**Cons:**
- Larger codebase (1,300 lines)
- More complex to maintain

**Action:** Replace `worker/index.js` with your production code

---

### Option B: Extend Current Implementation

**Pros:**
- ✅ Smaller codebase (650 lines)
- ✅ Easier to understand

**Cons:**
- ❌ Missing 12 endpoints (60% incomplete)
- ❌ No Signal Intelligence
- ❌ No context-aware coaching
- ❌ No SQL translation
- ❌ No session summaries
- ❌ No daily focus
- ❌ No preset fallbacks

**Action:** Add missing features incrementally

---

## ✅ Verdict

**Use your production worker code.** It's a complete, battle-tested implementation with all the features your frontend expects.

The current 650-line implementation is a minimal subset that's missing critical functionality.

---

## 📋 Next Steps

1. **Replace worker code** with production version
2. **Configure environment variables** (see commands below)
3. **Deploy to Cloudflare**
4. **Update frontend** to use worker URL
5. **Test all endpoints**

---

**Created:** December 29, 2025  
**Analysis:** Production worker (1,300 lines) vs Current (650 lines)  
**Recommendation:** Use production worker code
