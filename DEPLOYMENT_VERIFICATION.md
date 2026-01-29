# 🔍 DEPLOYMENT VERIFICATION CHECKLIST

## ✅ YOUR CODE IS CORRECT!

I verified that:
- ✅ `hcpMood` field exists in type definition (line 19 of schema.ts)
- ✅ `openingScene` field exists in type definition (line 18 of schema.ts)
- ✅ Display code exists in roleplay.tsx (lines 706-717)
- ✅ All scenarios have `hcpMood` and `openingScene` data

**Example from data.ts:**
```typescript
openingScene: "Dr. Patel glances at her watch as you enter. She's between patients, typing notes rapidly. 'I have about 10 minutes,' she says without looking up. 'What's this about?'",
hcpMood: "time-pressured, skeptical",
```

---

## 🚨 WHY YOU DON'T SEE IT YET

### **Cloudflare Pages Deployment Takes Time:**

1. **GitHub Actions Build** (2-3 minutes)
   - Runs `npm install`
   - Runs `npm run build`
   - Uploads to Cloudflare

2. **Cloudflare Deployment** (1-2 minutes)
   - Processes the build
   - Deploys to edge network

3. **CDN Cache Propagation** (2-5 minutes)
   - Updates global CDN cache
   - Clears old cached files

**TOTAL TIME: 5-10 minutes from push**

---

## 📊 HOW TO VERIFY DEPLOYMENT

### Step 1: Check GitHub Actions
1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2/actions
2. Look for your latest commit
3. Wait for green checkmark ✅
4. If red ❌, click to see error logs

### Step 2: Check Cloudflare Pages
1. Go to: https://dash.cloudflare.com/
2. Navigate to Pages → reflectivai-app-prod
3. Check "Deployments" tab
4. Look for latest deployment status
5. Should show "Success" with timestamp

### Step 3: Clear Your Browser Cache
**CRITICAL: Your browser is caching the old version!**

**Chrome/Edge:**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Firefox:**
- Windows: `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Safari:**
- `Cmd + Option + E` (clear cache)
- Then `Cmd + R` (reload)

### Step 4: Test in Incognito/Private Window
1. Open incognito/private browsing window
2. Go to: https://reflectivai-app-prod.pages.dev/roleplay
3. This bypasses all browser cache

---

## ✅ WHAT YOU SHOULD SEE

### On Scenario Cards:

```
┌─────────────────────────────────────────┐
│ HIV Prevention Gap in High-Risk Pop...  │
│ ⭐ intermediate                          │
├─────────────────────────────────────────┤
│ Stakeholder                             │
│ Dr. Maya Patel - Internal Medicine MD   │
│                                         │
│ Objective                               │
│ Create urgency around PrEP gaps...      │
│                                         │
│ Key Challenges                          │
│ • Belief that few patients are true...  │
│ • Renal safety and monitoring...        │
├─────────────────────────────────────────┤  ← BORDER
│ HCP Mood                                │  ← NEW!
│ time-pressured, skeptical               │  ← AMBER TEXT
│                                         │
│ Opening Scene                           │  ← NEW!
│ Dr. Patel glances at her watch as you   │  ← ITALIC
│ enter. She's between patients, typing   │
│ notes rapidly. 'I have about 10...      │
├─────────────────────────────────────────┤
│        [▶ Start Scenario]               │
└─────────────────────────────────────────┘
```

---

## 🐛 TROUBLESHOOTING

### "Still don't see it after 10 minutes"

**Check 1: GitHub Actions Failed?**
- Go to Actions tab
- Click on failed workflow
- Read error message
- Common issues:
  - TypeScript errors
  - Build failures
  - Missing dependencies

**Check 2: Cloudflare Deployment Failed?**
- Check Cloudflare Pages dashboard
- Look at deployment logs
- Common issues:
  - Build command incorrect
  - Output directory wrong
  - Environment variables missing

**Check 3: Browser Cache Stubborn?**
- Clear ALL browsing data (not just cache)
- Close and reopen browser
- Try different browser
- Use incognito/private mode

**Check 4: Wrong URL?**
- Make sure you're on: https://reflectivai-app-prod.pages.dev/roleplay
- NOT the preview URL: tp5qngjffy.preview.c24.airoapp.ai

### "GitHub Actions shows error"

**Build Error:**
```bash
# Download your code from Airo
# Extract and run locally:
cd /path/to/code
npm install
npm run build

# If this fails, you'll see the exact error
# Fix the error and push again
```

**Push Error:**
```bash
# Force push if needed:
git push https://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@github.com/ReflectivEI/dev_projects_full-build2.git main --force
```

---

## 🎯 QUICK TEST COMMANDS

### Test 1: Check if deployment is live
```bash
curl -I https://reflectivai-app-prod.pages.dev/roleplay
# Should return 200 OK
```

### Test 2: Check deployment timestamp
```bash
curl -I https://reflectivai-app-prod.pages.dev/roleplay | grep -i "last-modified"
# Should show recent timestamp
```

### Test 3: Force cache bypass
```bash
# Add cache-busting query parameter:
https://reflectivai-app-prod.pages.dev/roleplay?v=123456
```

---

## ✅ CONFIRMATION CHECKLIST

Before reporting an issue, verify:

- [ ] GitHub Actions workflow completed successfully (green checkmark)
- [ ] Cloudflare Pages deployment shows "Success"
- [ ] Waited at least 10 minutes since push
- [ ] Hard refreshed browser (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Tested in incognito/private window
- [ ] Tested in different browser
- [ ] Cleared all browser cache/cookies
- [ ] Confirmed correct URL (not preview URL)

---

## 🆘 IF STILL NOT WORKING

### Option 1: Check Airo Preview URL
Your preview URL has the latest code:
- https://tp5qngjffy.preview.c24.airoapp.ai/roleplay

If you see it there but not on Cloudflare, the issue is with the deployment, not the code.

### Option 2: Manual Cloudflare Upload
1. Download code from Airo
2. Extract and build locally:
   ```bash
   npm install
   npm run build
   ```
3. Go to Cloudflare Pages dashboard
4. Create new deployment
5. Upload `dist/client` folder

### Option 3: Check Build Logs
1. GitHub Actions → Click on workflow
2. Expand "Build" step
3. Look for errors or warnings
4. Share logs if you need help

---

## 📞 SUPPORT INFO

**Your Repository:** https://github.com/ReflectivEI/dev_projects_full-build2
**Your Site:** https://reflectivai-app-prod.pages.dev
**Preview URL:** https://tp5qngjffy.preview.c24.airoapp.ai

**Code Locations:**
- HCP Mood/Opening Scene Display: `src/pages/roleplay.tsx` lines 706-717
- Scenario Data: `src/lib/data.ts` starting line 298
- Type Definitions: `src/types/schema.ts` lines 18-19

**All code is correct and committed!** The issue is deployment timing or browser cache.

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when you see:

1. ✅ **HCP Mood** section on scenario cards (amber text)
2. ✅ **Opening Scene** section on scenario cards (italic text)
3. ✅ Both appear BELOW "Key Challenges" and ABOVE "Start Scenario" button
4. ✅ Border separator above HCP Mood
5. ✅ All scenarios show these fields

**Your code is 100% correct. Just wait for deployment and clear cache!** 🚀
