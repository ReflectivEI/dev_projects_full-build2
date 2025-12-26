# Cloudflare Pages Deployment Guide

This document describes how to deploy the ReflectivAI frontend to Cloudflare Pages and connect it to the Cloudflare Worker backend.

## Prerequisites

- Cloudflare account with Pages access
- Worker deployed (see `worker-parity/DEPLOY.md`)
- GitHub repository connected to Cloudflare Pages

## Deployment Steps

### 1. Create Cloudflare Pages Project

1. Log in to Cloudflare Dashboard
2. Navigate to **Pages**
3. Click **Create a project**
4. Connect to your GitHub repository: `ReflectivEI/dev_projects_full-build2`
5. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `client/dist`
   - **Root directory**: `/` (leave empty or set to root)

### 2. Set Environment Variables

**CRITICAL**: The frontend MUST have the worker URL configured to work in production.

In Cloudflare Pages, go to **Settings** > **Environment variables** and add:

#### Production Environment Variables

```bash
# REQUIRED - Points frontend to your deployed Cloudflare Worker
VITE_WORKER_URL=https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev

# OPTIONAL - Only if your worker requires authentication
VITE_API_KEY=your-optional-api-key
```

**Important Notes:**
- Replace `<your-subdomain>` with your actual Cloudflare Workers subdomain
- The worker URL must be the full HTTPS URL (no trailing slash)
- This must be set in Cloudflare Pages dashboard, NOT in a .env file
- Changes to environment variables require a new deployment to take effect

#### Preview Environment (Optional)

You can also set environment variables for preview deployments:

```bash
VITE_WORKER_URL=https://reflectivai-api-parity-staging.<your-subdomain>.workers.dev
```

### 3. Deploy

#### Automatic Deployment

Cloudflare Pages will automatically deploy when you push to your connected branch (typically `main`).

#### Manual Deployment

1. In Cloudflare Pages dashboard, go to your project
2. Click **Create deployment**
3. Select branch and commit
4. Click **Save and Deploy**

### 4. Verify Deployment

After deployment completes, verify the configuration:

1. Open browser console on your deployed site
2. Look for the log message:
   ```
   [queryClient] API Configuration: {
     VITE_WORKER_URL: "https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev",
     RESOLVED_API_BASE_URL: "https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev"
   }
   ```

3. Test the `/api/status` endpoint:
   ```bash
   curl https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev/api/status
   ```
   
   Expected response:
   ```json
   {
     "openaiConfigured": true,
     "message": "AI features are fully enabled",
     "worker": "parity-v2",
     "time": 1703001234567
   }
   ```

### 5. Smoke Test

Test critical functionality:

1. **AI Coach**: Send a message and verify you get a response with Signal Intelligence
2. **Role Play**: Start a scenario and verify:
   - Messages exchange works
   - Signal Intelligence panel populates
   - Live EQ Analysis shows scores
   - End Session provides complete feedback
3. **SQL Translator**: Translate a query
4. **Dashboard**: Verify insights load

## Troubleshooting

### Issue: `VITE_WORKER_URL = undefined` in console

**Cause**: Environment variable not set or deployment didn't pick up the change.

**Fix**:
1. Go to Cloudflare Pages > Settings > Environment variables
2. Verify `VITE_WORKER_URL` is set correctly
3. Trigger a new deployment (push a commit or manual redeploy)
4. Wait for build to complete and verify logs

### Issue: Frontend calls wrong endpoints or gets 404

**Cause**: Frontend is using relative URLs instead of worker URL.

**Fix**:
1. Check browser console for API Configuration log
2. If `RESOLVED_API_BASE_URL` is empty or incorrect, the environment variable is not set
3. Set `VITE_WORKER_URL` in Cloudflare Pages environment variables
4. Redeploy

### Issue: CORS errors

**Cause**: Worker CORS origins don't include the Cloudflare Pages domain.

**Fix**:
1. Get your Cloudflare Pages URL (e.g., `https://reflectivai-app-prod.pages.dev`)
2. Update worker CORS_ORIGINS secret:
   ```bash
   cd worker-parity
   npx wrangler secret put CORS_ORIGINS
   # Enter: https://reflectivai-app-prod.pages.dev,https://production.reflectivai-app-prod.pages.dev
   ```

### Issue: API returns 401 Unauthorized

**Cause**: Worker requires authentication but frontend doesn't have API key.

**Fix**:
1. If worker requires authentication, set `VITE_API_KEY` in Cloudflare Pages
2. Redeploy
3. Verify the Authorization header is being sent in requests

### Issue: Signal Intelligence not appearing

**Cause**: Multiple possible causes.

**Fix**:
1. Verify worker is responding with signals in the response
2. Check browser console for errors
3. Verify `/api/roleplay/respond` returns signals in response
4. Check Signal Intelligence panel in roleplay page (right sidebar on desktop)

### Issue: Live EQ Analysis is empty

**Cause**: No user messages sent yet, or worker not returning eqAnalysis.

**Fix**:
1. Send at least one message as the user in role play
2. Verify `/api/roleplay/respond` returns `eqAnalysis` field with scores
3. Check that `eqAnalysis` has empathy, adaptability, curiosity, resilience scores

### Issue: End Session feedback incomplete

**Cause**: Worker analysis endpoint not returning expected fields.

**Fix**:
1. Verify `/api/roleplay/end` returns complete analysis object
2. Check for topStrengths, priorityImprovements, nextSteps arrays
3. Frontend has fallback values if worker response is incomplete

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_WORKER_URL` | Yes (production) | `""` (local backend) | Full URL to Cloudflare Worker API |
| `VITE_API_KEY` | No | `""` | Optional API key if worker requires auth |
| `VITE_API_BASE_URL` | No | `""` | Legacy alias for `VITE_WORKER_URL` |

## Deployment Checklist

Before deploying to production:

- [ ] Worker is deployed and tested
- [ ] Worker health endpoint responds: `/health`
- [ ] Worker status endpoint responds: `/api/status`
- [ ] Worker CORS origins include Cloudflare Pages domain
- [ ] `VITE_WORKER_URL` environment variable is set in Cloudflare Pages
- [ ] Build completes successfully
- [ ] Browser console shows correct API configuration
- [ ] All critical features smoke tested (AI Coach, Role Play, SQL)
- [ ] Signal Intelligence appears in Role Play
- [ ] Live EQ Analysis shows scores
- [ ] End Session feedback is complete

## Rolling Back

If issues occur after deployment:

### Option 1: Rollback Cloudflare Pages

1. Go to Cloudflare Pages > Deployments
2. Find the last working deployment
3. Click **...** > **Rollback to this deployment**

### Option 2: Revert Environment Variable

1. Go to Settings > Environment variables
2. Change `VITE_WORKER_URL` to previous working worker
3. Trigger new deployment

### Option 3: Rollback Worker

See `worker-parity/DEPLOY.md` for worker rollback instructions.

## Monitoring

### Check Deployment Logs

1. Cloudflare Pages dashboard
2. Click on deployment
3. View build logs for errors

### Check Runtime Logs

1. Open browser console
2. Look for `[queryClient]` log messages
3. Check Network tab for API calls
4. Verify requests go to correct worker URL

### Check Worker Logs

```bash
cd worker-parity
npx wrangler tail
```

Filter for specific requests or errors.

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- Worker deployment guide: `worker-parity/DEPLOY.md`
- API specification: `cloudflare-worker-api.md`
