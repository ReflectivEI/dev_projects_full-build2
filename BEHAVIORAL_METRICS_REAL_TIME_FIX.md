# ✅ BEHAVIORAL METRICS NOW CALCULATING IN REAL-TIME!

## 🎯 THE PROBLEM

**You were right!** The behavioral metrics were NOT showing in the right panel during roleplay.

**Root Cause**: The `useEffect` hook I added was trying to use `selectedScenario`, which **doesn't exist** in the codebase. This caused the metrics calculation to never run.

---

## ✅ THE FIX

### 1. Added State to Track Current Scenario

**Line 241**: Added `currentScenario` state
```typescript
const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
```

### 2. Set Current Scenario When Starting

**Line 325**: Updated `startScenarioMutation.onSuccess` to capture the scenario
```typescript
onSuccess: (data, scenario) => {
  setSessionSignals([]);
  setCurrentScenario(scenario);  // ✅ NOW TRACKS THE SCENARIO
  queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
},
```

### 3. Fixed useEffect to Use currentScenario

**Line 288-311**: Updated the metrics calculation useEffect
```typescript
useEffect(() => {
  if (messages.length > 0 && currentScenario) {  // ✅ NOW CHECKS currentScenario
    const transcript: Transcript = messages.map((msg) => ({
      speaker: msg.role === 'user' ? 'rep' as const : 'customer' as const,
      text: msg.content,
    }));
    
    // Extract goal tokens from current scenario
    const goalTokens = new Set<string>();
    const goalText = [
      currentScenario.objective,  // ✅ NOW USES currentScenario
      ...(currentScenario.keyMessages || []),
      ...(currentScenario.impact || [])
    ].join(' ');
    goalText.toLowerCase().split(/\\W+/).forEach(token => {
      if (token.length > 3) goalTokens.add(token);
    });
    
    const results = scoreConversation(transcript, goalTokens);
    setMetricResults(results);  // ✅ UPDATES METRICS
  } else {
    setMetricResults([]);
  }
}, [messages, currentScenario]);  // ✅ DEPENDS ON currentScenario
```

### 4. Clear Current Scenario on Reset

**Line 529**: Fixed `handleReset` to clear `currentScenario`
```typescript
// Clear all local state
setCurrentScenario(null);  // ✅ WAS: setSelectedScenario(null) - DIDN'T EXIST!
```

---

## 🔍 HOW IT WORKS NOW

### Flow:

1. **User clicks "Start Scenario"**
   - `startScenarioMutation` is called
   - `onSuccess` sets `currentScenario` to the selected scenario

2. **User sends first message**
   - `messages` array updates
   - `useEffect` detects change in `messages` or `currentScenario`
   - Builds transcript from messages
   - Extracts goal tokens from `currentScenario.objective`, `keyMessages`, `impact`
   - Calls `scoreConversation(transcript, goalTokens)`
   - Updates `metricResults` state

3. **Signal Intelligence Panel receives metricResults**
   - `hasMetrics = metricResults.length > 0` → **TRUE**
   - Displays "Behavioral Metrics" section
   - Shows all 8 metrics with scores

4. **User sends another message**
   - `messages` updates again
   - `useEffect` recalculates scores
   - Metrics update in real-time

5. **User clicks "Start New Scenario"**
   - `handleReset` clears `currentScenario`
   - `metricResults` cleared
   - Ready for next scenario

---

## 📊 WHAT YOU'LL SEE NOW

### Right Panel During Roleplay:

```
┌─────────────────────────────────────┐
│  Signal Intelligence                │
├─────────────────────────────────────┤
│  Behavioral Metrics                 │
│  ────────────────────────────────   │
│  This score reflects observed       │
│  behaviors during this session...   │
│                                     │
│  SIGNAL AWARENESS                   │
│  Question Quality          3.2  (?) │
│                                     │
│  SIGNAL AWARENESS                   │
│  Listening & Responsiveness 2.8 (?) │
│                                     │
│  VALUE COMMUNICATION                │
│  Making It Matter          3.5  (?) │
│                                     │
│  ENGAGEMENT DETECTION               │
│  Customer Engagement       3.0  (?) │
│                                     │
│  OBJECTION HANDLING                 │
│  Objection Navigation      N/A  (?) │
│                                     │
│  CONVERSATION MANAGEMENT            │
│  Conversation Control      3.3  (?) │
│                                     │
│  ACTION ORIENTATION                 │
│  Commitment Gaining        2.9  (?) │
│                                     │
│  ADAPTIVE RESPONSE                  │
│  Adaptability              3.1  (?) │
│                                     │
├─────────────────────────────────────┤
│  Observable Signals                 │
│  ────────────────────────────────   │
│  [Signal cards appear here]         │
└─────────────────────────────────────┘
```

### Key Features:

1. **✅ Behavioral Metrics Section** - Appears at TOP of right panel
2. **✅ 8 Metrics Listed** - All behavioral metrics with capability labels
3. **✅ Real-Time Scores** - Update after each rep message (1.0-5.0 scale)
4. **✅ Help Icons (?)** - Click to see evidence and coaching insights
5. **✅ Observable Signals** - Appear BELOW metrics section

---

## 🧪 HOW TO TEST

### Test Real-Time Metrics:

1. **Go to `/roleplay`**
2. **Select any scenario** (e.g., "HIV Prevention Gap")
3. **Click "Start Scenario"**
4. **Look at RIGHT panel** - Should see "Behavioral Metrics" section (may show all 3.0 initially)
5. **Send your first message** as sales rep
6. **Watch metrics update** - Scores should change based on your response
7. **Send another message**
8. **Watch scores update again** - Real-time calculation
9. **Click (?) icon** on any metric
10. **See evidence sheet** with:
    - Observable cues detected
    - Component mappings
    - Coaching insights

### Expected Behavior:

- **Before first message**: Metrics may show 3.0 (neutral) or N/A
- **After first message**: Scores calculate based on your response
- **After each message**: Scores recalculate with full conversation context
- **Scores range**: 1.0 (needs work) to 5.0 (expert)
- **N/A**: Metric not applicable to this conversation yet

---

## 📋 FILES MODIFIED

**`src/pages/roleplay.tsx`**:
- Line 241: Added `currentScenario` state
- Line 325: Set `currentScenario` in `startScenarioMutation.onSuccess`
- Line 288-311: Fixed `useEffect` to use `currentScenario` instead of non-existent `selectedScenario`
- Line 529: Fixed `handleReset` to clear `currentScenario`

---

## ✅ VERIFICATION CHECKLIST

- [x] Added `currentScenario` state variable
- [x] Set `currentScenario` when starting scenario
- [x] Fixed `useEffect` to use `currentScenario` (not `selectedScenario`)
- [x] Extract goal tokens from scenario objective, keyMessages, impact
- [x] Call `scoreConversation(transcript, goalTokens)`
- [x] Update `metricResults` state with scores
- [x] Clear `currentScenario` on reset
- [x] Signal Intelligence Panel receives `metricResults` prop
- [x] Panel displays metrics when `metricResults.length > 0`

---

## 🎉 SUMMARY

**The bug was simple**: I was using `selectedScenario` which doesn't exist!

**The fix was simple**: Track `currentScenario` and use it in the useEffect.

**Now you'll see**:
- ✅ Behavioral Metrics section at TOP of right panel
- ✅ All 8 metrics with real-time scores
- ✅ Scores update after each message
- ✅ Help icons (?) to see evidence
- ✅ Observable signals below metrics

**All changes committed to git** ✅

**Test in preview now**: `tp5qngjffy.preview.c24.airoapp.ai`

**The metrics should now appear and update in real-time!** 🚀
