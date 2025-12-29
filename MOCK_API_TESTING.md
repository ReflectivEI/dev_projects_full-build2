# Mock API Testing Guide

## ✅ Ready to Test!

Your ReflectivAI application is now wired to a **local mock API** that simulates all Cloudflare Worker endpoints. You can test the full functionality without needing a real Cloudflare Worker!

---

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5173` (or the port shown in your terminal).

### 2. Open in Browser

Navigate to: **http://localhost:5173**

You should see the ReflectivAI Dashboard.

---

## 🧪 What's Been Set Up

### Mock API Endpoints Created:

✅ **Status Check**
- `GET /api/status` - Health check endpoint
- Returns: `{ status: 'ok', message: 'Mock API is running' }`

✅ **Chat Endpoints**
- `POST /api/chat/send` - Send message to AI coach
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/clear` - Clear chat history

✅ **Roleplay Endpoints**
- `POST /api/roleplay/start` - Start roleplay scenario
- `POST /api/roleplay/respond` - Send roleplay response
- `POST /api/roleplay/end` - End roleplay session

✅ **Dashboard Endpoint**
- `GET /api/dashboard/insights` - Get daily insights and tips

### Mock Data Features:

- **Realistic responses** - AI coach responses sound natural
- **Simulated delays** - 500-1000ms delays to mimic real API
- **Random variations** - Different responses each time
- **EQ metrics** - Random but realistic scores (60-100 range)
- **Error handling** - Proper validation and error responses

---

## 🧪 Testing Each Feature

### 1. Dashboard (`/`)

**What to test:**
- [ ] Page loads without errors
- [ ] Daily tip displays
- [ ] Focus areas show with scores
- [ ] Recent activity displays
- [ ] Suggested exercises appear
- [ ] API status indicator shows "Connected" (green)

**Expected behavior:**
- Dashboard loads with mock insights
- All cards display properly
- No console errors

---

### 2. AI Coach Chat (`/chat`)

**What to test:**
- [ ] Chat interface loads
- [ ] Can type messages
- [ ] Send button works
- [ ] AI responds after ~800ms delay
- [ ] Messages appear in chat history
- [ ] Can clear chat history
- [ ] Context filters work (disease state, specialty, etc.)

**How to test:**
1. Navigate to `/chat`
2. Type a message: "How do I handle objections?"
3. Click Send
4. Wait for AI response (~800ms)
5. Verify response appears
6. Try clearing chat history

**Expected responses:**
- "That's a great question! In pharmaceutical sales..."
- "I understand your concern. When approaching objections..."
- "Excellent point! The DISC framework can really help here..."
- And more variations

---

### 3. Roleplay Simulator (`/roleplay`)

**What to test:**
- [ ] Scenario list loads
- [ ] Can filter by disease state, specialty, difficulty
- [ ] Can start a roleplay scenario
- [ ] HCP profile displays
- [ ] Can send responses
- [ ] HCP responds after ~1000ms delay
- [ ] Live EQ metrics update
- [ ] Can end roleplay session
- [ ] Feedback dialog shows summary

**How to test:**
1. Navigate to `/roleplay`
2. Select a scenario (e.g., "Cardiology - New Treatment Introduction")
3. Click "Start Roleplay"
4. Read HCP's initial message
5. Type your response
6. Click Send
7. Watch EQ metrics update
8. Continue conversation (3-5 exchanges)
9. Click "End Roleplay"
10. Review feedback summary

**Expected behavior:**
- HCP profile: Dr. Sarah Mitchell (Cardiology)
- Initial message: "Good morning. I understand you wanted to discuss..."
- HCP responses vary (efficacy questions, safety concerns, cost questions)
- EQ metrics show realistic scores (60-100 range)
- Feedback includes strengths and improvements

---

### 4. Frameworks (`/frameworks`)

**What to test:**
- [ ] Framework cards display
- [ ] Can view framework details
- [ ] DISC, SPIN, LAER, etc. frameworks load
- [ ] Framework descriptions are readable

**Expected behavior:**
- All frameworks display with icons
- Clicking a framework shows details
- No API calls needed (static data)

---

### 5. Training Modules (`/modules`)

**What to test:**
- [ ] Module list displays
- [ ] Can view module details
- [ ] Modules organized by category
- [ ] Progress indicators work

**Expected behavior:**
- Modules load from local data
- No API calls needed (static data)

---

### 6. Exercises (`/exercises`)

**What to test:**
- [ ] Exercise list displays
- [ ] Can filter by difficulty
- [ ] Exercise details show
- [ ] Can start exercises

**Expected behavior:**
- Exercises load from local data
- No API calls needed (static data)

---

### 7. EI Metrics (`/ei-metrics`)

**What to test:**
- [ ] Metrics dashboard displays
- [ ] Charts render correctly
- [ ] Metric cards show scores
- [ ] Historical data displays

**Expected behavior:**
- Metrics load from local data
- Charts display properly
- No API calls needed (static data)

---

### 8. Knowledge Base (`/knowledge`)

**What to test:**
- [ ] Knowledge base interface loads
- [ ] Can search/browse topics
- [ ] Articles display

**Expected behavior:**
- Knowledge base loads from local data
- No API calls needed (static data)

---

### 9. Heuristics (`/heuristics`)

**What to test:**
- [ ] Heuristics templates display
- [ ] Can view template details
- [ ] Templates organized by category

**Expected behavior:**
- Templates load from local data
- No API calls needed (static data)

---

### 10. Data Reports (`/data-reports`)

**What to test:**
- [ ] Reports dashboard displays
- [ ] Charts and graphs render
- [ ] Data tables display

**Expected behavior:**
- Reports load from local data
- Charts display properly
- No API calls needed (static data)

---

### 11. SQL Translator (`/sql`)

**What to test:**
- [ ] SQL interface loads
- [ ] Can enter natural language queries
- [ ] Interface is functional

**Note:** SQL translation endpoint not yet mocked. This page will load but translation won't work until you add the endpoint or connect to real worker.

---

## 🔍 Checking API Status

### API Status Indicator

Look for the API status indicator in the header:

- 🟢 **Green "Connected"** = Mock API is working
- 🔴 **Red "Disconnected"** = API not responding

### Testing API Health

Open browser console and run:

```javascript
fetch('http://localhost:5173/api/status')
  .then(r => r.json())
  .then(console.log);
```

Expected response:
```json
{
  "status": "ok",
  "message": "Mock API is running",
  "timestamp": "2025-12-29T06:20:00.000Z",
  "version": "1.0.0-mock"
}
```

---

## 🐛 Troubleshooting

### Issue: "API Status: Disconnected"

**Solution:**
1. Check that dev server is running (`npm run dev`)
2. Verify `.env` has: `VITE_API_BASE_URL=http://localhost:5173`
3. Restart the dev server
4. Clear browser cache and reload

### Issue: "404 Not Found" on API calls

**Solution:**
1. Check that the endpoint file exists in `src/server/api/`
2. Verify the file follows the naming convention (e.g., `GET.ts`, `POST.ts`)
3. Restart the dev server

### Issue: Chat/Roleplay not responding

**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify API calls are being made (Network tab)
4. Check that mock endpoints are returning data

### Issue: TypeScript errors

**Solution:**
```bash
npm run type-check
```
Fix any reported errors.

---

## 🔄 Switching to Real Cloudflare Worker

When you're ready to use a real Cloudflare Worker:

### 1. Update `.env`

```bash
# Comment out mock API
# VITE_API_BASE_URL=http://localhost:5173

# Uncomment and set your worker URL
VITE_API_BASE_URL=https://reflectivai-api-dev.your-subdomain.workers.dev
```

### 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 3. Test Connection

- API status should show "Connected" if worker is accessible
- If "Disconnected", check worker URL and CORS settings

---

## 📊 Mock API Response Examples

### Chat Response

```json
{
  "message": "That's a great question! In pharmaceutical sales...",
  "timestamp": "2025-12-29T06:20:00.000Z",
  "sessionId": "mock-session-1735456800000",
  "context": {}
}
```

### Roleplay Start Response

```json
{
  "sessionId": "roleplay-session-1735456800000",
  "scenarioId": "cardio-new-treatment",
  "difficulty": "intermediate",
  "hcpProfile": {
    "name": "Dr. Sarah Mitchell",
    "specialty": "Cardiology",
    "personality": "Analytical and detail-oriented",
    "concerns": ["Efficacy data", "Patient safety", "Cost-effectiveness"]
  },
  "initialMessage": "Good morning. I understand you wanted to discuss...",
  "timestamp": "2025-12-29T06:20:00.000Z"
}
```

### Roleplay Response with EQ Metrics

```json
{
  "message": "I see. Can you provide more specific data...",
  "eqMetrics": {
    "empathy": 82,
    "activeListening": 75,
    "adaptability": 70,
    "emotionalRegulation": 80,
    "socialAwareness": 76,
    "relationshipManagement": 72
  },
  "feedback": {
    "strengths": ["Good use of data", "Professional tone"],
    "improvements": ["Could ask more open-ended questions"]
  },
  "timestamp": "2025-12-29T06:20:00.000Z"
}
```

---

## ✅ Testing Checklist

Before considering the mock API complete, verify:

- [ ] Dev server starts without errors
- [ ] Dashboard loads and displays mock data
- [ ] Chat sends messages and receives responses
- [ ] Roleplay starts, responds, and ends properly
- [ ] EQ metrics update during roleplay
- [ ] API status shows "Connected"
- [ ] No console errors
- [ ] All pages load without breaking
- [ ] Theme toggle works (dark/light mode)
- [ ] Navigation between pages works

---

## 📝 Next Steps

1. **Test all features** using this guide
2. **Report any issues** you find
3. **When ready**, switch to real Cloudflare Worker
4. **Compare behavior** between mock and real API

---

## 💡 Tips

- **Mock API is for testing only** - It doesn't persist data
- **Responses are random** - Each request gets a different response
- **Delays are simulated** - Real API may be faster or slower
- **No authentication** - Mock API doesn't require API keys
- **Local only** - Mock API only works on localhost

---

**Happy Testing! 🎉**

You can now explore the full ReflectivAI platform without needing a Cloudflare Worker!
