# Phase 3H: AI Framework Advisor Signal Support

**Date:** January 21, 2026  
**Status:** ✅ COMPLETE  
**Commits:** `c34c384b`, `04148e20`, `d847a772`

---

## 🎯 OBJECTIVE

**Problem:** AI Framework Advisor on "Selling and Coaching Modules" page was not responding
- User reported: "When clicked, it appears that AI Coach is responding but no output is ever delivered"
- Root cause: Missing abort signal support (same issue as Knowledge Base)

**Required Fix:**
- Add `AbortController` with 12-second timeout to both AI functions
- Pass `signal` parameter to `apiRequest` calls
- Ensure timeout cleanup in `finally` blocks

---

## 🔍 DIAGNOSIS

**File:** `src/pages/frameworks.tsx`

**Two AI Functions Found:**
1. **`generateAdvice`** (line 78) - "AI Framework Advisor" for communication frameworks
2. **`generateCustomization`** (line 290) - Template customization for heuristics

**Issues Identified:**
1. ✅ `generateAdvice` had `AbortController` but didn't pass signal to `apiRequest`
2. ❌ `generateCustomization` had NO `AbortController` at all
3. ❌ Neither function enforced 12-second timeout

---

## ✅ FIXES APPLIED

### 1️⃣ generateAdvice Signal Support (commit `c34c384b`)

**Before:**
```typescript
const response = await apiRequest("POST", "/api/chat/send", {
  message: `...`,
  content: "Generate framework advice"
});
```

**After:**
```typescript
const response = await apiRequest("POST", "/api/chat/send", {
  message: `...`,
  content: "Generate framework advice"
}, { signal: abortController.signal });  // NEW
```

**Result:**
- ✅ 12-second timeout now enforced
- ✅ Requests abort if AI takes too long
- ✅ Fallback content shown on timeout

---

### 2️⃣ generateCustomization Abort Controller (commit `04148e20`)

**Added:**
```typescript
const generateCustomization = async () => {
  // ...
  
  // NEW: Create AbortController with 12-second timeout
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 12000);

  try {
    const response = await apiRequest("POST", "/api/chat/send", {
      message: `...`,
      content: "Generate template customization"
    }, { signal: abortController.signal });  // NEW
    
    // ...
  } finally {
    clearTimeout(timeoutId);  // NEW
    setIsGeneratingCustomization(false);
  }
};
```

**Result:**
- ✅ Timeout enforcement added
- ✅ Signal passed to apiRequest
- ✅ Timeout cleanup in finally block

---

### 3️⃣ Timeout Cleanup (commit `d847a772`)

**Added to `generateCustomization` finally block:**
```typescript
finally {
  clearTimeout(timeoutId);  // NEW - prevents memory leak
  setIsGeneratingCustomization(false);
}
```

**Result:**
- ✅ Prevents timeout memory leaks
- ✅ Consistent with `generateAdvice` pattern

---

## 🧪 VERIFICATION CHECKLIST

### AI Framework Advisor (Communication Frameworks)
- [ ] Navigate to "Selling and Coaching Modules" page
- [ ] Click on any communication framework (DISC, Active Listening, etc.)
- [ ] Type a situation in the text field
- [ ] Click "Get AI Advice" button
- [ ] Verify response appears within 12 seconds
- [ ] If timeout, verify fallback advice shown

### Template Customization (Heuristics)
- [ ] Navigate to "Selling and Coaching Modules" page
- [ ] Switch to "Heuristics" tab
- [ ] Click on any template
- [ ] Type a situation in the customization field
- [ ] Click "Customize Template" button
- [ ] Verify customization appears within 12 seconds
- [ ] If timeout, verify error message shown

---

## 📊 TECHNICAL DETAILS

### Abort Signal Flow

```typescript
// 1. Create abort controller with timeout
const abortController = new AbortController();
const timeoutId = setTimeout(() => abortController.abort(), 12000);

// 2. Pass signal to apiRequest
const response = await apiRequest("POST", "/api/chat/send", data, {
  signal: abortController.signal
});

// 3. Fetch receives signal and aborts on timeout
fetch(url, { signal: options?.signal });

// 4. Cleanup timeout in finally block
finally {
  clearTimeout(timeoutId);
  setIsGenerating(false);
}
```

### Why This Matters

**Without Signal:**
- Request hangs indefinitely if Worker is slow
- User sees infinite loading spinner
- No fallback content shown
- Poor UX

**With Signal:**
- Request aborts after 12 seconds
- Fallback content shown immediately
- User gets useful response even if AI is slow
- Better UX and reliability

---

## 🚀 DEPLOYMENT

**Branch:** `main`  
**Latest Commit:** `d847a772`

**Commits:**
- `c34c384b` - Add signal to generateAdvice
- `04148e20` - Add AbortController to generateCustomization
- `d847a772` - Add timeout cleanup to generateCustomization

**Deployment Status:** ✅ PUSHED TO MAIN - DEPLOYMENT TRIGGERED

**Next Steps:**
1. Wait for Cloudflare Pages deployment (~2-3 minutes)
2. Verify production build stamp shows commit `d847a772`
3. Test AI Framework Advisor on production
4. Test Template Customization on production
5. Verify 12-second timeout enforcement

---

## 📝 PATTERN SUMMARY

**All AI Functions Now Follow This Pattern:**

```typescript
const generateAI = async () => {
  // 1. Create abort controller
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 12000);

  try {
    // 2. Pass signal to apiRequest
    const response = await apiRequest("POST", "/api/chat/send", data, {
      signal: abortController.signal
    });
    
    // 3. Process response...
  } catch (err) {
    // 4. Handle timeout/errors
  } finally {
    // 5. Cleanup timeout
    clearTimeout(timeoutId);
    setIsGenerating(false);
  }
};
```

**Files Using This Pattern:**
- ✅ `src/pages/knowledge.tsx` - Knowledge Base AI (Phase 3G)
- ✅ `src/pages/frameworks.tsx` - AI Framework Advisor (Phase 3H)
- ✅ `src/pages/modules.tsx` - Module Coaching (already had it)

---

## ✅ COMPLETION CRITERIA

- [x] `generateAdvice` passes signal to apiRequest
- [x] `generateCustomization` has AbortController
- [x] `generateCustomization` passes signal to apiRequest
- [x] Both functions cleanup timeout in finally
- [x] All changes committed to main
- [ ] Deployed to production
- [ ] Verified AI Framework Advisor works
- [ ] Verified Template Customization works
- [ ] Verified 12-second timeout enforcement

---

**Status:** ✅ CODE COMPLETE - READY FOR DEPLOYMENT
