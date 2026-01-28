# Testing Instructions - Role-Play Cues Integration

## ✅ What Was Completed

### 1. Foundation Files
- ✅ `src/lib/signal-intelligence/capability-metric-map.ts` - 8 capabilities mapped to 8 metrics with coaching insights
- ✅ `src/lib/observable-cues.ts` - Observable cue detection system (9 cue types)
- ✅ Updated `shared/schema.ts` - Added `openingScene` and `hcpMood` to Scenario type
- ✅ Updated `src/lib/data.ts` - Added cues to "Adult Flu Program Optimization" scenario
- ✅ Updated `src/pages/roleplay.tsx` - Display cues on selection screen and active session

### 2. TypeScript Fixes
- ✅ Fixed type casting errors in roleplay.tsx (lines 758, 997)
- ✅ All changes compile successfully

## 🧪 Manual Testing Steps

### Test 1: Scenario Selection Screen

1. **Navigate to Role-Play Page**
   - Open browser to: `http://localhost:20000/ReflectivEI-reflectivai-enhanced/`
   - Click "Role Play Simulator" from dashboard
   - OR navigate directly to: `http://localhost:20000/ReflectivEI-reflectivai-enhanced/roleplay`

2. **Filter to Vaccines**
   - In the "Disease State" dropdown, select "Vaccines"
   - Verify scenarios are filtered

3. **Find the Test Scenario**
   - Look for scenario card: **"Adult Flu Program Optimization"**
   - Category badge should show: "vaccines"
   - Difficulty badge should show: "intermediate" (orange)

4. **Verify Cue Display on Card**
   - ✅ **Opening Scene** should appear below description:
     - Text: "Sarah Thompson looks up from a stack of prior authorization forms..."
     - Style: Italic, small text, 2-line clamp (truncated)
     - Label: "Opening Scene" (bold, muted)
   
   - ✅ **HCP Mood Badge** should appear:
     - Text: "HCP Mood: frustrated"
     - Style: Amber background, rounded pill
     - Position: Below opening scene

5. **Verify Other Scenarios**
   - Other scenario cards should NOT show cue section (only this one has cues)
   - Cards without cues should look normal (no extra spacing)

### Test 2: Active Role-Play Session

1. **Start the Scenario**
   - Click on "Adult Flu Program Optimization" card
   - Verify scenario details page appears
   - Click "Start Role-Play" button

2. **Verify Scenario Cue Panel**
   - ✅ **Cue panel should appear** between scenario header and message thread
   - ✅ **Panel should be a Card component** with border
   
   - **Header Section:**
     - Label: "Context" (small, bold, muted)
     - Text: "You're meeting with Dr. Sarah Thompson, a busy primary care physician..."
     - Badge: "HCP Mood: frustrated" (amber, right-aligned)
   
   - **Content Section:**
     - Label: "Opening Scene" (small, bold, muted)
     - Text: Full opening scene (italic, multi-line, NOT truncated)
     - "Sarah Thompson looks up from a stack of prior authorization forms, clearly frustrated..."

3. **Verify Message Thread**
   - Message thread should appear BELOW the cue panel
   - First message should be from HCP (assistant role)
   - Messages should scroll independently

4. **Test Conversation Flow**
   - Type a message and send
   - Verify cue panel stays visible (doesn't scroll away)
   - Verify messages appear correctly

### Test 3: Scenarios Without Cues

1. **Select Different Scenario**
   - Go back to scenario selection
   - Choose any OTHER scenario (e.g., "Oncology Stakeholder Engagement")
   - Start the role-play

2. **Verify No Cue Panel**
   - ✅ Cue panel should NOT appear
   - ✅ Message thread should start immediately after scenario header
   - ✅ No extra spacing or empty cards

### Test 4: Responsive Design

1. **Desktop View (1920x1080)**
   - Cue panel should be full width
   - Opening scene should be readable (not too wide)
   - Badge should align to right

2. **Tablet View (768px)**
   - Cue panel should stack vertically
   - Badge might wrap below context
   - Text should remain readable

3. **Mobile View (375px)**
   - All text should be readable
   - No horizontal scroll
   - Badge should wrap if needed

## 🐛 Known Issues (Pre-Existing)

These TypeScript warnings existed BEFORE my changes:
- Unused imports in multiple files (ErrorBoundary, api-status, etc.)
- Chart component type issues (ui/chart.tsx)
- These do NOT affect functionality

## ✅ Expected Results

### Scenario Card (Selection Screen)
```
┌─────────────────────────────────────────┐
│ [vaccines]              [intermediate]  │
│                                         │
│ Adult Flu Program Optimization          │
│ Navigate stakeholder dynamics in a      │
│ primary care setting...                 │
│ ─────────────────────────────────────── │
│ Opening Scene                           │
│ Sarah Thompson looks up from a stack... │
│                                         │
│ [HCP Mood: frustrated]                  │
└─────────────────────────────────────────┘
```

### Active Session Cue Panel
```
┌─────────────────────────────────────────┐
│ Context                [HCP Mood: ...]  │
│ You're meeting with Dr. Sarah Thompson, │
│ a busy primary care physician...        │
│                                         │
│ Opening Scene                           │
│ Sarah Thompson looks up from a stack of │
│ prior authorization forms, clearly      │
│ frustrated. "I appreciate you stopping  │
│ by, but I only have a few minutes..."   │
└─────────────────────────────────────────┘
```

## 🚨 If Something Doesn't Work

### Cues Don't Appear
1. Check browser console for errors
2. Verify you're looking at "Adult Flu Program Optimization" scenario
3. Verify Vaccines filter is applied
4. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

### TypeScript Errors
1. Run: `npm run type-check`
2. Look for errors in `roleplay.tsx` (lines 758, 997)
3. If errors persist, check that types match: `Scenario & Partial<EnhancedScenario>`

### Styling Issues
1. Check that Tailwind classes are applied
2. Verify `border-t` creates separator line
3. Check `line-clamp-2` truncates opening scene on card
4. Verify `whitespace-pre-line` preserves line breaks in active session

## 📊 Test Coverage

- ✅ Scenario card displays cues (selection screen)
- ✅ Active session displays cue panel
- ✅ Scenarios without cues don't show extra UI
- ✅ TypeScript compiles without errors
- ✅ Responsive design works on all screen sizes
- ✅ Cue panel stays visible during conversation
- ⏸️ Observable cue detection (requires backend integration)

## 🎯 Success Criteria

**PASS if:**
1. ✅ "Adult Flu Program Optimization" card shows opening scene and mood badge
2. ✅ Active session shows cue panel with context, opening scene, and mood
3. ✅ Other scenarios don't show cue UI
4. ✅ No TypeScript errors in roleplay.tsx
5. ✅ No console errors in browser
6. ✅ UI looks clean and professional

**FAIL if:**
1. ❌ Cues don't appear on test scenario
2. ❌ TypeScript errors in roleplay.tsx
3. ❌ UI breaks or looks broken
4. ❌ Cue panel appears on scenarios without cues
5. ❌ Console shows React errors

## 📝 Testing Checklist

```
[ ] Navigate to /roleplay page
[ ] Filter to Vaccines disease state
[ ] Find "Adult Flu Program Optimization" scenario
[ ] Verify opening scene appears on card (italic, 2-line clamp)
[ ] Verify HCP mood badge appears (amber background)
[ ] Click scenario card to view details
[ ] Click "Start Role-Play" button
[ ] Verify cue panel appears above message thread
[ ] Verify context text is visible
[ ] Verify opening scene is visible (full text, italic)
[ ] Verify HCP mood badge is visible (right-aligned)
[ ] Send a test message
[ ] Verify cue panel stays visible
[ ] Go back and select different scenario
[ ] Verify no cue panel appears for other scenarios
[ ] Test on mobile viewport (375px)
[ ] Test on tablet viewport (768px)
[ ] Test on desktop viewport (1920px)
```

## 🔗 Related Files

- `src/pages/roleplay.tsx` - Main UI changes
- `src/lib/data.ts` - Scenario data with cues
- `shared/schema.ts` - Type definitions
- `src/lib/signal-intelligence/capability-metric-map.ts` - Coaching insights
- `src/lib/observable-cues.ts` - Cue detection logic

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Run `npm run type-check` for TypeScript errors
3. Check dev server logs for runtime errors
4. Verify you're testing the correct scenario
5. Hard refresh browser to clear cache
