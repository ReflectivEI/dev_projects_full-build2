# Worker-Parity Deployment Guide

## Production Deployment

### Prerequisites
- Wrangler CLI installed (`npm install -g wrangler` or use `npx wrangler`)
- Cloudflare account access
- KV namespace already exists (ID: `75ab38c3bd1d4c37a0f91d4ffc5909a7`)

### Step 1: Set Required Secrets

From the `worker-parity/` directory, set these secrets:

```bash
npx wrangler secret put PROVIDER_URL
# Enter: Your OpenAI-compatible API endpoint (e.g., https://api.openai.com/v1/chat/completions)

npx wrangler secret put PROVIDER_MODEL
# Enter: Model name (e.g., gpt-4o)

npx wrangler secret put PROVIDER_KEY
# Enter: Your API key

npx wrangler secret put CORS_ORIGINS
# Enter: https://reflectivai-app-prod.pages.dev,https://production.reflectivai-app-prod.pages.dev
```

### Step 2: Deploy

```bash
cd worker-parity
npx wrangler deploy
```

**Expected output:**
```
✨ Success! Uploaded worker 'reflectivai-api-parity-prod'
  https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev
```

### Step 3: Verify Deployment

After deployment, verify the worker is responding correctly:

#### Option 1: Run Automated Test Script (Recommended)

```bash
cd worker-parity
./test-endpoints.sh https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev
```

This will test all critical endpoints including `/health`, `/api/status`, CORS, and session handling.

#### Option 2: Manual Testing

```bash
# Health check (should return worker info)
curl https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev/health

# API Status check (required by API spec)
curl https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev/api/status

# Test CORS headers (should include Access-Control-Allow-Origin)
curl -I -X OPTIONS https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev/api/chat/send \
  -H "Origin: https://reflectivai-app-prod.pages.dev" \
  -H "Access-Control-Request-Method: POST"
```

---

## Pre-Deployment Validation Checklist

Before deploying to production, ensure:

### Configuration
- [ ] KV namespace `SESS` is bound with ID `75ab38c3bd1d4c37a0f91d4ffc5909a7`
- [ ] Worker name is `reflectivai-api-parity-prod` in `wrangler.toml`
- [ ] Compatibility date is current (currently `2025-12-21`)

### Secrets
- [ ] `PROVIDER_URL` is set to correct OpenAI-compatible endpoint
- [ ] `PROVIDER_MODEL` is set to appropriate model (e.g., `gpt-4o`)
- [ ] `PROVIDER_KEY` is set with valid API key
- [ ] `CORS_ORIGINS` includes all production domain variants

### Code Quality
- [ ] All TypeScript code compiles without errors
- [ ] No console.log statements left in production code (use structured logging)
- [ ] Error handling is comprehensive for all API endpoints

### API Endpoints
- [ ] `/api/chat/send` - Chat message with signal intelligence
- [ ] `/api/chat/summarize` - Session summary generation
- [ ] `/api/roleplay/start` - Roleplay session initialization
- [ ] `/api/roleplay/respond` - Roleplay message with EQ analysis
- [ ] `/api/roleplay/end` - End-of-session analysis
- [ ] `/api/modules/start` - Module exercise initialization
- [ ] `/api/modules/submit` - Module exercise submission
- [ ] `/api/dashboard/insights` - Dashboard insights generation

### Security
- [ ] CORS origins are explicitly set (no wildcards in production)
- [ ] API keys are stored as secrets (never in code)
- [ ] Input validation is in place for all endpoints
- [ ] Rate limiting is considered (via Cloudflare dashboard if needed)

### Monitoring
- [ ] Cloudflare Workers analytics dashboard is accessible
- [ ] Error logging is configured and monitored
- [ ] Have rollback plan ready (previous worker version or alternative endpoint)

---

## Post-Deployment Steps

### 1. Update Frontend Configuration

Update the Cloudflare Pages environment variable:

```bash
# In Cloudflare Pages dashboard for reflectivai-app-prod:
VITE_WORKER_URL=https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev
```

### 2. Smoke Test All Endpoints

Test each endpoint with sample data:

```bash
# Example: Test chat endpoint
curl -X POST https://reflectivai-api-parity-prod.<your-subdomain>.workers.dev/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Origin: https://reflectivai-app-prod.pages.dev" \
  -d '{
    "sessionId": "test-session",
    "message": "Hello, this is a test message",
    "history": []
  }'
```

### 3. Monitor Initial Traffic

- Check Cloudflare Workers analytics for:
  - Request volume
  - Error rates
  - Response times
  - KV operation counts

### 4. Validate Signal Intelligence Quality

- Review initial chat sessions for:
  - Appropriate signal generation (0-3 signals per message)
  - Signal quality (specific evidence, uncertain interpretation)
  - No forced signals on routine exchanges

### 5. Validate EQ Metrics

- Review roleplay sessions for:
  - Coherent EQ scores (empathy, adaptability, curiosity, resilience on 0-5 scale)
  - Strengths/improvements align with scores
  - Behavior-specific observations

---

## Rollback Plan

If issues are detected post-deployment:

### Option 1: Revert Frontend Variable
```bash
# Revert VITE_WORKER_URL to previous worker
VITE_WORKER_URL=https://previous-worker.<your-subdomain>.workers.dev
```

### Option 2: Rollback Worker
```bash
# List recent deployments
npx wrangler deployments list

# Rollback to previous version
npx wrangler rollback [DEPLOYMENT_ID]
```

---

## Troubleshooting

### Issue: Worker not responding
**Check:**
- Worker is deployed: `npx wrangler deployments list`
- Secrets are set: `npx wrangler secret list`
- KV namespace is bound: Check `wrangler.toml`

### Issue: CORS errors
**Check:**
- `CORS_ORIGINS` secret includes the requesting origin
- Origin header matches exactly (including protocol and subdomain)
- Preflight OPTIONS requests are handled

### Issue: API errors or timeouts
**Check:**
- `PROVIDER_URL` is reachable and correct
- `PROVIDER_KEY` is valid and not expired
- Provider API is not rate-limited
- Cloudflare Workers logs for specific errors: `npx wrangler tail`

### Issue: KV errors
**Check:**
- KV namespace ID matches in `wrangler.toml`
- KV namespace exists and is accessible
- No KV storage limits reached

---

## Maintenance

### Updating Secrets
```bash
# Update individual secrets as needed
cd worker-parity
npx wrangler secret put PROVIDER_KEY  # Update API key
npx wrangler secret put CORS_ORIGINS  # Add new origins
```

### Viewing Logs
```bash
# Stream live logs
cd worker-parity
npx wrangler tail

# Filter for errors only
npx wrangler tail --status error
```

### Monitoring KV Usage
```bash
# Check KV namespace details in Cloudflare dashboard
# Workers > KV > SESS namespace > View usage statistics
```

---

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [KV Storage Documentation](https://developers.cloudflare.com/kv/)
- Worker improvements documentation: `worker-parity/IMPROVEMENTS.md`
