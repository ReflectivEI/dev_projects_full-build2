# ReflectivAI Integration Guide

## ✅ Successfully Integrated from GitHub Repository

This project has been successfully integrated with the stable ReflectivAI codebase from:
**https://github.com/ReflectivEI/dev_projects_full-build2**

---

## 📦 What Was Integrated

### 1. **All Application Pages**
- ✅ `/` - Dashboard (main landing page)
- ✅ `/chat` - AI Coach chat interface
- ✅ `/roleplay` - Role-play simulator with scenarios
- ✅ `/exercises` - Practice exercises
- ✅ `/modules` - Training modules
- ✅ `/frameworks` - Sales frameworks (DISC, SPIN, etc.)
- ✅ `/ei-metrics` - Emotional Intelligence metrics
- ✅ `/data-reports` - Analytics and reports
- ✅ `/knowledge` - Knowledge base Q&A
- ✅ `/sql` - SQL query translator
- ✅ `/heuristics` - Sales heuristics and templates

### 2. **Custom Components**
- ✅ `api-status.tsx` - API connection status banner/badge
- ✅ `app-sidebar.tsx` - Main navigation sidebar
- ✅ `eq-metric-card.tsx` - EQ metric display cards
- ✅ `live-eq-analysis.tsx` - Real-time EQ analysis
- ✅ `roleplay-feedback-dialog.tsx` - Roleplay feedback modal
- ✅ `signal-intelligence-panel.tsx` - Signal Intelligence™ framework panel
- ✅ `theme-provider.tsx` - Dark/light theme support
- ✅ `theme-toggle.tsx` - Theme switcher component

### 3. **Hooks & Utilities**
- ✅ `use-mobile.tsx` - Mobile detection hook
- ✅ `use-toast.ts` - Toast notification hook
- ✅ `data.ts` - Application data and constants
- ✅ `eiMetricSettings.ts` - EQ metric configuration
- ✅ `queryClient.ts` - React Query configuration

### 4. **Dependencies Added**
- ✅ `wouter` - Lightweight routing library
- ✅ `framer-motion` - Animation library
- ✅ `recharts` - Chart library for data visualization
- ✅ `react-icons` - Icon library

### 5. **Shared Schema**
- ✅ `shared/schema.ts` - TypeScript types and Zod schemas

---

## 🔧 Configuration Required

### Step 1: Set Your Cloudflare Worker URL

Edit the `.env` file and replace the placeholder with your actual Cloudflare Worker URL:

```bash
# Replace this line:
VITE_API_BASE_URL=https://your-worker.your-subdomain.workers.dev

# With your actual worker URL, for example:
VITE_API_BASE_URL=https://reflectivai-api.your-subdomain.workers.dev
```

### Step 2: (Optional) Add API Key

If your Cloudflare Worker requires authentication, uncomment and set the API key:

```bash
VITE_API_KEY=your-api-key-here
```

### Step 3: Install Dependencies (if not already done)

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

---

## 🌐 Cloudflare Worker API Endpoints

Your Cloudflare Worker must implement these endpoints (see `cloudflare-worker-api.md` for full specification):

### Core Endpoints:
- `GET /api/status` - API health check
- `POST /api/chat/send` - Send chat message
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/clear` - Clear chat history
- `POST /api/chat/summary` - Generate session summary

### Role-Play Endpoints:
- `GET /api/roleplay/session` - Get current roleplay session
- `POST /api/roleplay/start` - Start new roleplay scenario
- `POST /api/roleplay/respond` - Send roleplay response
- `POST /api/roleplay/end` - End roleplay session

### Other Endpoints:
- `POST /api/sql/translate` - Translate natural language to SQL
- `POST /api/knowledge/ask` - Knowledge base Q&A
- `POST /api/frameworks/advice` - Get framework-specific advice
- `POST /api/modules/exercise` - Generate practice exercises
- `POST /api/heuristics/customize` - Customize sales templates
- `GET /api/dashboard/insights` - Get daily insights

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn UI components
│   ├── api-status.tsx   # API status components
│   ├── app-sidebar.tsx  # Main navigation
│   ├── eq-metric-card.tsx
│   ├── live-eq-analysis.tsx
│   ├── roleplay-feedback-dialog.tsx
│   ├── signal-intelligence-panel.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── data.ts          # Application data
│   ├── eiMetricSettings.ts
│   ├── queryClient.ts   # React Query config
│   └── utils.ts
├── pages/
│   ├── dashboard.tsx    # Main dashboard
│   ├── chat.tsx         # AI Coach
│   ├── roleplay.tsx     # Role-play simulator
│   ├── exercises.tsx
│   ├── modules.tsx
│   ├── frameworks.tsx
│   ├── ei-metrics.tsx
│   ├── data-reports.tsx
│   ├── knowledge.tsx
│   ├── sql.tsx
│   ├── heuristics.tsx
│   └── _404.tsx
├── styles/
│   └── globals.css      # Global styles
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point

shared/
└── schema.ts            # Shared TypeScript types
```

---

## 🎨 Features

### 1. **AI Coach Chat**
- Real-time chat with AI sales coach
- Conversation history
- Session summaries
- Framework-specific coaching

### 2. **Role-Play Simulator**
- 19+ realistic sales scenarios
- Difficulty levels (Beginner, Intermediate, Advanced)
- Filters by disease state, specialty, HCP category
- Real-time EQ analysis
- Detailed feedback after each session

### 3. **Signal Intelligence™ Framework**
- 6 core competencies visualization
- Competency scoring
- Pattern recognition
- Coaching cards

### 4. **Dashboard**
- Daily insights and tips
- Focus areas
- Suggested exercises
- Quick access to all features

### 5. **Dark/Light Theme**
- System preference detection
- Manual theme toggle
- Persistent theme selection

---

## 🔍 API Integration Details

### How API Calls Work

All API calls use the `VITE_API_BASE_URL` environment variable:

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${apiBaseUrl}/api/chat/send`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Optional: Add API key if configured
    ...(import.meta.env.VITE_API_KEY && {
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
    })
  },
  body: JSON.stringify({ message: 'Hello' })
});
```

### CORS Configuration

Your Cloudflare Worker must include CORS headers:

```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or specify your domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
```

---

## 🚀 Deployment

### Environment Variables for Production

When deploying, make sure to set:

```bash
VITE_API_BASE_URL=https://your-production-worker.workers.dev
VITE_API_KEY=your-production-api-key  # if needed
VITE_PUBLIC_URL=https://your-domain.com
```

### Build for Production

```bash
npm run build
```

---

## 📚 Additional Documentation

For detailed API specifications, see:
- `cloudflare-worker-api.md` - Complete API endpoint documentation
- `signal-intelligence-framework.md` - Framework methodology
- `design_guidelines.md` - Design principles

---

## 🐛 Troubleshooting

### Issue: API calls failing
**Solution:** Check that `VITE_API_BASE_URL` is set correctly in `.env` and your Cloudflare Worker is deployed and accessible.

### Issue: CORS errors
**Solution:** Ensure your Cloudflare Worker includes proper CORS headers (see above).

### Issue: Type errors
**Solution:** Run `npm run type-check` to identify TypeScript issues.

### Issue: Missing dependencies
**Solution:** Run `npm install` to ensure all dependencies are installed.

---

## ✨ Next Steps

1. **Configure your Cloudflare Worker URL** in `.env`
2. **Test the API connection** by visiting `/` (dashboard)
3. **Try the AI Coach** at `/chat`
4. **Explore role-play scenarios** at `/roleplay`
5. **Customize the theme** using the theme toggle in the header

---

## 📞 Support

For issues or questions about the ReflectivAI platform:
- GitHub: https://github.com/ReflectivEI/dev_projects_full-build2
- Documentation: See markdown files in the project root

---

**Integration completed successfully! 🎉**
