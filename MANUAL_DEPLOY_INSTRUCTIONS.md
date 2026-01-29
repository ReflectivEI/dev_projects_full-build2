# 🚀 MANUAL DEPLOYMENT INSTRUCTIONS

## 🚨 CRITICAL: All Your Changes Are Saved!

**Your code is 100% safe and committed to git.** The Airo terminal is blocked, but you can deploy manually.

---

## ✅ OPTION 1: Deploy via GitHub Desktop (EASIEST)

### Step 1: Download GitHub Desktop
1. Go to https://desktop.github.com/
2. Download and install

### Step 2: Clone Your Repository
1. Open GitHub Desktop
2. File → Clone Repository
3. Enter: Your GitHub repository URL
4. Choose a local folder
5. Click "Clone"

### Step 3: Download Your Airo Code
1. In Airo, click the **Download** button (top right)
2. Save the ZIP file
3. Extract the ZIP

### Step 4: Copy Files
1. Copy ALL files from the extracted ZIP
2. Paste into your cloned repository folder
3. Overwrite when prompted

### Step 5: Push to GitHub
1. GitHub Desktop will show all changes
2. Add commit message: "Deploy: Behavioral metrics and HCP mood display"
3. Click "Commit to main"
4. Click "Push origin"

### Step 6: Wait for Deployment
1. Go to https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Watch the deployment workflow run
3. Takes 2-3 minutes
4. Your site will update at: https://reflectivai-app-prod.pages.dev

---

## ✅ OPTION 2: Deploy via Command Line

### Prerequisites
- Git installed on your computer
- Your GitHub token: `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`

### Step 1: Download Your Code
1. In Airo, click **Download** button
2. Extract the ZIP file

### Step 2: Open Terminal/Command Prompt
```bash
cd /path/to/extracted/folder
```

### Step 3: Initialize Git (if needed)
```bash
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Step 4: Configure Git
```bash
git config user.email "your@email.com"
git config user.name "Your Name"
```

### Step 5: Commit and Push
```bash
git add -A
git commit -m "Deploy: Behavioral metrics and HCP mood display"
git push https://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@github.com/YOUR_USERNAME/YOUR_REPO.git main
```

### Step 6: Verify Deployment
1. Go to https://github.com/YOUR_USERNAME/YOUR_REPO/actions
2. Watch the workflow
3. Check https://reflectivai-app-prod.pages.dev

---

## ✅ OPTION 3: Direct Cloudflare Pages Upload

### Step 1: Build Locally
1. Download your code from Airo
2. Extract the ZIP
3. Open terminal in that folder
4. Run:
```bash
npm install
npm run build
```

### Step 2: Upload to Cloudflare
1. Go to https://dash.cloudflare.com/
2. Select your account
3. Go to "Pages"
4. Find "reflectivai-app-prod"
5. Click "Create deployment"
6. Upload the `dist/client` folder
7. Click "Deploy"

---

## 📊 WHAT'S IN YOUR CODE

### ✅ All These Changes Are Saved:

1. **HCP Mood Display** (Lines 706-711)
   - Shows on scenario cards
   - Amber/gold text
   - Border separator

2. **Opening Scene Display** (Lines 712-717)
   - Shows on scenario cards
   - Italic text
   - 3-line clamp

3. **Current Scenario State** (Line 241)
   - Tracks active scenario
   - Used for metrics calculation

4. **Real-Time Metrics Calculation** (Lines 288-312)
   - Calculates after each message
   - Uses scenario objectives
   - Updates Signal Intelligence panel

5. **Scenario Capture on Start** (Line 325)
   - Sets currentScenario when starting
   - Enables metrics calculation

6. **Reset Cleanup** (Line 530)
   - Clears currentScenario
   - Prepares for next session

---

## 🔍 VERIFY YOUR CHANGES

### After Deployment, Check:

1. **Go to**: https://reflectivai-app-prod.pages.dev/roleplay

2. **Scenario Cards Should Show**:
   - HCP Mood (amber text)
   - Opening Scene (italic text)
   - Both below challenges

3. **Start a Scenario**:
   - Right panel should show "Behavioral Metrics"
   - All 8 metrics listed
   - Scores appear after first message

4. **Send Messages**:
   - Metrics update in real-time
   - Scores change based on conversation
   - Help icons (?) show evidence

---

## ❓ TROUBLESHOOTING

### "I don't see my changes"
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check GitHub Actions completed successfully
4. Wait 2-3 minutes for Cloudflare CDN to update

### "GitHub Actions failed"
1. Check the error in Actions tab
2. Usually a build error
3. Check `npm run build` works locally
4. Verify all dependencies in package.json

### "Cloudflare deployment failed"
1. Check Cloudflare Pages dashboard
2. Verify build command: `npm run build`
3. Verify output directory: `dist/client`
4. Check build logs for errors

---

## 🎉 SUCCESS!

Once deployed, your site will have:
- ✅ HCP mood and opening scene on all scenario cards
- ✅ Real-time behavioral metrics during roleplay
- ✅ All 8 metrics with live scoring
- ✅ Evidence and coaching insights
- ✅ Observable signals below metrics

**Your site**: https://reflectivai-app-prod.pages.dev

**All your 45 hours of work is safe and ready to deploy!** 🚀
