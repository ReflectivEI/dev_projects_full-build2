// Practice questions for coaching modules
// Each module gets 4-5 deterministic practice questions

export interface PracticeQuestion {
  question: string;
  context?: string;
  focusArea: string;
  whyItMatters?: string;
  howToUse?: string;
}

export interface ModulePracticeQuestions {
  moduleId: string;
  questions: PracticeQuestion[];
}

export const MODULE_PRACTICE_QUESTIONS: Record<string, PracticeQuestion[]> = {
  // Module IDs from data.ts: discovery, stakeholder, clinical, objection, closing, eq-mastery
  "discovery": [
    {
      question: "What open-ended question would you ask to uncover a physician's biggest challenge with current treatment protocols?",
      focusArea: "Open-ended questioning",
      context: "Focus on understanding pain points before presenting solutions",
      whyItMatters: "Open-ended questions reveal the physician's true concerns and priorities, allowing you to position your solution as addressing their specific needs rather than generic benefits.",
      howToUse: "Practice asking this question out loud. Notice how it invites detailed responses rather than yes/no answers. Use this in early conversations to build rapport and gather intelligence."
    },
    {
      question: "How would you follow up when a physician gives a surface-level answer like 'Everything is fine'?",
      focusArea: "Probing deeper",
      context: "Challenge assumptions and dig beneath initial responses",
      whyItMatters: "Surface-level answers often hide real concerns. Physicians may be polite or guarded initially. Your ability to probe respectfully separates average reps from top performers.",
      howToUse: "Role-play this scenario with a colleague. Practice follow-up questions like 'What does fine look like?' or 'If you could improve one thing, what would it be?'"
    },
    {
      question: "What would you ask to understand the physician's decision-making criteria for selecting treatments?",
      focusArea: "Decision criteria discovery",
      context: "Uncover what truly matters in their evaluation process",
      whyItMatters: "Understanding decision criteria allows you to align your value proposition with what the physician actually cares about—whether it's efficacy, safety, cost, ease of use, or patient compliance.",
      howToUse: "Ask this early in the relationship to guide all future conversations. Listen for both stated criteria (what they say matters) and revealed criteria (what their questions and concerns actually focus on)."
    },
    {
      question: "How would you discover which patient populations the physician finds most challenging to treat?",
      focusArea: "Patient segmentation",
      context: "Identify specific use cases where your solution adds value",
      whyItMatters: "Physicians are most receptive to solutions that address their toughest clinical challenges. Identifying these pain points helps you position your product where it can make the biggest difference.",
      howToUse: "Use this question to uncover specific patient profiles, comorbidities, or treatment-resistant cases. Follow up with: 'What makes this population particularly challenging?' to dig deeper."
    },
    {
      question: "What question would reveal the physician's current workflow and where inefficiencies exist?",
      focusArea: "Process understanding",
      context: "Map their current state to identify improvement opportunities",
      whyItMatters: "Workflow inefficiencies represent opportunities for your solution to add value beyond clinical efficacy. Understanding their process helps you position practical benefits like time savings, reduced administrative burden, or better patient monitoring.",
      howToUse: "Ask: 'Walk me through how you currently manage [condition]—from diagnosis to follow-up.' Listen for pain points, bottlenecks, and workarounds. These are opportunities to demonstrate value."
    }
  ],
  // Alias for stakeholder module
  "stakeholder": [
    {
      question: "How would you identify all the stakeholders involved in a hospital formulary decision beyond the primary contact?",
      focusArea: "Stakeholder identification",
      context: "Map the complete decision-making unit"
    },
    {
      question: "What questions would you ask to understand the power dynamics between different stakeholders?",
      focusArea: "Influence mapping",
      context: "Identify who has veto power vs. advisory roles"
    },
    {
      question: "How would you tailor your message differently for a CFO vs. a Chief Medical Officer?",
      focusArea: "Audience adaptation",
      context: "Speak to each stakeholder's priorities and concerns"
    },
    {
      question: "What approach would you use to gain access to stakeholders who are difficult to reach?",
      focusArea: "Access strategy",
      context: "Leverage existing relationships and find creative entry points"
    },
    {
      question: "How would you document and track stakeholder relationships over time?",
      focusArea: "Relationship management",
      context: "Maintain institutional knowledge and continuity"
    }
  ],
  "stakeholder-mapping": [
    {
      question: "How would you identify all the stakeholders involved in a hospital formulary decision beyond the primary contact?",
      focusArea: "Stakeholder identification",
      context: "Map the complete decision-making unit"
    },
    {
      question: "What questions would you ask to understand the power dynamics between different stakeholders?",
      focusArea: "Influence mapping",
      context: "Determine who has veto power vs. advisory roles"
    },
    {
      question: "How would you uncover hidden influencers who aren't in formal decision-making roles?",
      focusArea: "Hidden influencers",
      context: "Find the informal power brokers and opinion leaders"
    },
    {
      question: "What approach would you use to understand each stakeholder's individual priorities and concerns?",
      focusArea: "Individual motivations",
      context: "Tailor your message to each stakeholder's unique perspective"
    },
    {
      question: "How would you navigate a situation where stakeholders have conflicting priorities?",
      focusArea: "Conflict resolution",
      context: "Find common ground and build consensus across competing interests"
    }
  ],
  // Alias for clinical module
  "clinical": [
    {
      question: "How would you explain a hazard ratio of 0.65 to a busy physician in under 30 seconds?",
      focusArea: "Data simplification",
      context: "Translate complex statistics into clinical relevance"
    },
    {
      question: "What would you emphasize when presenting trial data that shows statistical significance but modest clinical benefit?",
      focusArea: "Balanced communication",
      context: "Be honest about limitations while highlighting value"
    },
    {
      question: "How would you address a physician's concern about the trial population not matching their patient demographics?",
      focusArea: "External validity",
      context: "Acknowledge limitations and discuss applicability"
    },
    {
      question: "What questions would you ask to understand which clinical endpoints matter most to this physician?",
      focusArea: "Endpoint prioritization",
      context: "Align your data presentation with their decision criteria"
    }
  ],
  "clinical-data": [
    {
      question: "How would you present a non-inferiority trial result to a skeptical physician who prefers superiority data?",
      focusArea: "Data interpretation",
      context: "Frame clinical evidence in context of real-world clinical needs"
    },
    {
      question: "What would you say when a physician asks about a subgroup analysis that wasn't statistically significant?",
      focusArea: "Statistical literacy",
      context: "Explain limitations while maintaining credibility"
    },
    {
      question: "How would you address a physician's concern about the generalizability of trial data to their patient population?",
      focusArea: "External validity",
      context: "Bridge the gap between trial populations and real-world patients"
    },
    {
      question: "What approach would you use to discuss safety data when there's a numerical imbalance in adverse events?",
      focusArea: "Safety communication",
      context: "Present safety data transparently while providing appropriate context"
    }
  ],
  // Alias for objection module
  "objection": [
    {
      question: "When a physician says 'Your drug is too expensive,' what would you ask before responding?",
      focusArea: "Understanding objections",
      context: "Uncover the real concern behind the stated objection"
    },
    {
      question: "How would you respond to 'I've heard your drug has more side effects than the competitor'?",
      focusArea: "Safety concerns",
      context: "Acknowledge, provide context, and redirect to benefits"
    },
    {
      question: "What would you say when a physician states 'I'm happy with what I'm currently prescribing'?",
      focusArea: "Status quo challenge",
      context: "Identify gaps in current treatment without being confrontational"
    },
    {
      question: "How would you handle an objection about lack of long-term safety data?",
      focusArea: "Data limitations",
      context: "Be transparent while emphasizing available evidence"
    },
    {
      question: "What approach would you use when a physician raises multiple objections at once?",
      focusArea: "Objection prioritization",
      context: "Address the most critical concern first"
    }
  ],
  "objection-handling": [
    {
      question: "A physician says 'Your drug is too expensive.' How do you respond without being defensive?",
      focusArea: "Price objections",
      context: "Acknowledge concern, reframe to value, provide evidence"
    },
    {
      question: "How would you handle: 'I've heard negative things about your drug from colleagues'?",
      focusArea: "Reputation concerns",
      context: "Validate their concern, seek specifics, provide balanced perspective"
    },
    {
      question: "What would you say when a physician states: 'The current treatment works fine, why should I switch?'",
      focusArea: "Status quo bias",
      context: "Uncover hidden dissatisfaction and present incremental value"
    },
    {
      question: "How do you respond to: 'I don't have time to learn a new treatment protocol'?",
      focusArea: "Change resistance",
      context: "Minimize perceived effort and highlight support resources"
    },
    {
      question: "A physician says: 'Your competitor's drug has better efficacy data.' How do you respond?",
      focusArea: "Competitive positioning",
      context: "Acknowledge competition, differentiate on relevant dimensions"
    }
  ],
  "closing": [
    {
      question: "What specific commitment would you ask for after a successful product presentation?",
      focusArea: "Commitment gaining",
      context: "Be specific about next steps and timelines"
    },
    {
      question: "How would you handle a physician who says 'Let me think about it' at the end of your meeting?",
      focusArea: "Soft objections",
      context: "Uncover real concerns and establish concrete follow-up"
    },
    {
      question: "What would you say to move from 'I'm interested' to 'I'll prescribe this for my next eligible patient'?",
      focusArea: "Trial close",
      context: "Bridge interest to action with specific patient scenarios"
    },
    {
      question: "How would you secure a follow-up meeting when the physician seems satisfied but hasn't committed?",
      focusArea: "Next steps",
      context: "Create urgency and provide compelling reason to meet again"
    }
  ],
  "eq-mastery": [
    {
      question: "How would you recognize and respond when a physician becomes defensive during your conversation?",
      focusArea: "Emotional awareness",
      context: "Read emotional cues and adjust your approach in real-time"
    },
    {
      question: "What would you do if you notice your own frustration rising during a difficult interaction?",
      focusArea: "Self-regulation",
      context: "Manage your emotions to maintain professional effectiveness"
    },
    {
      question: "How would you build rapport with a physician who seems rushed and uninterested?",
      focusArea: "Empathy and connection",
      context: "Demonstrate understanding of their constraints and priorities"
    },
    {
      question: "What approach would you use to re-engage a physician who has become disengaged mid-conversation?",
      focusArea: "Engagement recovery",
      context: "Recognize disengagement signals and pivot to regain attention"
    }
  ]
};

export function getPracticeQuestions(moduleId: string): PracticeQuestion[] {
  return MODULE_PRACTICE_QUESTIONS[moduleId] || [];
}
