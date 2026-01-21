# Selling & Coaching Frameworks Page - Diagnostic Report

**Date:** January 21, 2026  
**Status:** 🔍 INVESTIGATING

---

## 🎯 CURRENT STATE ANALYSIS

### ✅ What EXISTS and WORKS

1. **Route Configuration** ✅
   - File: `src/App.tsx` line 35
   - Route: `/frameworks` → `FrameworksPage`
   - Status: CONFIGURED

2. **Sidebar Navigation** ✅
   - File: `src/components/app-sidebar.tsx` line 74
   - Title: "Selling and Coaching Frameworks"
   - URL: `/frameworks`
   - Icon: Brain
   - Status: VISIBLE IN SIDEBAR

3. **Page Component** ✅
   - File: `src/pages/frameworks.tsx` (1134 lines)
   - Status: EXISTS

4. **AI Functionality** ✅
   - `generateAdvice()` function (line 78) - WITH timeout protection
   - `generateCustomization()` function - WITH timeout protection
   - Both use AbortController with 12-second timeout
   - Both call `/api/chat/send` endpoint
   - Status: CODE EXISTS

5. **Data Source** ✅
   - File: `src/lib/data.ts`
   - Exports: `eqFrameworks`, `communicationStyleModels`, `heuristicTemplates`
   - Status: DATA EXISTS

---

## ❓ WHAT MIGHT BE BROKEN

### Hypothesis 1: API Endpoint Not Responding
**Symptom:** AI features don't respond when clicked  
**Cause:** `/api/chat/send` endpoint might be:
- Not deployed to Cloudflare Worker
- Returning errors
- Timing out

**Evidence:**
- No backend API route in `src/server/api/` (this is a Worker endpoint)
- Other pages (AI Coach, Knowledge Base) use same endpoint
- If those work, this should work too

### Hypothesis 2: UI Not Rendering Properly
**Symptom:** Page appears broken or incomplete  
**Cause:** Missing data or rendering errors

**Evidence:**
- Screenshot shows page exists
- Need to verify if AI buttons are visible and clickable

### Hypothesis 3: State Management Issue
**Symptom:** Buttons don't trigger AI generation  
**Cause:** Event handlers not wired up

**Evidence:**
- Need to verify button onClick handlers

---

## 🔍 VERIFICATION NEEDED

### Test Checklist
1. ⏳ Navigate to `/frameworks` - does page load?
2. ⏳ Are framework cards visible?
3. ⏳ Click "Get AI Advice" button - does it trigger?
4. ⏳ Does loading spinner appear?
5. ⏳ Does AI response appear or error message?
6. ⏳ Click "Customize" on heuristic template - does it trigger?
7. ⏳ Check browser console for errors

---

## 🛠️ POTENTIAL FIXES

### If API Endpoint Issue:
```typescript
// Verify apiRequest is using correct base URL
import { apiRequest } from "@/lib/queryClient";

// Should handle both:
// - Development: http://localhost:5173/api/chat/send
// - Production: https://worker.domain.com/api/chat/send
```

### If UI Rendering Issue:
- Check if frameworks data is loading
- Verify tabs are switching properly
- Check if buttons are disabled

### If State Management Issue:
- Verify onClick handlers are attached
- Check if state updates are triggering re-renders

---

## 📊 COMPARISON WITH WORKING PAGES

### AI Coach Page (WORKING)
- Uses `/api/chat/send` ✅
- Has timeout protection ✅
- Uses apiRequest helper ✅
- Has error handling ✅

### Knowledge Base Page (WORKING)
- Uses `/api/knowledge/query` ✅
- Has timeout protection ✅
- Uses apiRequest helper ✅
- Has error handling ✅

### Frameworks Page (UNKNOWN)
- Uses `/api/chat/send` ✅
- Has timeout protection ✅
- Uses apiRequest helper ✅
- Has error handling ✅
- **Same pattern as working pages!**

---

## 🚀 NEXT STEPS

1. **User to verify:** What specifically is broken?
   - Page doesn't load?
   - AI buttons don't respond?
   - Error messages appear?
   - Something else?

2. **Check browser console** for errors

3. **Test AI functionality:**
   - Click "Get AI Advice" on a framework
   - Click "Customize" on a heuristic template
   - Check if responses appear

4. **Compare with working pages:**
   - Does AI Coach work?
   - Does Knowledge Base AI work?
   - If yes, Frameworks should work too (same endpoint)

---

**Status:** ⏳ AWAITING USER FEEDBACK ON SPECIFIC ISSUE
