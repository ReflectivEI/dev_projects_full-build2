# Quick Test Reference: Dynamic HCP Cue System

## 🔗 Test URLs
- **Preview**: https://tp5qngjffy.preview.c24.airoapp.ai/roleplay
- **Production**: https://reflectivai-app-prod.pages.dev/roleplay

---

## ✅ Quick Test (5 minutes)

### Setup
1. Go to roleplay page
2. Start any scenario
3. Enable cue display (eye icon)

### Test Flow

**Turn 1** (HCP opens)
- ✓ See 1-2 amber cue boxes below HCP message
- ✓ Record which cues appear: _____

**Turn 2** (You adapt)
- Type: "I understand you're pressed for time. I'll be brief."
- ✓ See green metric badges below your message
- ✓ See blue feedback box

**Turn 3** (HCP responds)
- ✓ See DIFFERENT cues (not same as Turn 1)
- ✓ Amber boxes show NEW behavioral descriptions

**Turn 4** (You ask question)
- Type: "What are your biggest challenges with A1C targets?"
- ✓ See green metric badges (Question Quality, Customer Engagement)

**Turn 5** (HCP engages)
- ✓ See MORE POSITIVE cues (Interested, Engaged, or neutral)
- ✓ No repeated cues from previous turns

### Success Criteria
- [ ] No repeated cues within 3 turns
- [ ] At least 4-5 different cues shown
- [ ] Cues evolved based on your responses
- [ ] Rep metrics displayed correctly
- [ ] Visual display looks correct

---

## 🎯 What to Look For

### HCP Cues (Amber Boxes)
```
┌─────────────────────────────────────┐
│ 🟡 Time Pressure                    │
│ The HCP glances at the clock        │
│ repeatedly and shifts in their      │
│ chair, signaling limited time.      │
└─────────────────────────────────────┘
```
- Appears below HCP messages
- Amber/yellow background
- Rich behavioral description
- Should NOT repeat within 3 turns

### Rep Metrics (Green Badges)
```
┌─────────────────────────────────────┐
│ ✓ Question Quality                  │
│ ✓ Listening & Responsiveness        │
└─────────────────────────────────────┘
```
- Appears below your messages
- Green background
- Only when you demonstrate skills

### Feedback (Blue Boxes)
```
┌─────────────────────────────────────┐
│ 💡 Great adaptation! You             │
│ acknowledged the time constraint.   │
│ Consider being even more specific.  │
└─────────────────────────────────────┘
```
- Appears below your messages
- Blue background
- Actionable coaching tips

---

## 🐛 Common Issues

### Issue: Cues Repeat
**Expected**: Different cues every 3 turns
**If repeating**: Check browser console, report error

### Issue: No Cues Appear
**Check**: Eye icon toggle is enabled
**Check**: Browser console for errors

### Issue: No Rep Metrics
**Check**: Your message contains skill keywords
**Try**: "What challenges do you face?" (should trigger Question Quality)

### Issue: Mood Doesn't Change
**Check**: Rep metrics are being detected
**Try**: Alternate good/bad responses to see mood shift

---

## 📊 Expected Cue Progression

### Good Performance Path
```
Turn 1: Time Pressure, Hesitant
  ↓ (You adapt well)
Turn 3: Distracted, Neutral
  ↓ (You ask great question)
Turn 5: Interested, Engaged
  ↓ (You link to outcomes)
Turn 7: Low Engagement, Neutral
```

### Poor Performance Path
```
Turn 1: Hesitant, Distracted
  ↓ (You give generic pitch)
Turn 3: Defensive, Frustrated
  ↓ (You ignore cues)
Turn 5: Impatient, Withdrawn
  ↓ (You continue poorly)
Turn 7: Disinterested, Uncomfortable
```

---

## 🎬 Test Scripts

### Script 1: Excellent Rep (Copy/Paste)
```
1. I understand you're pressed for time. I'll be brief and focus on what matters most to your patients.

2. What are your biggest challenges in managing A1C targets for your Type 2 diabetes patients?

3. This approach could help you reduce A1C levels by 1-2 points, which means fewer complications and better patient outcomes.

4. What specific outcomes are you looking for in your practice?
```
**Expected**: HCP warms up, cues become more positive

### Script 2: Poor Rep (Copy/Paste)
```
1. Our product is the best on the market.

2. Let me tell you more about our features.

3. This will save you money.

4. We have great customer reviews.
```
**Expected**: HCP pulls back, cues escalate

### Script 3: Mixed Rep (Copy/Paste)
```
1. I understand your time is valuable. Let me focus on what matters to you.

2. Our company has been around for 50 years.

3. What specific outcomes are you looking for in your practice?

4. Let me tell you about our pricing.
```
**Expected**: HCP mood fluctuates, cues vary

---

## 📝 Quick Report Template

**Date**: _____
**Tester**: _____
**URL**: Preview / Production

### Results
- Cues repeated? YES / NO
- Cue variety? (count): _____
- Mood evolution? YES / NO
- Visual display? GOOD / ISSUES

### Issues Found
1. _____
2. _____
3. _____

### Status
- [ ] Ready for production
- [ ] Needs fixes

### Notes
_____

---

## 🚀 Next Steps

### If Tests Pass ✅
→ Deploy to production
→ Monitor for 24 hours
→ Collect user feedback

### If Tests Fail ❌
→ Document specific failures
→ Check browser console
→ Report to development team

---

**For detailed testing**: See `TESTING_GUIDE_DYNAMIC_CUES.md`
**For technical details**: See `DYNAMIC_CUE_SYSTEM_IMPLEMENTATION.md`
**For diagnostics**: See `DIAGNOSTIC_FIX_COMPLETE.md`
