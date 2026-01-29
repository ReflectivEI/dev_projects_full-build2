# Critical Fixes Needed - January 29, 2026

## Issue 1: "App Template" Title Appearing

**Problem**: The deployed site shows "App Template" as the page title instead of "ReflectivAi - AI-Powered Sales Enablement for Life Sciences"

**Root Cause**: The build process is correct (index.html has the right title), but something in the React app is dynamically changing the document.title.

**Diagnosis Steps**:
1. Check if any component is using `document.title = "App Template"`
2. Check if there's a React Helmet usage setting the title
3. Check if the title is being set in a useEffect hook

**Fix**: Need to search all React components for dynamic title setting and remove/update it.

---

## Issue 2: Scenario Cues Not Displaying Without Breaking

**Problem**: The `openingScene`, `hcpMood`, and `context` fields are defined in the schema and data, but something breaks when they're used.

**Current Status**:
- ✅ Schema has the fields defined (shared/schema.ts lines 73-74)
- ✅ Data has the fields populated (src/lib/data.ts - vac_id_adult_flu_playbook scenario)
- ✅ Roleplay page has the UI code to display them (src/pages/roleplay.tsx lines 1013-1089)

**Diagnosis**:
1. The fields ARE in the code
2. The UI IS rendering them conditionally
3. Something must be breaking at runtime

**Possible Causes**:
- TypeScript type mismatch
- Build process not including the updated data
- React component not re-rendering when scenario changes
- Vite HMR not picking up data.ts changes (requires server restart)

**Fix Strategy**:
1. Restart dev server to ensure data.ts changes are loaded
2. Verify the scenario object in browser console
3. Check for TypeScript errors in the build
4. Ensure conditional rendering logic is correct

---

## Issue 3: Chat Page Shows Jargon When Returning

**Problem**: When user leaves AI Coach page and returns, technical jargon/debug info is displayed instead of a clean interface.

**Root Cause**: Session state is persisting when it shouldn't, or the component is not properly resetting when unmounted/remounted.

**Diagnosis**:
1. Check if session state is stored in localStorage/sessionStorage
2. Check if React Query cache is persisting stale data
3. Check if the component has a cleanup function in useEffect
4. Check if the session is being cleared on page navigation

**Fix Strategy**:
1. Add proper cleanup in useEffect when component unmounts
2. Clear session state when navigating away from chat page
3. Add a "fresh start" check when component mounts
4. Ensure React Query cache is invalidated properly

---

## Priority Order

1. **Issue 3** (Chat page bug) - Most user-facing, affects usability
2. **Issue 2** (Scenario cues) - Critical for roleplay functionality
3. **Issue 1** (Title) - Branding issue, but less critical

---

## Next Steps

1. Search all components for `document.title` usage
2. Restart dev server and verify scenario data loads
3. Add session cleanup logic to chat page
4. Test all three fixes in deployed environment
