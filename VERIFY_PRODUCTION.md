# 🧪 PRODUCTION VERIFICATION CHECKLIST

**URL**: https://reflectivai-app-prod.pages.dev/
**Date**: 2026-01-20
**Deployment**: PROMPT_17_HOTFIX

---

## ✅ VERIFICATION TESTS (ALL MUST PASS)

### Test 1: Exercises Page
**URL**: https://reflectivai-app-prod.pages.dev/exercises

**Steps**:
1. Navigate to /exercises
2. Click "Generate Practice Exercises" button
3. Wait for response

**Expected**:
- ✅ Exercises appear with content
- ✅ No error banner
- ✅ Network: POST to Worker URL, status 200

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 2: Modules Page
**URL**: https://reflectivai-app-prod.pages.dev/modules

**Steps**:
1. Navigate to /modules
2. Select any module
3. Click "Generate Coaching Guidance"
4. Wait for response

**Expected**:
- ✅ Coaching guidance appears
- ✅ No "Unable to generate" error
- ✅ Network: POST to Worker URL, status 200

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 3: Knowledge Base
**URL**: https://reflectivai-app-prod.pages.dev/knowledge

**Steps**:
1. Navigate to /knowledge
2. Type question: "What is ReflectivAI?"
3. Click "Ask" button
4. Wait for response

**Expected**:
- ✅ Answer appears
- ✅ No "Failed to get answer" error
- ✅ Network: POST to Worker URL, status 200

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 4: Frameworks - Get AI Advice
**URL**: https://reflectivai-app-prod.pages.dev/frameworks

**Steps**:
1. Navigate to /frameworks
2. Scroll to "Get AI Advice" section
3. Enter situation: "Customer objection about price"
4. Select framework: "SPIN Selling"
5. Click "Get AI Advice"
6. Wait for response

**Expected**:
- ✅ Advice appears with personalized content
- ✅ No error message
- ✅ Network: POST to Worker URL, status 200

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 5: Frameworks - Customize Framework
**URL**: https://reflectivai-app-prod.pages.dev/frameworks

**Steps**:
1. Navigate to /frameworks
2. Scroll to "Heuristic Templates" section
3. Select template: "Acknowledge + Reframe"
4. Enter situation: "Customer says product is too expensive"
5. Click "Customize for My Situation"
6. Wait for response

**Expected**:
- ✅ Customized template appears
- ✅ No error message
- ✅ Network: POST to Worker URL, status 200

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 6: Home Page Chat
**URL**: https://reflectivai-app-prod.pages.dev/

**Steps**:
1. Navigate to home page
2. Type message: "Help me prepare for a sales call"
3. Click Send button
4. Wait for response

**Expected**:
- ✅ AI response appears
- ✅ No error message
- ✅ Network: POST to Worker URL, status 200

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 7: Mobile Deep Link (iPhone Safari)
**URL**: https://reflectivai-app-prod.pages.dev/exercises

**Steps**:
1. Open in iPhone Safari
2. Navigate to /exercises
3. Pull down to hard refresh
4. Observe behavior

**Expected**:
- ✅ Stays on /exercises page
- ✅ No "Redirecting..." message
- ✅ No 404 error
- ✅ Page loads correctly

**Result**: [ ] PASS / [ ] FAIL
**Notes**: _______________________________________

---

### Test 8: Network Tab Verification
**URL**: https://reflectivai-app-prod.pages.dev/exercises

**Steps**:
1. Open DevTools → Network tab
2. Click "Generate Practice Exercises"
3. Find the POST request in Network tab
4. Check URL and status

**Expected**:
- ✅ POST to: https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev/api/chat/send
- ✅ Status: 200 OK
- ❌ NOT: POST to relative /api/chat/send (would be 404)

**Result**: [ ] PASS / [ ] FAIL
**Actual URL**: _______________________________________
**Status Code**: _______________________________________

---

### Test 9: Console Error Check
**URL**: https://reflectivai-app-prod.pages.dev/

**Steps**:
1. Open DevTools → Console tab
2. Navigate through all pages
3. Trigger at least one "Generate" feature
4. Check for errors

**Expected**:
- ✅ No red error messages
- ✅ No fetch failures
- ✅ No CORS errors
- ✅ No "undefined base URL" errors

**Result**: [ ] PASS / [ ] FAIL
**Errors Found**: _______________________________________

---

## 📊 FINAL VERDICT

**Total Tests**: 9
**Passed**: _____ / 9
**Failed**: _____ / 9

**Overall Status**: [ ] ALL PASS (PRODUCTION RESTORED) / [ ] FAILURES DETECTED (ROLLBACK REQUIRED)

---

## 🚨 IF ANY TEST FAILS

**IMMEDIATE ROLLBACK**:
```bash
git revert HEAD~4
git push origin main
```

Then re-trigger deployment workflow:
1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2/actions/workflows/deploy-frontend.yml
2. Click "Run workflow"
3. Select "production"
4. Type "DEPLOY"
5. Click "Run workflow"

**Document failure**:
- Which test failed: _______________________________________
- Error message: _______________________________________
- Network URL called: _______________________________________
- Console errors: _______________________________________

---

## ✅ IF ALL TESTS PASS

**Tag the release**:
```bash
git tag -a PROD_RESTORED_20260120 -m "Production hotfix: Fixed all raw fetch() calls to use apiRequest() helper. Restored AI generation features on exercises, modules, knowledge, frameworks, and home pages."
git push origin PROD_RESTORED_20260120
```

**Update status**:
- Production: ✅ FULLY OPERATIONAL
- All AI features: ✅ WORKING
- Mobile routing: ✅ STABLE
- Deployment: ✅ SUCCESSFUL

---

**END OF VERIFICATION CHECKLIST**
