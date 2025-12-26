# ReflectivAI Sales Enablement Platform

AI-powered emotional intelligence coaching and role-play training for pharmaceutical sales professionals.

## Architecture Overview

The ReflectivAI platform consists of three main components:

1. **Frontend (Cloudflare Pages)**: React/Vite application with AI Coach, Role Play, SQL Translator, and more
2. **Worker API (Cloudflare Workers)**: Stateless API handling AI interactions and session management
3. **KV Storage**: Cloudflare KV for session persistence

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Cloudflare Pages)                                │
│  - React + Vite                                             │
│  - TanStack Query for API calls                             │
│  - Shadcn UI components                                     │
│  - Environment: VITE_WORKER_URL points to Worker API       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS API calls
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  Worker API (Cloudflare Workers)                            │
│  - worker-parity/index.ts                                   │
│  - Handles all /api/* endpoints                             │
│  - Integrates with OpenAI/LLM provider                      │
│  - Session management via x-session-id                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  KV Storage (Cloudflare KV)                                 │
│  - Namespace: SESS                                          │
│  - Stores session state (messages, signals, roleplay)       │
│  - 24-hour TTL                                              │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 20.x or later
- npm or pnpm
- Cloudflare account (for deployment)
- OpenAI API key or compatible LLM provider

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd dev_projects_full-build2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the frontend**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

4. **Configure API endpoint**
   
   During development, you can either:
   - Use a deployed worker (set `VITE_WORKER_URL` in `.env.local`)
   - Run a local worker (requires Wrangler CLI)

### Production Deployment

See detailed deployment guides:
- **Frontend**: [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md)
- **Worker API**: [worker-parity/DEPLOY.md](./worker-parity/DEPLOY.md)

## Project Structure

```
.
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components (AI Coach, Role Play, etc.)
│   │   ├── lib/             # Utilities and API client
│   │   └── hooks/           # React hooks
│   └── dist/                # Build output (generated)
│
├── worker-parity/            # Cloudflare Worker API
│   ├── index.ts             # Main worker entry point
│   ├── signal_intel.ts      # Signal Intelligence framework
│   ├── wrangler.toml        # Worker configuration
│   ├── DEPLOY.md            # Worker deployment guide
│   └── test-endpoints.sh    # Endpoint verification script
│
├── shared/                   # Shared TypeScript types
│   └── schema.ts            # Scenario and type definitions
│
├── docs/                     # Additional documentation
├── cloudflare-worker-api.md  # API specification
├── CLOUDFLARE_PAGES_DEPLOYMENT.md  # Frontend deployment guide
└── package.json             # Root package configuration
```

## Key Features

### 1. AI Coach
Interactive AI-powered coaching for pharma sales scenarios with:
- Context-aware coaching (disease state, specialty, HCP category, influence driver)
- Signal Intelligence: Real-time behavioral pattern detection
- Session summaries with actionable insights

### 2. Role Play Simulator
Practice sales conversations with AI stakeholders:
- Multiple scenarios across disease areas (HIV, Oncology, Cardiology, etc.)
- Live EQ Analysis: Empathy, Adaptability, Curiosity, Resilience scoring
- Signal Intelligence panel showing observable interaction patterns
- Comprehensive end-of-session feedback

### 3. SQL Translator
Natural language to SQL query translation for sales data analysis.

### 4. Knowledge Base
Q&A system for pharma/biotech knowledge and best practices.

### 5. Dashboard
Personalized insights, daily focus areas, and coaching prompts.

## Configuration

### Environment Variables

#### Frontend (Cloudflare Pages)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_WORKER_URL` | **Yes** (production) | Full URL to Cloudflare Worker API |
| `VITE_API_KEY` | No | Optional API key if worker requires auth |

Set in Cloudflare Pages dashboard under Settings > Environment variables.

#### Worker (Cloudflare Workers)

| Secret | Required | Description |
|--------|----------|-------------|
| `PROVIDER_URL` | **Yes** | OpenAI-compatible API endpoint |
| `PROVIDER_MODEL` | **Yes** | Model name (e.g., gpt-4o) |
| `PROVIDER_KEY` | **Yes** | API key for LLM provider |
| `CORS_ORIGINS` | **Yes** | Comma-separated allowed origins |

Set via Wrangler CLI:
```bash
cd worker-parity
npx wrangler secret put PROVIDER_KEY
npx wrangler secret put CORS_ORIGINS
```

### API Endpoints

The worker implements these key endpoints (see [cloudflare-worker-api.md](./cloudflare-worker-api.md) for full spec):

- `GET /health` - Health check
- `GET /api/status` - API configuration status
- `POST /api/chat/send` - Send chat message with Signal Intelligence
- `POST /api/chat/summary` - Get session summary
- `POST /api/roleplay/start` - Start role-play session
- `POST /api/roleplay/respond` - Send role-play response with EQ analysis
- `POST /api/roleplay/end` - End session and get comprehensive feedback
- `POST /api/roleplay/eq-analysis` - Get live EQ analysis
- `POST /api/sql/translate` - Translate natural language to SQL
- `POST /api/knowledge/ask` - Ask knowledge base questions
- `GET /api/dashboard/insights` - Get personalized dashboard insights

## Development

### Type Checking

```bash
npm run check
```

### Building

```bash
npm run build
```

Output will be in `client/dist/`.

### Linting

Currently uses TypeScript's built-in type checking. Additional linting can be configured as needed.

## Troubleshooting

### Frontend shows "VITE_WORKER_URL = undefined"

**Solution**: Set `VITE_WORKER_URL` in Cloudflare Pages environment variables and redeploy.

See [CLOUDFLARE_PAGES_DEPLOYMENT.md](./CLOUDFLARE_PAGES_DEPLOYMENT.md#troubleshooting) for details.

### Signal Intelligence not appearing in Role Play

**Solution**: Verify the worker is returning signals in `/api/roleplay/respond` response. Check browser console for errors.

### Live EQ Analysis is empty

**Solution**: Send at least one user message. Verify worker returns `eqAnalysis` with empathy, adaptability, curiosity, resilience scores.

### End Session feedback incomplete

**Solution**: Worker `/api/roleplay/end` must return complete analysis. Frontend has fallback values if fields are missing.

### Worker returns 404 for /api/status

**Solution**: This is fixed in the latest version. Redeploy worker:
```bash
cd worker-parity
npx wrangler deploy
```

## Testing

### Worker Endpoints

Use the automated test script:
```bash
cd worker-parity
./test-endpoints.sh https://your-worker.workers.dev
```

### Frontend

Manual testing checklist:
1. AI Coach: Send message, verify response with Signal Intelligence
2. Role Play: Start scenario, send messages, verify EQ Analysis and signals
3. End Session: Verify complete feedback with strengths, improvements, next steps
4. SQL Translator: Translate a query
5. Dashboard: Verify insights load

## Contributing

1. Create a feature branch
2. Make changes
3. Run type checking: `npm run check`
4. Test manually in development
5. Submit PR

## API Specification

See [cloudflare-worker-api.md](./cloudflare-worker-api.md) for complete API documentation.

## Deployment Guides

- [Frontend Deployment](./CLOUDFLARE_PAGES_DEPLOYMENT.md)
- [Worker Deployment](./worker-parity/DEPLOY.md)

## Additional Documentation

- [Signal Intelligence Framework](./signal-intelligence-framework.md)
- [Design Guidelines](./design_guidelines.md)

## Support

For issues or questions:
1. Check troubleshooting sections in deployment guides
2. Review API specification for contract details
3. Check browser console and worker logs for errors

## License

Proprietary - ReflectivAI
