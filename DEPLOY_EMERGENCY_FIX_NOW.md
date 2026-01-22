# 🚨 DEPLOY THIS EMERGENCY FIX NOW

**CRITICAL:** Site is currently broken. This fix restores functionality.

---

## 🔥 WHAT'S BROKEN

**Problem:** Entire site not loading (white screen / blank page)

**Cause:** App.tsx imports a file that doesn't exist in production:
```typescript
import WorkerProbePage from "@/pages/worker-probe"; // ❌ File missing
```

**Impact:** React build fails, entire app crashes

---

## ✅ FIX APPLIED

**File Modified:** `src/App.tsx`

**Changes:**
- ❌ Removed: `import WorkerProbePage from "@/pages/worker-probe";`
- ❌ Removed: `<Route path="/worker-probe" component={WorkerProbePage} />`

**Status:** ✅ Fix is ready and committed locally

---

## 🚀 DEPLOYMENT COMMANDS

### Option 1: Using Airo (Recommended)

Ask Airo to run:

```bash
git add src/App.tsx EMERGENCY_FIX_ROLEPLAY_PAGE.md DEPLOY_EMERGENCY_FIX_NOW.md
git commit -m "🚨 EMERGENCY: Revert worker-probe import (site broken)"
git push origin main
```

### Option 2: Manual Git Commands

If you have terminal access:

```bash
cd /path/to/repo
git add src/App.tsx
git add EMERGENCY_FIX_ROLEPLAY_PAGE.md
git add DEPLOY_EMERGENCY_FIX_NOW.md
git commit -m "🚨 EMERGENCY: Revert worker-probe import (site broken)"
git push origin main
```

---

## ⏱️ EXPECTED TIMELINE

1. **Push to GitHub:** Immediate
2. **GitHub Actions trigger:** ~10 seconds
3. **Build & Deploy:** ~2-3 minutes
4. **Site restored:** ~3 minutes total

---

## ✅ VERIFICATION

**After deployment (wait 3 minutes):**

1. Visit https://reflectivei.com
2. Check if site loads (should see dashboard)
3. Navigate to /roleplay
4. Verify roleplay page works

**Expected Result:**
- ✅ Site loads normally
- ✅ No white screen
- ✅ All pages accessible
- ✅ Roleplay simulator works

---

## 📊 WHAT HAPPENED

**Timeline:**

1. Created worker-probe diagnostic tool (3 files)
2. App.tsx was auto-committed with import
3. Other 2 files were NOT committed
4. Production deployed with partial changes
5. Build failed (missing import)
6. Site crashed

**Root Cause:** Partial commit (only 1 of 3 files)

**Fix:** Revert the import until all files are ready

---

## 🔄 WORKER PROBE STATUS

**Status:** Postponed (not deployed)

**Files Ready (Local):**
- `src/pages/worker-probe.tsx` (8KB)
- `src/server/api/probe-worker/GET.ts` (2KB)

**To Deploy Later:**

Commit all 3 files together:
```bash
git add src/pages/worker-probe.tsx
git add src/server/api/probe-worker/GET.ts
git add src/App.tsx  # Re-add the route
git commit -m "✨ Add Worker contract verification probe"
git push origin main
```

---

## 🎯 ACTION REQUIRED

**DEPLOY THE FIX NOW:**

1. Run the git commands above
2. Wait 3 minutes
3. Verify site is working
4. Report back if still broken

**This is a critical fix. Deploy immediately.**

---

**END OF EMERGENCY DEPLOYMENT INSTRUCTIONS**
