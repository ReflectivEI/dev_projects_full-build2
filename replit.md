# ReflectivAI - AI Sales Enablement for Life Sciences

## Overview
ReflectivAI is an AI-powered Sales Enablement platform designed specifically for Life Sciences, Biotech, and Pharmaceutical sales professionals. It combines emotional intelligence frameworks with practical sales coaching to help reps master the art of healthcare stakeholder engagement.

**Signal Intelligence**: ReflectivAI is powered by Signal Intelligence — the ability to notice, interpret, and respond appropriately to observable signals during professional interactions. AI highlights meaningful behavioral signals; sales professionals apply judgment using demonstrated emotional intelligence capabilities, communication models, and coaching tools.

## Core Features

### 1. AI Sales Coach (Chat)
- Real-time AI coaching powered by OpenAI gpt-4o
- Context-aware responses for pharma sales situations
- Personalized feedback on sales techniques
- EI framework suggestions integrated into responses
- **Disease State selector**: HIV, PrEP, Oncology, Cardiology, Neurology, Infectious Disease, Endocrinology, Respiratory/Pulmonology, Hepatology, Vaccines/Immunization, General Medicine
- **HCP Profile selector**: Choose from 10 realistic HCP personas with different specialties and communication styles
- **Session Summary**: AI-generated key takeaways, skills discussed, action items, and next steps

### 2. Role-Play Simulator
- **19 real-world pharma sales scenarios** across therapeutic areas:
  - HIV/PrEP (4): Descovy share, access barriers, Biktarvy switches, Cabotegravir screening
  - Oncology (6): ADC integration, pathway operations, oral oncolytic onboarding, KOL meetings
  - Cardiovascular (4): HFrEF GDMT, CKD SGLT2, post-MI transitions, formulary review
  - Vaccines (2): Adult flu optimization, primary care capture
  - COVID-19 (2): Outpatient antivirals, post-COVID adherence
  - Immunology, Neurology, Rare Disease scenarios
- **Scenario card sections**: Stakeholder, Objective, Context, Challenges, Key Messages, Impact
- Interactive stakeholder conversations with AI-powered responses
- Real-time EI analysis during role-plays
- Difficulty levels: Beginner, Intermediate, Advanced
- **Disease State selector**: Context for role-play scenarios
- **HCP Profile selector**: Customize stakeholder persona for practice

### 3. SQL Query Translator
- Natural language to SQL conversion for sales data analysis
- Pre-built schema for pharma sales databases
- Query history tracking
- Example questions for quick starts

### 4. Selling & Coaching Frameworks (Three-Layer Hierarchy)
ReflectivAI uses a clear, defensible three-layer hierarchy:

**Layer 1 — Emotional Intelligence (Core Measurement Layer)**
EI refers to DEMONSTRATED CAPABILITY — how effectively a user:
- Accurately perceives observable signals from others
- Interprets those signals appropriately in context
- Regulates their response
- Adapts communication to preserve trust, clarity, and credibility
Key metrics: Empathy Accuracy, Discovery Depth, Clarity & Alignment, Adaptive Communication.
EI is measured through observable behaviors, NOT personality traits. It is not diagnostic.

**Layer 2 — Behavioral Communication Models (Optional Supporting Lens)**
How sellers adapt their approach:
- **DISC Communication Styles**: An OPTIONAL behavioral lens. DISC describes observable communication preferences—it does NOT measure emotional intelligence or infer personality.

**Layer 3 — Coaching & Execution Tools (Action Layer)**
How improvement happens:
- Adaptive language examples (not scripts)
- Coaching prompts tied to EI gaps
- AI-guided practice and role-play
- Manager coaching recommendations
- Compliance-safe framing (guidance, not mandated language)

### 5. Coaching Modules
- Discovery Questions Mastery
- Stakeholder Mapping
- Clinical Evidence Communication
- Objection Handling
- Closing Techniques
- EI Mastery for Pharma

### 6. Knowledge Base
- FDA regulatory information
- Clinical trial design fundamentals
- HIPAA compliance guidelines
- HCP engagement best practices
- Market access and payer dynamics
- Drug pricing and transparency

## Technical Architecture

### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS with Shadcn UI components
- Dark/Light theme support

### Backend
- Express.js server
- OpenAI gpt-4o integration for AI features
- In-memory storage (MemStorage) for sessions
- RESTful API design

### Key Files
- `client/src/App.tsx` - Main application with routing and layout
- `client/src/pages/` - Page components for each feature
- `client/src/lib/data.ts` - Static data for frameworks, modules, scenarios
- `server/routes.ts` - API endpoints
- `server/openai.ts` - OpenAI integration with demo fallbacks
- `server/storage.ts` - In-memory data storage
- `shared/schema.ts` - TypeScript schemas and types

## API Endpoints

### Chat
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/send` - Send message and get AI response (accepts optional `context` with diseaseState/hcpProfile)
- `POST /api/chat/clear` - Clear chat history
- `POST /api/chat/summary` - Generate session summary with key takeaways

### SQL Translation
- `GET /api/sql/history` - Get query history
- `POST /api/sql/translate` - Translate natural language to SQL

### Role-Play
- `GET /api/roleplay/session` - Get current session
- `POST /api/roleplay/start` - Start new scenario
- `POST /api/roleplay/respond` - Send response in role-play
- `POST /api/roleplay/end` - End session and get analysis

### Status
- `GET /api/status` - Check OpenAI API key configuration

## Environment Variables
- `OPENAI_API_KEY` (optional) - Enables full AI features. Without it, app runs in demo mode with sample responses.

### Cloudflare Worker Integration (Optional)
- `VITE_API_BASE_URL` - Set to your Cloudflare Worker URL to use external backend (e.g., `https://my-worker.workers.dev`)
- `VITE_API_KEY` - Optional API key for authentication with external backend

See `docs/cloudflare-worker-api.md` for complete API specification to implement your own Cloudflare Worker backend.

## Demo Mode
When OpenAI API key is not configured:
- "Demo Mode" badge shown in header
- AI responses prefixed with "[Demo Mode]"
- Sample pharma sales coaching content provided
- All features remain functional with placeholder AI responses

## Development
```bash
npm run dev  # Start development server
```

The application runs on port 5000 with hot reload enabled.

## Recent Changes (December 2024)

### Phase 0-5 Restructuring
- **Navigation Restructure**: Renamed "Tools" to "Customizations" section in sidebar
- **New Pages Created**:
  - EI Metrics: Configure Core (4 metrics) and Extended (6 metrics) emotional intelligence metrics
  - Exercises: Practice exercises from coaching modules
  - Data and Reports: Renamed from SQL Translator with manager-level access indication
- **Sidebar Navigation Order**:
  - Main: Dashboard, AI Coach, Role Play Simulator, Exercises
  - Customizations: EI Metrics, Selling and Coaching Frameworks, Data and Reports, Knowledge Base
- **AI Coach Dropdown Restructure**: 
  - Disease State → Specialty (filtered by disease state) → HCP Category → Influence & Decision Drivers
  - No named HCPs in AI Coach (uses generic decision signals)
  - DISC Model toggle (optional behavioral lens - off by default)
  - Adaptive coaching tone (AI automatically adjusts based on question type)
- **Role Play maintains named HCP profiles** for realistic simulation practice
- **Dashboard Quick Actions** updated: AI Coach, Role Play Simulator, Exercises, Knowledge Base

### Signal Intelligence & DISC Updates
- **Signal Intelligence Now Wired**: Backend AI responses now include observable signals (verbal, conversational, engagement, contextual cues) that are displayed in the Signal Intelligence panel in real-time
- **DISC Model Toggle**: Added a toggle switch in AI Coach to enable/disable DISC behavioral communication lens - off by default, only referenced when explicitly enabled
- **Observable Signals Only**: All AI feedback framed around observable behaviors, never inferring personality/emotional state

### Previous Changes
- **Post-Roleplay Feedback Dialog**: Comprehensive performance analysis with Layer 1 EI metrics (10 metrics) and Sales Skills rubrics (5 metrics)
- **Live EI Analysis Panel**: Real-time EI scoring during role-play with animated metric cards
- **Layer 1 EI Framework**: Authentic 10-metric framework (empathy, clarity, compliance, discovery, objection-handling, confidence, active-listening, adaptability, action-insight, resilience)
- Expanded Role-Play Simulator to 19 real-world scenarios based on industry data
- Added Impact section to scenario cards showing measurable outcomes
- Context-aware AI responses based on selected disease state and HCP profile
- Demo mode implementation for API key-free usage
- Comprehensive three-layer hierarchy (EI, Behavioral Models, Coaching Tools)
- Industry-specific knowledge base
