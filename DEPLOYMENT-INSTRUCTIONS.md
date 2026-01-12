# CRITICAL DEPLOYMENT INSTRUCTIONS

## ROOT CAUSE: Why Changes Weren't Visible on Live Site

### The Problem
After merging the PR with UI terminology updates, the changes were **NOT visible on the live production site** because:

1. **Manual Deployment Required**: The Cloudflare Pages deployment workflow (`.github/workflows/deploy-frontend.yml`) is configured as **MANUAL ONLY** (`workflow_dispatch`)
2. **No Automatic Deployment**: Unlike GitHub Pages which deploys automatically on push to `main`, Cloudflare Pages requires explicit manual triggering
3. **Changes Only in Repository**: The merged changes were only in the GitHub repository, not deployed to the live Cloudflare Pages site

### The Fix
Two deployment options are available:

---

## OPTION 1: Deploy via GitHub Actions (RECOMMENDED)

### Steps to Deploy to Production:

1. **Go to GitHub Actions**
   - Navigate to: `https://github.com/ReflectivEI/dev_projects_full-build2/actions`
   
2. **Select the Deployment Workflow**
   - Click on "Deploy Frontend to Cloudflare Pages (MANUAL ONLY)" in the left sidebar

3. **Trigger Manual Deployment**
   - Click "Run workflow" button (top right)
   - Select branch: `main`
   - Choose environment: `production`
   - Type confirmation: `DEPLOY`
   - Click "Run workflow"

4. **Wait for Completion**
   - Watch the workflow run complete (typically 2-3 minutes)
   - Verify success in the workflow logs

5. **Verify on Live Site**
   - Visit: `https://reflectivai-app-prod.pages.dev/`
   - **IMPORTANT**: Hard refresh the page (Ctrl+Shift+R on Windows/Linux, Cmd+Shift+R on Mac)
   - Browser cache can show old content - hard refresh bypasses cache

### Staging Deployment (for testing before production):

Same steps as above, but:
- Choose environment: `staging`
- Test at: `https://reflectivai-app-staging.pages.dev/`

---

## OPTION 2: Deploy Locally Using Wrangler

### Prerequisites:
- Cloudflare API Token configured
- Cloudflare Account ID known
- Wrangler CLI installed

### Steps:

```bash
# From repository root
cd client

# Build the frontend
npm run build

# Deploy to production
npx wrangler pages deploy dist --project-name=reflectivai-app-prod --branch=main

# OR deploy to staging
npx wrangler pages deploy dist --project-name=reflectivai-app-staging --branch=staging
```

---

## Changes Made in This PR

### UI Terminology Updates (User-Visible Only):

✅ **Pages Updated:**
- `client/src/pages/modules.tsx`:
  - "Related EI Frameworks" → "Related Signal Intelligence Frameworks"
  - Tab label "EI" → "Signal Intelligence"

- `client/src/pages/frameworks.tsx`:
  - "Layer 1: EI Frameworks" → "Layer 1: Signal Intelligence Frameworks"
  - "EI Skill" badge → "Signal Intelligence Skill"
  - "EI skills help..." → "Signal Intelligence skills help..."
  - "EI Principles:" → "Signal Intelligence Principles:"

- `client/src/components/roleplay-feedback-dialog.tsx`:
  - "EQ Score (Aggregate)" → "Signal Intelligence Score (Aggregate)"
  - "EI Metrics" tab → "Behavioral Metrics"

- `client/src/pages/roleplay.tsx`:
  - Comment updated for clarity (no user-visible change)

### What Was NOT Changed (As Required):
❌ Internal variable names (e.g., `eqMetrics`, `eqFrameworks`, `eqScores`)
❌ Function names (e.g., `readEnabledEIMetricIds`, `writeEnabledEIMetricIds`)
❌ File names (e.g., `eiMetricSettings.ts`)
❌ Import/export statements
❌ Data structures
❌ Logic or calculations

---

## Post-Deployment Checklist

After deploying, verify these changes are visible on the live site:

- [ ] Navigate to Modules page - tab shows "Signal Intelligence" instead of "EI"
- [ ] Open a module detail - shows "Related Signal Intelligence Frameworks"
- [ ] Navigate to Frameworks page - Layer 1 tab shows "Signal Intelligence Frameworks"
- [ ] In roleplay feedback - aggregate score shows "Signal Intelligence Score"
- [ ] In roleplay feedback - tab shows "Behavioral Metrics"
- [ ] Hard refresh browser to clear cache (Ctrl+Shift+R / Cmd+Shift+R)

---

## Prevention: Automated Deployments

### Current Setup (Manual):
- **GitHub Pages**: Deploys automatically to `github-pages` environment
- **Cloudflare Pages**: Requires manual workflow trigger (SAFETY FEATURE)

### Why Manual Deployment?
The `deploy-frontend.yml` workflow is intentionally configured as manual-only to:
1. Prevent accidental production deployments
2. Ensure changes are tested on staging first
3. Provide explicit control over production releases

### To Enable Automatic Deployments (NOT RECOMMENDED):
If you want automatic deployments on merge to `main`, modify `.github/workflows/deploy-frontend.yml`:

```yaml
# Change from:
on:
  workflow_dispatch:

# To:
on:
  push:
    branches:
      - main
  workflow_dispatch:  # Keep manual trigger as backup
```

**WARNING**: This removes the safety confirmation and will deploy every push to main automatically.

---

## Cost Impact

### Why This Was Expensive:
1. **Development Time**: Multiple attempts to figure out why changes weren't visible
2. **Confusion**: Root cause was deployment process, not code changes
3. **Delay**: Changes sat undeployed while appearing "complete" in repository

### Solution:
- **Always trigger deployment** after merging UI changes
- **Document deployment requirements** clearly (this document)
- **Test on staging first** before production deployment
- **Hard refresh browser** after deployment to clear cache

---

## Support

If deployment fails:
1. Check GitHub Actions logs for error messages
2. Verify Cloudflare API token has correct permissions
3. Confirm project names match: `reflectivai-app-prod` / `reflectivai-app-staging`
4. Check Cloudflare Pages dashboard for deployment status

Cloudflare Pages Dashboard: https://dash.cloudflare.com/
