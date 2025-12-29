# Cloudflare Worker Deployment Guide

## Overview

This guide explains how to deploy your ReflectivAI Cloudflare Worker backend to enable full AI functionality.

---

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install globally
   ```bash
   npm install -g wrangler
   ```
3. **Groq API Keys**: Get from [console.groq.com](https://console.groq.com)

---

## Step 1: Create Worker Project

### 1.1 Create Worker Directory

```bash
mkdir cloudflare-worker
cd cloudflare-worker
```

### 1.2 Initialize Wrangler

```bash
wrangler init reflectivai-worker
cd reflectivai-worker
```

### 1.3 Copy Your Worker Code

Create `src/index.js` and paste your complete worker code (the code you provided).

---

## Step 2: Configure wrangler.toml

Create `wrangler.toml` in the worker directory:

```toml
name = "reflectivai-worker"
main = "src/index.js"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]

# Environment variables (non-sensitive)
[vars]
PROVIDER_URL = "https://api.groq.com/openai/v1/chat/completions"
PROVIDER_MODEL = "llama-3.1-70b-versatile"
MAX_OUTPUT_TOKENS = "1600"
RATELIMIT_WINDOW_MINUTES = "1"
RATELIMIT_MAX_REQUESTS = "10"
RATELIMIT_RETRY_AFTER = "2"
DEBUG_MODE = "false"

# CORS origins (add your domains)
CORS_ORIGINS = "https://reflectivei.github.io,https://yxpzdb7o9z.preview.c24.airoapp.ai"

# KV namespace for session storage (optional)
[[kv_namespaces]]
binding = "SESS"
id = "YOUR_KV_NAMESPACE_ID"
```

---

## Step 3: Set Environment Secrets

### 3.1 Add Groq API Keys

```bash
# Add your Groq API keys (you can add multiple for load balancing)
wrangler secret put PROVIDER_API_KEY
# Enter your first Groq API key when prompted

wrangler secret put GROQ_KEY_1
# Enter your second Groq API key (optional)

wrangler secret put GROQ_KEY_2
# Enter your third Groq API key (optional)
```

### 3.2 Create KV Namespace (Optional)

For session storage:

```bash
wrangler kv:namespace create "SESS"
# Copy the namespace ID and add it to wrangler.toml
```

---

## Step 4: Deploy Worker

### 4.1 Deploy to Production

```bash
wrangler deploy
```

You'll get a URL like:
```
https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev
```

### 4.2 Test Deployment

```bash
# Test health endpoint
curl https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev/health

# Test with deep health check
curl https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev/health?deep=true

# Test version endpoint
curl https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev/version
```

---

## Step 5: Update Frontend Configuration

### 5.1 Update .env File

Update your ReflectivAI frontend `.env` file:

```bash
# Cloudflare Worker URL (replace with your actual worker URL)
VITE_WORKER_URL=https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev

# Remove or comment out mock API configuration
# VITE_API_BASE_URL=http://localhost:20000
```

### 5.2 Update .env.production

Create or update `.env.production`:

```bash
# Production Cloudflare Worker
VITE_WORKER_URL=https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev

# Application
VITE_APP_NAME=ReflectivAI
VITE_PUBLIC_URL=https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced

# Features
VITE_ENABLE_SOURCE_MAPPING=false
VITE_ENABLE_SSR=false
```

### 5.3 Disable Mock API

Update `src/lib/mockApi.ts`:

```typescript
// Change this line:
export const MOCK_API_ENABLED = false; // Disable mock API when using real worker
```

---

## Step 6: Rebuild and Deploy Frontend

### 6.1 Rebuild with Production Config

```bash
npm run build
```

### 6.2 Test Locally

```bash
npm run preview
```

Verify that the app connects to your Cloudflare Worker.

### 6.3 Deploy to GitHub Pages

```bash
git add .
git commit -m "feat: integrate Cloudflare Worker backend"
git push origin main
```

Wait for GitHub Actions to complete deployment.

---

## Step 7: Verify Integration

### 7.1 Check Worker Logs

```bash
wrangler tail
```

This will show real-time logs from your worker.

### 7.2 Test API Endpoints

Open your deployed site and test:

1. **Dashboard**: Should load insights data
2. **Chat**: Send a message to AI Coach
3. **Roleplay**: Start a roleplay scenario
4. **Browser Console**: Check for API errors

### 7.3 Monitor Network Requests

Open DevTools → Network tab:
- Verify requests go to `reflectivai-worker.YOUR_SUBDOMAIN.workers.dev`
- Check response status codes (should be 200)
- Verify response data structure

---

## Environment Variables Reference

### Required Secrets (set via wrangler secret)

| Variable | Description | Example |
|----------|-------------|----------|
| `PROVIDER_API_KEY` | Primary Groq API key | `gsk_...` |
| `GROQ_KEY_1` | Additional Groq key (optional) | `gsk_...` |
| `GROQ_KEY_2` | Additional Groq key (optional) | `gsk_...` |

### Public Variables (set in wrangler.toml)

| Variable | Description | Default |
|----------|-------------|----------|
| `PROVIDER_URL` | Groq API endpoint | `https://api.groq.com/openai/v1/chat/completions` |
| `PROVIDER_MODEL` | LLM model name | `llama-3.1-70b-versatile` |
| `MAX_OUTPUT_TOKENS` | Max response length | `1600` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | Your domains |
| `RATELIMIT_WINDOW_MINUTES` | Rate limit window | `1` |
| `RATELIMIT_MAX_REQUESTS` | Max requests per window | `10` |
| `DEBUG_MODE` | Enable debug logging | `false` |

---

## API Endpoints

Your worker exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check (returns "ok") |
| `/health?deep=true` | GET | Deep health check (tests Groq API) |
| `/version` | GET | Worker version info |
| `/debug/ei` | GET | Debug endpoint info |
| `/facts` | POST | Fetch facts by disease/topic |
| `/plan` | POST | Generate conversation plan |
| `/chat` | POST | Send chat message (main endpoint) |
| `/coach-metrics` | POST | Record coaching metrics |

---

## Troubleshooting

### Issue: CORS Errors

**Symptom**: Browser console shows CORS errors

**Solution**:
1. Add your domain to `CORS_ORIGINS` in `wrangler.toml`
2. Redeploy worker: `wrangler deploy`
3. Clear browser cache and reload

### Issue: 401 Unauthorized

**Symptom**: API returns 401 errors

**Solution**:
1. Verify Groq API keys are set: `wrangler secret list`
2. Test keys manually: `curl -H "Authorization: Bearer YOUR_KEY" https://api.groq.com/openai/v1/models`
3. Re-add keys if needed: `wrangler secret put PROVIDER_API_KEY`

### Issue: 429 Rate Limited

**Symptom**: API returns 429 errors

**Solution**:
1. Add more Groq API keys (GROQ_KEY_1, GROQ_KEY_2, etc.)
2. Increase rate limit in `wrangler.toml`: `RATELIMIT_MAX_REQUESTS = "20"`
3. Redeploy worker

### Issue: Worker Not Responding

**Symptom**: Requests timeout or fail

**Solution**:
1. Check worker logs: `wrangler tail`
2. Verify deployment: `wrangler deployments list`
3. Test health endpoint: `curl https://YOUR_WORKER_URL/health`
4. Check Cloudflare dashboard for errors

### Issue: Mock API Still Active

**Symptom**: App uses mock data instead of real API

**Solution**:
1. Update `src/lib/mockApi.ts`: Set `MOCK_API_ENABLED = false`
2. Verify `.env` has `VITE_WORKER_URL` set
3. Rebuild: `npm run build`
4. Clear browser cache

---

## Custom Domain (Optional)

To use a custom domain like `api.reflectivai.com`:

### 1. Add Route in Cloudflare Dashboard

1. Go to Workers & Pages → Your Worker
2. Click "Triggers" tab
3. Add Custom Domain: `api.reflectivai.com`
4. Cloudflare will automatically provision SSL

### 2. Update Frontend Config

```bash
# .env.production
VITE_WORKER_URL=https://api.reflectivai.com
```

### 3. Rebuild and Deploy

```bash
npm run build
git add .
git commit -m "feat: use custom domain for API"
git push origin main
```

---

## Monitoring and Analytics

### View Worker Analytics

1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages → Your Worker
3. Click "Metrics" tab
4. View:
   - Request count
   - Error rate
   - CPU time
   - Response time

### Enable Logpush (Optional)

For advanced logging:

```bash
wrangler logpush create
```

---

## Cost Estimation

### Cloudflare Workers Pricing

- **Free Tier**: 100,000 requests/day
- **Paid Plan**: $5/month for 10 million requests
- **KV Storage**: $0.50/GB/month

### Groq API Pricing

- **Free Tier**: Limited requests/day
- **Paid Plans**: Pay per token
- Check [console.groq.com/pricing](https://console.groq.com/pricing)

---

## Next Steps

1. ✅ Deploy Cloudflare Worker
2. ✅ Configure environment variables
3. ✅ Update frontend to use worker URL
4. ✅ Test all API endpoints
5. ✅ Monitor worker performance
6. ⬜ Set up custom domain (optional)
7. ⬜ Configure analytics (optional)
8. ⬜ Set up monitoring alerts (optional)

---

## Support

If you encounter issues:

1. Check worker logs: `wrangler tail`
2. Review Cloudflare dashboard for errors
3. Test endpoints with curl
4. Verify environment variables
5. Check CORS configuration

---

**Deployment Date**: December 29, 2025  
**Worker Version**: r10.1  
**Status**: Ready for deployment
