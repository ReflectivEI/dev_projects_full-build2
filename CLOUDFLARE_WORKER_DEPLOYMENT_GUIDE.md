# 🚀 Cloudflare Worker Deployment Guide - URGENT UPDATE NEEDED

## ⚠️ **CRITICAL: Your Worker is Outdated**

**Current Deployed Version**: `23df0d1b` (3 days old)
**Status**: ❌ **WRONG CODE** - Still using old EQ metrics system
**Action Required**: Deploy the new Signal Intelligence™ worker immediately

---

## 📊 **What's Wrong with Current Deployment**

### ❌ **Current (Outdated) Worker**

```javascript
// OLD CODE - DO NOT USE
var PHARMA_SALES_SYSTEM_PROMPT = `You are an expert AI Sales Coach specializing in Life Sciences...
1. **Emotional Intelligence Frameworks:**
   - DISC Behavioral Model
   - Active Listening techniques
   - Empathy Mapping
   - Rapport Building strategies
`;

var ANALYSIS_SYSTEM_PROMPT = `You are an expert sales coach analyzing pharma sales conversations for emotional intelligence...
Respond in JSON format:
{
  "overallScore": number,
  "eqMetrics": {  // ❌ OLD FORMAT
    "empathy": number,
    "activeListening": number,
    "rapport": number,
    "discAdaptation": number
  }
}`;

// OLD ENDPOINTS
if (url.pathname === "/chat") { // ❌ Wrong path
  return handleChat(request, env);
}
```

**Problems:**
1. ❌ Uses "Emotional Intelligence" and "EQ" terminology
2. ❌ Wrong endpoints (`/chat` instead of `/api/chat/send`)
3. ❌ Returns `eqMetrics` instead of `behavioralCapabilities`
4. ❌ Missing Signal Intelligence™ framework
5. ❌ No environment variables configured
6. ❌ No secrets set

### ✅ **New (Correct) Worker**

```javascript
// NEW CODE - CORRECT
const SIGNAL_FRAMEWORK_PROMPT = `You are ReflectivAI — an AI Sales Coach for life sciences sales professionals.

Signal Intelligence (Core, Always On):
Signal Intelligence is the ability to notice, interpret, and respond appropriately to OBSERVABLE interaction signals during HCP conversations.

Valid signal types (strict):
- verbal: tone shifts, pacing, certainty vs hesitation, word choice
- nonverbal: body language, facial expressions, posture changes
- contextual: environmental factors, timing, setting dynamics
- relational: rapport indicators, trust signals, engagement level
`;

// NEW ENDPOINTS
const routes = {
  'POST /api/chat/send': handleChatSend,
  'POST /api/roleplay/start': handleRoleplayStart,
  'POST /api/roleplay/respond': handleRoleplayRespond,
  'POST /api/roleplay/end': handleRoleplayEnd,
  'GET /api/dashboard/insights': handleDashboardInsights,
  // ... 15+ endpoints
};
```

**Features:**
1. ✅ Signal Intelligence™ terminology throughout
2. ✅ Correct API endpoints (`/api/*`)
3. ✅ Returns `behavioralCapabilities` (8 capabilities)
4. ✅ Complete Signal Intelligence™ framework
5. ✅ Session management with KV storage
6. ✅ CORS configuration
7. ✅ Comprehensive error handling

---

## 🔧 **Step-by-Step Deployment**

### **Prerequisites**

1. **Wrangler CLI** installed:
   ```bash
   npm install -g wrangler
   ```

2. **Cloudflare Account** with Workers enabled

3. **API Token** from Cloudflare dashboard

---

### **Step 1: Authenticate with Cloudflare**

```bash
# Login to Cloudflare
wrangler login

# Or use API token
wrangler config
```

---

### **Step 2: Create KV Namespace (If Not Exists)**

```bash
# Create KV namespace for session storage
wrangler kv:namespace create "SESS"

# Output will show:
# { binding = "SESS", id = "<YOUR_KV_ID>" }
```

**Copy the KV namespace ID** - you'll need it for `wrangler.toml`.

---

### **Step 3: Update wrangler.toml**

Edit `/worker/wrangler.toml`:

```toml
name = "saleseq-coach-prod"
main = "index.js"
compatibility_date = "2024-01-01"
workers_dev = true

# IMPORTANT: Add your KV namespace ID here
[[kv_namespaces]]
binding = "SESS"
id = "<YOUR_KV_NAMESPACE_ID>"  # Replace with actual ID from Step 2

[vars]
ENVIRONMENT = "production"
VERSION = "2.0.0"
```

---

### **Step 4: Set Environment Secrets**

```bash
# Navigate to worker directory
cd worker

# Set OpenAI API key (REQUIRED)
wrangler secret put PROVIDER_KEY
# When prompted, paste your OpenAI API key: sk-...

# Verify secrets are set
wrangler secret list
```

**Expected output:**
```
[
  {
    "name": "PROVIDER_KEY",
    "type": "secret_text"
  }
]
```

---

### **Step 5: Deploy the Worker**

```bash
# From /worker directory
wrangler deploy

# Or from project root
wrangler deploy --config worker/wrangler.toml
```

**Expected output:**
```
Total Upload: XX.XX KiB / gzip: XX.XX KiB
Uploaded saleseq-coach-prod (X.XX sec)
Published saleseq-coach-prod (X.XX sec)
  https://saleseq-coach-prod.tonyabdelmalak.workers.dev
Current Deployment ID: <NEW_VERSION_ID>
```

---

### **Step 6: Verify Deployment**

#### Test Health Endpoint

```bash
curl https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "timestamp": "2026-01-02T01:30:00.000Z",
  "environment": "production",
  "features": {
    "aiEnabled": true,
    "kvStorage": true,
    "sessionManagement": true
  }
}
```

#### Test Chat Endpoint

```bash
curl -X POST https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I handle objections about drug pricing?",
    "sessionId": "test-123"
  }'
```

**Expected response:**
```json
{
  "reply": "When addressing pricing objections...",
  "timestamp": 1735776600000,
  "sessionId": "test-123"
}
```

#### Test Roleplay Endpoint

```bash
curl -X POST https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/roleplay/start \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "objection-handling-1",
    "sessionId": "test-456"
  }'
```

**Expected response:**
```json
{
  "stakeholderMessage": "I'm concerned about the side effects...",
  "scenario": {
    "id": "objection-handling-1",
    "title": "Handling Safety Concerns",
    "stakeholder": "Dr. Sarah Chen, MD"
  },
  "sessionId": "test-456",
  "timestamp": 1735776600000
}
```

---

## 🔍 **Verify Environment Variables**

### Check in Cloudflare Dashboard

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **saleseq-coach-prod**
3. Click: **Settings** → **Variables**

**You should see:**

#### Environment Variables
- `ENVIRONMENT`: `production`
- `VERSION`: `2.0.0`

#### Secrets (Encrypted)
- `PROVIDER_KEY`: `[encrypted]`

#### KV Namespace Bindings
- `SESS`: `<YOUR_KV_NAMESPACE_ID>`

**If any are missing**, add them:

```bash
# Add environment variable
wrangler secret put ENVIRONMENT
# Enter: production

wrangler secret put VERSION
# Enter: 2.0.0

# Add OpenAI API key
wrangler secret put PROVIDER_KEY
# Enter: sk-...
```

---

## 📋 **Post-Deployment Checklist**

### ✅ **Verify All Endpoints**

```bash
# Health check
curl https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/health

# Status check
curl https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/status

# Chat endpoint
curl -X POST https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "sessionId": "test"}'

# Roleplay start
curl -X POST https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/roleplay/start \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": "objection-handling-1", "sessionId": "test"}'

# Dashboard insights
curl https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/dashboard/insights
```

### ✅ **Check Logs**

```bash
# View real-time logs
wrangler tail saleseq-coach-prod

# Or in Cloudflare dashboard:
# Workers & Pages → saleseq-coach-prod → Logs
```

### ✅ **Test from Frontend**

Update your `.env` file:

```bash
VITE_API_BASE_URL=https://saleseq-coach-prod.tonyabdelmalak.workers.dev
```

Then test the frontend integration.

---

## 🐛 **Troubleshooting**

### **Issue: "PROVIDER_KEY is not set"**

**Solution:**
```bash
wrangler secret put PROVIDER_KEY
# Paste your OpenAI API key when prompted
```

### **Issue: "KV namespace not found"**

**Solution:**
```bash
# Create KV namespace
wrangler kv:namespace create "SESS"

# Update wrangler.toml with the ID
[[kv_namespaces]]
binding = "SESS"
id = "<YOUR_KV_ID>"

# Redeploy
wrangler deploy
```

### **Issue: "CORS error from frontend"**

**Solution:**
Check `ALLOWED_ORIGINS` in `worker/index.js`:

```javascript
const ALLOWED_ORIGINS = new Set([
  'https://reflectivei.github.io',
  'https://yxpzdb7o9z.preview.c24.airoapp.ai',
  'http://localhost:5173',
  // Add your frontend URL here
]);
```

### **Issue: "Old code still deployed"**

**Solution:**
```bash
# Force redeploy
wrangler deploy --force

# Or delete and recreate
wrangler delete saleseq-coach-prod
wrangler deploy
```

---

## 📊 **Monitoring**

### **View Analytics**

1. Go to Cloudflare Dashboard
2. Navigate to: **Workers & Pages** → **saleseq-coach-prod**
3. Click: **Metrics**

**Monitor:**
- Requests per second
- Error rate
- CPU time
- KV operations

### **Set Up Alerts**

1. Go to: **Notifications**
2. Create alert for:
   - Error rate > 5%
   - CPU time > 50ms
   - Request failures

---

## 🎯 **Expected Results After Deployment**

### ✅ **API Responses**

**Chat endpoint** should return:
```json
{
  "reply": "...",
  "timestamp": 1735776600000,
  "sessionId": "..."
}
```

**Roleplay endpoint** should return:
```json
{
  "stakeholderMessage": "...",
  "scenario": { ... },
  "behavioralMetrics": [ ... ],  // ✅ NEW FORMAT
  "timestamp": 1735776600000
}
```

**NOT** the old format:
```json
{
  "eqMetrics": { ... }  // ❌ OLD FORMAT
}
```

### ✅ **Frontend Integration**

After deployment, your frontend should:
1. ✅ Connect to the worker successfully
2. ✅ Receive Signal Intelligence™ responses
3. ✅ Display 8 behavioral capabilities
4. ✅ Show disclaimers correctly
5. ✅ No "EQ" or "Emotional Intelligence" terminology

---

## 📝 **Deployment Verification Script**

Save this as `verify-deployment.sh`:

```bash
#!/bin/bash

WORKER_URL="https://saleseq-coach-prod.tonyabdelmalak.workers.dev"

echo "🔍 Verifying Cloudflare Worker Deployment..."
echo ""

# Test health endpoint
echo "1. Testing /api/health..."
HEALTH=$(curl -s "$WORKER_URL/api/health")
echo "$HEALTH" | jq .
echo ""

# Test status endpoint
echo "2. Testing /api/status..."
STATUS=$(curl -s "$WORKER_URL/api/status")
echo "$STATUS" | jq .
echo ""

# Test chat endpoint
echo "3. Testing /api/chat/send..."
CHAT=$(curl -s -X POST "$WORKER_URL/api/chat/send" \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "sessionId": "verify-test"}')
echo "$CHAT" | jq .
echo ""

# Check for old terminology
echo "4. Checking for old terminology..."
if echo "$CHAT" | grep -q "eqMetrics"; then
  echo "❌ FAIL: Old 'eqMetrics' found in response"
  echo "⚠️  Worker is still using old code!"
else
  echo "✅ PASS: No old terminology found"
fi

echo ""
echo "✅ Deployment verification complete!"
```

Run it:
```bash
chmod +x verify-deployment.sh
./verify-deployment.sh
```

---

## 🚀 **Quick Deploy Command**

If you just want to deploy quickly:

```bash
# One-line deploy
cd worker && wrangler deploy && cd ..

# Verify
curl https://saleseq-coach-prod.tonyabdelmalak.workers.dev/api/health
```

---

## 📞 **Support**

If you encounter issues:

1. **Check logs**: `wrangler tail saleseq-coach-prod`
2. **Verify secrets**: `wrangler secret list`
3. **Check KV**: `wrangler kv:namespace list`
4. **Review docs**: `CLOUDFLARE_WORKER_SETUP.md`

---

## ✅ **Success Criteria**

Deployment is successful when:

1. ✅ `/api/health` returns `{"status": "healthy"}`
2. ✅ `/api/status` shows `"aiEnabled": true`
3. ✅ `/api/chat/send` returns responses without "eqMetrics"
4. ✅ Frontend connects successfully
5. ✅ No CORS errors
6. ✅ All 8 behavioral capabilities display correctly
7. ✅ Disclaimers show on all evaluation interfaces

---

**Deploy now to fix the outdated worker!** 🚀
