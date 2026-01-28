# Testing Guide: Dynamic HCP Cue System

## Live Site URL
**Preview**: https://tp5qngjffy.preview.c24.airoapp.ai
**Production**: https://reflectivai-app-prod.pages.dev/

---

## Test Scenario 1: Excellent Rep Performance
**Goal**: Verify HCP mood improves and cues become more positive

### Steps

1. **Navigate to Roleplay**
   - Go to https://tp5qngjffy.preview.c24.airoapp.ai/roleplay
   - Click "Start New Roleplay"
   - Select any scenario (e.g., "Busy Cardiologist - Time Constrained")
   - Click "Start Roleplay"

2. **Turn 1: Observe Initial Cues**
   - **Expected**: HCP shows 1-2 cues (e.g., Time Pressure, Hesitant)
   - **Look for**: Amber boxes below HCP message with cue descriptions
   - **Record**: Which cues appear

3. **Turn 2: Demonstrate Adaptability**
   - **Type**: "I understand you're pressed for time. I'll be brief and focus on what matters most to your patients."
   - **Expected**: Green badges appear below your message showing:
     - ✓ Adaptability
     - ✓ Listening & Responsiveness
   - **Look for**: Blue feedback box with coaching tip

4. **Turn 3: Observe Mood Improvement**
   - **Expected**: HCP cues change (NOT repeated from Turn 1)
   - **Look for**: 
     - Different cues (e.g., Low Engagement → Neutral, or Distracted)
     - Amber box with NEW behavioral description
   - **Verify**: "Hesitant" and "Time Pressure" should NOT appear again

5. **Turn 4: Ask High-Quality Question**
   - **Type**: "What are your biggest challenges in managing A1C targets for your Type 2 diabetes patients?"
   - **Expected**: Green badges showing:
     - ✓ Question Quality
     - ✓ Customer Engagement
   - **Look for**: Blue feedback box praising question quality

6. **Turn 5: Observe Further Improvement**
   - **Expected**: HCP shows MORE POSITIVE cues
   - **Look for**: 
     - Cues like "Interested", "Engaged", or neutral cues
     - Amber box describing HCP leaning forward or showing interest
   - **Verify**: No repeated cues from previous turns

7. **Turn 6: Connect to Outcomes**
   - **Type**: "This approach could help you reduce A1C levels by 1-2 points, which means fewer complications and better patient outcomes."
   - **Expected**: Green badges showing:
     - ✓ Making It Matter
     - ✓ Customer Engagement

8. **Turn 7: Final Check**
   - **Expected**: HCP continues showing positive/neutral cues
   - **Verify**: 
     - Cue variety across all turns (no repeats within 3 turns)
     - HCP mood has improved (less resistance, more engagement)
     - At least 5-6 different cues shown across conversation

### Expected Results Summary

| Turn | Rep Action | Rep Metrics | HCP Mood | Expected HCP Cues |
|------|-----------|-------------|----------|-------------------|
| 1 | (HCP opens) | N/A | Stable | Time Pressure, Hesitant |
| 2 | Adapts well | 2 metrics | Improving | (Rep metrics shown) |
| 3 | (HCP responds) | N/A | Improving | Distracted, Neutral (NEW) |
| 4 | Great question | 2 metrics | Improving | (Rep metrics shown) |
| 5 | (HCP engages) | N/A | Improving | Interested, Engaged (POSITIVE) |
| 6 | Links outcomes | 2 metrics | Improving | (Rep metrics shown) |
| 7 | (HCP continues) | N/A | Improving | Low Engagement, Neutral (VARIETY) |

**Success Criteria**:
- ✅ No repeated cues within 3 turns
- ✅ At least 5 different cues shown
- ✅ Cues become more positive over time
- ✅ Rep metrics displayed correctly
- ✅ Feedback boxes provide coaching tips

---

## Test Scenario 2: Poor Rep Performance
**Goal**: Verify HCP mood declines and cues escalate

### Steps

1. **Navigate to Roleplay**
   - Go to https://tp5qngjffy.preview.c24.airoapp.ai/roleplay
   - Click "Start New Roleplay"
   - Select any scenario
   - Click "Start Roleplay"

2. **Turn 1: Observe Initial Cues**
   - **Expected**: HCP shows 1-2 neutral/mild cues
   - **Record**: Which cues appear

3. **Turn 2: Give Generic Pitch**
   - **Type**: "Our product is the best on the market."
   - **Expected**: NO green badges (0 metrics detected)
   - **Look for**: Blue feedback box suggesting improvements

4. **Turn 3: Observe Mood Decline**
   - **Expected**: HCP cues escalate (e.g., Defensive, Frustrated)
   - **Look for**: 
     - More severe cues than Turn 1
     - Amber box describing HCP pulling back or showing resistance
   - **Verify**: Cues are different from Turn 1

5. **Turn 4: Ignore HCP Cues**
   - **Type**: "Let me tell you more about our features."
   - **Expected**: NO green badges (0 metrics detected)
   - **Look for**: Blue feedback box noting missed opportunity

6. **Turn 5: Observe Further Decline**
   - **Expected**: HCP shows HIGH-SEVERITY cues
   - **Look for**: 
     - Cues like "Impatient", "Withdrawn", "Disinterested"
     - Amber box describing HCP checking watch or looking away
   - **Verify**: Cues continue to escalate

7. **Turn 6: Continue Poor Performance**
   - **Type**: "This will save you money."
   - **Expected**: NO green badges (0 metrics detected)

8. **Turn 7: Final Check**
   - **Expected**: HCP shows maximum resistance cues
   - **Verify**: 
     - Clear escalation from Turn 1 to Turn 7
     - Cue variety (no repeats within 3 turns)
     - At least 5-6 different cues shown

### Expected Results Summary

| Turn | Rep Action | Rep Metrics | HCP Mood | Expected HCP Cues |
|------|-----------|-------------|----------|-------------------|
| 1 | (HCP opens) | N/A | Stable | Hesitant, Distracted |
| 2 | Generic pitch | 0 metrics | Declining | (No rep metrics) |
| 3 | (HCP responds) | N/A | Declining | Defensive, Frustrated (ESCALATED) |
| 4 | Ignores cues | 0 metrics | Declining | (No rep metrics) |
| 5 | (HCP pulls back) | N/A | Declining | Impatient, Withdrawn (HIGH SEVERITY) |
| 6 | Poor response | 0 metrics | Declining | (No rep metrics) |
| 7 | (HCP resists) | N/A | Declining | Disinterested, Uncomfortable (MAX) |

**Success Criteria**:
- ✅ No repeated cues within 3 turns
- ✅ At least 5 different cues shown
- ✅ Cues escalate in severity over time
- ✅ No rep metrics displayed (poor performance)
- ✅ Feedback boxes suggest improvements

---

## Test Scenario 3: Mixed Performance
**Goal**: Verify HCP mood fluctuates and cues vary realistically

### Steps

1. **Navigate to Roleplay**
   - Go to https://tp5qngjffy.preview.c24.airoapp.ai/roleplay
   - Click "Start New Roleplay"
   - Select any scenario
   - Click "Start Roleplay"

2. **Turn 1: Observe Initial Cues**
   - **Expected**: HCP shows 1-2 neutral cues
   - **Record**: Which cues appear

3. **Turn 2: Adapt Well**
   - **Type**: "I understand your time is valuable. Let me focus on what matters to you."
   - **Expected**: 2 green badges (Adaptability, Listening)
   - **HCP Mood**: Stable → Improving

4. **Turn 3: Observe Improvement**
   - **Expected**: Cues become less severe or more neutral
   - **Verify**: Different cues from Turn 1

5. **Turn 4: Lose Focus**
   - **Type**: "Our company has been around for 50 years."
   - **Expected**: 0 green badges
   - **HCP Mood**: Improving → Declining

6. **Turn 5: Observe Decline**
   - **Expected**: Cues escalate (e.g., Defensive, Distracted)
   - **Verify**: More severe than Turn 3

7. **Turn 6: Recover with Question**
   - **Type**: "What specific outcomes are you looking for in your practice?"
   - **Expected**: 2 green badges (Question Quality, Customer Engagement)
   - **HCP Mood**: Declining → Improving

8. **Turn 7: Observe Recovery**
   - **Expected**: Cues become less severe again
   - **Verify**: 
     - Cue variety across all turns
     - Clear mood fluctuation based on rep performance
     - At least 6-7 different cues shown

### Expected Results Summary

| Turn | Rep Action | Rep Metrics | HCP Mood | Expected HCP Cues |
|------|-----------|-------------|----------|-------------------|
| 1 | (HCP opens) | N/A | Stable | Time Pressure, Hesitant |
| 2 | Adapts | 2 metrics | Improving | (Rep metrics shown) |
| 3 | (HCP warms) | N/A | Improving | Low Engagement, Neutral (BETTER) |
| 4 | Loses focus | 0 metrics | Declining | (No rep metrics) |
| 5 | (HCP pulls back) | N/A | Declining | Defensive, Distracted (WORSE) |
| 6 | Recovers | 2 metrics | Improving | (Rep metrics shown) |
| 7 | (HCP re-engages) | N/A | Improving | Uncomfortable, Hesitant (BETTER) |

**Success Criteria**:
- ✅ No repeated cues within 3 turns
- ✅ At least 6 different cues shown
- ✅ Cues fluctuate based on rep performance
- ✅ Clear cause-and-effect relationship
- ✅ Rep metrics displayed when appropriate

---

## Visual Checklist

### HCP Cue Display (Amber Boxes)
- [ ] Appears below HCP messages
- [ ] Shows cue name (e.g., "Time Pressure")
- [ ] Shows rich behavioral description
- [ ] Amber/yellow background color
- [ ] Eye icon toggle works (show/hide)

### Rep Metric Display (Green Badges)
- [ ] Appears below user messages
- [ ] Shows metric name (e.g., "Question Quality")
- [ ] Green background color
- [ ] Only appears when metrics detected

### Feedback Display (Blue Boxes)
- [ ] Appears below user messages
- [ ] Shows coaching tips
- [ ] Blue background color
- [ ] Provides actionable guidance

### Cue Variety
- [ ] No repeated cues within 3 turns
- [ ] At least 5-6 different cues per conversation
- [ ] Cues evolve based on rep performance

### Mood Evolution
- [ ] Good rep performance → HCP warms up
- [ ] Poor rep performance → HCP pulls back
- [ ] Mixed performance → HCP fluctuates

---

## Debugging Tips

### If Cues Repeat
1. Check browser console for errors
2. Verify `conversationContext` state is updating
3. Check `previousCues` array in state
4. Ensure `selectDynamicCues()` is being called

### If No Cues Appear
1. Check if `showCues` toggle is enabled (eye icon)
2. Verify HCP messages are being detected
3. Check browser console for errors
4. Ensure `detectObservableCues()` is working

### If Rep Metrics Don't Appear
1. Verify message contains metric keywords
2. Check if previous HCP message exists (for context)
3. Ensure `detectRepMetrics()` is being called
4. Check browser console for errors

### If Mood Doesn't Evolve
1. Verify rep metrics are being detected
2. Check `repPerformance` in conversation context
3. Ensure `updateContext()` is being called
4. Check browser console for state updates

---

## Expected Console Output

When testing, you should see console logs like:

```
[Dynamic Cue Manager] Turn 1: Detected 2 raw cues
[Dynamic Cue Manager] Rep performance: N/A (HCP turn)
[Dynamic Cue Manager] HCP mood: stable
[Dynamic Cue Manager] Selected cues: time-pressure, hesitant

[Dynamic Cue Manager] Turn 2: Detected 2 rep metrics
[Dynamic Cue Manager] Rep performance: good (2 metrics)
[Dynamic Cue Manager] HCP mood: stable → improving

[Dynamic Cue Manager] Turn 3: Detected 1 raw cue (hesitant)
[Dynamic Cue Manager] Filtered out: hesitant (recently shown)
[Dynamic Cue Manager] Generating contextual cues for improving mood
[Dynamic Cue Manager] Selected cues: distracted, neutral
```

---

## Reporting Results

After testing, please report:

### Scenario 1 Results
- [ ] Cues did NOT repeat within 3 turns
- [ ] At least 5 different cues shown
- [ ] Cues became more positive over time
- [ ] Rep metrics displayed correctly
- **Issues found**: _____

### Scenario 2 Results
- [ ] Cues did NOT repeat within 3 turns
- [ ] At least 5 different cues shown
- [ ] Cues escalated in severity
- [ ] No rep metrics displayed (poor performance)
- **Issues found**: _____

### Scenario 3 Results
- [ ] Cues did NOT repeat within 3 turns
- [ ] At least 6 different cues shown
- [ ] Cues fluctuated based on performance
- [ ] Clear cause-and-effect relationship
- **Issues found**: _____

### Overall Assessment
- **Dynamic cue system working**: YES / NO
- **Cue variety achieved**: YES / NO
- **Mood evolution working**: YES / NO
- **Visual display correct**: YES / NO
- **Ready for production**: YES / NO

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Deploy to production (Cloudflare Pages)
2. Monitor production logs for any issues
3. Collect user feedback on cue variety
4. Consider backend enhancements (see CLOUDFLARE_WORKER_ENHANCEMENT_GUIDE.md)

### If Tests Fail ❌
1. Document specific failures
2. Check browser console for errors
3. Review conversation context state
4. Debug cue selection logic
5. Report findings for fixes

---

**Testing Date**: _____
**Tester**: _____
**Environment**: Preview / Production
**Status**: Pass / Fail
**Notes**: _____
