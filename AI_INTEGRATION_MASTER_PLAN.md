# AI INTEGRATION MASTER PLAN

**Date:** January 21, 2026 1:30 AM HST  
**Status:** COMPREHENSIVE RE-INTEGRATION REQUIRED  
**Objective:** Restore and enhance AI functionality across all pages with behavioral metrics integration

---

## 🎯 EXECUTIVE SUMMARY

**Current State:**
- ✅ Static coaching library implemented (Plan B)
- ✅ Cloudflare Worker API configured and working
- ✅ Behavioral metrics spec defined (8 metrics with scoring formulas)
- ❌ AI API calls disabled on most pages
- ❌ Behavioral metrics NOT integrated with roleplay
- ❌ Observable cues/signals NOT used for real-time scoring

**Target State:**
- ✅ AI API calls enabled on ALL pages
- ✅ Behavioral metrics integrated with roleplay feedback
- ✅ Real-time signal detection during roleplay
- ✅ Automatic scoring based on metrics-spec.ts
- ✅ Fallback to static content if API fails

---

## 📋 PAGES REQUIRING AI INTEGRATION

### 1. ✅ AI Coach (Chat) - ALREADY WORKING
**File:** `src/pages/chat.tsx`  
**Status:** Fully integrated with Worker API  
**API:** `POST /api/chat/send`  
**Features:**
- Real-time coaching conversations
- Context-aware responses
- Session management
- Signal intelligence panel

**No changes needed.**

---

### 2. ❌ Coaching Modules - NEEDS RE-INTEGRATION
**File:** `src/pages/modules.tsx`  
**Current:** Uses static `coaching-content.ts` library  
**Target:** AI-generated coaching with static fallback

**Integration Steps:**

```typescript
const generateCoachingGuidance = async (module: CoachingModule) => {
  setIsGenerating(true);
  setError(null);
  
  try {
    // 1. Try AI generation first
    const response = await apiRequest("POST", "/api/chat/send", {
      message: `Generate coaching guidance for ${module.title}. Focus on: ${module.description}. Provide:
      - focus: Main skill to develop
      - whyItMatters: Business impact
      - nextAction: Concrete next step
      - keyPractices: Array of 4-5 best practices
      - commonChallenges: Array of 4-5 pitfalls
      - developmentTips: Array of 4-5 skill-building strategies
      
      Return ONLY valid JSON matching this structure.`,
      context: {
        module: module.id,
        category: module.category,
        keyTopics: module.keyTopics
      }
    });
    
    const data = await response.json();
    const normalized = normalizeAIResponse(data);
    
    if (normalized.json && normalized.json.focus) {
      setCoachingGuidance(normalized.json);
      return;
    }
    
    // 2. Fallback to static library
    throw new Error('AI response invalid');
    
  } catch (err) {
    console.warn('[MODULES] AI generation failed, using static content:', err);
    const content = getCoachingContent(module.id);
    if (content) {
      setCoachingGuidance(content);
    } else {
      setError('Unable to load coaching guidance');
    }
  } finally {
    setIsGenerating(false);
  }
};
```

**Benefits:**
- AI provides fresh, contextual coaching
- Static library ensures reliability
- Seamless fallback if API fails

---

### 3. ❌ Knowledge Base - NEEDS RE-INTEGRATION
**File:** `src/pages/knowledge.tsx`  
**Current:** Uses static knowledge articles  
**Target:** AI-generated knowledge with static fallback

**Integration Steps:**

```typescript
const generateKnowledgeArticle = async (topic: string) => {
  try {
    const response = await apiRequest("POST", "/api/chat/send", {
      message: `Generate a comprehensive knowledge article about ${topic} for pharmaceutical sales representatives. Include:
      - title: Article title
      - summary: 2-3 sentence overview
      - content: Detailed explanation (3-5 paragraphs)
      - keyTakeaways: Array of 3-5 bullet points
      - relatedTopics: Array of 3-4 related topics
      
      Return ONLY valid JSON.`,
      context: { topic, domain: 'pharmaceutical_sales' }
    });
    
    const data = await response.json();
    return normalizeAIResponse(data).json;
  } catch (err) {
    // Fallback to static knowledge base
    return getStaticKnowledgeArticle(topic);
  }
};
```

---

### 4. ❌ Selling & Coaching Frameworks - NEEDS RE-INTEGRATION
**File:** `src/pages/frameworks.tsx`  
**Current:** Uses static framework data  
**Target:** AI-generated framework advice with static fallback

**Integration Steps:**

```typescript
const getFrameworkAdvice = async (framework: Framework, scenario: string) => {
  try {
    const response = await apiRequest("POST", "/api/chat/send", {
      message: `Provide specific advice for applying the ${framework.name} framework to this scenario: ${scenario}. Include:
      - situation: Analysis of the scenario
      - recommendation: How to apply the framework
      - steps: Array of 3-5 action steps
      - example: Concrete example dialogue
      
      Return ONLY valid JSON.`,
      context: {
        framework: framework.id,
        category: framework.category,
        steps: framework.steps
      }
    });
    
    const data = await response.json();
    return normalizeAIResponse(data).json;
  } catch (err) {
    // Fallback to static framework guidance
    return getStaticFrameworkAdvice(framework);
  }
};
```

---

### 5. ❌ Exercises - NEEDS RE-INTEGRATION
**File:** `src/pages/exercises.tsx`  
**Current:** Uses static 12-question quiz pool  
**Target:** AI-generated exercises with static fallback

**Integration Steps:**

```typescript
const generateExercises = async (topic: string, count: number = 3) => {
  try {
    const response = await apiRequest("POST", "/api/chat/send", {
      message: `Generate ${count} multiple-choice questions about ${topic} for pharmaceutical sales training. Each question should have:
      - question: The question text
      - options: Array of 4 answer choices
      - correctAnswer: Index of correct answer (0-3)
      - explanation: Why the answer is correct
      
      Return ONLY valid JSON array.`,
      context: { topic, difficulty: 'intermediate' }
    });
    
    const data = await response.json();
    return normalizeAIResponse(data).json;
  } catch (err) {
    // Fallback to static quiz pool
    return getRandomQuestionsFromPool(count);
  }
};
```

---

## 🎯 BEHAVIORAL METRICS INTEGRATION

### Current State

**Metrics Spec Defined:** `src/lib/signal-intelligence/metrics-spec.ts`
- 8 behavioral metrics with scoring formulas
- Component-level indicators and heuristics
- Deterministic scoring framework

**NOT Integrated:**
- Roleplay feedback doesn't use metrics-spec
- No real-time signal detection
- No automatic scoring based on indicators

### Target Integration

#### 1. Roleplay Feedback Enhancement

**File:** `src/components/roleplay-feedback-dialog.tsx`

**Current Flow:**
```
User completes roleplay
  ↓
Click "Get Feedback"
  ↓
API call to /api/chat/send
  ↓
Manual feedback parsing
  ↓
Display feedback
```

**Enhanced Flow:**
```
User completes roleplay
  ↓
Extract transcript
  ↓
Analyze with metrics-spec scoring
  ↓
Detect observable signals
  ↓
Calculate component scores
  ↓
Aggregate to metric scores
  ↓
Generate AI feedback
  ↓
Display scores + feedback
```

**Implementation:**

```typescript
import { scoreTranscript } from '@/lib/signal-intelligence/scoring';
import { METRICS_SPEC } from '@/lib/signal-intelligence/metrics-spec';

const analyzeRoleplay = async (transcript: Message[]) => {
  // 1. Score transcript using metrics-spec
  const scores = scoreTranscript(transcript);
  
  // 2. Extract observable signals
  const signals = extractObservableSignals(transcript, scores);
  
  // 3. Generate AI feedback with scores as context
  const response = await apiRequest("POST", "/api/chat/send", {
    message: `Analyze this roleplay transcript and provide coaching feedback. Behavioral metric scores:
    ${JSON.stringify(scores, null, 2)}
    
    Observable signals detected:
    ${JSON.stringify(signals, null, 2)}
    
    Provide specific, actionable feedback for improvement.`,
    context: {
      transcript,
      scores,
      signals
    }
  });
  
  return {
    scores,
    signals,
    feedback: await response.json()
  };
};
```

#### 2. Real-Time Signal Detection

**File:** `src/pages/roleplay.tsx`

**Add live signal detection during roleplay:**

```typescript
import { detectSignals } from '@/lib/signal-intelligence/signal-detector';

const handleUserMessage = async (message: string) => {
  // Send message
  const response = await sendMessage(message);
  
  // Detect signals in real-time
  const signals = detectSignals(messages, message);
  
  // Update signal panel
  setObservableSignals(prev => [...prev, ...signals]);
  
  return response;
};
```

#### 3. Behavioral Metrics Page Integration

**File:** `src/pages/ei-metrics.tsx`

**Current:** Shows static 3.0 scores  
**Target:** Show actual scores from last roleplay

```typescript
import { getLatestRoleplayScores } from '@/lib/signal-intelligence/score-storage';

const EIMetricsPage = () => {
  const [scores, setScores] = useState<Record<string, number>>({});
  
  useEffect(() => {
    // Load scores from last roleplay
    const latestScores = getLatestRoleplayScores();
    if (latestScores) {
      setScores(latestScores);
    }
  }, []);
  
  // Map scores to metrics
  const metricsWithScores = eqMetrics.map(metric => ({
    ...metric,
    score: scores[metric.id] || 3.0
  }));
  
  return (
    // Render metrics with actual scores
  );
};
```

---

## 🔧 IMPLEMENTATION PLAN

### Phase 1: Core Infrastructure (1-2 hours)

1. ✅ **Verify Worker API** - Test all endpoints
2. ✅ **Create signal detector** - `src/lib/signal-intelligence/signal-detector.ts`
3. ✅ **Create score storage** - `src/lib/signal-intelligence/score-storage.ts`
4. ✅ **Update normalizeAIResponse** - Handle new response formats

### Phase 2: Behavioral Metrics Integration (2-3 hours)

1. ✅ **Integrate scoring with roleplay**
   - Update `roleplay-feedback-dialog.tsx`
   - Add real-time signal detection
   - Store scores in localStorage

2. ✅ **Update Behavioral Metrics page**
   - Load scores from storage
   - Display actual scores instead of 3.0
   - Show last roleplay timestamp

3. ✅ **Add signal intelligence panel**
   - Real-time signal display during roleplay
   - Color-coded by metric
   - Expandable details

### Phase 3: AI Re-Integration (2-3 hours)

1. ✅ **Coaching Modules**
   - Add AI generation
   - Keep static fallback
   - Test both paths

2. ✅ **Knowledge Base**
   - Add AI generation
   - Keep static fallback
   - Test both paths

3. ✅ **Frameworks**
   - Add AI generation
   - Keep static fallback
   - Test both paths

4. ✅ **Exercises**
   - Add AI generation
   - Keep static fallback
   - Test both paths

### Phase 4: Testing & Validation (1-2 hours)

1. ✅ **Test all AI endpoints**
2. ✅ **Test fallback behavior**
3. ✅ **Test behavioral metrics scoring**
4. ✅ **Test signal detection**
5. ✅ **Test score persistence**

---

## 📊 SUCCESS CRITERIA

### AI Integration
- ✅ All pages call Worker API for AI generation
- ✅ All pages have static fallback
- ✅ No errors when API fails
- ✅ Seamless user experience

### Behavioral Metrics
- ✅ Roleplay feedback includes metric scores
- ✅ Scores calculated using metrics-spec.ts
- ✅ Observable signals detected in real-time
- ✅ Behavioral Metrics page shows actual scores
- ✅ Scores persist across sessions

### User Experience
- ✅ Fast response times (<2 seconds)
- ✅ Clear loading states
- ✅ Helpful error messages
- ✅ Consistent UI across all pages

---

## 🚀 NEXT STEPS

1. **Create signal detector module**
2. **Create score storage module**
3. **Integrate scoring with roleplay**
4. **Re-enable AI on all pages**
5. **Test end-to-end**
6. **Deploy to production**

---

**READY TO BEGIN IMPLEMENTATION**

Shall I proceed with Phase 1: Core Infrastructure?
