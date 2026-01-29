# 🔐 Cloudflare Pages Deployment - Secrets Setup

## ✅ Workflow Created

I've created `.github/workflows/cloudflare-pages.yml` which will automatically deploy to Cloudflare Pages on every push to `main`.

## 🔑 Required Secrets

You need to add TWO secrets to your GitHub repository:

### 1. CLOUDFLARE_API_TOKEN

**How to get it:**

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use template: **"Edit Cloudflare Workers"** OR create custom token with:
   - **Permissions**:
     - Account → Cloudflare Pages → Edit
   - **Account Resources**:
     - Include → Your Account
4. Click **"Continue to summary"**
5. Click **"Create Token"**
6. **COPY THE TOKEN** (you won't see it again!)

### 2. CLOUDFLARE_ACCOUNT_ID

**How to get it:**

1. Go to: https://dash.cloudflare.com/
2. Click on **"Workers & Pages"** in left sidebar
3. Look at the URL - it will be:
   ```
   https://dash.cloudflare.com/YOUR_ACCOUNT_ID/workers-and-pages
                                  ^^^^^^^^^^^^^^^^
   ```
4. Copy the account ID from the URL

**OR:**

1. Go to any Cloudflare dashboard page
2. Scroll down in the right sidebar
3. Look for **"Account ID"** section
4. Click to copy

## 📝 Add Secrets to GitHub

### Step 1: Go to Repository Settings

1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2
2. Click **"Settings"** tab (top right)
3. In left sidebar, click **"Secrets and variables"** → **"Actions"**

### Step 2: Add CLOUDFLARE_API_TOKEN

1. Click **"New repository secret"**
2. **Name**: `CLOUDFLARE_API_TOKEN`
3. **Secret**: Paste the API token from Cloudflare
4. Click **"Add secret"**

### Step 3: Add CLOUDFLARE_ACCOUNT_ID

1. Click **"New repository secret"**
2. **Name**: `CLOUDFLARE_ACCOUNT_ID`
3. **Secret**: Paste your account ID
4. Click **"Add secret"**

## ✅ Verify Secrets Are Added

You should see both secrets listed:
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

## 🚀 Trigger Deployment

Once secrets are added, you have two options:

### Option 1: Push a Commit (Automatic)

The workflow will run automatically on the next push to `main`.

### Option 2: Manual Trigger (Immediate)

1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2/actions
2. Click **"Deploy to Cloudflare Pages"** workflow in left sidebar
3. Click **"Run workflow"** button (top right)
4. Select branch: **"main"**
5. Click **"Run workflow"**

## 📊 Monitor Deployment

1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2/actions
2. Click on the running workflow
3. Watch the progress:
   - ✅ Checkout
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Build application
   - ✅ Deploy to Cloudflare Pages

## ✅ Verify Deployment

After workflow completes (2-3 minutes):

### Step 1: Check Version

```bash
curl -s "https://reflectivai-app-prod.pages.dev/version.json"
```

Should show:
```json
{
  "version": "1.0.2",
  "buildHash": "CdiFEvo6"
}
```

### Step 2: Check JavaScript Bundle

```bash
curl -s "https://reflectivai-app-prod.pages.dev/" | grep -o 'assets/main-[^"]*\.js'
```

Should show: `main-CdiFEvo6.js`

### Step 3: Verify Scenario Data

```bash
curl -s "https://reflectivai-app-prod.pages.dev/assets/main-CdiFEvo6.js" | grep -o "Sarah Thompson looks up"
```

Should output: `Sarah Thompson looks up`

### Step 4: Test in Browser

1. Go to: https://reflectivai-app-prod.pages.dev/
2. **Hard refresh**: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Navigate to **Role Play Simulator**
4. Filter by **Vaccines**
5. Find **"Adult Flu Program Optimization"**
6. **You should see**:
   - ✅ Opening scene preview in card
   - ✅ "HCP Mood: frustrated" badge
   - ✅ Context information

## 🔧 Troubleshooting

### Workflow Fails with "Invalid API Token"

- Check that `CLOUDFLARE_API_TOKEN` is correct
- Make sure token has **Cloudflare Pages → Edit** permission
- Token might have expired - create a new one

### Workflow Fails with "Account not found"

- Check that `CLOUDFLARE_ACCOUNT_ID` is correct
- Copy it directly from Cloudflare dashboard URL

### Workflow Fails with "Project not found"

- Make sure the project name is exactly: `reflectivai-app-prod`
- Check in Cloudflare dashboard: Workers & Pages → reflectivai-app-prod

### Deployment Succeeds but Site Not Updated

- Wait 1-2 minutes for Cloudflare CDN to update
- Hard refresh your browser: `Cmd + Shift + R` or `Ctrl + Shift + R`
- Try incognito window
- Check version.json to confirm new version is deployed

## 📋 Summary

**What you need to do:**

1. ✅ Get Cloudflare API Token from https://dash.cloudflare.com/profile/api-tokens
2. ✅ Get Cloudflare Account ID from dashboard URL
3. ✅ Add both secrets to GitHub repository settings
4. ✅ Manually trigger workflow OR push a commit
5. ✅ Wait 2-3 minutes for deployment
6. ✅ Hard refresh browser and test

**After this setup, every push to `main` will automatically deploy to:**
- ✅ GitHub Pages (via existing workflow)
- ✅ Cloudflare Pages (via new workflow)

**Both sites will always be in sync!** 🎉
