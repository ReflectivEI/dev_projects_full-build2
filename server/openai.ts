import OpenAI from "openai";

// Use gpt-4o for reliable responses
// Initialize OpenAI client only if API key is available
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export function isOpenAIConfigured(): boolean {
  return !!openai;
}

const PHARMA_SALES_SYSTEM_PROMPT = `You are an expert AI Sales Coach specializing in Life Sciences, Biotech, and Pharmaceutical sales. Your coaching is powered by Signal Intelligence — the ability to notice, interpret, and respond appropriately to observable signals during professional interactions.

## ADAPTIVE COACHING STYLE
Automatically adapt your coaching tone based on the user's question:
- For ANALYTICAL questions (data, metrics, ROI, evidence): Be methodical, data-driven, break down performance metrics, reference frameworks and best practices
- For EMOTIONAL/CONFIDENCE questions (frustration, self-doubt, motivation): Be warm, supportive, encouraging, acknowledge challenges, build confidence with positive framing
- For TACTICAL/URGENT questions (quick tips, what to say, immediate help): Be direct, concise, actionable, give clear next steps without sugarcoating
- For STRATEGIC/GROWTH questions (career, skills development, long-term): Be inspiring, push for full potential, celebrate progress, frame challenges as growth opportunities

Sense the emotional tone and urgency in the user's message and respond appropriately. Match energy—if they're stressed, be calming; if they're curious, be engaging; if they're frustrated, acknowledge and redirect constructively.

## LAYER 1 — Signal Intelligence (Core Measurement Layer)
Signal Intelligence refers to DEMONSTRATED CAPABILITY — how effectively a user:
- Accurately perceives observable signals from others
- Interprets those signals appropriately in context
- Regulates their response
- Adapts communication in ways that preserve trust, clarity, and credibility

Key metrics: Empathy Accuracy, Discovery Depth, Clarity & Alignment, Adaptive Communication.
EI is measured through observable behaviors, NOT personality traits. It is not diagnostic.

## LAYER 2 — Behavioral Communication Models (Optional Supporting Lens)
How sellers adapt their approach:
- Active Listening techniques
- Empathy Mapping (what stakeholders Think, Feel, Say, Do)
- Rapport Building strategies
- DISC Communication Styles: An OPTIONAL behavioral lens that describes observable communication preferences. Only reference DISC if the user has explicitly enabled it.

## LAYER 3 — Coaching & Execution Tools (Action Layer)
How improvement happens:
- Adaptive language examples (not scripts)
- Coaching prompts tied to demonstrated EI gaps
- AI-guided practice and role-play
- Manager coaching recommendations

When responding:
- Frame all feedback around observable signals and demonstrated behaviors
- Never infer emotional state, personality, intent, or permanent traits
- Present insights as interpretive observations, not truths
- Provide actionable, specific advice tailored to pharma sales contexts
- Reference the appropriate layer when giving advice
- Do NOT mention or use DISC unless the user has explicitly enabled DISC mode

Keep responses focused and practical. If asked about unrelated topics, politely redirect to sales coaching.

When disease state or HCP profile context is provided, tailor your advice specifically to that therapeutic area and stakeholder type.`;

type ChatContext = {
  diseaseState?: string;
  hcpProfile?: {
    name: string;
    specialty: string;
    setting: string;
    style: string;
  };
  discEnabled?: boolean;
};

export interface ObservableSignal {
  type: "verbal" | "conversational" | "engagement" | "contextual";
  signal: string;
  interpretation: string;
  suggestedResponse?: string;
}

export interface ChatResponseWithSignals {
  content: string;
  signals: ObservableSignal[];
}

const SQL_SYSTEM_PROMPT = `You are an expert SQL query translator for pharmaceutical sales data analysis. Convert natural language questions into valid PostgreSQL queries.

The database schema includes these common tables:
- sales_calls (id, rep_id, physician_id, territory_id, call_date, duration_minutes, samples_distributed, notes)
- physicians (id, name, specialty, institution, npi_number, address, city, state)
- prescriptions (id, physician_id, product_id, prescription_count, prescription_date, therapeutic_area)
- products (id, product_name, therapeutic_area, launch_date, price)
- territories (id, territory_name, region, rep_id)
- contacts (id, physician_id, contact_date, contact_type, outcome)

Guidelines:
1. Write clean, readable SQL with proper formatting
2. Use appropriate JOINs, GROUP BY, ORDER BY clauses
3. Include relevant aggregations (COUNT, SUM, AVG) when needed
4. Use date functions appropriately (DATE_TRUNC, INTERVAL, CURRENT_DATE)
5. Always return the SQL query and a brief explanation

Respond in JSON format: { "sql": "...", "explanation": "..." }`;

const ROLEPLAY_SYSTEM_PROMPT = `You are playing the role of a healthcare professional (HCP) in a pharma sales training role-play. The USER is the pharmaceutical sales rep practicing their skills. YOU are the HCP they are calling on.

CRITICAL IDENTITY RULES:
- YOU are the HCP with the name provided in the scenario (e.g., "Dr. Smith", "Karen Mitchell, NP")
- The USER is the sales representative - NEVER address them by your HCP name
- Address the user as "you" or use neutral terms like "the rep" - do NOT use any name for them
- If you need to reference yourself, use YOUR HCP character name

As the HCP stakeholder:
- Express realistic concerns, questions, and objections relevant to your clinical practice
- Respond to the sales rep based on their approach and how well they communicate
- Show appropriate skepticism or interest based on the quality of their pitch
- React to signal intelligence techniques (or lack thereof)
- Occasionally test the rep with challenging clinical questions or objections

HANDLING OFF-TOPIC OR PERSONAL QUESTIONS:
- If the rep brings up personal matters (family health, personal stories, etc.), acknowledge briefly but redirect professionally
- Example: "I appreciate you sharing that. Now, getting back to my patients here at the clinic..."
- Stay in character - you're a busy HCP, so gently steer back to the clinical discussion
- Do NOT break character to give medical advice about the rep's personal/family health
- Do NOT act as a general medical assistant - stay focused on the role-play scenario

After each response, internally evaluate the rep's:
- Use of active listening
- Empathy and rapport building
- Communication style adaptation
- Clinical knowledge accuracy
- Objection handling skill

Keep responses concise and realistic for a busy healthcare professional.`;

// Demo mode message
const DEMO_MODE_NOTICE = `[Demo Mode] This is a sample response. To enable full AI-powered coaching with personalized feedback, please configure your OpenAI API key.

`;

// Demo responses for when API key is not available - clearly marked as demo content
const DEMO_RESPONSES = {
  chat: [
    `${DEMO_MODE_NOTICE}When handling price objections, I recommend using the 'Feel-Felt-Found' technique:

1. **Feel**: "I understand how you feel about the cost."
2. **Felt**: "Other physicians have felt the same way initially."
3. **Found**: "What they've found is that the reduction in hospitalizations often offsets the therapy cost."

This approach shows empathy while guiding stakeholders to a value-based perspective. Try practicing this in a role-play scenario!`,
    `${DEMO_MODE_NOTICE}Building rapport with skeptical KOLs requires a value-first approach:

1. **Research First**: Before the meeting, review their recent publications and ongoing studies
2. **Lead with Value**: Share relevant clinical insights that could help their practice
3. **Show Genuine Interest**: Ask thoughtful questions about their research

Over time, this builds trust and positions you as a valuable resource rather than just a sales rep. The key Layer 1 (Signal Intelligence) demonstrated capabilities here are Empathy Accuracy and Active Listening—observable skills that help you perceive and respond to signals from the KOL.`,
    `${DEMO_MODE_NOTICE}Understanding communication styles helps you adapt your approach effectively. Note: DISC is an optional behavioral lens—it helps you recognize observable communication preferences, not emotional capability or personality traits.

Here's how to adapt your communication approach:

- **Direct communicators (D-style)**: Get to the bottom line fast. Lead with efficacy data and outcomes.
- **Collaborative communicators (I-style)**: Build the relationship. Connect personally before diving into data.
- **Steady communicators (S-style)**: Take your time. Provide reassurance and don't rush decisions.
- **Analytical communicators (C-style)**: Come prepared with detailed data, methodology, and publications.

Practice identifying communication preferences in your next meetings and adjust your approach accordingly.`,
  ],
  sql: {
    default: {
      sql: `-- Demo Mode: Sample SQL Query
SELECT 
    p.name,
    p.specialty,
    COUNT(*) as total_calls
FROM physicians p
JOIN sales_calls sc ON p.id = sc.physician_id
WHERE sc.call_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.id, p.name, p.specialty
ORDER BY total_calls DESC
LIMIT 10;`,
      explanation: "[Demo Mode] This query retrieves the top 10 physicians by number of sales calls in the last 30 days. Configure your OpenAI API key for AI-powered query generation."
    }
  },
  roleplay: [
    `${DEMO_MODE_NOTICE}*The physician looks up from their computer*

Yes, come in. I have about 10 minutes before my next patient. What do you have for me today?`,
    `${DEMO_MODE_NOTICE}*The physician considers your points*

Interesting. But I've been using the current standard of care for years with good results. What specifically makes your therapy different from what I'm already prescribing?`,
    `${DEMO_MODE_NOTICE}*The physician nods thoughtfully*

The efficacy data looks promising, but what about the cost? Many of my patients already struggle with medication adherence due to financial barriers. How do you address that?`,
    `${DEMO_MODE_NOTICE}*The physician leans back*

I appreciate the information, but I'd really need to see more real-world evidence before I consider switching my stable patients. Do you have any post-marketing data from clinical practice?`,
  ]
};

let demoResponseIndex = 0;
let roleplayResponseIndex = 0;

const SIGNAL_INTELLIGENCE_PROMPT = `

## SIGNAL INTELLIGENCE OUTPUT
After your coaching response, you MUST include a JSON block with observable signals detected from the user's message. This helps the user understand what behavioral cues you noticed.

Format your response as:
1. Your coaching advice (normal text)
2. Then on a new line, include: ===SIGNALS===
3. Then a JSON array of signals you observed

Signal types (choose the most appropriate):
- "verbal": Word choice, tone indicators, language patterns in their message
- "conversational": Question types, response patterns, dialogue flow
- "engagement": Level of detail, follow-up depth, topic focus
- "contextual": Situational factors, timing, priorities mentioned

Each signal should have:
- type: one of the above
- signal: The specific observable cue (what you noticed)
- interpretation: What this might indicate (framed as possibility, not certainty)
- suggestedResponse: (optional) How to respond to this signal

Example output:
Your coaching response text here...

===SIGNALS===
[{"type":"verbal","signal":"User asked about 'handling pushback'","interpretation":"May be encountering resistance in current calls","suggestedResponse":"Practice objection-handling scenarios"},{"type":"engagement","signal":"Detailed question about specific HCP type","interpretation":"Preparing for an upcoming interaction with this stakeholder"}]

IMPORTANT: Always include at least 1-2 signals. Frame interpretations as possibilities, never certainties. Focus on OBSERVABLE behaviors only.`;

export async function getChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  context?: ChatContext
): Promise<ChatResponseWithSignals> {
  if (!openai) {
    // Return demo response when API key is not available
    const response = DEMO_RESPONSES.chat[demoResponseIndex % DEMO_RESPONSES.chat.length];
    demoResponseIndex++;
    return { 
      content: response, 
      signals: [
        {
          type: "verbal",
          signal: "Demo mode active",
          interpretation: "System running without OpenAI API key configured"
        }
      ]
    };
  }

  try {
    // Build system prompt with context if provided
    let systemPrompt = PHARMA_SALES_SYSTEM_PROMPT;
    
    // Add DISC if enabled
    if (context?.discEnabled) {
      systemPrompt += `\n\n**DISC Communication Model ENABLED**
You may now use DISC behavioral insights in your coaching. When relevant, reference how the user might adapt their communication style:
- D (Dominance): Direct, results-focused stakeholders - get to the point, emphasize outcomes
- I (Influence): Enthusiastic, relationship-focused stakeholders - be warm, collaborative, share stories
- S (Steadiness): Patient, stability-seeking stakeholders - provide reassurance, avoid rushing
- C (Conscientiousness): Analytical, detail-oriented stakeholders - lead with data, be precise

Remember: DISC describes observable communication PREFERENCES, not personality or EI capability.`;
    }
    
    if (context?.diseaseState || context?.hcpProfile) {
      systemPrompt += "\n\n**Current Session Context:**";
      
      if (context.diseaseState) {
        systemPrompt += `\n- Disease State/Therapeutic Area: ${context.diseaseState}`;
      }
      
      if (context.hcpProfile) {
        systemPrompt += `\n- HCP Profile: ${context.hcpProfile.name}`;
        systemPrompt += `\n  - Specialty: ${context.hcpProfile.specialty}`;
        systemPrompt += `\n  - Setting: ${context.hcpProfile.setting}`;
        systemPrompt += `\n  - Communication Style: ${context.hcpProfile.style}`;
        systemPrompt += `\n\nTailor your coaching advice specifically for conversations with this type of HCP in this therapeutic area. Consider their communication preferences and clinical priorities when providing suggestions.`;
      }
    }
    
    // Add signal intelligence instructions
    systemPrompt += SIGNAL_INTELLIGENCE_PROMPT;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      ],
      max_completion_tokens: 1500,
    });

    const rawContent = response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
    
    // Parse signals from response
    let content = rawContent;
    let signals: ObservableSignal[] = [];
    
    const signalMarker = "===SIGNALS===";
    const markerIndex = rawContent.indexOf(signalMarker);
    
    if (markerIndex !== -1) {
      content = rawContent.substring(0, markerIndex).trim();
      const signalsPart = rawContent.substring(markerIndex + signalMarker.length).trim();
      
      try {
        // Extract JSON array from the signals part
        const jsonMatch = signalsPart.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          signals = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Failed to parse signals JSON:", e);
        // Continue without signals if parsing fails
      }
    }
    
    return { content, signals };
  } catch (error: any) {
    console.error("OpenAI chat error:", error);
    throw new Error("Failed to get AI response. Please check your API key configuration.");
  }
}

export async function translateToSql(naturalLanguage: string): Promise<{ sql: string; explanation: string }> {
  if (!openai) {
    // Return demo SQL when API key is not available
    const queryLower = naturalLanguage.toLowerCase();
    
    if (queryLower.includes("prescri")) {
      return {
        sql: `-- Demo Mode: Sample SQL Query
SELECT 
    product_name,
    SUM(prescription_count) as total_rx
FROM prescriptions pr
JOIN products p ON pr.product_id = p.id
WHERE prescription_date >= DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '3 months')
GROUP BY product_name
ORDER BY total_rx DESC
LIMIT 10;`,
        explanation: "[Demo Mode] This query retrieves the top 10 products by prescription volume. Configure your OpenAI API key for AI-powered query generation."
      };
    }
    
    if (queryLower.includes("territory") || queryLower.includes("sample")) {
      return {
        sql: `-- Demo Mode: Sample SQL Query
SELECT 
    t.territory_name,
    AVG(sc.samples_distributed) as avg_samples
FROM sales_calls sc
JOIN territories t ON sc.territory_id = t.id
GROUP BY t.territory_name
ORDER BY avg_samples DESC;`,
        explanation: "[Demo Mode] This query calculates the average samples distributed per call for each territory. Configure your OpenAI API key for AI-powered query generation."
      };
    }
    
    if (queryLower.includes("contact") || queryLower.includes("30 days") || queryLower.includes("month")) {
      return {
        sql: `-- Demo Mode: Sample SQL Query
SELECT 
    p.name,
    p.specialty,
    p.institution,
    MAX(c.contact_date) as last_contact
FROM physicians p
LEFT JOIN contacts c ON p.id = c.physician_id
GROUP BY p.id, p.name, p.specialty, p.institution
HAVING MAX(c.contact_date) < CURRENT_DATE - INTERVAL '30 days'
   OR MAX(c.contact_date) IS NULL;`,
        explanation: "[Demo Mode] This query finds physicians who haven't been contacted in the last 30 days. Configure your OpenAI API key for AI-powered query generation."
      };
    }
    
    return DEMO_RESPONSES.sql.default;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SQL_SYSTEM_PROMPT },
        { role: "user", content: `Translate this question to SQL: "${naturalLanguage}"` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 512,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);
    return {
      sql: result.sql || "-- Unable to generate SQL",
      explanation: result.explanation || "SQL query generated from your question."
    };
  } catch (error: any) {
    console.error("OpenAI SQL translation error:", error);
    throw new Error("Failed to translate to SQL. Please check your API key configuration.");
  }
}

// Generate tailored scenario content based on disease state and HCP profile
export async function generateTailoredScenarioContent(
  scenario: {
    title: string;
    description: string;
    category: string;
    stakeholder: string;
    objective: string;
    context: string;
    challenges: string[];
    keyMessages: string[];
    impact?: string[];
    suggestedPhrasing?: string[];
  },
  diseaseState?: string,
  hcpProfile?: {
    name: string;
    specialty: string;
    setting: string;
    style: string;
  }
): Promise<{
  stakeholder: string;
  objective: string;
  context: string;
  challenges: string[];
  keyMessages: string[];
  impact: string[];
  suggestedPhrasing: string[];
}> {
  // Return original content if no context is provided
  if (!diseaseState && !hcpProfile) {
    return {
      stakeholder: scenario.stakeholder,
      objective: scenario.objective,
      context: scenario.context,
      challenges: scenario.challenges,
      keyMessages: scenario.keyMessages,
      impact: scenario.impact || [],
      suggestedPhrasing: scenario.suggestedPhrasing || []
    };
  }

  if (!openai) {
    // Demo mode: Return slightly modified content
    const prefix = diseaseState ? `[${diseaseState}] ` : "";
    const hcpPrefix = hcpProfile ? `[For ${hcpProfile.specialty}] ` : "";
    return {
      stakeholder: hcpProfile ? `${hcpProfile.name} - ${hcpProfile.specialty}` : scenario.stakeholder,
      objective: `${prefix}${scenario.objective}`,
      context: `${prefix}${scenario.context}`,
      challenges: scenario.challenges.map((c, i) => i === 0 ? `${prefix}${c}` : c),
      keyMessages: scenario.keyMessages.map((m, i) => i === 0 ? `${hcpPrefix}${m}` : m),
      impact: (scenario.impact || []).map((imp, i) => i === 0 ? `${prefix}${imp}` : imp),
      suggestedPhrasing: (scenario.suggestedPhrasing || []).map((p, i) => i === 0 ? `${hcpPrefix}${p}` : p)
    };
  }

  try {
    let contextDescription = "";
    if (diseaseState) {
      contextDescription += `Disease State/Therapeutic Area: ${diseaseState}\n`;
    }
    if (hcpProfile) {
      contextDescription += `HCP Profile: ${hcpProfile.name} - ${hcpProfile.specialty} (${hcpProfile.setting})\n`;
      contextDescription += `Communication Style: ${hcpProfile.style}\n`;
    }

    const prompt = `You are an expert pharmaceutical sales coach. Given a sales scenario and specific context, generate tailored content that adapts the scenario to the given disease state and/or HCP profile.

ORIGINAL SCENARIO:
Title: ${scenario.title}
Description: ${scenario.description}
Category: ${scenario.category}
Stakeholder: ${scenario.stakeholder}
Objective: ${scenario.objective}
Context: ${scenario.context}

Original Challenges: ${JSON.stringify(scenario.challenges)}
Original Key Messages: ${JSON.stringify(scenario.keyMessages)}
Original Impact: ${JSON.stringify(scenario.impact || [])}
Original Suggested Phrasing: ${JSON.stringify(scenario.suggestedPhrasing || [])}

NEW CONTEXT TO ADAPT FOR:
${contextDescription}

Generate NEW, TAILORED versions of the ENTIRE scenario content that are specifically relevant to the provided disease state and/or HCP profile. This includes:
- A new stakeholder name and title appropriate for the therapeutic area
- A new objective tailored to the disease state and HCP type
- A new context paragraph that reflects the clinical setting and challenges specific to the therapeutic area
- New challenges, key messages, impact statements, and suggested phrasing

The content should:
1. Be specific to the therapeutic area (${diseaseState || 'provided context'}) and its clinical realities
2. If an HCP profile is provided, make the stakeholder match that HCP's specialty and setting
3. Reflect the HCP's communication style and priorities if provided
4. Maintain the same number of items as the original (or 3-4 if original is empty)
5. Be practical, realistic, and actionable for pharma sales
6. Feel like a completely new scenario tailored to the context, not just minor edits

Respond in JSON format:
{
  "stakeholder": "Name, Title - Setting (e.g., Dr. Jane Smith, MD - Infectious Disease Specialist at University Hospital)",
  "objective": "The tailored sales objective for this therapeutic area",
  "context": "A 2-3 sentence context paragraph specific to the disease state and clinical setting",
  "challenges": ["challenge1", "challenge2", "challenge3", "challenge4"],
  "keyMessages": ["message1", "message2", "message3", "message4"],
  "impact": ["impact1", "impact2", "impact3", "impact4"],
  "suggestedPhrasing": ["phrase1", "phrase2", "phrase3"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert pharmaceutical sales coach. Generate tailored, specific content for sales training scenarios. Always respond in valid JSON format." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);
    return {
      stakeholder: result.stakeholder || scenario.stakeholder,
      objective: result.objective || scenario.objective,
      context: result.context || scenario.context,
      challenges: result.challenges || scenario.challenges,
      keyMessages: result.keyMessages || scenario.keyMessages,
      impact: result.impact || scenario.impact || [],
      suggestedPhrasing: result.suggestedPhrasing || scenario.suggestedPhrasing || []
    };
  } catch (error: any) {
    console.error("OpenAI tailored content error:", error);
    // Return original content on error
    return {
      stakeholder: scenario.stakeholder,
      objective: scenario.objective,
      context: scenario.context,
      challenges: scenario.challenges,
      keyMessages: scenario.keyMessages,
      impact: scenario.impact || [],
      suggestedPhrasing: scenario.suggestedPhrasing || []
    };
  }
}

export async function getRoleplayResponse(
  scenario: {
    title: string;
    stakeholder: string;
    context: string;
    objective: string;
    challenges: string[];
  },
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  context?: ChatContext
): Promise<string> {
  if (!openai) {
    // Return demo roleplay response
    const response = DEMO_RESPONSES.roleplay[roleplayResponseIndex % DEMO_RESPONSES.roleplay.length];
    roleplayResponseIndex++;
    return response;
  }

  try {
    let scenarioContext = `
SCENARIO: ${scenario.title}
YOUR ROLE: ${scenario.stakeholder}
CONTEXT: ${scenario.context}
REP'S OBJECTIVE: ${scenario.objective}
CHALLENGES TO PRESENT: ${scenario.challenges.join(", ")}`;

    // Add disease state and HCP profile context if provided
    if (context?.diseaseState) {
      scenarioContext += `\nTHERAPEUTIC AREA FOCUS: ${context.diseaseState}`;
    }
    
    if (context?.hcpProfile) {
      scenarioContext += `\nHCP PERSONA OVERRIDE:
- Name: ${context.hcpProfile.name}
- Specialty: ${context.hcpProfile.specialty}
- Setting: ${context.hcpProfile.setting}
- Communication Style: ${context.hcpProfile.style}

Adapt your responses to match this HCP's communication style and clinical priorities.`;
    }

    scenarioContext += `\n\nStay in character as this stakeholder. Be realistic but not impossible to work with.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ROLEPLAY_SYSTEM_PROMPT + "\n\n" + scenarioContext },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
      ],
      max_completion_tokens: 512,
    });

    return response.choices[0].message.content || "I don't have time for this meeting right now.";
  } catch (error: any) {
    console.error("OpenAI roleplay error:", error);
    throw new Error("Failed to get roleplay response. Please check your API key configuration.");
  }
}

// Knowledge Base Q&A - Answer questions about pharma industry topics
export async function getKnowledgeAnswer(
  question: string,
  articleContext?: { title: string; content: string }
): Promise<{ answer: string; relatedTopics: string[] }> {
  if (!openai) {
    return {
      answer: `${DEMO_MODE_NOTICE}This is a sample answer about pharma industry topics. The FDA approval process typically involves three main phases of clinical trials, followed by NDA submission and review. Configure your OpenAI API key for personalized AI-powered answers.`,
      relatedTopics: ["FDA Regulations", "Clinical Trials", "Drug Development"]
    };
  }

  try {
    const contextPrompt = articleContext 
      ? `\n\nREFERENCE ARTICLE:\nTitle: ${articleContext.title}\nContent: ${articleContext.content}\n\nAnswer based on this article context when relevant.`
      : "";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an expert in pharmaceutical and life sciences sales. Answer questions about FDA regulations, clinical trials, HIPAA compliance, market access, drug pricing, and HCP engagement. Provide accurate, helpful information for sales professionals.${contextPrompt}
          
Respond in JSON format: { "answer": "detailed answer here", "relatedTopics": ["topic1", "topic2", "topic3"] }` 
        },
        { role: "user", content: question }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Knowledge Q&A error:", error);
    throw new Error("Failed to get answer. Please try again.");
  }
}

// Framework Advisor - Get personalized guidance on using EQ frameworks
export async function getFrameworkAdvice(
  frameworkId: string,
  frameworkName: string,
  situation: string
): Promise<{ advice: string; practiceExercise: string; tips: string[] }> {
  if (!openai) {
    return {
      advice: `${DEMO_MODE_NOTICE}For this situation, the ${frameworkName} framework suggests focusing on identifying the stakeholder's communication style first. Configure your OpenAI API key for personalized guidance.`,
      practiceExercise: "Practice identifying behavioral cues in your next meeting",
      tips: ["Observe body language", "Listen for communication patterns", "Adapt your approach"]
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an expert coach in signal intelligence frameworks for pharma sales. Provide specific, actionable advice on applying the ${frameworkName} framework.

Respond in JSON format: { "advice": "detailed personalized advice", "practiceExercise": "specific exercise to practice", "tips": ["tip1", "tip2", "tip3"] }` 
        },
        { role: "user", content: `I need help applying the ${frameworkName} framework in this situation: ${situation}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Framework advisor error:", error);
    throw new Error("Failed to get framework advice. Please try again.");
  }
}

// Module Exercise Generator - Generate AI-powered practice exercises
export async function generateModuleExercise(
  moduleTitle: string,
  moduleDescription: string,
  exerciseType: "quiz" | "practice" | "roleplay"
): Promise<{ 
  title: string; 
  instructions: string; 
  content: Array<{ question: string; options?: string[]; correctAnswer?: string; explanation: string }>;
}> {
  if (!openai) {
    return {
      title: `${moduleTitle} Practice Exercise`,
      instructions: `${DEMO_MODE_NOTICE}Complete the following practice questions to reinforce your learning.`,
      content: [
        {
          question: "What is the most important aspect of discovery questions in pharma sales?",
          options: ["Asking closed questions", "Understanding stakeholder needs", "Presenting product features", "Closing quickly"],
          correctAnswer: "Understanding stakeholder needs",
          explanation: "Discovery questions help uncover the stakeholder's true needs and challenges, enabling you to provide relevant solutions."
        }
      ]
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are creating training exercises for pharma sales professionals. Generate engaging, practical ${exerciseType} exercises for the module: ${moduleTitle}.

Respond in JSON format: { 
  "title": "Exercise title", 
  "instructions": "Clear instructions",
  "content": [
    { "question": "question text", "options": ["a", "b", "c", "d"], "correctAnswer": "correct option", "explanation": "why this is correct" }
  ]
}

Generate 3-5 questions appropriate for the exercise type.` 
        },
        { role: "user", content: `Generate a ${exerciseType} exercise for: ${moduleDescription}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1500,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Exercise generation error:", error);
    throw new Error("Failed to generate exercise. Please try again.");
  }
}

// Heuristics Customizer - Personalize templates for specific situations
export async function customizeHeuristic(
  templateName: string,
  templatePattern: string,
  userSituation: string
): Promise<{ customizedTemplate: string; example: string; tips: string[] }> {
  if (!openai) {
    return {
      customizedTemplate: `${DEMO_MODE_NOTICE}Here's a customized version of the ${templateName} template for your situation. Configure your OpenAI API key for personalized templates.`,
      example: `"I understand you're concerned about [specific concern]. Other physicians have felt the same way, and what they've found is..."`,
      tips: ["Adapt the language to your stakeholder", "Practice the delivery", "Be genuine in your approach"]
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an expert pharma sales coach. Customize the following heuristic language template for a specific situation.

Template: ${templateName}
Pattern: ${templatePattern}

Respond in JSON format: { "customizedTemplate": "the adapted template with specific language", "example": "a complete example dialogue", "tips": ["tip1", "tip2", "tip3"] }` 
        },
        { role: "user", content: `Customize this template for: ${userSituation}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Heuristic customization error:", error);
    throw new Error("Failed to customize template. Please try again.");
  }
}

// Dashboard Insights - Generate personalized daily recommendations
export async function getDashboardInsights(): Promise<{
  dailyTip: string;
  focusArea: string;
  suggestedExercise: { title: string; description: string };
  motivationalQuote: string;
}> {
  if (!openai) {
    return {
      dailyTip: `${DEMO_MODE_NOTICE}Focus on active listening in your next HCP meeting. Try paraphrasing what the stakeholder says before responding.`,
      focusArea: "Active Listening",
      suggestedExercise: { 
        title: "Paraphrasing Practice", 
        description: "In your next meeting, paraphrase at least 3 stakeholder statements before responding." 
      },
      motivationalQuote: "The most successful sales professionals listen twice as much as they speak."
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an AI sales coach providing daily insights for pharma sales professionals. Generate fresh, actionable recommendations.

Respond in JSON format: {
  "dailyTip": "specific actionable tip for today",
  "focusArea": "EQ skill to focus on",
  "suggestedExercise": { "title": "exercise name", "description": "what to practice" },
  "motivationalQuote": "inspiring quote for sales professionals"
}` 
        },
        { role: "user", content: "Generate personalized daily insights for a pharma sales professional." }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 512,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Dashboard insights error:", error);
    throw new Error("Failed to generate insights. Please try again.");
  }
}

// Session Summary - Generate key takeaways from coaching conversation
export async function generateSessionSummary(
  messages: Array<{ role: string; content: string }>
): Promise<{
  summary: string;
  keyTakeaways: string[];
  skillsDiscussed: string[];
  actionItems: string[];
  nextSteps: string;
}> {
  if (!openai) {
    return {
      summary: `${DEMO_MODE_NOTICE}This coaching session covered important pharma sales techniques including objection handling and stakeholder engagement strategies.`,
      keyTakeaways: [
        "[Demo] Focus on building rapport before presenting clinical data",
        "[Demo] Use the Feel-Felt-Found technique for price objections",
        "[Demo] Adapt communication style based on stakeholder preferences"
      ],
      skillsDiscussed: ["Objection Handling", "Communication Style Adaptation", "Active Listening"],
      actionItems: [
        "[Demo] Practice identifying communication preferences in your next meeting",
        "[Demo] Prepare 3 open-ended discovery questions"
      ],
      nextSteps: "[Demo] Review the Role-Play Simulator to practice these techniques in realistic scenarios."
    };
  }

  try {
    const conversationText = messages
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an expert pharma sales coach. Analyze this coaching conversation and provide a comprehensive session summary with actionable takeaways.

Focus on:
- Key learning points discussed
- EQ frameworks and sales techniques mentioned
- Specific action items the user should implement
- Clear next steps for continued development

Respond in JSON format: {
  "summary": "2-3 sentence overview of the coaching session",
  "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"],
  "skillsDiscussed": ["skill1", "skill2"],
  "actionItems": ["action1", "action2"],
  "nextSteps": "recommended next activity or area to focus on"
}` 
        },
        { role: "user", content: `Summarize this coaching conversation:\n\n${conversationText}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response");
    return JSON.parse(content);
  } catch (error: any) {
    console.error("Session summary error:", error);
    throw new Error("Failed to generate session summary. Please try again.");
  }
}

// Comprehensive post-roleplay analysis result type
export interface ComprehensiveFeedbackResult {
  overallScore: number;
  performanceLevel: "exceptional" | "strong" | "developing" | "emerging" | "needs-focus";
  eqScores: Array<{
    metricId: string;
    score: number;
    feedback: string;
    observedBehaviors?: number;
    totalOpportunities?: number;
    calculationNote?: string;
  }>;
  salesSkillScores: Array<{
    skillId: string;
    skillName: string;
    score: number;
    feedback: string;
    observedBehaviors?: number;
    totalOpportunities?: number;
    calculationNote?: string;
  }>;
  topStrengths: string[];
  priorityImprovements: string[];
  specificExamples: Array<{
    quote: string;
    analysis: string;
    isPositive: boolean;
  }>;
  nextSteps: string[];
  overallSummary: string;
}

const COMPREHENSIVE_FEEDBACK_PROMPT = `You are an expert pharmaceutical sales coach providing comprehensive post-roleplay feedback using the ReflectivAI three-layer framework.

## LAYER 1 — EMOTIONAL INTELLIGENCE (Core Measurement Layer)
EI refers to DEMONSTRATED CAPABILITY measured through observable behaviors. Score based on what was observed, not inferred intent or personality.

IMPORTANT: Frame all feedback around observable signals and demonstrated actions. Never infer emotional state, personality, or intent.

Rate each 1-5 based on observable behaviors:
1. **Empathy Accuracy**: How accurately the rep recognized and responded to observable HCP signals
2. **Clarity & Alignment**: How clearly the rep's response aligned to HCP's expressed needs
3. **Compliance**: Observable adherence to approved labeling and appropriate redirects
4. **Discovery Depth**: How well the rep validated assumptions and surfaced meaningful information
5. **Objection Handling**: Demonstrated ability to acknowledge and reframe concerns with evidence
6. **Confidence**: Demonstrated self-assurance in presenting data
7. **Active Listening**: Demonstrated paraphrasing and responding to what was actually said
8. **Adaptive Communication**: Demonstrated flexibility based on observed signals
9. **Action Insight**: Demonstrated ability to translate discussion into next steps
10. **Resilience**: Demonstrated composure when facing pushback

## SALES SKILLS RUBRICS
Rate each 1-5:
1. **Opening Impact**: Did the rep establish credibility and capture attention?
2. **Needs Assessment**: Did the rep thoroughly understand the HCP's situation?
3. **Value Articulation**: Did the rep clearly communicate product/solution value?
4. **Evidence-Based Selling**: Did the rep use clinical data effectively?
5. **Closing Technique**: Did the rep seek commitment or next steps?

## SCORING INTERPRETATION:
- 5: Exceptional - Multiple clear examples demonstrated naturally
- 4: Strong - Good demonstration with minor room for improvement
- 3: Developing - Some evidence but inconsistent application
- 2: Emerging - Limited demonstration, significant opportunity
- 1: Needs Focus - Little to no evidence in conversation

## PERFORMANCE LEVELS:
- 4.5-5.0: exceptional
- 3.5-4.4: strong
- 2.5-3.4: developing
- 1.5-2.4: emerging
- 1.0-1.4: needs-focus

Respond in this exact JSON format:
{
  "overallScore": (1-5 average),
  "performanceLevel": "exceptional|strong|developing|emerging|needs-focus",
  "eqScores": [
    {"metricId": "empathy", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": (number of positive instances), "totalOpportunities": (number of opportunities to demonstrate), "calculationNote": "e.g., Acknowledged 3 of 4 HCP concerns"},
    {"metricId": "clarity", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "compliance", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "discovery", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "objection-handling", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "confidence", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "active-listening", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "adaptability", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "action-insight", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"metricId": "resilience", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"}
  ],
  "salesSkillScores": [
    {"skillId": "opening", "skillName": "Opening Impact", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"skillId": "needs-assessment", "skillName": "Needs Assessment", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"skillId": "value-articulation", "skillName": "Value Articulation", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"skillId": "evidence-based", "skillName": "Evidence-Based Selling", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"},
    {"skillId": "closing", "skillName": "Closing Technique", "score": 1-5, "feedback": "specific feedback", "observedBehaviors": X, "totalOpportunities": Y, "calculationNote": "brief explanation"}
  ],
  "topStrengths": ["strength 1", "strength 2", "strength 3"],
  "priorityImprovements": ["improvement 1", "improvement 2"],
  "specificExamples": [
    {"quote": "exact quote from rep", "analysis": "why this was good/needs work", "isPositive": true/false}
  ],
  "nextSteps": ["actionable next step 1", "actionable next step 2", "actionable next step 3"],
  "overallSummary": "2-3 sentence summary with balanced feedback acknowledging strengths and key area for growth"
}`;

export async function analyzeConversation(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  scenarioContext?: {
    title?: string;
    stakeholder?: string;
    objective?: string;
    challenges?: string[];
  }
): Promise<ComprehensiveFeedbackResult> {
  if (!openai) {
    // Return comprehensive demo analysis
    return {
      overallScore: 3.4,
      performanceLevel: "developing",
      eqScores: [
        { metricId: "empathy", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 3, totalOpportunities: 5, calculationNote: "Acknowledged 3 of 5 HCP concerns" },
        { metricId: "clarity", score: 4, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 4, totalOpportunities: 5, calculationNote: "4 of 5 explanations were clear and relevant" },
        { metricId: "compliance", score: 4, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 4, totalOpportunities: 4, calculationNote: "All claims stayed on-label" },
        { metricId: "discovery", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 2, totalOpportunities: 4, calculationNote: "Asked 2 discovery questions, 4 opportunities existed" },
        { metricId: "objection-handling", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 2, totalOpportunities: 3, calculationNote: "Handled 2 of 3 objections effectively" },
        { metricId: "confidence", score: 4, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 4, totalOpportunities: 5, calculationNote: "Clear delivery in 4 of 5 exchanges" },
        { metricId: "active-listening", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 3, totalOpportunities: 5, calculationNote: "Paraphrased 3 of 5 HCP statements" },
        { metricId: "adaptability", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 2, totalOpportunities: 3, calculationNote: "Adjusted approach 2 of 3 times when cues changed" },
        { metricId: "action-insight", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 1, totalOpportunities: 2, calculationNote: "Proposed 1 relevant next step" },
        { metricId: "resilience", score: 4, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 2, totalOpportunities: 2, calculationNote: "Maintained composure during 2 challenging moments" }
      ],
      salesSkillScores: [
        { skillId: "opening", skillName: "Opening Impact", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 1, totalOpportunities: 1, calculationNote: "Established some credibility but missed attention-grabbing opener" },
        { skillId: "needs-assessment", skillName: "Needs Assessment", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 2, totalOpportunities: 4, calculationNote: "Explored 2 of 4 potential need areas" },
        { skillId: "value-articulation", skillName: "Value Articulation", score: 4, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 3, totalOpportunities: 4, calculationNote: "3 of 4 value statements were clear and compelling" },
        { skillId: "evidence-based", skillName: "Evidence-Based Selling", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 2, totalOpportunities: 3, calculationNote: "Cited 2 relevant data points" },
        { skillId: "closing", skillName: "Closing Technique", score: 3, feedback: "[Demo Mode] Configure OpenAI API for personalized feedback", observedBehaviors: 1, totalOpportunities: 2, calculationNote: "Attempted 1 close, missed 1 opportunity" }
      ],
      topStrengths: [
        "[Demo Mode] Good clinical knowledge demonstrated",
        "[Demo Mode] Professional demeanor throughout",
        "[Demo Mode] Clear value proposition delivery"
      ],
      priorityImprovements: [
        "[Demo Mode] Deepen discovery with open-ended questions",
        "[Demo Mode] Practice active listening techniques"
      ],
      specificExamples: [
        {
          quote: "[Demo Mode] Example quote would appear here",
          analysis: "Configure OpenAI API to see actual conversation analysis",
          isPositive: true
        }
      ],
      nextSteps: [
        "[Demo Mode] Review communication style models for stakeholder adaptation",
        "[Demo Mode] Practice the Feel-Felt-Found objection handling technique",
        "[Demo Mode] Focus on asking 2-3 discovery questions before presenting"
      ],
      overallSummary: "[Demo Mode] This is a sample analysis. Configure your OpenAI API key to receive personalized, detailed feedback based on your actual conversation performance."
    };
  }

  try {
    let contextInfo = "";
    if (scenarioContext) {
      contextInfo = `\n\nSCENARIO CONTEXT:
${scenarioContext.title ? `Title: ${scenarioContext.title}` : ""}
${scenarioContext.stakeholder ? `Stakeholder: ${scenarioContext.stakeholder}` : ""}
${scenarioContext.objective ? `Rep's Objective: ${scenarioContext.objective}` : ""}
${scenarioContext.challenges?.length ? `Challenges: ${scenarioContext.challenges.join(", ")}` : ""}`;
    }

    const conversationText = messages
      .map(m => `${m.role === "user" ? "REP" : "HCP"}: ${m.content}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: COMPREHENSIVE_FEEDBACK_PROMPT },
        { role: "user", content: `Analyze this pharma sales roleplay conversation and provide comprehensive feedback:${contextInfo}\n\nCONVERSATION:\n${conversationText}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No analysis generated");
    }

    const result = JSON.parse(content);
    
    // Ensure salesSkillScores have proper skillName fallbacks
    const skillNameMap: Record<string, string> = {
      "opening": "Opening Impact",
      "needs-assessment": "Needs Assessment",
      "value-articulation": "Value Articulation",
      "evidence-based": "Evidence-Based Selling",
      "closing": "Closing Technique"
    };
    
    if (result.salesSkillScores) {
      result.salesSkillScores = result.salesSkillScores.map((skill: any) => ({
        ...skill,
        skillName: skill.skillName || skillNameMap[skill.skillId] || skill.skillId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      }));
    }
    
    return result as ComprehensiveFeedbackResult;
  } catch (error: any) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze conversation. Please try again.");
  }
}

// Layer 1 Signal Intelligence Analysis - Analyze conversation using the 10-metric behavioral framework
export interface EQScore {
  metricId: string;
  score: number;
  maxScore: number;
  feedback?: string;
}

export interface EQAnalysisResult {
  scores: EQScore[];
  overallScore: number;
  summary?: string;
  timestamp: string;
}

const EQ_ANALYSIS_PROMPT = `You are an expert sales coach using the ReflectivAI Layer 1 Signal Intelligence framework for pharmaceutical sales. Analyze the sales rep's DEMONSTRATED CAPABILITIES based on observable behaviors in this conversation. Score on the following 10 behavioral metrics.

IMPORTANT: Signal Intelligence metrics measure demonstrated capability through observable behaviors—NOT personality traits, emotional states, or intent. Frame all feedback around what was observed.

## LAYER 1 — SIGNAL INTELLIGENCE METRICS FOR PHARMA SALES (Rate each 1-5):

### INTERPERSONAL COMPOSITE:
1. **Empathy Accuracy** (empathy): How accurately the rep recognized and responded to observable signals from the HCP. Did they acknowledge expressed concerns before offering solutions?
2. **Discovery Depth** (discovery): How well the rep validated assumptions and surfaced meaningful information through insightful questions.
3. **Active Listening** (active-listening): Demonstrated ability to paraphrase, clarify, and respond to what the HCP actually said.

### SELF-EXPRESSION COMPOSITE:
4. **Clarity & Alignment** (clarity): How clearly and appropriately the rep's response aligned to the HCP's expressed needs and constraints.

### SELF-PERCEPTION COMPOSITE:
5. **Confidence** (confidence): Demonstrated self-assurance in presenting data while remaining open to dialogue.

### DECISION MAKING COMPOSITE:
6. **Compliance** (compliance): Observable adherence to approved labeling and appropriate redirection of off-label questions.
7. **Action Insight** (action-insight): Demonstrated ability to translate discussion into concrete next steps.

### STRESS MANAGEMENT COMPOSITE:
8. **Objection Handling** (objection-handling): How effectively the rep acknowledged and reframed HCP concerns using evidence.
9. **Adaptive Communication** (adaptability): Demonstrated flexibility in adjusting approach based on observed signals and cues.
10. **Resilience** (resilience): Demonstrated composure when facing pushback or resistance.

## SCORING RUBRIC:
- **5/5**: Exceptional - Multiple clear examples of this skill demonstrated naturally
- **4/5**: Strong - Good demonstration with minor room for improvement
- **3/5**: Developing - Some evidence of skill but inconsistent application
- **2/5**: Emerging - Limited demonstration, significant opportunity to improve
- **1/5**: Needs Focus - Little to no evidence of this skill in the conversation

## IMPORTANT:
- Only score metrics based on OBSERVABLE behaviors in the rep's messages
- Never infer emotional state, personality, or intent—focus on demonstrated actions
- If a metric cannot be evaluated (no opportunity in conversation), provide a score of 3 with feedback noting limited opportunity
- Frame feedback around what was observed, not what was "felt" or "intended"
- Be constructive and specific—every score should be explainable

Respond in JSON format:
{
  "scores": [
    {"metricId": "empathy", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "clarity", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "compliance", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "discovery", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "objection-handling", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "confidence", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "active-listening", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "adaptability", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "action-insight", "score": 1-5, "feedback": "brief specific feedback"},
    {"metricId": "resilience", "score": 1-5, "feedback": "brief specific feedback"}
  ],
  "overallScore": (average of all scores, 1 decimal),
  "summary": "1-2 sentence overall assessment with top strength and area for focus"
}`;

export async function analyzeEQPerformance(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  scenarioContext?: {
    title: string;
    stakeholder: string;
    objective: string;
    challenges: string[];
  }
): Promise<EQAnalysisResult> {
  const timestamp = new Date().toISOString();

  if (!openai) {
    // Demo mode: Generate realistic-looking scores
    const generateDemoScore = (metricId: string): EQScore => {
      const baseScores: Record<string, number> = {
        "empathy": 3,
        "clarity": 4,
        "compliance": 5,
        "discovery": 2,
        "objection-handling": 4,
        "confidence": 4,
        "active-listening": 2,
        "adaptability": 3,
        "action-insight": 2,
        "resilience": 3
      };
      const variance = Math.random() > 0.5 ? 1 : 0;
      const score = Math.min(5, Math.max(1, (baseScores[metricId] || 3) + (Math.random() > 0.5 ? variance : -variance)));
      return {
        metricId,
        score,
        maxScore: 5,
        feedback: "[Demo Mode] Configure OpenAI API for personalized feedback"
      };
    };

    const scores = [
      "empathy", "clarity", "compliance", "discovery", "objection-handling",
      "confidence", "active-listening", "adaptability", "action-insight", "resilience"
    ].map(generateDemoScore);

    const overallScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;

    return {
      scores,
      overallScore: Math.round(overallScore * 10) / 10,
      summary: "[Demo Mode] Good foundation in clarity and compliance. Focus on discovery questions and active listening techniques to deepen stakeholder engagement.",
      timestamp
    };
  }

  try {
    // Only analyze if there are user messages (rep responses)
    const repMessages = messages.filter(m => m.role === "user");
    if (repMessages.length === 0) {
      // Return neutral scores if no rep messages yet
      return {
        scores: [
          "empathy", "clarity", "compliance", "discovery", "objection-handling",
          "confidence", "active-listening", "adaptability", "action-insight", "resilience"
        ].map(metricId => ({
          metricId,
          score: 0,
          maxScore: 5,
          feedback: "Awaiting first response"
        })),
        overallScore: 0,
        summary: "Begin the conversation to receive EQ analysis.",
        timestamp
      };
    }

    let contextInfo = "";
    if (scenarioContext) {
      contextInfo = `\n\nSCENARIO CONTEXT:
Title: ${scenarioContext.title}
Stakeholder: ${scenarioContext.stakeholder}
Rep's Objective: ${scenarioContext.objective}
Challenges to Navigate: ${scenarioContext.challenges.join(", ")}`;
    }

    const conversationText = messages
      .map(m => `${m.role === "user" ? "REP" : "HCP"}: ${m.content}`)
      .join("\n\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: EQ_ANALYSIS_PROMPT },
        { role: "user", content: `Analyze this pharma sales conversation:${contextInfo}\n\nCONVERSATION:\n${conversationText}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No analysis generated");
    }

    const result = JSON.parse(content);
    
    // Normalize the response format
    const scores: EQScore[] = result.scores.map((s: any) => ({
      metricId: s.metricId,
      score: Math.min(5, Math.max(1, s.score)),
      maxScore: 5,
      feedback: s.feedback || ""
    }));

    return {
      scores,
      overallScore: Math.round(result.overallScore * 10) / 10,
      summary: result.summary || "",
      timestamp
    };
  } catch (error: any) {
    console.error("EQ Analysis error:", error);
    throw new Error("Failed to analyze EQ performance. Please try again.");
  }
}

// Today's Focus - Generate a personalized daily coaching focus
const DAILY_FOCUS_PROMPT = `You are ReflectivAI, an AI Sales Coach for pharmaceutical sales professionals. Generate a brief, actionable daily focus tip.

Focus areas should rotate between:
- Layer 1 behavioral skills: empathy, discovery, clarity, adaptability, active listening, resilience, confidence, compliance, action insight, objection handling
- Layer 2 behavioral adaptation: DISC communication styles, stakeholder engagement approaches
- Layer 3 coaching tools: heuristic templates, role-play practice, evidence-based messaging

Therapeutic contexts to incorporate:
- Oncology, HIV/PrEP, Cardiology, Neurology, Immunology, Vaccines, Respiratory, Endocrinology, Hepatology

Generate ONE brief tip (under 15 words) that is specific, actionable, and relevant to pharma sales.

Respond in JSON format:
{
  "focus": "Your brief actionable tip here",
  "category": "ei|behavioral|coaching"
}`;

export interface DailyFocus {
  focus: string;
  category: string;
  timestamp: string;
}

export async function generateDailyFocus(): Promise<DailyFocus> {
  const timestamp = new Date().toISOString();
  
  // Demo fallback tips that rotate based on day of week
  const demoTips = [
    { focus: "Practice discovery questions with oncology stakeholders today", category: "ei" },
    { focus: "Use empathy mapping before your next cardiology call", category: "behavioral" },
    { focus: "Try the objection handling template for access barriers", category: "coaching" },
    { focus: "Focus on active listening during HIV specialist meetings", category: "ei" },
    { focus: "Adapt your DISC approach for analytical pharmacists", category: "behavioral" },
    { focus: "Role-play a challenging formulary conversation", category: "coaching" },
    { focus: "Lead with clinical evidence in your next HCP interaction", category: "ei" },
  ];

  if (!openai) {
    const dayIndex = new Date().getDay();
    const tip = demoTips[dayIndex];
    return {
      focus: tip.focus,
      category: tip.category,
      timestamp
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DAILY_FOCUS_PROMPT },
        { role: "user", content: `Generate today's focus tip. Current date: ${new Date().toLocaleDateString()}` }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 150,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No focus generated");
    }

    const result = JSON.parse(content);
    return {
      focus: result.focus || demoTips[0].focus,
      category: result.category || "ei",
      timestamp
    };
  } catch (error: any) {
    console.error("Daily focus generation error:", error);
    // Fallback to demo tip on error
    const dayIndex = new Date().getDay();
    const tip = demoTips[dayIndex];
    return {
      focus: tip.focus,
      category: tip.category,
      timestamp
    };
  }
}
