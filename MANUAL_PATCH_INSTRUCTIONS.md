# 🚨 MANUAL PATCH INSTRUCTIONS - CRITICAL FIXES

**Date:** January 22, 2026  
**Status:** Ready to apply  
**Estimated Time:** 10 minutes

---

## 🎯 WHAT YOU'RE FIXING

These fixes resolve critical scoring issues where:
- Metrics show "N/A" even when signals are detected
- Scoring uses stale/cached messages instead of fresh data
- Scores can be 0 even when signals exist

---

## 📝 FILE 1: `src/lib/signal-intelligence/scoring.ts`

### Change 1A: Add signal attribution check (Line 784)

**FIND THIS (around line 783):**
```typescript
    const applicableComponents = components.filter(c => c.applicable);
    const notApplicable = spec.optional && applicableComponents.length === 0;
```

**REPLACE WITH:**
```typescript
    const applicableComponents = components.filter(c => c.applicable);
    
    // PROMPT #20: Metric Applicability Promotion
    // Canonical rule: not_applicable = !(components.applicable || signals.exist)
    // If any component is applicable OR signals were attributed, metric is applicable
    const hasApplicableComponents = applicableComponents.length > 0;
    const hasSignalsAttributed = hasMetricSignals(transcript, spec.id);
    const notApplicable = spec.optional && !hasApplicableComponents && !hasSignalsAttributed;
```

### Change 1B: Verify PROMPT #21 is present (Lines 796-802)

**CHECK THAT THIS EXISTS (around line 796):**
```typescript
    // PROMPT #21: Minimum Viable Signal Seeding (Scoring Guardrail)
    // If signals exist but score is 0 or null, seed minimum viable score
    const MIN_SIGNAL_SCORE = 1.0;
    const hasSignals = hasApplicableComponents || hasMetricSignals(transcript, spec.id);
    if (hasSignals && (overallScore === null || overallScore === 0)) {
      overallScore = MIN_SIGNAL_SCORE;
    }
```

**If NOT present, add it BEFORE the `results.push({` line.**

---

## 📝 FILE 2: `client/src/lib/signal-intelligence/scoring.ts`

### Change 2: Same as File 1

**Apply the EXACT SAME changes as File 1 above.**

Both `src/` and `client/src/` versions must be identical.

---

## 📝 FILE 3: `src/pages/roleplay.tsx`

### Change 3A: Verify PROMPT #23 fix (Lines 298-318)

**CHECK that `sendResponseMutation.onSuccess` looks like this:**
```typescript
  const sendResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/roleplay/respond", { message: content });
      return res.json();
    },
    onSuccess: async (data) => {
      const newSignals = extractSignals(data);
      if (newSignals.length) {
        setSessionSignals((prev) =>
          dedupeByStableKey(cap50([...prev, ...newSignals]))
        );
      }
      
      // PROMPT #23: Invalidate and wait for refetch before scoring
      await queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
      await queryClient.refetchQueries({ queryKey: ["/api/roleplay/session"] });

      // PROMPT #23: Get fresh messages after refetch
      const freshData = queryClient.getQueryData<SessionPayload>(["/api/roleplay/session"]);
      const currentMessages = freshData?.messages ?? [];
      
      console.log('[LIVE SCORING DEBUG] Current messages count:', currentMessages.length);
      
      if (currentMessages.length >= 2) { // Need at least 1 exchange to score
        const transcript: Transcript = currentMessages.map((msg) => ({
          speaker: msg.role === 'user' ? 'rep' : 'customer',
          text: msg.content,
        }));
        const liveScores = scoreConversation(transcript);
        setMetricResults(liveScores);
        console.log('[LIVE SCORING] Updated metrics during conversation:', liveScores.length);
        console.log('[LIVE SCORING] Scores:', liveScores.map(m => ({ id: m.id, score: m.overall_score, notApplicable: m.not_applicable })));
      }
    },
  });
```

**If it's different, replace the entire `onSuccess` function with the code above.**

### Change 3B: Verify PROMPT #24 fix (Lines 328-374)

**CHECK that `endScenarioMutation.onSuccess` starts like this:**
```typescript
  const endScenarioMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/roleplay/end");
      if (!res.ok) throw new Error("end_failed");
      return res.json();
    },
    onSuccess: async (data) => {
      // PROMPT #24: Wait for final refetch before scoring (same pattern as sendResponse)
      await queryClient.invalidateQueries({ queryKey: ["/api/roleplay/session"] });
      await queryClient.refetchQueries({ queryKey: ["/api/roleplay/session"] });
      
      // Get fresh messages after refetch
      const freshData = queryClient.getQueryData<SessionPayload>(["/api/roleplay/session"]);
      const finalMessages = freshData?.messages ?? [];
      
      console.log('[END SESSION DEBUG] Final messages count:', finalMessages.length);
      
      // ... rest of the function ...
```

**If the first 10 lines of `onSuccess` don't match, replace them with the code above.**

---

## ✅ VERIFICATION CHECKLIST

After applying changes, verify:

### In `scoring.ts` files (both src/ and client/src/):
- [ ] Line ~784: `const hasSignalsAttributed = hasMetricSignals(transcript, spec.id);`
- [ ] Line ~785: `const notApplicable = spec.optional && !hasApplicableComponents && !hasSignalsAttributed;`
- [ ] Line ~796-802: PROMPT #21 minimum viable signal seeding code present

### In `roleplay.tsx`:
- [ ] Line ~298-300: `await queryClient.invalidateQueries` and `refetchQueries` in sendResponseMutation
- [ ] Line ~303: `const freshData = queryClient.getQueryData<SessionPayload>`
- [ ] Line ~328-330: Same pattern in endScenarioMutation
- [ ] Line ~333: `const freshData = queryClient.getQueryData<SessionPayload>`

---

## 🚀 DEPLOYMENT STEPS

### 1. Apply Changes
```bash
cd /path/to/dev_projects_full-build2

# Apply changes manually using the instructions above
# OR use the APPLY_THIS_PATCH.sh script (if on Mac/Linux)
```

### 2. Verify Changes
```bash
# Check what changed
git diff

# Should show changes in 3 files:
# - src/lib/signal-intelligence/scoring.ts
# - client/src/lib/signal-intelligence/scoring.ts  
# - src/pages/roleplay.tsx
```

### 3. Test Locally (Optional but Recommended)
```bash
npm run dev

# Open http://localhost:5173
# Test roleplay page
# Check browser console for:
# - [LIVE SCORING] messages
# - [END SESSION DEBUG] messages
```

### 4. Commit and Push
```bash
git add src/lib/signal-intelligence/scoring.ts \
        client/src/lib/signal-intelligence/scoring.ts \
        src/pages/roleplay.tsx

git commit -m "Fix PROMPT #20-24: Signal attribution, timing, and scoring fixes

- PROMPT #20: Add signal attribution check to metric applicability
- PROMPT #21: Ensure minimum viable score when signals exist
- PROMPT #23: Use fresh messages for live scoring
- PROMPT #24: Use fresh messages for final scoring

Fixes: Metrics showing N/A when signals detected, stale message scoring"

git push origin main
```

### 5. Monitor Deployment
```bash
# Watch GitHub Actions
open https://github.com/ReflectivEI/dev_projects_full-build2/actions

# Wait for "Deploy to Cloudflare Pages" to complete (2-3 minutes)
```

### 6. Verify Production
```bash
# Open production site
open https://reflectivai-app-prod.pages.dev

# Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
# Test roleplay page
# Open browser console (F12)
# Look for:
# - [LIVE SCORING] Updated metrics during conversation: 8
# - [END SESSION DEBUG] Final messages count: N
# - All 8 metrics showing in feedback dialog
```

---

## 🔥 QUICK REFERENCE

**Files to modify:** 3
1. `src/lib/signal-intelligence/scoring.ts`
2. `client/src/lib/signal-intelligence/scoring.ts`
3. `src/pages/roleplay.tsx`

**Key changes:**
- Add `hasSignalsAttributed` check
- Change `notApplicable` logic to include signals
- Add `await refetchQueries` before scoring
- Use `freshData` instead of stale cache

**Expected result:**
- ✅ All 8 metrics calculate correctly
- ✅ No "N/A" when signals exist
- ✅ Live scoring uses fresh messages
- ✅ Final scoring uses fresh messages
- ✅ Minimum score of 1 when signals detected

---

## 🔄 ROLLBACK (If Needed)

If something goes wrong:

```bash
# Restore from backups (if you created them)
cp src/lib/signal-intelligence/scoring.ts.backup src/lib/signal-intelligence/scoring.ts
cp client/src/lib/signal-intelligence/scoring.ts.backup client/src/lib/signal-intelligence/scoring.ts
cp src/pages/roleplay.tsx.backup src/pages/roleplay.tsx

# OR revert the commit
git revert HEAD
git push origin main
```

---

**THESE FIXES ARE CRITICAL FOR ACCURATE SCORING!**

**Questions? Check the Airo workspace for the complete verified code.**
