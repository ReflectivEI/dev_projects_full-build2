# Cloudflare Worker API Specification

This document describes all API endpoints that your Cloudflare Worker needs to implement to work with the ReflectivAI Sales Enablement app.

## Configuration

To connect your Cloudflare Worker to the app, set these environment variables:

```bash
VITE_API_BASE_URL=https://your-worker.your-subdomain.workers.dev
VITE_API_KEY=your-optional-api-key  # Only if your Worker requires authentication
```

## CORS Configuration

Your Cloudflare Worker must include these CORS headers in responses:

```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or specify your frontend domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight requests
if (request.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}
```

---

## API Endpoints

### 1. Status Check

**GET** `/api/status`

Returns the API status and configuration.

**Response:**
```json
{
  "openaiConfigured": true,
  "message": "AI features are fully enabled"
}
```

---

### 2. Chat Endpoints

#### Get Chat Messages
**GET** `/api/chat/messages`

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "How do I handle objections?",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "role": "assistant", 
      "content": "Here are some techniques...",
      "timestamp": "2024-01-15T10:30:05Z"
    }
  ]
}
```

#### Send Chat Message
**POST** `/api/chat/send`

**Request:**
```json
{
  "message": "How do I handle price objections in oncology?"
}
```

**Response:**
```json
{
  "id": 3,
  "role": "assistant",
  "content": "When handling price objections in oncology...",
  "timestamp": "2024-01-15T10:31:00Z"
}
```

#### Clear Chat History
**POST** `/api/chat/clear`

**Response:**
```json
{
  "success": true
}
```

#### Get Session Summary
**POST** `/api/chat/summary`

Generates a summary of the current coaching conversation with key takeaways and action items.

**Response:**
```json
{
  "summary": "This coaching session focused on handling price objections using emotional intelligence frameworks...",
  "keyTakeaways": [
    "Active listening helps understand underlying objection reasons",
    "Use the Feel-Felt-Found technique for price concerns",
    "Focus on value communication over price justification"
  ],
  "skillsDiscussed": ["Active Listening", "Empathy Mapping", "Value Communication"],
  "actionItems": [
    "Practice the Feel-Felt-Found technique in your next meeting",
    "Prepare 3 value-focused talking points"
  ],
  "nextSteps": "Try the Role-Play Simulator to practice these techniques in realistic scenarios"
}
```

---

### 3. SQL Translation Endpoints

#### Get SQL History
**GET** `/api/sql/history`

**Response:**
```json
{
  "queries": [
    {
      "id": "sql-1",
      "naturalLanguage": "Show me top 10 sales by region",
      "sqlQuery": "SELECT region, SUM(sales) as total_sales FROM sales_data GROUP BY region ORDER BY total_sales DESC LIMIT 10;",
      "explanation": "This query groups sales by region...",
      "timestamp": "2024-01-15T09:00:00Z"
    }
  ]
}
```

#### Translate Natural Language to SQL
**POST** `/api/sql/translate`

**Request:**
```json
{
  "question": "What are the top 5 products by revenue this quarter?"
}
```

**Response:**
```json
{
  "id": "sql-2",
  "naturalLanguage": "What are the top 5 products by revenue this quarter?",
  "sqlQuery": "SELECT product_name, SUM(revenue) as total_revenue FROM sales WHERE quarter = CURRENT_QUARTER GROUP BY product_name ORDER BY total_revenue DESC LIMIT 5;",
  "explanation": "This query calculates total revenue per product for the current quarter and returns the top 5."
}
```

---

### 4. Role-Play Endpoints

#### Get Current Session
**GET** `/api/roleplay/session`

**Response (no active session):**
```json
{
  "session": null
}
```

**Response (active session):**
```json
{
  "session": {
    "id": "rp-123",
    "scenarioId": "oncologist-skeptical",
    "scenarioTitle": "Skeptical Oncologist",
    "stakeholderName": "Dr. Sarah Chen",
    "stakeholderRole": "Oncologist",
    "difficulty": "intermediate",
    "messages": [
      {
        "role": "stakeholder",
        "content": "I've heard about your new medication, but I'm not convinced the efficacy data is strong enough."
      }
    ]
  }
}
```

#### Start Role-Play Session
**POST** `/api/roleplay/start`

**Request:**
```json
{
  "scenarioId": "oncologist-skeptical",
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "session": {
    "id": "rp-124",
    "scenarioId": "oncologist-skeptical",
    "scenarioTitle": "Skeptical Oncologist",
    "stakeholderName": "Dr. Sarah Chen",
    "stakeholderRole": "Oncologist",
    "difficulty": "intermediate",
    "messages": [
      {
        "role": "stakeholder",
        "content": "Good morning. I have about 10 minutes before my next patient. What did you want to discuss about your new oncology treatment?"
      }
    ]
  }
}
```

#### Send Role-Play Response
**POST** `/api/roleplay/respond`

**Request:**
```json
{
  "message": "Thank you for your time, Dr. Chen. I wanted to share some recent Phase 3 trial data..."
}
```

**Response:**
```json
{
  "stakeholderResponse": "Interesting. What were the primary endpoints in that trial?",
  "eqAnalysis": {
    "score": 85,
    "strengths": ["Good rapport building", "Professional tone"],
    "improvements": ["Could ask more discovery questions"],
    "frameworksUsed": ["active-listening", "rapport-building"]
  }
}
```

#### End Role-Play Session
**POST** `/api/roleplay/end`

**Response:**
```json
{
  "messages": [...],
  "analysis": {
    "overallScore": 82,
    "eqScore": 78,
    "technicalScore": 86,
    "strengths": [
      "Excellent use of clinical data",
      "Good rapport building"
    ],
    "areasForImprovement": [
      "Ask more open-ended questions",
      "Allow more time for stakeholder responses"
    ],
    "frameworksApplied": ["disc", "active-listening"],
    "recommendations": [
      "Practice the DISC model for better stakeholder adaptation"
    ]
  }
}
```

---

### 5. Knowledge Base Q&A

**POST** `/api/knowledge/ask`

**Request:**
```json
{
  "question": "What are the FDA requirements for Phase 3 clinical trials?",
  "articleContext": "optional-article-id-for-context"
}
```

**Response:**
```json
{
  "answer": "Phase 3 clinical trials must meet several FDA requirements including...",
  "relatedTopics": ["FDA regulations", "Drug approval process", "Clinical trial phases"]
}
```

---

### 6. Framework Advisor

**POST** `/api/frameworks/advice`

**Request:**
```json
{
  "frameworkId": "disc",
  "frameworkName": "DISC Model",
  "situation": "Meeting with a skeptical cardiologist who is data-driven and analytical"
}
```

**Response:**
```json
{
  "advice": "Based on the DISC model, this cardiologist likely displays high 'C' (Conscientiousness) traits...",
  "practiceExercise": "Role-play scenario: Prepare a data-heavy presentation and practice responding to detailed technical questions...",
  "tips": [
    "Lead with clinical evidence and statistics",
    "Be prepared for detailed follow-up questions",
    "Avoid overselling - stick to facts"
  ]
}
```

---

### 7. Module Exercise Generator

**POST** `/api/modules/exercise`

**Request:**
```json
{
  "moduleTitle": "Discovery Questions Mastery",
  "moduleDescription": "Learn to ask powerful questions that uncover stakeholder needs",
  "exerciseType": "quiz"
}
```

**Response:**
```json
{
  "title": "Discovery Questions Practice Quiz",
  "instructions": "Select the best discovery question for each scenario.",
  "content": [
    {
      "question": "A cardiologist mentions they're looking for new treatment options. What's the best discovery question?",
      "options": [
        "Would you like to hear about our new medication?",
        "What specific patient outcomes are you hoping to improve?",
        "How many patients do you see per week?",
        "Have you tried our competitor's product?"
      ],
      "correctAnswer": "What specific patient outcomes are you hoping to improve?",
      "explanation": "This open-ended question uncovers the stakeholder's priorities and needs."
    }
  ]
}
```

---

### 8. Heuristics Customizer

**POST** `/api/heuristics/customize`

**Request:**
```json
{
  "templateName": "Feel-Felt-Found",
  "templatePattern": "I understand how you feel... Others have felt... They found...",
  "userSituation": "Cardiologist concerned about drug costs for elderly patients"
}
```

**Response:**
```json
{
  "customizedTemplate": "I understand how you feel about the cost burden on elderly patients. Many cardiologists have felt the same concern. They found that our patient assistance program significantly reduces out-of-pocket costs...",
  "example": "Dr. Smith, I completely understand your concern about medication costs for your elderly patients on fixed incomes...",
  "tips": [
    "Acknowledge the valid concern first",
    "Reference similar situations with other physicians",
    "Present concrete solutions like patient assistance programs"
  ]
}
```

---

### 9. Dashboard Insights

**GET** `/api/dashboard/insights`

**Response:**
```json
{
  "dailyTip": "Focus on asking more open-ended questions today to better understand stakeholder needs.",
  "focusArea": "Discovery Questions",
  "suggestedExercise": {
    "title": "Active Listening Practice",
    "description": "During your next call, practice summarizing what the stakeholder says before responding."
  },
  "motivationalQuote": "The best salespeople don't sell - they help customers buy."
}
```

---

## Error Handling

All endpoints should return errors in this format:

```json
{
  "error": "Description of what went wrong"
}
```

With appropriate HTTP status codes:
- `400` - Bad request (missing required fields)
- `401` - Unauthorized (invalid API key)
- `500` - Internal server error

---

## Example Cloudflare Worker Structure

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };
    
    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Route handling
    if (path === "/api/status" && request.method === "GET") {
      return Response.json(
        { openaiConfigured: true, message: "AI features enabled" },
        { headers: corsHeaders }
      );
    }
    
    if (path === "/api/chat/send" && request.method === "POST") {
      const body = await request.json();
      // Call OpenAI API here
      const response = await callOpenAI(body.message, env.OPENAI_API_KEY);
      return Response.json(response, { headers: corsHeaders });
    }
    
    // Add more routes...
    
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
};
```
