# Scenario Cues Fix - Adult Flu Program Optimization

## Problem Identified

The "Adult Flu Program Optimization" scenario (`vac_id_adult_flu_playbook`) was **missing from the data file** (`src/lib/data.ts`). 

### Root Cause
- The scenario was referenced in documentation and test files
- The UI code in `roleplay.tsx` was correctly implemented to display cues
- **BUT** the actual scenario object with `openingScene` and `hcpMood` fields was never added to `data.ts`

### Evidence
```bash
# Before fix:
$ grep -n "vac_id_adult_flu_playbook" src/lib/data.ts
# (no results - scenario didn't exist)

# After fix:
$ grep -n "vac_id_adult_flu_playbook" src/lib/data.ts
652:    id: "vac_id_adult_flu_playbook",
```

## Solution Applied

Added the complete scenario to `src/lib/data.ts` at line 651-685 with:

### Scenario Details
- **ID**: `vac_id_adult_flu_playbook`
- **Title**: "Adult Flu Program Optimization"
- **Category**: `vaccines`
- **Difficulty**: `intermediate`

### Cue Fields (NEW)
```typescript
openingScene: "Sarah Thompson looks up from a stack of prior authorization forms, clearly frustrated. 'I appreciate you stopping by, but I only have a few minutes before my next patient.'"
hcpMood: "frustrated"
```

### Complete Scenario Structure
```typescript
{
  id: "vac_id_adult_flu_playbook",
  title: "Adult Flu Program Optimization",
  description: "ID group with LTC/high-risk adults; late clinic launches; weak reminder-recall",
  category: "vaccines",
  stakeholder: "Dr. Evelyn Harper - Infectious Diseases Specialist",
  objective: "Pre-season outreach to high-risk adults; early clinic launch; automated reminder system",
  context: "Infectious disease practice managing high-risk adults and LTC facilities. Flu clinics launch late in season. Reminder-recall system is manual and inconsistent.",
  openingScene: "Sarah Thompson looks up from a stack of prior authorization forms, clearly frustrated. 'I appreciate you stopping by, but I only have a few minutes before my next patient.'",
  hcpMood: "frustrated",
  challenges: [
    "Late flu clinic launch timing",
    "Manual reminder-recall system",
    "Inconsistent LTC facility coordination",
    "Limited high-risk patient identification"
  ],
  keyMessages: [
    "Pre-season outreach to high-risk populations",
    "Early clinic launch strategy",
    "Automated reminder system implementation",
    "LTC facility partnership protocols"
  ],
  impact: [
    "Increase vaccination rates in high-risk adults by 30%",
    "Reduce flu-related hospitalizations",
    "Improve LTC facility coverage",
    "Streamline reminder-recall workflow"
  ],
  suggestedPhrasing: [
    "Pre-season outreach to your high-risk patients could significantly improve vaccination rates. Would you like to see a timeline?",
    "Launching clinics earlier in the season gives you more time to reach your target population. What's preventing an earlier start?",
    "An automated reminder system could free up staff time and improve consistency. Can I show you how other practices have implemented this?"
  ],
  difficulty: "intermediate"
}
```

## Files Modified

### `src/lib/data.ts`
- **Lines 651-685**: Added complete `vac_id_adult_flu_playbook` scenario
- **Commit**: 3b03c0d0854009e06956bf48779c0be1e53ec881

## Verification Steps

1. **Refresh your browser** (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
2. Navigate to Role-Play Simulator page
3. Select "Infectious Disease" from Disease State dropdown
4. Look for "Adult Flu Program Optimization" scenario card
5. **Expected Results**:
   - ✅ Card shows "Opening Scene" section with italic text
   - ✅ Card shows amber "HCP Mood: frustrated" badge
   - ✅ When you click the card, the full scenario details appear
   - ✅ When you start the role-play, the cue panel appears above the chat

## Debug Console Output

The debug logging in `roleplay.tsx` (lines 995-1007) should now show:

```javascript
🔍 Rendering scenario: Adult Flu Program Optimization
{
  id: 'vac_id_adult_flu_playbook',
  title: 'Adult Flu Program Optimization',
  openingScene: "Sarah Thompson looks up from a stack of prior authorization forms...",
  hcpMood: 'frustrated',
  context: 'Infectious disease practice managing high-risk adults...',
  hasOpeningScene: true,
  hasHcpMood: true
}
```

## Status

✅ **RESOLVED** - Scenario now exists in data file with all required cue fields

## Next Steps

1. Refresh browser to see changes
2. Test the scenario selection and role-play flow
3. Verify cues display correctly in both:
   - Scenario selection card (grid view)
   - Active role-play session (cue panel)

---

**Last Updated**: 2026-01-28T23:17:51.874Z
**Fixed By**: AI Assistant
**Commit**: 3b03c0d0854009e06956bf48779c0be1e53ec881
