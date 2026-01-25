/**
 * BEHAVIORAL METRICS SPECIFICATION
 * Source of Truth for ReflectivAI's 8 Core Behavioral Metrics
 * 
 * This document defines the metrics used to evaluate pharmaceutical sales
 * representative performance during roleplay simulations and coaching sessions.
 * 
 * NO PROPRIETARY INFORMATION - Public-facing definitions only
 */

export type BehaviorMetricId =
  | "empathy"
  | "active-listening"
  | "objection-handling"
  | "value-articulation"
  | "relationship-building"
  | "clinical-credibility"
  | "adaptability"
  | "closing-effectiveness";

export interface BehaviorMetric {
  id: BehaviorMetricId;
  name: string;
  shortDescription: string;
  fullDescription: string;
  category: "emotional-intelligence" | "communication" | "sales-technique" | "clinical";
  
  /** What to look for in conversation */
  positiveIndicators: string[];
  
  /** Red flags that lower the score */
  negativeIndicators: string[];
  
  /** Example phrases that demonstrate this skill */
  examplePhrases: string[];
  
  /** How to improve this metric */
  improvementTips: string[];
  
  /** Scoring guidance (0-100) */
  scoringGuidance: {
    excellent: string; // 80-100
    good: string; // 60-79
    needsWork: string; // 40-59
    poor: string; // 0-39
  };
}

/**
 * BEHAVIORAL METRICS DEFINITIONS
 * These are the 8 core metrics evaluated during roleplay simulations
 */
export const BEHAVIORAL_METRICS: Record<BehaviorMetricId, BehaviorMetric> = {
  "empathy": {
    id: "empathy",
    name: "Empathy & Signal Intelligence",
    shortDescription: "Understanding and responding to HCP emotions and concerns",
    fullDescription: "The ability to recognize, understand, and appropriately respond to the emotional state and concerns of healthcare professionals. This includes acknowledging their challenges, validating their perspectives, and demonstrating genuine care for patient outcomes.",
    category: "emotional-intelligence",
    
    positiveIndicators: [
      "Acknowledges HCP's time constraints or workload",
      "Validates concerns before responding",
      "Uses phrases like 'I understand' or 'That makes sense'",
      "Asks about patient outcomes and HCP's experience",
      "Shows patience when HCP expresses frustration",
      "Reflects back HCP's concerns to show understanding",
      "Connects product benefits to HCP's stated priorities",
    ],
    
    negativeIndicators: [
      "Dismisses or minimizes HCP concerns",
      "Interrupts when HCP is expressing concerns",
      "Focuses only on product features, ignoring HCP's emotional state",
      "Uses defensive language when challenged",
      "Fails to acknowledge HCP's perspective",
      "Rushes through conversation without reading emotional cues",
    ],
    
    examplePhrases: [
      "I can see why that would be concerning for you and your patients.",
      "It sounds like you've had some challenging cases with this condition.",
      "I appreciate you taking the time to share your experience with me.",
      "That's a valid concern, and I'd like to address it thoughtfully.",
      "I understand the pressure you're under to balance efficacy and safety.",
    ],
    
    improvementTips: [
      "Practice active listening - pause before responding to show you're processing",
      "Use reflective statements to mirror back what you heard",
      "Ask follow-up questions about HCP's experiences and feelings",
      "Acknowledge challenges before offering solutions",
      "Pay attention to tone and body language (in real interactions)",
    ],
    
    scoringGuidance: {
      excellent: "Consistently demonstrates deep understanding of HCP emotions, validates concerns naturally, and builds strong rapport through genuine empathy.",
      good: "Shows awareness of HCP emotions and validates concerns, though may occasionally miss subtle emotional cues.",
      needsWork: "Acknowledges some concerns but often moves too quickly to product pitch without fully validating HCP's perspective.",
      poor: "Rarely acknowledges HCP emotions, dismisses concerns, or appears indifferent to HCP's challenges.",
    },
  },

  "active-listening": {
    id: "active-listening",
    name: "Active Listening",
    shortDescription: "Fully engaging with and comprehending HCP communication",
    fullDescription: "The practice of fully concentrating on, understanding, and responding to what the HCP is saying. This includes asking clarifying questions, paraphrasing to confirm understanding, and building on HCP's statements rather than waiting to speak.",
    category: "communication",
    
    positiveIndicators: [
      "Asks clarifying questions based on HCP's statements",
      "Paraphrases or summarizes what HCP said",
      "References earlier points made by HCP",
      "Builds responses on HCP's specific concerns",
      "Avoids interrupting or talking over HCP",
      "Asks open-ended questions to encourage elaboration",
      "Demonstrates understanding before pivoting to new topics",
    ],
    
    negativeIndicators: [
      "Interrupts HCP mid-sentence",
      "Gives generic responses that don't address specific points",
      "Asks questions already answered by HCP",
      "Jumps to scripted pitch without acknowledging HCP input",
      "Fails to pick up on verbal cues or hints",
      "Repeats same points without adapting to HCP feedback",
    ],
    
    examplePhrases: [
      "So if I'm hearing you correctly, your main concern is...",
      "You mentioned earlier that... can you tell me more about that?",
      "Let me make sure I understand - you're saying that...",
      "That's interesting. What led you to that conclusion?",
      "Based on what you've shared, it sounds like...",
    ],
    
    improvementTips: [
      "Take brief notes during conversations to reference later",
      "Practice the 80/20 rule - listen 80% of the time, speak 20%",
      "Count to 3 before responding to ensure HCP is finished",
      "Use the WAIT technique: Why Am I Talking?",
      "Ask 'What else?' to encourage deeper sharing",
    ],
    
    scoringGuidance: {
      excellent: "Demonstrates exceptional listening by building on every HCP statement, asking insightful follow-up questions, and never repeating information already provided.",
      good: "Shows good listening skills with occasional clarifying questions and appropriate paraphrasing, though may miss some nuances.",
      needsWork: "Listens passively but doesn't actively engage with HCP's points; responses feel somewhat generic or disconnected.",
      poor: "Frequently interrupts, asks redundant questions, or gives responses that show lack of comprehension.",
    },
  },

  "objection-handling": {
    id: "objection-handling",
    name: "Objection Handling",
    shortDescription: "Addressing concerns and resistance professionally",
    fullDescription: "The ability to acknowledge, understand, and respond to HCP objections or concerns in a way that maintains rapport while providing relevant information. This includes reframing objections as opportunities and using evidence-based responses.",
    category: "sales-technique",
    
    positiveIndicators: [
      "Acknowledges objection before responding (Feel-Felt-Found)",
      "Asks clarifying questions to understand root concern",
      "Provides evidence-based responses (clinical data, studies)",
      "Reframes objection into a benefit discussion",
      "Remains calm and professional when challenged",
      "Offers to provide additional resources or follow-up",
      "Validates objection as reasonable before addressing",
    ],
    
    negativeIndicators: [
      "Becomes defensive or argumentative",
      "Dismisses objection as invalid or uninformed",
      "Provides vague or unsupported responses",
      "Avoids addressing objection directly",
      "Uses high-pressure tactics to overcome resistance",
      "Fails to ask follow-up questions to understand concern",
    ],
    
    examplePhrases: [
      "That's a common concern. Many physicians have felt the same way until...",
      "I appreciate you bringing that up. Can you tell me more about what's driving that concern?",
      "Let me address that with some recent data from the Phase 3 trial...",
      "That's actually an important consideration. Here's how we've seen it play out in practice...",
      "I understand your hesitation. What specific information would help you feel more confident?",
    ],
    
    improvementTips: [
      "Use the Feel-Felt-Found framework: 'I understand how you feel... others have felt the same... here's what they found...'",
      "Prepare responses to top 10 objections with clinical evidence",
      "Ask 'What would need to be true for you to consider this?' to uncover real concerns",
      "Practice staying calm under pressure - objections are opportunities",
      "Always validate before responding - never make HCP feel wrong",
    ],
    
    scoringGuidance: {
      excellent: "Handles all objections with poise, provides evidence-based responses, and turns concerns into productive discussions that strengthen credibility.",
      good: "Addresses most objections professionally with relevant information, though may occasionally miss opportunities to dig deeper.",
      needsWork: "Responds to objections but sometimes defensively or with insufficient evidence; may avoid difficult objections.",
      poor: "Becomes flustered by objections, provides weak responses, or fails to address concerns directly.",
    },
  },

  "value-articulation": {
    id: "value-articulation",
    name: "Value Articulation",
    shortDescription: "Clearly communicating product benefits relevant to HCP needs",
    fullDescription: "The ability to translate product features into meaningful benefits that align with the HCP's specific patient population, practice setting, and priorities. This includes using clinical data effectively and connecting benefits to patient outcomes.",
    category: "sales-technique",
    
    positiveIndicators: [
      "Connects features to specific HCP-stated needs",
      "Uses clinical data to support value claims",
      "Focuses on patient outcomes, not just product attributes",
      "Tailors value proposition to HCP's specialty or practice",
      "Quantifies benefits when possible (e.g., '30% reduction in...')",
      "Differentiates from competitors on meaningful dimensions",
      "Uses clear, jargon-free language",
    ],
    
    negativeIndicators: [
      "Lists features without connecting to benefits",
      "Uses generic value statements not tailored to HCP",
      "Relies on marketing language instead of clinical evidence",
      "Fails to differentiate from competitors",
      "Focuses on company/product instead of patient outcomes",
      "Uses overly technical jargon that obscures value",
    ],
    
    examplePhrases: [
      "For your cardiology patients, this means a 30% reduction in cardiovascular events compared to standard of care.",
      "Given your focus on elderly patients, the simplified dosing regimen can improve adherence by...",
      "The Phase 3 data showed that patients achieved target levels 40% faster, which translates to...",
      "Unlike other options in this class, our product offers once-daily dosing, which your patients have told you is important for...",
      "This addresses the exact challenge you mentioned about balancing efficacy and tolerability.",
    ],
    
    improvementTips: [
      "Use the 'So what?' test - for every feature, ask 'So what does this mean for the patient?'",
      "Memorize 3-5 key clinical data points with specific numbers",
      "Practice the Feature-Benefit-Evidence framework",
      "Create a value matrix: Feature → Benefit → Evidence → HCP-specific application",
      "Listen for HCP's priorities first, then tailor value proposition",
    ],
    
    scoringGuidance: {
      excellent: "Consistently articulates clear, evidence-based value propositions tailored to HCP's specific needs and patient population, with strong differentiation.",
      good: "Communicates value effectively with clinical support, though may occasionally rely on generic statements or miss opportunities to tailor.",
      needsWork: "Mentions benefits but often focuses on features; value propositions feel generic or insufficiently supported by evidence.",
      poor: "Struggles to articulate clear value; relies heavily on features or marketing language without connecting to HCP needs.",
    },
  },

  "relationship-building": {
    id: "relationship-building",
    name: "Relationship Building",
    shortDescription: "Establishing trust and long-term professional connections",
    fullDescription: "The ability to create genuine, trust-based relationships with HCPs that extend beyond a single transaction. This includes demonstrating reliability, showing personal interest, and positioning yourself as a valuable resource.",
    category: "emotional-intelligence",
    
    positiveIndicators: [
      "Asks about HCP's practice or professional interests",
      "Offers to be a resource beyond just product information",
      "Follows up on previous conversations or commitments",
      "Shares relevant industry insights or research",
      "Demonstrates knowledge of HCP's patient population",
      "Uses HCP's name naturally in conversation",
      "Finds common ground or shared interests",
      "Offers to connect HCP with relevant experts or resources",
    ],
    
    negativeIndicators: [
      "Treats interaction as purely transactional",
      "Fails to reference previous conversations",
      "Only contacts HCP when pushing for a sale",
      "Shows no interest in HCP's professional goals",
      "Makes promises but doesn't follow through",
      "Focuses exclusively on own agenda",
    ],
    
    examplePhrases: [
      "I remember you mentioned you were presenting at the conference - how did that go?",
      "I came across this recent study on [topic] and thought of you given your interest in...",
      "I'd be happy to connect you with our medical science liaison who specializes in...",
      "What are your biggest challenges with this patient population right now?",
      "I want to be a valuable resource for you, not just another rep. How can I best support your practice?",
    ],
    
    improvementTips: [
      "Keep a CRM or notes on each HCP's interests, challenges, and previous conversations",
      "Send value-added follow-ups (relevant articles, studies) not just sales pitches",
      "Ask about professional goals and look for ways to support them",
      "Be reliable - if you say you'll follow up, do it promptly",
      "Find ways to help HCP beyond your product (industry insights, connections)",
    ],
    
    scoringGuidance: {
      excellent: "Builds authentic rapport through genuine interest, consistent follow-through, and positioning as a trusted advisor beyond just product sales.",
      good: "Establishes positive relationships with some personal touches and follow-through, though may occasionally feel transactional.",
      needsWork: "Makes some effort to build rapport but interactions feel primarily sales-focused; limited follow-through or personal connection.",
      poor: "Treats interactions as purely transactional with no effort to build long-term relationship or trust.",
    },
  },

  "clinical-credibility": {
    id: "clinical-credibility",
    name: "Clinical Credibility",
    shortDescription: "Demonstrating deep product and disease state knowledge",
    fullDescription: "The ability to discuss clinical data, mechanism of action, and disease state information with accuracy and confidence. This includes knowing when to say 'I don't know' and how to access additional resources when needed.",
    category: "clinical",
    
    positiveIndicators: [
      "Cites specific clinical trial data accurately",
      "Explains mechanism of action clearly",
      "Discusses disease state pathophysiology appropriately",
      "Answers clinical questions with confidence",
      "Acknowledges limitations of data honestly",
      "Offers to get additional information when uncertain",
      "Uses appropriate medical terminology correctly",
      "References guidelines or treatment algorithms",
    ],
    
    negativeIndicators: [
      "Provides inaccurate or vague clinical information",
      "Avoids clinical questions or changes subject",
      "Misuses medical terminology",
      "Makes claims not supported by data",
      "Appears uncertain or unprepared on basic product facts",
      "Fails to acknowledge data limitations",
      "Over-promises or exaggerates clinical benefits",
    ],
    
    examplePhrases: [
      "In the Phase 3 trial, we saw a statistically significant 30% reduction in primary endpoint with a p-value of...",
      "The mechanism of action involves selective inhibition of... which leads to...",
      "That's a great question. I want to make sure I give you accurate information, so let me connect you with our MSL who can provide the detailed data.",
      "The safety profile showed that the most common adverse events were... occurring in X% of patients.",
      "According to the latest [Society] guidelines, this would be appropriate for patients who...",
    ],
    
    improvementTips: [
      "Create flashcards for key clinical data points (efficacy, safety, MOA)",
      "Review clinical trial publications, not just sales materials",
      "Practice explaining MOA in simple terms to non-clinical audiences",
      "Know your top 10 clinical questions and have evidence-based answers ready",
      "Build relationships with MSLs and know when to escalate clinical questions",
      "Stay current on treatment guidelines and competitor data",
    ],
    
    scoringGuidance: {
      excellent: "Demonstrates deep clinical knowledge, cites data accurately, and handles complex clinical questions with confidence while acknowledging limitations appropriately.",
      good: "Shows solid clinical understanding with accurate data references, though may occasionally lack depth on complex questions.",
      needsWork: "Has basic clinical knowledge but sometimes vague or uncertain; may avoid detailed clinical discussions.",
      poor: "Lacks clinical credibility with frequent inaccuracies, vague responses, or avoidance of clinical topics.",
    },
  },

  "adaptability": {
    id: "adaptability",
    name: "Adaptability & Flexibility",
    shortDescription: "Adjusting approach based on HCP responses and context",
    fullDescription: "The ability to read the situation and adjust your communication style, pacing, and content based on HCP feedback, time constraints, and conversational flow. This includes pivoting when an approach isn't working and being comfortable with ambiguity.",
    category: "communication",
    
    positiveIndicators: [
      "Adjusts pace when HCP signals time pressure",
      "Changes approach when initial strategy isn't resonating",
      "Pivots to HCP's areas of interest",
      "Modifies language/detail level based on HCP's expertise",
      "Handles unexpected questions or directions smoothly",
      "Reads verbal and contextual cues effectively",
      "Comfortable with non-linear conversations",
    ],
    
    negativeIndicators: [
      "Rigidly follows script despite HCP disinterest",
      "Continues detailed explanation when HCP signals time pressure",
      "Fails to adjust when approach isn't working",
      "Becomes flustered by unexpected questions",
      "Insists on covering all points regardless of relevance",
      "Uses same approach for all HCPs regardless of context",
    ],
    
    examplePhrases: [
      "I can see you're pressed for time - let me focus on the two most relevant points for your practice.",
      "It sounds like safety is your primary concern, so let me shift gears and focus there.",
      "That's a different direction than I expected, but I'm glad you brought it up. Let's explore that.",
      "I'm sensing this isn't resonating - what would be most valuable for you to discuss?",
      "Given your expertise in this area, I'll skip the basics and focus on the nuances.",
    ],
    
    improvementTips: [
      "Practice multiple conversation pathways, not just one script",
      "Watch for verbal cues: 'I need to go,' 'I'm not sure about that,' 'What about...'",
      "Prepare 3-minute, 5-minute, and 10-minute versions of your pitch",
      "Role-play difficult scenarios: time pressure, skeptical HCP, unexpected questions",
      "Develop comfort with silence and non-linear conversations",
    ],
    
    scoringGuidance: {
      excellent: "Seamlessly adapts to HCP cues, pivots strategies naturally, and handles unexpected situations with confidence and grace.",
      good: "Shows flexibility and adjusts approach when needed, though may occasionally miss subtle cues or hesitate before pivoting.",
      needsWork: "Demonstrates some adaptability but often sticks to planned approach even when it's not working; may struggle with unexpected directions.",
      poor: "Rigidly follows script regardless of HCP feedback; becomes flustered by unexpected questions or time pressure.",
    },
  },

  "closing-effectiveness": {
    id: "closing-effectiveness",
    name: "Closing Effectiveness",
    shortDescription: "Moving conversation toward clear next steps or commitment",
    fullDescription: "The ability to recognize closing opportunities and guide the conversation toward a specific next action, whether that's a prescription, a trial, a follow-up meeting, or access to additional resources. This includes using trial closes and confirming commitment.",
    category: "sales-technique",
    
    positiveIndicators: [
      "Uses trial closes to gauge readiness ('How does this sound?')",
      "Asks for specific next action or commitment",
      "Summarizes key points before closing",
      "Addresses final concerns before asking for commitment",
      "Offers clear, specific next steps",
      "Confirms understanding and agreement",
      "Uses assumptive language when appropriate",
      "Recognizes and acts on buying signals",
    ],
    
    negativeIndicators: [
      "Ends conversation without clear next steps",
      "Misses obvious closing opportunities",
      "Asks for commitment too early or too aggressively",
      "Fails to summarize value before closing",
      "Leaves next steps vague or undefined",
      "Doesn't confirm HCP's commitment or understanding",
      "Backs off at first sign of hesitation",
    ],
    
    examplePhrases: [
      "Based on what we've discussed, it sounds like this could be a good fit for your [patient type]. What do you think?",
      "Would you be open to trying this with your next appropriate patient?",
      "What would you need to see to feel comfortable prescribing this?",
      "Let me summarize the key benefits we discussed... Does this address your main concerns?",
      "I'll send you the full prescribing information and follow up next week. Does that work for you?",
      "It sounds like you're interested but have some reservations about [concern]. Let's address that before we move forward.",
    ],
    
    improvementTips: [
      "Practice trial closes throughout conversation, not just at the end",
      "Learn to recognize buying signals: 'That's interesting,' 'How would I...,' 'What about...'",
      "Use the Assumptive Close: 'When you prescribe this...' instead of 'If you prescribe...'",
      "Always end with a specific next action and timeline",
      "Address final objections before asking for commitment",
      "Practice the Summary Close: recap value, confirm agreement, ask for next step",
    ],
    
    scoringGuidance: {
      excellent: "Consistently recognizes closing opportunities, uses trial closes effectively, and secures clear commitments or next steps while maintaining rapport.",
      good: "Moves toward closing with specific next steps, though may occasionally miss opportunities or hesitate to ask for commitment.",
      needsWork: "Sometimes asks for next steps but often vague or passive; may miss closing opportunities or fail to confirm commitment.",
      poor: "Rarely moves toward clear next steps; misses closing opportunities or ends conversations without defined action items.",
    },
  },
};

/**
 * Get metric by ID
 */
export function getMetric(id: BehaviorMetricId): BehaviorMetric {
  return BEHAVIORAL_METRICS[id];
}

/**
 * Get all metrics
 */
export function getAllMetrics(): BehaviorMetric[] {
  return Object.values(BEHAVIORAL_METRICS);
}

/**
 * Get metrics by category
 */
export function getMetricsByCategory(category: BehaviorMetric["category"]): BehaviorMetric[] {
  return getAllMetrics().filter((m) => m.category === category);
}

/**
 * Analyze text for metric indicators (frontend-only logic)
 * Returns a score suggestion based on detected indicators
 */
export function analyzeTextForMetric(
  text: string,
  metricId: BehaviorMetricId
): {
  score: number;
  detectedPositive: string[];
  detectedNegative: string[];
  reasoning: string;
} {
  const metric = getMetric(metricId);
  const lowerText = text.toLowerCase();
  
  const detectedPositive: string[] = [];
  const detectedNegative: string[] = [];
  
  // Check for positive indicators
  metric.positiveIndicators.forEach((indicator) => {
    const keywords = extractKeywords(indicator);
    if (keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
      detectedPositive.push(indicator);
    }
  });
  
  // Check for negative indicators
  metric.negativeIndicators.forEach((indicator) => {
    const keywords = extractKeywords(indicator);
    if (keywords.some((kw) => lowerText.includes(kw.toLowerCase()))) {
      detectedNegative.push(indicator);
    }
  });
  
  // Calculate score (0-100)
  const positiveWeight = detectedPositive.length * 15;
  const negativeWeight = detectedNegative.length * 20;
  const baseScore = 50; // Neutral starting point
  
  let score = baseScore + positiveWeight - negativeWeight;
  score = Math.max(0, Math.min(100, score)); // Clamp to 0-100
  
  // Generate reasoning
  let reasoning = "";
  if (detectedPositive.length > 0) {
    reasoning += `Positive signals: ${detectedPositive.length} indicators detected. `;
  }
  if (detectedNegative.length > 0) {
    reasoning += `Areas for improvement: ${detectedNegative.length} concerns detected. `;
  }
  if (detectedPositive.length === 0 && detectedNegative.length === 0) {
    reasoning = "No clear indicators detected in this conversation segment.";
  }
  
  return {
    score,
    detectedPositive,
    detectedNegative,
    reasoning: reasoning.trim(),
  };
}

/**
 * Extract keywords from an indicator description
 */
function extractKeywords(indicator: string): string[] {
  // Remove common words and extract meaningful keywords
  const commonWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "should", "could", "may", "might", "must", "can", "about", "when",
    "where", "which", "who", "what", "how", "why", "their", "there",
    "they", "this", "that", "these", "those", "it", "its",
  ]);
  
  return indicator
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word));
}
