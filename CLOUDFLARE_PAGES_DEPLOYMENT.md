# 🚀 Deploy to Cloudflare Pages (reflectivai-app-prod.pages.dev)

## Current Status

✅ **GitHub Pages**: Up to date with latest code (commit `f669c1c`)  
❌ **Cloudflare Pages**: Out of date - needs manual deployment

## The Issue

You have TWO separate deployments:

1. **GitHub Pages** (https://reflectivei.github.io/dev_projects_full-build2/)
   - Automatically deploys via GitHub Actions on every push to `main`
   - ✅ Currently has the latest code with scenario cues

2. **Cloudflare Pages** (https://reflectivai-app-prod.pages.dev/)
   - Requires manual deployment
   - ❌ Currently has OLD code without scenario cues

## How to Deploy to Cloudflare Pages

### Option 1: Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**:
   - Visit: https://dash.cloudflare.com/
   - Log in to your account

2. **Navigate to Pages**:
   - Click **"Workers & Pages"** in left sidebar
   - Find **"reflectivai-app-prod"** project
   - Click on it

3. **Trigger New Deployment**:
   - Click **"Create deployment"** button
   - OR click **"View build configuration"** → **"Retry deployment"**

4. **Connect to GitHub** (if not already connected):
   - Click **"Connect to Git"**
   - Select **"ReflectivEI/dev_projects_full-build2"** repository
   - Branch: **"main"**

5. **Build Settings**:
   ```
   Build command: npm run build:vite
   Build output directory: dist
   Root directory: /
   ```

6. **Deploy**:
   - Click **"Save and Deploy"**
   - Wait 2-3 minutes for build to complete

### Option 2: Wrangler CLI (Advanced)

**Prerequisites:**
- Cloudflare account with API token
- Wrangler CLI installed

**Steps:**

1. **Install Wrangler** (if not installed):
   ```bash
   npm install -D wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   npx wrangler login
   ```

3. **Build the app**:
   ```bash
   npm run build:vite
   ```

4. **Deploy to Pages**:
   ```bash
   npx wrangler pages deploy dist --project-name=reflectivai-app-prod
   ```

5. **Verify deployment**:
   ```bash
   curl -s "https://reflectivai-app-prod.pages.dev/version.json"
   ```

   Should show:
   ```json
   {
     "version": "1.0.2",
     "commit": "CACHE_BUST_DEPLOYMENT"
   }
   ```

### Option 3: Automatic Deployments (Recommended)

**Set up automatic deployments from GitHub:**

1. **In Cloudflare Dashboard**:
   - Go to **"reflectivai-app-prod"** project
   - Click **"Settings"** tab
   - Click **"Builds & deployments"**

2. **Enable Automatic Deployments**:
   - Toggle **"Automatic deployments"** ON
   - Production branch: **"main"**
   - Preview branches: **"All branches"** (optional)

3. **Configure Build**:
   ```
   Build command: npm run build:vite
   Build output directory: dist
   Root directory: /
   Node version: 18 or higher
   ```

4. **Save Settings**

Now every push to `main` will automatically deploy to both:
- ✅ GitHub Pages (via GitHub Actions)
- ✅ Cloudflare Pages (via Cloudflare integration)

## Verification After Deployment

### Step 1: Check Version

```bash
curl -s "https://reflectivai-app-prod.pages.dev/version.json"
```

Should show version `1.0.2` with commit `CACHE_BUST_DEPLOYMENT`

### Step 2: Check JavaScript Bundle

```bash
curl -s "https://reflectivai-app-prod.pages.dev/" | grep -o 'assets/main-[^"]*\.js'
```

Should show `main-CdiFEvo6.js` (the latest bundle)

### Step 3: Verify Scenario Data

```bash
curl -s "https://reflectivai-app-prod.pages.dev/assets/main-CdiFEvo6.js" | grep -o "Sarah Thompson looks up"
```

Should output: `Sarah Thompson looks up`

### Step 4: Test in Browser

1. Go to: https://reflectivai-app-prod.pages.dev/
2. Navigate to **Role Play Simulator**
3. Filter by **Vaccines**
4. Find **"Adult Flu Program Optimization"**
5. **You should see**:
   - ✅ Opening scene preview in card
   - ✅ "HCP Mood: frustrated" badge
   - ✅ Context information

## Current Build Output

The latest build (commit `f669c1c`) produces:

```
dist/
├── index.html (1.08 kB)
├── assets/
│   ├── main-BgWDowy8.css (84.93 kB)
│   ├── index-Cbacc3qV.js (2.20 kB)
│   └── main-CdiFEvo6.js (1,188.85 kB) ← Contains scenario data
└── version.json
```

**Important:** The `main-CdiFEvo6.js` file contains all the scenario cue data including:
- ✅ Sarah Thompson opening scene
- ✅ openingScene field
- ✅ hcpMood field
- ✅ context field

## Why Two Deployment Systems?

**GitHub Pages:**
- Free hosting for static sites
- Automatic deployment via GitHub Actions
- Good for development/testing
- URL: `reflectivei.github.io/dev_projects_full-build2/`

**Cloudflare Pages:**
- Production-grade hosting
- Better performance (global CDN)
- Custom domain support
- URL: `reflectivai-app-prod.pages.dev`

## Recommendation

**Set up automatic deployments** (Option 3) so you don't have to manually deploy to Cloudflare Pages every time you push code.

This way, both sites will always be in sync:
- Push to `main` → GitHub Actions deploys to GitHub Pages
- Push to `main` → Cloudflare deploys to Cloudflare Pages

## Next Steps

1. **Deploy to Cloudflare Pages** using one of the options above
2. **Verify** the deployment using the verification steps
3. **Set up automatic deployments** to avoid this issue in the future
4. **Test** the live site at https://reflectivai-app-prod.pages.dev/

---

## Quick Deploy Command

If you have Wrangler configured:

```bash
# Build and deploy in one command
npm run build:vite && npx wrangler pages deploy dist --project-name=reflectivai-app-prod
```

Then verify:

```bash
curl -s "https://reflectivai-app-prod.pages.dev/version.json"
```

**The code is ready. You just need to deploy it to Cloudflare Pages!** 🚀
