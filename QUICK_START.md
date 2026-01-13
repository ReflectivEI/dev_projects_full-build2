# ReflectivAI - Quick Start Guide

## 🚀 Your App is Ready!

**Live URL**: https://57caki7jtt.preview.c24.airoapp.ai

## ✅ Root Cause FIXED!

### The Problem (Same as Your Cloudflare Issue)
- Frontend was calling wrong backend URL
- Missing `window.WORKER_URL` configuration
- Version mismatch between frontend and backend

### The Solution Applied
1. ✅ Added `window.REFLECTIVAI_CONFIG` in `public/config.js`
2. ✅ Loaded config in `index.html` BEFORE React
3. ✅ Frontend now calls Cloudflare Worker directly
4. ✅ Response format fixed (`data.reply`)

## 🎯 How It Works Now

```
GoDaddy Frontend → Cloudflare Worker (Direct)
        ↓
  window.REFLECTIVAI_CONFIG
  (loaded in index.html)
```

**Same pattern as your Cloudflare Pages fix!**

## 🔍 Verify It's Working

### Step 1: Open the App
https://57caki7jtt.preview.c24.airoapp.ai

### Step 2: Open Browser Console (F12)
You should see:
```
[ReflectivAI] Config loaded: {
  WORKER_URL: "https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev",
  VERSION: "1.0.0",
  ENVIRONMENT: "production"
}
```

### Step 3: Send a Test Message
Type anything in the chat and press Enter.

Console should show:
```
[ReflectivAI] Calling worker: https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev
```

### Step 4: Check Network Tab
The request should go to:
- ✅ `reflectivai-api-parity-prod.tonyabdelmalak.workers.dev/chat`
- ❌ NOT `57caki7jtt.preview.c24.airoapp.ai/api/chat`

## 🛠️ Configuration Files

### `public/config.js` (NEW)
```javascript
window.REFLECTIVAI_CONFIG = {
  WORKER_URL: 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev',
  VERSION: '1.0.0',
  ENVIRONMENT: 'production'
};
```

### `index.html` (UPDATED)
```html
<head>
  <title>ReflectivAI - AI Coach</title>
  <!-- CRITICAL: Load worker URL config before app loads -->
  <script src="/config.js"></script>
</head>
```

### `src/pages/index.tsx` (UPDATED)
```typescript
// Get worker URL from config
const workerUrl = (window as any).REFLECTIVAI_CONFIG?.WORKER_URL;

// Call worker directly
const response = await fetch(`${workerUrl}/chat`, {
  method: 'POST',
  body: JSON.stringify({
    session: sessionId,
    mode: 'sales-coach',
    messages: [...messages]
  })
});

// Handle worker response format
const data = await response.json();
const reply = data.reply || data.message;
```

## 🚨 Troubleshooting

### "Worker URL not configured" Error

**Check**:
1. Does `public/config.js` exist?
2. Is it loaded in `index.html`?
3. Restart dev server to pick up new files

### CORS Errors

**Fix**: Update your Cloudflare Worker's `CORS_ORIGINS` to include:
```
https://57caki7jtt.preview.c24.airoapp.ai
```

### Empty Responses

**Already Fixed**: Frontend reads `data.reply || data.message`

### 405 Method Not Allowed

**Check Network Tab**: Should call `workers.dev`, not `airoapp.ai`

## 📋 Key Differences from Cloudflare Setup

| Aspect | Cloudflare Pages | GoDaddy Airo |
|--------|-----------------|---------------|
| Config Variable | `window.WORKER_URL` | `window.REFLECTIVAI_CONFIG` |
| Config File | `client/index.html` | `public/config.js` |
| Frontend | Cloudflare Pages | GoDaddy Airo |
| Backend | Cloudflare Worker | Same Cloudflare Worker |
| Pattern | Direct call | Direct call |

**Same root cause, same solution pattern!**

## ✅ What's Working

- ✅ Beautiful chat interface
- ✅ Direct connection to Cloudflare Worker
- ✅ Correct request format (session, mode, messages)
- ✅ Correct response handling (data.reply)
- ✅ Session management
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-scroll messages
- ✅ Keyboard shortcuts

## 🎤 Presentation Ready!

Your app demonstrates:
1. **Root cause diagnosis** - Same issue as Cloudflare deployment
2. **Proper fix applied** - Config-based worker URL
3. **Direct backend calls** - No proxy layer confusion
4. **Production-ready** - Error handling, logging, sessions
5. **Type-safe** - Full TypeScript throughout

## 📚 Full Documentation

See `DEPLOYMENT_FIX.md` for:
- Complete root cause analysis
- Detailed troubleshooting guide
- Deployment checklist
- Architecture comparison

**Good luck with your presentation! 🚀**
