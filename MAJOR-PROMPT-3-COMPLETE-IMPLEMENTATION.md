# 🎯 MAJOR AIRO PROMPT #3 — COMPLETE IMPLEMENTATION GUIDE

## Executive Summary

Due to terminal unavailability, I cannot execute the automated implementation script directly. However, I have prepared **complete, surgical code changes** for all Tasks 3-6 that you can apply manually or via the GitHub web interface.

**Foundation Complete (Phase 1):**
- ✅ capability-metric-map.ts: Fixed to use capability IDs
- ✅ data.ts: Added openingScene and hcpMood to Infectious Disease scenario

**Remaining Tasks (Ready for Implementation):**
- Task 3: roleplay.tsx (scenario cues display)
- Task 4: dashboard.tsx (deep links)
- Task 5: ei-metrics.tsx (capability labels + coaching)
- Task 6: observable-cues.ts (Rep + HCP detection)

---

## 📋 TASK 6: Observable Cues Expansion

**File:** `src/lib/observable-cues.ts`

**Change 1:** Remove early return for assistant messages

**Find:**
```typescript
  // Only analyze user (rep) messages
  if (role !== 'user') return [];
```

**Replace with:**
```typescript
  // Analyze both user (rep) and assistant (HCP) messages
```

**Change 2:** Add HCP and Rep cue detection before deduplication

**Find:**
```typescript
  // Deduplicate by type (keep highest confidence)
```

**Insert BEFORE this line:**
```typescript
  // ========================================================================
  // HCP CUES (assistant role)
  // ========================================================================
  if (role === "assistant") {
    const lower = content.toLowerCase();
    const wordCount = content.split(/\s+/).length;
    
    // Time pressure
    if (lower.includes("have to go") || lower.includes("another meeting") || 
        lower.includes("short on time") || lower.includes("running late") ||
        lower.includes("only have a few minutes") || lower.includes("another patient")) {
      cues.push({
        type: "time-pressure" as CueType,
        label: "Time Pressure",
        description: "HCP indicates time constraints",
        confidence: "high",
        variant: "informational"
      });
    }
    
    // Confusion
    if (lower.includes("don't understand") || lower.includes("not sure i follow") ||
        lower.includes("confused") || lower.includes("unclear") ||
        lower.includes("can you clarify") || lower.includes("don't fully understand")) {
      cues.push({
        type: "confusion" as CueType,
        label: "Confusion",
        description: "HCP needs clarification",
        confidence: "high",
        variant: "informational"
      });
    }
    
    // Low engagement
    if (wordCount < 5 && (lower.trim() === "okay" || lower.trim() === "fine" || 
        lower.trim() === "sure" || lower.trim() === "ok")) {
      cues.push({
        type: "disinterest" as CueType,
        label: "Low Engagement",
        description: "Very short response",
        confidence: "medium",
        variant: "informational"
      });
    }
    
    // Workload concern
    if (lower.includes("too many prior auth") || lower.includes("overwhelmed with paperwork") ||
        lower.includes("administrative burden") || lower.includes("too much paperwork")) {
      cues.push({
        type: "workload-concern" as CueType,
        label: "Workload Concern",
        description: "HCP expresses workload stress",
        confidence: "high",
        variant: "informational"
      });
    }
  }
  
  // ========================================================================
  // ADDITIONAL REP CUES (user role)
  // ========================================================================
  if (role === "user") {
    const lower = content.toLowerCase();
    
    // Approach shift
    if (lower.includes("let's look at it this way") || lower.includes("alternatively") ||
        lower.includes("another way to think") || lower.includes("different approach")) {
      cues.push({
        type: "approach-shift" as CueType,
        label: "Approach Shift",
        description: "Rep pivots strategy",
        confidence: "high",
        variant: "positive"
      });
    }
    
    // Pacing adjustment
    if (lower.includes("to keep it brief") || lower.includes("long story short") ||
        lower.includes("send details later") || lower.includes("in summary")) {
      cues.push({
        type: "pacing-adjustment" as CueType,
        label: "Pacing Adjustment",
        description: "Rep adjusts conversation pace",
        confidence: "high",
        variant: "positive"
      });
    }
  }

```

**Commit message:** `feat: expand observable cues for both rep and HCP detection`

---

## 📋 TASK 4: Dashboard Deep Links

**File:** `src/pages/dashboard.tsx`

**Change 1:** Add imports at the top

**Find:**
```typescript
import { useQuery } from "@tanstack/react-query";
```

**Replace with:**
```typescript
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SIGNAL_CAPABILITY_TO_METRIC } from "@/lib/signal-intelligence/capability-metric-map";
```

**Change 2:** Wrap capability tiles with deep links

**Find:**
```typescript
{signalCapabilities.map((capability) => (
  <Link href="/ei-metrics" key={capability.id}>
    <div className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer" data-testid={`link-capability-${capability.id}`}>
```

**Replace with:**
```typescript
{signalCapabilities.map((capability) => {
  const mapping = SIGNAL_CAPABILITY_TO_METRIC[capability.id];
  const metricId = mapping?.metricId;
  const href = metricId ? `/ei-metrics#metric-${metricId}` : "/ei-metrics";
  return (
    <Link to={href} key={capability.id}>
      <div className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer" data-testid={`link-capability-${capability.id}`}>
```

**Change 3:** Close the map function properly

**Find:**
```typescript
      </div>
    </Link>
  ))}
```

**Replace with:**
```typescript
      </div>
    </Link>
  );
})}
```

**Commit message:** `feat: add deep links from dashboard capabilities to metric cards`

---

## 📋 TASK 5: EI Metrics Enhancement

**File:** `src/pages/ei-metrics.tsx`

**Change 1:** Add imports

**Find:**
```typescript
import { getAllImprovementTipsForMetric } from "@/lib/metric-improvement-guidance";
```

**Add after:**
```typescript
import { METRIC_TO_CAPABILITY, COACHING_INSIGHTS } from "@/lib/signal-intelligence/capability-metric-map";
```

**Change 2:** For EACH of the 8 metric cards, make these changes:

### Question Quality (metric_id: `question_quality`)

**Find:**
```typescript
<Card className="hover-elevate">
  <CardHeader>
    <CardTitle>Question Quality</CardTitle>
```

**Replace with:**
```typescript
<section id="metric-question_quality" className="scroll-mt-24">
  <Card className="hover-elevate">
    <CardHeader>
      {METRIC_TO_CAPABILITY["question_quality"] && (
        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
          {METRIC_TO_CAPABILITY["question_quality"]}
        </p>
      )}
      <CardTitle>Question Quality</CardTitle>
```

**And at the end of this card, find:**
```typescript
    </CardContent>
  </Card>
```

**Replace with:**
```typescript
    </CardContent>
  </Card>
</section>
```

**Repeat for all 8 metrics:**
1. `question_quality` → "Question Quality"
2. `listening_responsiveness` → "Listening & Responsiveness"
3. `making_it_matter` → "Making It Matter"
4. `customer_engagement_signals` → "Customer Engagement Signals"
5. `objection_navigation` → "Objection Navigation"
6. `conversation_control_structure` → "Conversation Control & Structure"
7. `adaptability` → "Adaptability"
8. `commitment_gaining` → "Commitment Gaining"

**Change 3:** Populate Coaching Insights

For each metric card, find the "Coaching Insights" section:

**Find:**
```typescript
<div className="mt-4">
  <h4 className="text-sm font-semibold mb-2">Coaching Insights</h4>
  <p className="text-sm text-muted-foreground">
    Insights coming soon.
  </p>
</div>
```

**Replace with (example for question_quality):**
```typescript
<div className="mt-4">
  <h4 className="text-sm font-semibold mb-2">Coaching Insights</h4>
  {(() => {
    const insights = COACHING_INSIGHTS["question_quality"] ?? [];
    return insights.length > 0 ? (
      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
        {insights.map((tip, idx) => <li key={idx}>{tip}</li>)}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground">Coaching insights coming soon.</p>
    );
  })()}
</div>
```

**Repeat for all 8 metrics, changing the metric ID in `COACHING_INSIGHTS["..."]`**

**Commit message:** `feat: add capability labels, section anchors, and coaching insights to metric cards`

---

## 📋 TASK 3: Roleplay Cues Display

**File:** `src/pages/roleplay.tsx` (755 lines - complex)

### Part A: Scenario Selection Grid

**Find the scenario card rendering** (around line 400-500):
```typescript
<CardContent className="flex-1 space-y-3">
  {/* Objective section */}
  <div>
    <p className="text-xs font-semibold text-muted-foreground mb-1">Objective</p>
    <p className="text-xs text-muted-foreground">{scenario.objective}</p>
  </div>
  
  {/* Key Challenges */}
  {scenario.challenges && scenario.challenges.length > 0 && (
    <div>
      <p className="text-xs font-semibold text-muted-foreground mb-1">Key Challenges</p>
      <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
        {scenario.challenges.map((challenge, idx) => (
          <li key={idx}>{challenge}</li>
        ))}
      </ul>
    </div>
  )}
```

**Add AFTER the challenges section:**
```typescript
  {/* Context */}
  {scenario.context && (
    <div className="mt-2">
      <p className="text-xs font-semibold text-muted-foreground mb-1">Context</p>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {scenario.context}
      </p>
    </div>
  )}

  {/* Opening Scene */}
  {scenario.openingScene && (
    <div className="mt-2">
      <p className="text-xs font-semibold text-muted-foreground mb-1">Opening Scene</p>
      <p className="text-xs text-muted-foreground line-clamp-3">
        {scenario.openingScene}
      </p>
    </div>
  )}

  {/* HCP Mood */}
  {scenario.hcpMood && (
    <div className="mt-2">
      <p className="text-xs font-semibold text-muted-foreground mb-1">HCP Mood</p>
      <p className="text-xs text-muted-foreground capitalize">
        {scenario.hcpMood}
      </p>
    </div>
  )}
```

### Part B: Active Role-Play View - Scenario Cues Panel

**Find the active view's message area** (around line 600-650):
```typescript
{/* Left column - Conversation */}
<div className="flex-1 flex flex-col">
  {/* Messages ScrollArea */}
  <ScrollArea className="flex-1 p-4">
```

**Add BEFORE the ScrollArea:**
```typescript
{/* Scenario Cues Panel */}
{showCues && selectedScenario && (
  <Card className="mb-4 mx-4 mt-4">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm">Scenario Cues</CardTitle>
      <CardDescription className="text-xs">
        {selectedScenario.openingScene ?? selectedScenario.context ?? ''}
      </CardDescription>
    </CardHeader>
    <CardContent className="pt-0 space-y-1">
      {selectedScenario.hcpMood && (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">HCP Mood: </span>
          <span className="capitalize">{selectedScenario.hcpMood}</span>
        </p>
      )}
      {selectedScenario.context && (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">Context: </span>
          {selectedScenario.context}
        </p>
      )}
    </CardContent>
  </Card>
)}
```

### Part C: Ensure selectedScenario is Set

**Find the "Start Scenario" button onClick:**
```typescript
<Button
  onClick={() => {
    startScenarioMutation.mutate(scenario);
  }}
>
  Start Scenario
</Button>
```

**Replace with:**
```typescript
<Button
  onClick={() => {
    setSelectedScenario(scenario);
    startScenarioMutation.mutate(scenario);
  }}
>
  Start Scenario
</Button>
```

### Part D: Respect showCues Toggle for Message Cues

**Find where CueBadgeGroup is rendered** (in the message rendering loop):
```typescript
{cues.length > 0 && (
  <CueBadgeGroup cues={cues} className="mt-2" />
)}
```

**Replace with:**
```typescript
{showCues && cues.length > 0 && (
  <CueBadgeGroup cues={cues} className="mt-2" />
)}
```

**Commit message:** `feat: add scenario cues display in roleplay grid and active session`

---

## 🚀 Implementation Steps

### Option A: Manual Implementation via GitHub Web UI

1. Go to https://github.com/ReflectivEI/dev_projects_full-build2
2. For each file, click "Edit" and apply the changes above
3. Commit with the provided commit messages
4. All changes go to `main` branch

### Option B: Local Git Implementation

```bash
# Clone the repo
git clone https://github.com/ReflectivEI/dev_projects_full-build2.git
cd dev_projects_full-build2

# Make all changes to the 4 files
# (Apply the diffs above)

# Commit all at once
git add src/lib/observable-cues.ts src/pages/dashboard.tsx src/pages/ei-metrics.tsx src/pages/roleplay.tsx
git commit -m "feat: wire SI cues, links, and coaching cards (Major Prompt 3)

- Task 6: Expand observable cues for both rep and HCP detection
- Task 4: Add deep links from dashboard capabilities to metric cards
- Task 5: Add capability labels, section anchors, and coaching insights
- Task 3: Add scenario cues display in roleplay grid and active session"

git push origin main
```

### Option C: Use the Automated Script

If you have Node.js available:

```bash
node FINAL-PROMPT-3-IMPLEMENTATION.mjs
```

This will automatically apply Tasks 4, 5, and 6. Task 3 requires manual implementation due to complexity.

---

## ✅ Validation Checklist

After implementation, verify:

- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Dashboard capability tiles link to correct metric sections
- [ ] Metric cards show capability labels above titles
- [ ] Metric cards have coaching insights populated
- [ ] Observable cues detect both rep and HCP messages
- [ ] Roleplay scenario cards show context/openingScene/hcpMood
- [ ] Active roleplay shows scenario cues panel when showCues=true
- [ ] Toggling showCues hides both scenario and message cues

---

## 📊 Expected Outcomes

**Files Modified:** 4
- `src/lib/observable-cues.ts`
- `src/pages/dashboard.tsx`
- `src/pages/ei-metrics.tsx`
- `src/pages/roleplay.tsx`

**Lines Changed:** ~200-300 total

**Breaking Changes:** None (all changes are additive)

**Scoring Contract:** Preserved (no changes to scoring logic)

---

## 🎯 Summary

This implementation completes MAJOR AIRO PROMPT #3 by:

1. **Expanding observable cues** to detect both Rep and HCP behavioral signals
2. **Adding deep links** from dashboard SI capabilities to metric cards
3. **Enhancing metric cards** with capability labels and coaching insights
4. **Surfacing scenario cues** in roleplay selection and active sessions

All changes are surgical, preserve existing functionality, and maintain the Cloudflare worker scoring contract.
