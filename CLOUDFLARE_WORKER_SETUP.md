# Cloudflare Worker Setup Guide

**Project:** ReflectivAI  
**Worker Name:** `saleseq-coach-prod`  
**Worker URL:** `https://saleseq-coach-prod.tonyabdelmalak.workers.dev`  
**Worker Path:** `/worker/`  
**Configuration File:** `worker/wrangler.toml`  
**Main Script:** `worker/index.js`

---

## Overview

The ReflectivAI Cloudflare Worker provides the AI-powered backend for:
- Chat coaching with Signal Intelligence™
- Roleplay simulations with behavioral analysis
- Dashboard insights and daily focus
- SQL translation
- Knowledge base Q&A
- Sales frameworks and heuristics

---

## Prerequisites

1. **Cloudflare Account** - Free tier works for development
2. **Wrangler CLI** - Cloudflare's deployment tool
3. **Groq API Key** - Primary AI provider (free tier available)
4. **OpenAI API Key** (optional) - Fallback provider

---

## Step-by-Step Setup

### Step 1: Install Wrangler CLI

```bash
# Install globally
npm install -g wrangler

# Verify installation
wrangler --version
```

### Step 2: Login to Cloudflare

```bash
# Authenticate with Cloudflare
wrangler login

# This will open a browser window to authorize
# Follow the prompts to complete authentication
```

### Step 3: Create KV Namespace

KV (Key-Value) storage is used for session management.

```bash
# Navigate to worker directory
cd worker

# Create KV namespace
wrangler kv:namespace create "SESS"

# Output will look like:
# ⛅️ wrangler 3.x.x
# 🌀 Creating namespace with title "reflectivai-worker-SESS"
# ✨ Success!
# Add the following to your configuration file in your kv_namespaces array:
# [[kv_namespaces]]
# binding = "SESS"
# id = "abc123def456ghi789jkl012mno345pq"
```

**IMPORTANT:** Copy the `id` value from the output.

### Step 4: Update wrangler.toml

Edit `worker/wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID` with the ID from Step 3:

```toml
[[kv_namespaces]]
binding = "SESS"
id = "abc123def456ghi789jkl012mno345pq"  # ← Replace with your actual ID
```

### Step 5: Set API Key Secrets

Secrets are encrypted environment variables that are never exposed in code.

#### Option A: Single Groq API Key

```bash
# Set single API key
wrangler secret put PROVIDER_KEY

# When prompted, paste your Groq API key:
# gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Option B: Multiple Groq API Keys (Load Balancing)

```bash
# Set multiple keys (semicolon separated)
wrangler secret put PROVIDER_KEYS

# When prompted, paste keys separated by semicolons:
# gsk_key1;gsk_key2;gsk_key3
```

#### Option C: OpenAI Fallback (Optional)

```bash
# Set OpenAI API key as fallback
wrangler secret put OPENAI_API_KEY

# When prompted, paste your OpenAI API key:
# sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** You need either `PROVIDER_KEY` or `PROVIDER_KEYS`. `OPENAI_API_KEY` is optional.

### Step 6: Update CORS Origins (Optional)

If you have custom domains, add them to `wrangler.toml`:

```toml
[vars]
CORS_ORIGINS = "https://reflectivei.github.io,https://yxpzdb7o9z.preview.c24.airoapp.ai,https://your-custom-domain.com,http://localhost:5173"
```

**Current domains configured:**
- `https://reflectivei.github.io` - GitHub Pages
- `https://yxpzdb7o9z.preview.c24.airoapp.ai` - Preview environment
- `https://reflectivai-app-prod.pages.dev` - Production Cloudflare Pages
- `https://production.reflectivai-app-prod.pages.dev` - Production subdomain
- `http://localhost:5173` - Local development (Vite)
- `http://localhost:3000` - Local development (alternative)

### Step 7: Deploy Worker

```bash
# Deploy to Cloudflare
wrangler deploy

# Output will show:
# ⛅️ wrangler 3.x.x
# Total Upload: XX.XX KiB / gzip: XX.XX KiB
# Uploaded reflectivai-worker (X.XX sec)
# Published reflectivai-worker (X.XX sec)
#   https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev
# Current Deployment ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**IMPORTANT:** Copy the worker URL from the output.

### Step 8: Test Deployment

```bash
# Set worker URL (replace with your actual URL)
export WORKER_URL="https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev"

# Test health endpoint
curl "$WORKER_URL/health"

# Expected response:
# {"ok":true,"status":"ok","worker":"reflectivai-v2","aiConfigured":true,"message":"AI provider configured"}

# Test status endpoint
curl "$WORKER_URL/api/status"

# Test dashboard insights
curl "$WORKER_URL/api/dashboard/insights"
```

### Step 9: Update Frontend Configuration

Update your frontend to use the worker URL:

**Option A: Environment Variable**

Create or update `.env` file:
```bash
VITE_API_BASE_URL=https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev
```

**Option B: Configuration File**

Update `src/lib/api-client.ts` or similar:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://reflectivai-worker.YOUR_SUBDOMAIN.workers.dev';
```

---

## Required Environment Variables

### Secrets (Set via `wrangler secret put`)

| Variable | Description | Required | Format | Example |
|----------|-------------|----------|--------|----------|
| `PROVIDER_KEY` | Single Groq API key | Yes* | `gsk_...` | `gsk_abc123...` |
| `PROVIDER_KEYS` | Multiple Groq keys (semicolon separated) | Yes* | `gsk_...;gsk_...` | `gsk_key1;gsk_key2` |
| `OPENAI_API_KEY` | OpenAI fallback key | No | `sk-...` | `sk-abc123...` |

*Either `PROVIDER_KEY` or `PROVIDER_KEYS` is required

### Public Variables (In `wrangler.toml`)

| Variable | Description | Default | Customizable |
|----------|-------------|---------|-------------|
| `PROVIDER_URL` | Groq API endpoint | `https://api.groq.com/openai/v1/chat/completions` | No |
| `PROVIDER_MODEL` | Groq model name | `llama-3.3-70b-versatile` | Yes |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | See wrangler.toml | Yes |

### KV Namespace (In `wrangler.toml`)

| Binding | Description | Required | Setup Command |
|---------|-------------|----------|---------------|
| `SESS` | Session storage | Yes | `wrangler kv:namespace create "SESS"` |

---

## Getting API Keys

### Groq API Key (Primary Provider)

1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)
6. **Free tier:** 14,400 requests/day, 30 requests/minute

### OpenAI API Key (Optional Fallback)

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **Note:** OpenAI requires payment setup

---

## Verification Checklist

Before deploying to production, verify:

- [ ] Wrangler CLI installed and authenticated
- [ ] KV namespace created and ID added to `wrangler.toml`
- [ ] At least one API key secret set (`PROVIDER_KEY` or `PROVIDER_KEYS`)
- [ ] CORS origins include your production domain
- [ ] Worker deployed successfully
- [ ] Health endpoint returns `{"ok":true}`
- [ ] Status endpoint returns endpoint list
- [ ] Frontend configured with worker URL
- [ ] Test chat endpoint works
- [ ] Test roleplay endpoint works

---

## Common Commands

### Deployment

```bash
# Deploy worker
wrangler deploy

# Deploy with specific environment
wrangler deploy --env production
```

### Secrets Management

```bash
# List all secrets
wrangler secret list

# Add/update secret
wrangler secret put SECRET_NAME

# Delete secret
wrangler secret delete SECRET_NAME
```

### KV Management

```bash
# List KV namespaces
wrangler kv:namespace list

# List keys in namespace
wrangler kv:key list --namespace-id YOUR_KV_NAMESPACE_ID

# Get specific key value
wrangler kv:key get "sess:SESSION_ID" --namespace-id YOUR_KV_NAMESPACE_ID

# Delete key
wrangler kv:key delete "sess:SESSION_ID" --namespace-id YOUR_KV_NAMESPACE_ID
```

### Monitoring

```bash
# View real-time logs
wrangler tail

# Filter logs by status
wrangler tail --status error

# Filter logs by method
wrangler tail --method POST

# View recent logs (last 5 minutes)
wrangler tail --since 5m
```

### Deployments

```bash
# List deployments
wrangler deployments list

# View specific deployment
wrangler deployments view DEPLOYMENT_ID

# Rollback to previous deployment
wrangler rollback DEPLOYMENT_ID
```

---

## Troubleshooting

### Issue: "KV namespace not found"

**Cause:** KV namespace ID not set or incorrect in `wrangler.toml`

**Solution:**
```bash
# List KV namespaces
wrangler kv:namespace list

# Copy the correct ID and update wrangler.toml
# [[kv_namespaces]]
# binding = "SESS"
# id = "YOUR_ACTUAL_KV_NAMESPACE_ID"

# Redeploy
wrangler deploy
```

### Issue: "401 Unauthorized" from AI provider

**Cause:** API key not set or invalid

**Solution:**
```bash
# Verify secrets are set
wrangler secret list

# Re-add API key
wrangler secret put PROVIDER_KEY
# Paste your Groq API key when prompted

# Redeploy
wrangler deploy
```

### Issue: CORS errors in browser

**Cause:** Frontend domain not in CORS_ORIGINS

**Solution:**
```bash
# Edit wrangler.toml and add your domain to CORS_ORIGINS
[vars]
CORS_ORIGINS = "https://reflectivei.github.io,https://your-domain.com"

# Redeploy
wrangler deploy
```

### Issue: Worker not responding

**Cause:** Deployment failed or worker crashed

**Solution:**
```bash
# Check deployment status
wrangler deployments list

# View recent logs
wrangler tail --since 10m

# Redeploy
wrangler deploy
```

### Issue: "Rate limit exceeded"

**Cause:** Groq free tier limits reached

**Solution:**
- Use multiple API keys with `PROVIDER_KEYS` for load balancing
- Add OpenAI as fallback with `OPENAI_API_KEY`
- Upgrade Groq plan

---

## API Endpoints

Once deployed, the worker provides these endpoints:

### Health & Status
- `GET /health` - Health check
- `GET /api/status` - Detailed status with endpoint list

### Chat Coaching
- `POST /api/chat/send` - Send coaching message
- `GET /api/chat/messages` - Get conversation history
- `POST /api/chat/clear` - Clear chat history
- `GET|POST /api/chat/summary` - Generate session summary

### Roleplay Simulations
- `POST /api/roleplay/start` - Start roleplay scenario
- `POST /api/roleplay/respond` - Send rep message, get HCP response
- `POST /api/roleplay/end` - End roleplay, get comprehensive feedback
- `GET /api/roleplay/session` - Get active session

### Dashboard & Insights
- `GET /api/dashboard/insights` - Daily coaching insights
- `GET /api/daily-focus` - Personalized daily focus

### SQL Translation
- `POST /api/sql/translate` - Natural language to SQL
- `GET /api/sql/history` - Query history

### Knowledge & Frameworks
- `POST /api/knowledge/ask` - Knowledge base Q&A
- `POST /api/frameworks/advice` - Apply sales frameworks
- `POST /api/heuristics/customize` - Customize heuristics
- `POST /api/modules/exercise` - Generate training exercises

### Coach Prompts
- `GET|POST /api/coach/prompts` - Context-aware conversation starters

**Full API documentation:** See `worker/README.md`

---

## Production Deployment Checklist

### Pre-Deployment
- [ ] All secrets configured
- [ ] KV namespace created and configured
- [ ] CORS origins include production domain
- [ ] Worker tested in local environment (`wrangler dev`)
- [ ] API endpoints tested with curl/Postman

### Deployment
- [ ] Run `wrangler deploy`
- [ ] Verify deployment URL
- [ ] Test health endpoint
- [ ] Test critical endpoints (chat, roleplay)
- [ ] Update frontend with worker URL

### Post-Deployment
- [ ] Monitor logs for errors (`wrangler tail`)
- [ ] Test end-to-end user flows
- [ ] Verify CORS works from production domain
- [ ] Check KV storage is working
- [ ] Set up monitoring/alerting (optional)

---

## Cost Considerations

### Cloudflare Workers
- **Free tier:** 100,000 requests/day
- **Paid tier:** $5/month for 10 million requests
- **KV storage:** First 1GB free, then $0.50/GB/month
- **KV reads:** First 10 million free, then $0.50/million
- **KV writes:** First 1 million free, then $5/million

### Groq API
- **Free tier:** 14,400 requests/day, 30 requests/minute
- **Paid tier:** Contact Groq for pricing

### OpenAI API (if used as fallback)
- **GPT-4o:** $2.50/1M input tokens, $10/1M output tokens
- **GPT-4o-mini:** $0.15/1M input tokens, $0.60/1M output tokens

**Recommendation:** Start with Groq free tier + Cloudflare free tier for development/testing.

---

## Next Steps

1. **Complete Setup:** Follow steps 1-9 above
2. **Test Locally:** Use `wrangler dev` for local testing
3. **Deploy to Production:** Run `wrangler deploy`
4. **Update Frontend:** Configure frontend with worker URL
5. **Monitor Usage:** Use `wrangler tail` to monitor logs
6. **Optimize:** Add multiple API keys for load balancing
7. **Scale:** Upgrade to paid tiers as needed

---

## Support Resources

- **Cloudflare Workers Docs:** https://developers.cloudflare.com/workers/
- **Wrangler CLI Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Groq API Docs:** https://console.groq.com/docs
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Worker README:** `worker/README.md`

---

**Document Created:** January 2, 2026  
**Last Updated:** January 2, 2026  
**Version:** 1.0.0
