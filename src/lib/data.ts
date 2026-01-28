import type { CoachingModule, EQFramework, Scenario } from "@/types/schema";

// Temporary type definitions for missing types
interface HeuristicTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
}

// =============================================================================
// LAYER 2 — Behavioral Communication Models (Supporting Insight Layer)
// =============================================================================
// These models help sellers APPLY signal intelligence more effectively
// by understanding observable communication preferences.
// IMPORTANT: DISC is an OPTIONAL behavioral lens—it supports signal-intelligent 
// interactions but does not measure behavioral capabilities.
// DISC describes observable communication preferences.
// Signal Intelligence refers to demonstrated capability: how well someone perceives, adapts, and responds.
export const communicationStyleModels: EQFramework[] = [
  {
    id: "disc",
    name: "DISC Communication Styles",
    description: "An optional behavioral communication lens that helps adapt your approach to different stakeholder preferences. Note: DISC describes observable communication preferences, not behavioral capabilities.",
    principles: [
      "Dominance (D): Direct, results-oriented, decisive",
      "Influence (I): Enthusiastic, collaborative, optimistic",
      "Steadiness (S): Patient, reliable, team-oriented",
      "Conscientiousness (C): Analytical, precise, systematic"
    ],
    techniques: [
      {
        name: "Style Identification",
        description: "Quickly identify a stakeholder's primary communication style through verbal and non-verbal cues",
        example: "A physician who wants bottom-line efficacy data first may prefer direct, data-driven communication"
      },
      {
        name: "Adaptive Communication",
        description: "Modify your presentation style to match the stakeholder's preferences",
        example: "For analytical stakeholders, lead with clinical data and methodology details"
      },
      {
        name: "Style-Aware Conversations",
        description: "Use behavioral awareness to navigate conversations more effectively",
        example: "With relationship-focused stakeholders, take time to build rapport before diving into data"
      }
    ],
    color: "chart-1"
  }
];

// =============================================================================
// LAYER 1 — Signal Intelligence (Core Measurement Layer)
// =============================================================================
// Signal Intelligence is a DEMONSTRATED CAPABILITY in ReflectivAI.
// These frameworks assess how effectively a seller perceives, interprets, and 
// responds to observable signals in complex sales conversations.
// Key point: Signal Intelligence is measured through observable behaviors, not personality traits.
// It is NOT personality-based, NOT behavioral labeling, and NOT diagnostic.
export const eqFrameworks: EQFramework[] = [
  {
    id: "active-listening",
    name: "Active Listening",
    description: "A signal intelligence skill: developing deep listening to understand stakeholder needs and build trust",
    principles: [
      "Give full attention without planning your response",
      "Reflect back what you hear to confirm understanding",
      "Ask clarifying questions to go deeper",
      "Notice non-verbal cues and emotional undertones"
    ],
    techniques: [
      {
        name: "Paraphrasing",
        description: "Restate the stakeholder's message in your own words",
        example: "So what I'm hearing is that your primary concern is patient adherence..."
      },
      {
        name: "Emotional Validation",
        description: "Acknowledge the feelings behind the words",
        example: "I can understand why the formulary restrictions are frustrating for your practice"
      },
      {
        name: "Strategic Silence",
        description: "Use purposeful pauses to encourage deeper sharing",
        example: "After a stakeholder shares a concern, pause 3-5 seconds before responding"
      }
    ],
    color: "chart-2"
  },
  {
    id: "empathy-mapping",
    name: "Empathy Mapping",
    description: "A signal intelligence skill: understanding stakeholder perspectives by mapping what they think, feel, say, and do",
    principles: [
      "Map what stakeholders SAY in conversations",
      "Infer what they THINK based on their questions",
      "Identify what they FEEL through emotional cues",
      "Observe what they DO in their decision patterns"
    ],
    techniques: [
      {
        name: "Stakeholder Journey Mapping",
        description: "Chart the emotional journey of key decision-makers",
        example: "Map a KOL's journey from initial skepticism to advocacy for your therapy"
      },
      {
        name: "Pain Point Discovery",
        description: "Uncover the real challenges stakeholders face daily",
        example: "Ask about their biggest frustration in managing treatment-resistant patients"
      },
      {
        name: "Value Alignment",
        description: "Connect your solution to what stakeholders truly care about",
        example: "Link clinical outcomes to the physician's personal mission of improving lives"
      }
    ],
    color: "chart-3"
  },
  {
    id: "rapport-building",
    name: "Rapport Building",
    description: "A signal intelligence skill: establishing genuine connections that form the foundation of trusted partnerships",
    principles: [
      "Find authentic common ground beyond business",
      "Match communication style and energy levels",
      "Demonstrate consistent reliability over time",
      "Show genuine interest in their success"
    ],
    techniques: [
      {
        name: "Mirroring",
        description: "Subtly match body language, pace, and vocabulary",
        example: "If a stakeholder speaks methodically, slow your pace to match"
      },
      {
        name: "Value-First Approach",
        description: "Lead with insights and value before discussing products",
        example: "Share a relevant clinical insight before presenting your therapy data"
      },
      {
        name: "Follow-Through Excellence",
        description: "Build trust through consistent delivery on commitments",
        example: "Send the promised journal article within 24 hours of the meeting"
      }
    ],
    color: "chart-4"
  }
];

export const coachingModules: CoachingModule[] = [
  {
    id: "discovery",
    title: "Discovery Questions Mastery",
    description: "Learn to ask powerful questions that uncover stakeholder needs, challenges, and priorities",
    category: "discovery",
    icon: "Search",
    frameworks: ["active-listening", "empathy-mapping"],
    exercises: [
      {
        id: "d1",
        title: "Open-Ended Question Practice",
        description: "Practice converting closed questions to open-ended alternatives",
        type: "practice"
      },
      {
        id: "d2",
        title: "Needs Discovery Role-Play",
        description: "Simulate a first meeting with a new oncologist",
        type: "roleplay"
      }
    ],
    progress: 0
  },
  {
    id: "stakeholder",
    title: "Stakeholder Mapping",
    description: "Identify and understand all decision-makers in the healthcare ecosystem",
    category: "stakeholder",
    icon: "Users",
    frameworks: ["disc", "empathy-mapping"],
    exercises: [
      {
        id: "s1",
        title: "Influence Network Analysis",
        description: "Map the decision-making network for a hospital system",
        type: "practice"
      },
      {
        id: "s2",
        title: "P&T Committee Dynamics",
        description: "Understand pharmacy and therapeutics committee processes",
        type: "quiz"
      }
    ],
    progress: 0
  },
  {
    id: "clinical",
    title: "Clinical Evidence Communication",
    description: "Present clinical data effectively to different stakeholder types",
    category: "clinical",
    icon: "FileText",
    frameworks: ["disc", "active-listening"],
    exercises: [
      {
        id: "c1",
        title: "Data Storytelling",
        description: "Transform clinical trial results into compelling narratives",
        type: "practice"
      },
      {
        id: "c2",
        title: "KOL Presentation",
        description: "Present phase 3 data to a skeptical key opinion leader",
        type: "roleplay"
      }
    ],
    progress: 0
  },
  {
    id: "objection",
    title: "Objection Handling",
    description: "Address concerns and objections with empathy and evidence",
    category: "objection",
    icon: "Shield",
    frameworks: ["active-listening", "rapport-building"],
    exercises: [
      {
        id: "o1",
        title: "Cost Objection Response",
        description: "Practice responding to budget and pricing concerns",
        type: "roleplay"
      },
      {
        id: "o2",
        title: "Safety Concern Navigation",
        description: "Address adverse event questions effectively",
        type: "practice"
      }
    ],
    progress: 0
  },
  {
    id: "closing",
    title: "Closing Techniques",
    description: "Guide stakeholders toward commitment with confidence and integrity",
    category: "closing",
    icon: "CheckCircle",
    frameworks: ["rapport-building", "disc"],
    exercises: [
      {
        id: "cl1",
        title: "Commitment Ladder",
        description: "Practice gaining incremental commitments",
        type: "practice"
      },
      {
        id: "cl2",
        title: "Next Steps Confirmation",
        description: "Master the art of clear action planning",
        type: "roleplay"
      }
    ],
    progress: 0
  },
  {
    id: "eq-mastery",
    title: "Behavioral Mastery for Pharma",
    description: "Integrate all signal intelligence frameworks for healthcare selling",
    category: "eq",
    icon: "Brain",
    frameworks: ["disc", "active-listening", "empathy-mapping", "rapport-building"],
    exercises: [
      {
        id: "eq1",
        title: "Multi-Stakeholder Meeting",
        description: "Navigate a meeting with diverse communication styles",
        type: "roleplay"
      },
      {
        id: "eq2",
        title: "Behavioral Self-Assessment",
        description: "Evaluate your signal intelligence strengths",
        type: "quiz"
      }
    ],
    progress: 0
  }
];

export const scenarios: Scenario[] = [
  // ============================================================================
  // FOUNDATION LAYER: Disease-State Scenarios
  // Early modules • Lower pressure • Focus on noticing, interpreting, navigating
  // Ideal for onboarding or baseline assessment
  // ============================================================================
  
  {
    id: "hiv_prep_opportunity",
    title: "HIV Prevention: Identifying PrEP Candidates",
    description: "Internal medicine physician underutilizes PrEP despite patient population at risk",
    category: "hiv",
    stakeholder: "Dr. Maya Patel - Internal Medicine MD, Urban Clinic",
    objective: "Create awareness of PrEP gaps and establish systematic screening approach",
    context: "This time-pressed IM physician has inconsistent screening for HIV risk factors. STI testing volume suggests missed PrEP opportunities. Clinic believes few true PrEP candidates exist despite evidence to the contrary.",
    openingScene: "Dr. Patel glances at her watch as you enter. She's between patients, typing notes rapidly. 'I have about 10 minutes,' she says without looking up. 'What's this about?'",
    hcpMood: "time-pressured, skeptical",
    behavioralCues: [
      "Repeated glances at the clock or doorway",
      "Multitasking behavior (typing, signing forms, checking phone)",
      "Short, clipped responses with minimal elaboration"
    ],
    challenges: [
      "Belief that few patients are true PrEP candidates",
      "Renal safety and monitoring workload concerns",
      "Limited time for detailed discussions",
      "Prior auth burden for prevention medications"
    ],
    keyMessages: [
      "Quantify at-risk patient pool from STI volume",
      "Review evidence-based screening criteria",
      "Propose nurse-led screening and lab cadence",
      "Streamlined quarterly follow-up protocol"
    ],
    impact: [
      "Reduce new HIV infections in at-risk population",
      "Improve clinic PrEP initiation rates",
      "Establish standardized screening workflow",
      "Protect high-risk patients proactively"
    ],
    suggestedPhrasing: [
      "I noticed your STI testing volume suggests there may be patients who could benefit from PrEP. Can we review the data together?",
      "What if we set up a nurse-led protocol to handle screening and follow-ups? This could reduce your workload significantly.",
      "The latest guidelines make it easier to identify candidates. Would you like to see the screening criteria?"
    ],
    difficulty: "beginner"
  },

  {
    id: "hiv_treatment_landscape",
    title: "HIV Treatment: Optimizing Stable Patients",
    description: "HIV clinic with declining optimization velocity; perception that most patients are stable",
    category: "hiv",
    stakeholder: "Michael Chen, PA-C - Academic HIV Center",
    objective: "Reinforce importance of ongoing treatment optimization and establish review criteria",
    context: "Hospital-affiliated ID clinic where optimization efforts have slowed. Strong perception that most patients are already on optimal regimens.",
    openingScene: "Michael leans back in his chair, arms crossed but with an open expression. 'I'm always interested in better outcomes for my patients. What data do you have on long-term outcomes?'",
    hcpMood: "curious, data-driven",
    behavioralCues: [
      "Arms crossed tightly or shoulders hunched forward",
      "Delayed responses or long pauses before replying",
      "Leaning forward when data is presented"
    ],
    challenges: [
      "Reluctance to change stable, suppressed patients",
      "Perception of complete optimization",
      "Limited awareness of newer treatment benefits",
      "Competing clinical priorities"
    ],
    keyMessages: [
      "Long-term durability and resistance barrier data",
      "Simplified regimens improve adherence",
      "Create candidate list by labs/adherence flags",
      "Schedule optimization review day"
    ],
    impact: [
      "Improve long-term treatment outcomes",
      "Reduce pill burden for eligible patients",
      "Proactive resistance prevention",
      "Enhanced patient satisfaction"
    ],
    suggestedPhrasing: [
      "Even with stable, suppressed patients, there may be opportunities to simplify regimens. Can we review which patients might benefit?",
      "What if we scheduled a quarterly optimization day to systematically review candidates?",
      "The resistance barrier data is compelling for long-term durability. Would you like to see the latest studies?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "onc_biomarker_discussion",
    title: "Oncology: Biomarker-Driven Treatment Selection",
    description: "Solid-tumor center evaluating biomarker testing; P&T scrutinizes cost and outcomes",
    category: "oncology",
    stakeholder: "Dr. Robert Chen - Hematology/Oncology, Community Practice",
    objective: "Define biomarker-driven patient selection with clear clinical benefit",
    context: "Center focuses on cost-per-response and resource utilization. Need to demonstrate clear value proposition for biomarker testing.",
    openingScene: "Dr. Chen reviews a patient chart, looking skeptical. He sets it down and turns to you with a measured expression. 'We're very careful about adding new testing protocols. Walk me through the clinical rationale.'",
    hcpMood: "analytical, cost-conscious",
    behavioralCues: [
      "Flat or monotone vocal delivery despite neutral words",
      "Avoidance of eye contact while listening",
      "Physically turning body away (chair angled, half-standing posture)"
    ],
    challenges: [
      "Resource constraints for testing",
      "P&T cost scrutiny",
      "Competition with established treatment protocols",
      "Uncertainty about patient selection criteria"
    ],
    keyMessages: [
      "Biomarker-driven patient selection criteria",
      "Clear clinical benefit vs standard of care",
      "Testing workflow integration",
      "Evidence-based treatment algorithms"
    ],
    impact: [
      "Expand treatment options for biomarker+ patients",
      "Improve progression-free survival",
      "Establish clear testing pathway",
      "Enhance tumor board decision-making"
    ],
    suggestedPhrasing: [
      "For your biomarker-positive patients, the clinical data shows a clear benefit. Would you like to review the subset analysis?",
      "The testing workflow is designed to fit within your existing process. Can I walk you through it?",
      "This aligns with current guidelines. Would it help to present this to your tumor board?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "cv_heart_failure_gdmt",
    title: "Cardiology: Heart Failure GDMT Optimization",
    description: "HFrEF clinic with suboptimal four-pillar guideline-directed medical therapy adoption",
    category: "cardiology",
    stakeholder: "Dr. Amanda Lewis - Cardiologist, Academic Heart Failure Center",
    objective: "Implement systematic GDMT optimization and reduce treatment gaps",
    context: "Top-tier HF program with suboptimal four-pillar GDMT adoption. Handoff gaps and copay barriers compromise outcomes.",
    openingScene: "Dr. Lewis enters the conference room with a stack of discharge summaries, looking frustrated. She sighs audibly before sitting down. 'I know we have gaps. The question is whether we can actually fix them with our current resources.'",
    hcpMood: "frustrated, overwhelmed",
    behavioralCues: [
      "Sighing or exhaling audibly before answering",
      "Interrupting mid-sentence to redirect or move on",
      "Shoulders hunched forward, tense posture"
    ],
    challenges: [
      "Copay barriers for newer therapies",
      "Handoff gaps to PCP after discharge",
      "Inconsistent four-pillar implementation",
      "Day-30 refill gaps"
    ],
    keyMessages: [
      "Discharge GDMT checklist implementation",
      "Copay assistance enrollment process",
      "Start therapies before discharge when eligible",
      "Systematic optimization protocol"
    ],
    impact: [
      "Reduce 30-day HF readmissions",
      "Improve complete GDMT at discharge",
      "Eliminate day-30 refill gaps",
      "Better mortality outcomes"
    ],
    suggestedPhrasing: [
      "Starting therapies before discharge captures patients while they're still in the system. What would it take to add this to your discharge protocol?",
      "A pharmacy tech can handle copay assistance enrollment. Would that help?",
      "The evidence for complete GDMT is compelling. Can I share the protocol that other HF centers are using?"
    ],
    difficulty: "advanced"
  },

  // ============================================================================
  // APPLICATION LAYER: Fictitious-Product Scenarios
  // Later modules • Value articulation • Commitment moments
  // Still clearly non-promotional
  // ============================================================================

  {
    id: "hiv_prep_novel_agent",
    title: "Novel PrEP Agent: Renal Safety Profile",
    description: "Discussing a once-daily oral PrEP option with improved renal safety profile",
    category: "hiv",
    stakeholder: "Sarah Thompson, NP - HIV Specialty Clinic",
    objective: "Address renal safety concerns and establish appropriate patient selection criteria",
    context: "High-performing NP concerned about renal monitoring burden. A novel agent with improved renal safety profile may address workflow concerns while maintaining efficacy.",
    openingScene: "Sarah looks up from a stack of lab reports with a tired smile. 'I'm always interested in options that are easier on the kidneys, but I need to see the data first.'",
    hcpMood: "interested but cautious",
    behavioralCues: [
      "Leaning forward slightly when discussing patient concerns",
      "Nodding thoughtfully while reviewing data",
      "Asking clarifying questions with genuine curiosity"
    ],
    challenges: [
      "Need for robust renal safety data",
      "Monitoring protocol requirements",
      "Patient selection criteria",
      "Workflow integration concerns"
    ],
    keyMessages: [
      "Renal safety profile vs existing options",
      "Simplified monitoring requirements",
      "Patient selection criteria",
      "Clinical trial efficacy data"
    ],
    impact: [
      "Expand PrEP access to patients with renal concerns",
      "Reduce monitoring burden",
      "Maintain high efficacy standards",
      "Improve patient adherence"
    ],
    suggestedPhrasing: [
      "The renal safety data shows significant advantages in patients with baseline concerns. Would you like to review the comparative analysis?",
      "The monitoring protocol is streamlined compared to current options. Can I walk you through it?",
      "For patients with renal risk factors, this may be an appropriate alternative. What patient selection criteria would be most helpful?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "onc_adc_integration",
    title: "Antibody-Drug Conjugate: Pathway Integration",
    description: "Discussing integration of a novel ADC with established IO backbone",
    category: "oncology",
    stakeholder: "Lisa Martinez, NP - Community Oncology Infusion Center",
    objective: "Establish clear pathway position and toxicity management protocols",
    context: "Community practice with conservative adoption patterns. Novel ADC offers potential benefit but requires clear integration plan and AE management protocols.",
    openingScene: "Lisa reviews an infusion schedule, looking concerned. 'We're already stretched thin with our current protocols. How does this fit into our workflow?'",
    hcpMood: "cautious, resource-conscious",
    behavioralCues: [
      "Rubbing temples or showing signs of stress",
      "Glancing at schedule or staffing board repeatedly",
      "Crossing arms defensively when workflow is mentioned",
      "Speaking quickly with urgency in tone"
    ],
    challenges: [
      "Staffing limitations for AE management",
      "Pathway integration complexity",
      "Infusion chair time constraints",
      "Need for clear patient selection criteria"
    ],
    keyMessages: [
      "Biomarker-driven patient selection",
      "Standardized AE management protocols",
      "Infusion workflow integration",
      "Clinical benefit data"
    ],
    impact: [
      "Expand treatment options for appropriate patients",
      "Improve patient outcomes",
      "Manageable toxicity profile with protocols",
      "Clear pathway positioning"
    ],
    suggestedPhrasing: [
      "The infusion protocol is designed to fit within your existing workflow. Can I show you how other community practices have integrated it?",
      "Standardized AE protocols can help your team manage toxicities confidently. Would you like to review them?",
      "For biomarker-positive patients, the clinical benefit is clear. Can we discuss patient selection criteria?"
    ],
    difficulty: "advanced"
  },

  {
    id: "cv_arni_conversion",
    title: "ARNI Therapy: Optimizing HFrEF Patients",
    description: "Discussing conversion from ACE/ARB to ARNI in eligible HFrEF patients",
    category: "cardiology",
    stakeholder: "Karen Mitchell, NP - Rural Heart Failure Clinic",
    objective: "Establish conversion protocol and address safety concerns",
    context: "Rural practice with high HFrEF burden. ARNI underutilized due to conversion complexity concerns and limited specialist support.",
    openingScene: "Karen looks up from patient charts, interested but hesitant. 'I've heard about ARNI benefits, but I'm not sure about the conversion process in our setting.'",
    hcpMood: "interested, seeking guidance",
    behavioralCues: [
      "Taking notes actively during explanation",
      "Asking 'what if' questions about edge cases",
      "Expressing concern through furrowed brow"
    ],
    challenges: [
      "Conversion protocol uncertainty",
      "Limited specialist support in rural setting",
      "Patient education needs",
      "Monitoring requirements"
    ],
    keyMessages: [
      "Evidence-based conversion protocol",
      "Safety monitoring guidelines",
      "Patient education materials",
      "Clinical benefit data"
    ],
    impact: [
      "Improve HFrEF outcomes in rural population",
      "Reduce HF hospitalizations",
      "Build provider confidence",
      "Expand access to guideline-directed therapy"
    ],
    suggestedPhrasing: [
      "The conversion protocol is straightforward with clear safety guidelines. Would you like to review it step-by-step?",
      "I have patient education materials that explain the transition in simple terms. Can I share them?",
      "The clinical benefit data is compelling for eligible patients. Would you like to see the outcomes?"
    ],
    difficulty: "intermediate"
  },

  {
    id: "vac_adult_immunization",
    title: "Adult Immunization: Program Optimization",
    description: "ID practice serving high-risk adults with suboptimal vaccination rates",
    category: "vaccines",
    stakeholder: "Dr. Evelyn Harper - Infectious Diseases Specialist",
    objective: "Implement systematic vaccination program with standing orders and reminders",
    context: "ID practice serving long-term care and high-risk adult populations. Coverage rates below target. Late program start and weak reminder systems contribute to missed opportunities.",
    openingScene: "Dr. Harper looks up from paperwork, rubbing her temples. 'We know vaccination is important, but we're struggling with the logistics. What can you suggest?'",
    hcpMood: "frustrated but open",
    behavioralCues: [
      "Visible signs of fatigue (rubbing eyes, slumped posture)",
      "Expressing exasperation through tone and body language",
      "Perking up when practical solutions are mentioned"
    ],
    challenges: [
      "Late program initiation timing",
      "Weak reminder-recall systems",
      "Standing order implementation gaps",
      "Staff workflow constraints"
    ],
    keyMessages: [
      "Early program launch timeline",
      "SMS reminder system implementation",
      "Standing orders in LTC facilities",
      "Staff workflow optimization"
    ],
    impact: [
      "Improve vaccination coverage rates",
      "Reduce preventable infections",
      "Streamline clinic workflow",
      "Better protection for high-risk patients"
    ],
    suggestedPhrasing: [
      "Starting earlier in the season captures more patients. Can we plan for an August launch next year?",
      "SMS reminders significantly improve show rates. Would you like to see the data?",
      "Standing orders in your LTC facilities could automate much of this. Can I share implementation examples?"
    ],
    difficulty: "beginner"
  }
];

export const heuristicTemplates: HeuristicTemplate[] = [
  {
    id: "h1",
    category: "objection",
    name: "Feel-Felt-Found",
    template: "I understand how you feel. Other physicians have felt the same way. What they've found is that [benefit/outcome].",
    example: "I understand how you feel about the cost. Other oncologists felt the same concern initially. What they've found is that the reduction in hospitalizations more than offsets the therapy cost.",
    useCase: "When facing emotional or initial resistance objections",
    eqPrinciples: ["empathy-mapping", "active-listening"]
  },
  {
    id: "h2",
    category: "objection",
    name: "Acknowledge-Bridge-Close",
    template: "That's an important consideration. [Acknowledge]. What we've seen is [bridge to benefit]. How would [closing question]?",
    example: "That's an important consideration about long-term safety. We now have 5-year follow-up data showing consistent outcomes. How would access to that data help your prescribing confidence?",
    useCase: "When addressing specific clinical or data concerns",
    eqPrinciples: ["active-listening", "rapport-building"]
  },
  {
    id: "h3",
    category: "value-proposition",
    name: "Problem-Agitate-Solve",
    template: "Many physicians struggle with [problem]. This leads to [negative impact]. [Your solution] addresses this by [benefit].",
    example: "Many physicians struggle with patient adherence to injection therapies. This leads to suboptimal outcomes and increased office visits. Our auto-injector design addresses this with a 94% patient preference rating.",
    useCase: "When presenting your therapy's unique value",
    eqPrinciples: ["empathy-mapping"]
  },
  {
    id: "h4",
    category: "value-proposition",
    name: "Before-After-Bridge",
    template: "Before [your solution], patients experienced [challenge]. After, they [improved outcome]. The bridge is [your specific benefit].",
    example: "Before our therapy, patients with moderate-to-severe RA averaged 4 flares per year. After starting treatment, that dropped to 1.2 flares. The bridge is our rapid onset of action within the first week.",
    useCase: "When demonstrating clinical transformation",
    eqPrinciples: ["empathy-mapping", "rapport-building"]
  },
  {
    id: "h5",
    category: "closing",
    name: "Assumptive Next Step",
    template: "Based on what we've discussed, would it make sense to [specific next action]? I can [support offer].",
    example: "Based on what we've discussed about your HER2+ patients, would it make sense to schedule a peer-to-peer with Dr. Martinez? I can coordinate calendars this week.",
    useCase: "When gaining commitment after positive discussion",
    eqPrinciples: ["disc", "rapport-building"]
  },
  {
    id: "h6",
    category: "closing",
    name: "Trial Close with Options",
    template: "Would you prefer to start with [option A] or [option B]? Either way, I'll ensure [support commitment].",
    example: "Would you prefer to start with sample patients or begin with a lunch-and-learn for your team? Either way, I'll ensure you have all the clinical resources you need.",
    useCase: "When offering pathways to commitment",
    eqPrinciples: ["disc"]
  },
  {
    id: "h7",
    category: "discovery",
    name: "Situation-Problem-Implication",
    template: "Tell me about [situation]. What challenges does that create? How does that impact [patient outcomes/practice efficiency]?",
    example: "Tell me about your current approach to treatment-resistant patients. What challenges does that create in your practice? How does that impact your confidence in managing complex cases?",
    useCase: "When uncovering deep needs and priorities",
    eqPrinciples: ["active-listening", "empathy-mapping"]
  },
  {
    id: "h8",
    category: "discovery",
    name: "Day-in-the-Life",
    template: "Walk me through how you currently handle [situation]. What would make that easier/better?",
    example: "Walk me through how you currently handle insurance prior authorizations for biologics. What would make that process easier for your team?",
    useCase: "When understanding workflows and pain points",
    eqPrinciples: ["active-listening", "empathy-mapping"]
  },
  {
    id: "h9",
    category: "rapport",
    name: "Genuine Curiosity",
    template: "I noticed [observation about their work/interest]. What drew you to [that specialty/approach]?",
    example: "I noticed you've published extensively on personalized medicine approaches. What drew you to focus on biomarker-driven treatment selection?",
    useCase: "When building authentic connection",
    eqPrinciples: ["rapport-building", "active-listening"]
  },
  {
    id: "h10",
    category: "rapport",
    name: "Shared Purpose",
    template: "What we share is a commitment to [patient outcome]. I'm here to support that by [specific value].",
    example: "What we share is a commitment to improving quality of life for RA patients. I'm here to support that by ensuring you have the latest clinical evidence and patient access resources.",
    useCase: "When aligning on common ground",
    eqPrinciples: ["rapport-building", "empathy-mapping"]
  }
];

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "fda-approval",
    title: "FDA Drug Approval Process Overview",
    category: "fda",
    content: `The FDA drug approval process is rigorous and multi-phased, designed to ensure safety and efficacy before market authorization.

## Preclinical Testing
Before human trials, drugs undergo laboratory and animal testing to assess safety and biological activity.

## Clinical Trial Phases

### Phase 1
- 20-100 healthy volunteers
- Focus on safety and dosage
- Duration: Several months

### Phase 2
- 100-500 patients with condition
- Assess efficacy and side effects
- Duration: Several months to 2 years

### Phase 3
- 1,000-5,000 patients
- Confirm efficacy, monitor adverse reactions
- Duration: 1-4 years

## NDA/BLA Review
The New Drug Application or Biologics License Application is submitted with all clinical data. FDA review typically takes 10-12 months, with priority review available for breakthrough therapies.

## Post-Marketing (Phase 4)
Ongoing safety monitoring and additional studies after approval.`,
    summary: "Understanding the FDA's drug approval pathway from preclinical testing through post-market surveillance",
    tags: ["FDA", "drug approval", "clinical trials", "NDA", "regulatory"]
  },
  {
    id: "clinical-design",
    title: "Clinical Trial Design Fundamentals",
    category: "clinical-trials",
    content: `Understanding clinical trial design is essential for effectively communicating with healthcare providers about your therapy's evidence base.

## Randomized Controlled Trials (RCTs)
The gold standard for establishing causality. Patients are randomly assigned to treatment or control groups.

## Key Design Elements

### Blinding
- Single-blind: Patients don't know assignment
- Double-blind: Neither patients nor investigators know
- Open-label: All parties aware of assignment

### Control Types
- Placebo-controlled
- Active comparator
- Standard of care

### Endpoints
- Primary: Main outcome measure
- Secondary: Additional outcomes of interest
- Exploratory: Hypothesis-generating

## Statistical Considerations
- p-value: Probability result occurred by chance
- Confidence interval: Range of plausible values
- Hazard ratio: Comparison of event rates
- Number needed to treat: Patients to treat for one benefit`,
    summary: "Core concepts in clinical trial design that every pharma professional should understand",
    tags: ["clinical trials", "RCT", "endpoints", "statistics", "evidence"]
  },
  {
    id: "hipaa-basics",
    title: "HIPAA Compliance for Pharma Sales",
    category: "compliance",
    content: `HIPAA regulations impact how pharmaceutical representatives can interact with healthcare providers and access patient information.

## Protected Health Information (PHI)
Any individually identifiable health information including:
- Names, addresses, dates
- Medical records and history
- Insurance information
- Any other identifying data

## Key Requirements

### Minimum Necessary Standard
Only access the minimum PHI needed for a specific purpose.

### Business Associate Agreements
Required when third parties handle PHI on behalf of covered entities.

### Security Safeguards
- Administrative controls
- Physical safeguards
- Technical measures

## Implications for Sales Reps
- Never request specific patient information
- Avoid looking at patient charts or records
- Be careful with sample signature logs
- Maintain confidentiality of any incidental exposure`,
    summary: "Essential HIPAA knowledge for maintaining compliance in pharmaceutical sales interactions",
    tags: ["HIPAA", "compliance", "privacy", "PHI", "regulations"]
  },
  {
    id: "hcp-engagement",
    title: "HCP Engagement Best Practices",
    category: "hcp-engagement",
    content: `Effective engagement with healthcare providers requires balancing value delivery with regulatory compliance.

## Pre-Call Planning
- Research the HCP's specialty and interests
- Review publication history
- Understand practice dynamics
- Prepare relevant clinical data

## During the Interaction
- Lead with value, not product
- Listen more than you speak
- Respect time constraints
- Offer relevant resources

## Compliance Considerations
- Follow speaker program guidelines
- Proper documentation of samples
- Transparency in value exchanges
- Sunshine Act reporting

## Virtual Engagement
- Leverage approved digital channels
- Respect communication preferences
- Provide easy access to resources
- Follow up appropriately`,
    summary: "Guidelines for effective and compliant healthcare provider engagement",
    tags: ["HCP", "engagement", "compliance", "best practices", "sales"]
  },
  {
    id: "market-access",
    title: "Understanding Payer Dynamics",
    category: "market-access",
    content: `Navigating the complex payer landscape is crucial for ensuring patient access to your therapies.

## Payer Types

### Commercial Payers
- Large national insurers (UnitedHealthcare, Anthem, Aetna)
- Regional health plans
- Self-insured employers

### Government Payers
- Medicare Part D
- Medicaid (state-specific)
- Veterans Affairs

## Formulary Tiers
- Tier 1: Generic (lowest copay)
- Tier 2: Preferred brand
- Tier 3: Non-preferred brand
- Specialty tier: High-cost therapies

## Access Barriers
- Prior authorization
- Step therapy requirements
- Quantity limits
- Site of care restrictions

## Value Demonstration
- Clinical differentiation
- Pharmacoeconomic data
- Real-world evidence
- Patient outcomes data`,
    summary: "Key concepts in market access and payer navigation for pharmaceutical products",
    tags: ["payers", "formulary", "market access", "insurance", "reimbursement"]
  },
  {
    id: "pricing-transparency",
    title: "Drug Pricing and Transparency",
    category: "pricing",
    content: `Understanding drug pricing mechanisms helps navigate conversations about cost and value.

## Pricing Terminology

### WAC (Wholesale Acquisition Cost)
The manufacturer's list price to wholesalers. Often used as the starting point for negotiations.

### AWP (Average Wholesale Price)
A benchmark price, typically WAC plus a markup. Used in some reimbursement calculations.

### ASP (Average Sales Price)
Medicare Part B uses ASP plus 6% for reimbursement of physician-administered drugs.

## Discounts and Rebates
- Medicaid rebates (mandatory)
- Commercial rebates (negotiated)
- 340B program pricing
- Patient assistance programs

## Transparency Requirements
- Sunshine Act reporting
- State pricing laws
- Pipeline notification requirements

## Value-Based Discussions
Frame cost conversations around:
- Total cost of care
- Avoided hospitalizations
- Quality of life improvements
- Long-term outcomes`,
    summary: "Navigate drug pricing conversations with clarity and confidence",
    tags: ["pricing", "transparency", "WAC", "rebates", "value"]
  }
];

export const diseaseStates = [
  { id: "hiv", name: "HIV" },
  { id: "prep", name: "PrEP (HIV Prevention)" },
  { id: "oncology", name: "Oncology" },
  { id: "cardiology", name: "Cardiology" },
  { id: "neurology", name: "Neurology" },
  { id: "infectious-disease", name: "Infectious Disease" },
  { id: "endocrinology", name: "Endocrinology" },
  { id: "respiratory", name: "Respiratory / Pulmonology" },
  { id: "hepatology", name: "Hepatology" },
  { id: "vaccines", name: "Vaccines / Immunization" },
  { id: "general-medicine", name: "General Medicine" },
];

export const coachingStyles = [
  { 
    id: "direct", 
    name: "Direct Coach", 
    description: "Straight to the point. Gives clear, actionable feedback without sugarcoating.",
    icon: "Zap",
    promptModifier: "Be direct and concise. Give clear, actionable feedback. Don't sugarcoat issues - tell the rep exactly what they need to improve. Focus on practical next steps."
  },
  { 
    id: "empathetic", 
    name: "Empathetic Coach", 
    description: "Supportive and encouraging. Focuses on building confidence while coaching.",
    icon: "Heart",
    promptModifier: "Be warm, supportive, and encouraging. Acknowledge the rep's efforts and challenges. Build confidence while gently guiding improvement. Use positive framing."
  },
  { 
    id: "analytical", 
    name: "Analytical Coach", 
    description: "Data-driven and methodical. Breaks down performance with detailed analysis.",
    icon: "BarChart3",
    promptModifier: "Be analytical and data-driven. Break down performance metrics and provide detailed analysis. Reference specific frameworks and best practices. Be methodical and thorough."
  },
  { 
    id: "motivational", 
    name: "Motivational Coach", 
    description: "High-energy and inspiring. Pushes reps to reach their full potential.",
    icon: "Flame",
    promptModifier: "Be energetic, inspiring, and motivational. Push the rep to reach their full potential. Celebrate wins enthusiastically. Frame challenges as growth opportunities."
  }
];

export const hcpProfiles = [
  { 
    id: "hiv_fp_md_timepressed", 
    name: "Dr. Maya Patel — Family Practice MD", 
    specialty: "Family Medicine", 
    setting: "Urban clinic with mixed payer base", 
    style: "Direct; wants concise workflows",
    therapeuticAreas: ["hiv", "prep", "infectious-disease", "general-medicine"],
    prescriberLevel: "Moderate Volume",
    concern: "Time Constraints"
  },
  { 
    id: "hiv_id_md_guideline_strict", 
    name: "Dr. Evelyn Harper — Infectious Diseases", 
    specialty: "Infectious Diseases", 
    setting: "Academic ID clinic", 
    style: "Evidence-demanding; skeptical of marketing",
    therapeuticAreas: ["hiv", "prep", "infectious-disease"],
    prescriberLevel: "High Volume",
    concern: "Evidence Quality"
  },
  { 
    id: "onco_hemonc_md_costtox", 
    name: "Dr. Chen — Hematology/Oncology", 
    specialty: "Hem/Onc", 
    setting: "Community oncology practice", 
    style: "Wants clear ΔOS/ΔPFS with AE context",
    therapeuticAreas: ["oncology"],
    prescriberLevel: "High Volume",
    concern: "Cost & Toxicity"
  },
  { 
    id: "vax_peds_np_hesitancy", 
    name: "Alex Nguyen, NP — Pediatrics", 
    specialty: "Pediatrics", 
    setting: "Suburban pediatrics office", 
    style: "Brief, template-driven",
    therapeuticAreas: ["vaccines", "general-medicine"],
    prescriberLevel: "Moderate Volume",
    concern: "Patient Hesitancy"
  },
  { 
    id: "covid_hosp_hospitalist_threshold", 
    name: "Dr. Fabiano — Hospitalist", 
    specialty: "Internal Medicine", 
    setting: "Community hospital", 
    style: "Order-set focused",
    therapeuticAreas: ["infectious-disease", "general-medicine"],
    prescriberLevel: "High Volume",
    concern: "Protocol Adherence"
  },
  { 
    id: "hbv_hepatology_md_access", 
    name: "Dr. Smith — Hepatology", 
    specialty: "Hepatology", 
    setting: "Academic liver clinic", 
    style: "Wants PA-ready documentation",
    therapeuticAreas: ["hepatology", "infectious-disease"],
    prescriberLevel: "High Volume",
    concern: "Access & PA"
  },
  { 
    id: "cardio_fm_md_ascvd_risk", 
    name: "Dr. Lewis — Primary Care Cardiology Focus", 
    specialty: "Family Medicine", 
    setting: "Large IPA", 
    style: "Targets measurable KPI gains",
    therapeuticAreas: ["cardiology", "general-medicine"],
    prescriberLevel: "Moderate Volume",
    concern: "KPI Metrics"
  },
  { 
    id: "pulm_md_copd_exac", 
    name: "Dr. Ramos — Pulmonology", 
    specialty: "Pulmonology", 
    setting: "Pulmonary clinic", 
    style: "Brief; focuses on exacerbation risk",
    therapeuticAreas: ["respiratory"],
    prescriberLevel: "High Volume",
    concern: "Exacerbation Risk"
  },
  { 
    id: "endo_md_t2d_ckd", 
    name: "Dr. Nasser — Endocrinology", 
    specialty: "Endocrinology", 
    setting: "Multispecialty group", 
    style: "Wants ADA/KDIGO alignment",
    therapeuticAreas: ["endocrinology", "cardiology"],
    prescriberLevel: "High Volume",
    concern: "Guideline Alignment"
  },
  { 
    id: "asthma_peds_md_controller", 
    name: "Dr. Ortega — Pediatrics", 
    specialty: "Pediatrics", 
    setting: "Community clinic", 
    style: "Uses step charts and action plans",
    therapeuticAreas: ["respiratory", "general-medicine"],
    prescriberLevel: "Low Volume",
    concern: "Controller Adherence"
  },
  { 
    id: "neuro_md_ms_migraine", 
    name: "Dr. Kovacs — Neurology", 
    specialty: "Neurology", 
    setting: "Academic neurology center", 
    style: "Wants mechanism-of-action detail and long-term safety data",
    therapeuticAreas: ["neurology", "general-medicine"],
    prescriberLevel: "High Volume",
    concern: "Long-term Safety"
  },
  { 
    id: "neuro_np_headache_clinic", 
    name: "Sarah Mitchell, NP — Headache & Migraine", 
    specialty: "Neurology", 
    setting: "Headache specialty clinic", 
    style: "Patient-centered; focused on quality of life outcomes",
    therapeuticAreas: ["neurology"],
    prescriberLevel: "Moderate Volume",
    concern: "Patient QoL"
  },
];

// Helper to get HCP profile descriptor for display (industry standard format)
export function getHcpDescriptor(profile: typeof hcpProfiles[0]): string {
  return profile.prescriberLevel;
}

// Helper to get HCP concern tag
export function getHcpConcernTag(profile: typeof hcpProfiles[0]): string {
  return profile.concern;
}

// =============================================================================
// UNIFIED SIGNAL INTELLIGENCE SCORING SYSTEM
// =============================================================================
// All Signal Intelligence metrics use a consistent 1-5 scoring scale with performance levels.
// This ensures intuitive, comparable evaluation across all coaching experiences.

export type PerformanceLevel = "exceptional" | "strong" | "developing" | "emerging" | "needs-focus";

export interface PerformanceLevelInfo {
  level: PerformanceLevel;
  label: string;
  range: string;
  color: string;
  bgColor: string;
}

export const performanceLevels: Record<PerformanceLevel, PerformanceLevelInfo> = {
  "exceptional": { level: "exceptional", label: "Exceptional", range: "4.5-5.0", color: "text-green-600", bgColor: "bg-green-500/10" },
  "strong": { level: "strong", label: "Strong", range: "3.5-4.4", color: "text-blue-600", bgColor: "bg-blue-500/10" },
  "developing": { level: "developing", label: "Developing", range: "2.5-3.4", color: "text-yellow-600", bgColor: "bg-yellow-500/10" },
  "emerging": { level: "emerging", label: "Emerging", range: "1.5-2.4", color: "text-orange-600", bgColor: "bg-orange-500/10" },
  "needs-focus": { level: "needs-focus", label: "Needs Focus", range: "1.0-1.4", color: "text-red-600", bgColor: "bg-red-500/10" }
};

export function getPerformanceLevel(score: number): PerformanceLevelInfo {
  if (score >= 4.5) return performanceLevels["exceptional"];
  if (score >= 3.5) return performanceLevels["strong"];
  if (score >= 2.5) return performanceLevels["developing"];
  if (score >= 1.5) return performanceLevels["emerging"];
  return performanceLevels["needs-focus"];
}

export function getScoreColor(score: number): string {
  if (score >= 4.5) return "text-green-600";
  if (score >= 3.5) return "text-blue-600";
  if (score >= 2.5) return "text-yellow-600";
  if (score >= 1.5) return "text-orange-600";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 4.5) return "bg-green-500/10 border-green-500/30";
  if (score >= 3.5) return "bg-blue-500/10 border-blue-500/30";
  if (score >= 2.5) return "bg-yellow-500/10 border-yellow-500/30";
  if (score >= 1.5) return "bg-orange-500/10 border-orange-500/30";
  return "bg-red-500/10 border-red-500/30";
}

// Signal Intelligence Metrics Framework - Layer 1 (Core Measurement)
// Measures DEMONSTRATED CAPABILITY through observable behaviors.
// All metrics scored 1-5 for consistency and intuitive comparison.
export interface SignalCapability {
  id: string;
  name: string;
  displayName?: string;
  behavioralMetric: string;
  category: "awareness" | "interpretation" | "engagement" | "navigation" | "management" | "adaptation" | "commitment" | "self-perception" | "self-expression" | "interpersonal" | "decision-making" | "stress-management";
  description: string;
  showsUpWhen: string;
  examples: string[];
  whatItMeasures: string;
  whatStrongPerformanceLooksLike: string[];
  observableBehaviors: string[];
  whyItMatters: string;
  coachingInsight: string[];
  calculation?: string;
  keyTip?: string;
  whatGoodLooksLike?: string;
  learnMoreLink?: string;
  color: string;
  isCore?: boolean;
  icon?: string;
  sampleIndicators?: string[];
}



export const signalCapabilities: SignalCapability[] = [
  {
    id: 'signal-awareness',
    name: 'Signal Awareness',
    behavioralMetric: 'Question Quality',
    category: 'awareness',
    description: 'Asking questions that are timely, relevant to the customer\'s context, and move the conversation forward.',
    showsUpWhen: 'Questions reflect what is happening in the conversation right now and advance understanding or clarify next steps.',
    examples: [
      'Questions reflect customer\'s stated priorities or recent comments',
      'Questions are well-timed and respond to subtle cues or shifts',
      'Questions advance understanding or clarify next steps',
      'Questions open productive dialogue and build momentum',
    ],
    whatItMeasures: 'How well a rep notices what matters in the moment and asks questions that move the conversation forward.',
    whatStrongPerformanceLooksLike: [
      'Questions clearly reflect what the customer just said',
      'Timing feels natural, not scripted',
      'Each question advances understanding or momentum',
    ],
    observableBehaviors: [
      'Builds directly on customer statements',
      'Avoids generic or disconnected questions',
      'Uses questions to clarify priorities and direction',
    ],
    whyItMatters: 'Signal Awareness is the foundation of effective conversations. When reps notice the right cues and respond with relevant questions, customers feel understood and engaged rather than interrogated.',
    coachingInsight: [
      'Missed relevance → coach noticing and timing',
      'Low momentum → coach question purpose, not technique',
    ],
    icon: 'Target',
    color: 'hsl(210, 100%, 50%)',
    isCore: true,
  },
  {
    id: 'signal-interpretation',
    name: 'Signal Interpretation',
    behavioralMetric: 'Listening & Responsiveness',
    category: 'interpretation',
    description: 'Accurately understanding customer input and responding in a way that clearly reflects that understanding.',
    showsUpWhen: 'Rep correctly understands and reflects what the customer has communicated, then responds in a way that meaningfully aligns with what was said.',
    examples: [
      'Paraphrases or summarizes customer input accurately',
      'Avoids misinterpreting intent, priority, or meaning',
      'Response directly addresses the customer\'s input',
      'Adjusts message, depth, or direction appropriately',
    ],
    whatItMeasures: 'How accurately a rep understands customer input and responds in a way that clearly reflects that understanding.',
    whatStrongPerformanceLooksLike: [
      'Customer ideas are accurately reflected or paraphrased',
      'Responses align with what the customer actually expressed',
      'No assumptions or misreads',
    ],
    observableBehaviors: [
      'Correctly summarizes customer points',
      'Adjusts response based on customer meaning',
      'Avoids default or pre-planned replies',
    ],
    whyItMatters: 'Understanding without alignment breaks trust. Signal Interpretation ensures the rep is responding to the customer\'s reality, not their own assumptions.',
    coachingInsight: [
      'Misinterpretation → coach listening precision',
      'Poor alignment → coach response adaptability',
    ],
    icon: 'Ear',
    color: 'hsl(142, 76%, 36%)',
    isCore: true,
  },
  {
    id: 'making-it-matter',
    name: 'Value Connection',
    behavioralMetric: 'Value Framing',
    category: 'engagement',
    description: 'Connecting information to customer-specific priorities and clearly explaining why it matters to them.',
    showsUpWhen: 'Value being communicated clearly connects to the customer\'s stated priorities, needs, or goals, and the rep translates information into meaningful customer outcomes.',
    examples: [
      'References customer-specific goals, challenges, or context',
      'Value aligns with what the customer has indicated matters',
      'Connects features or data to implications for the customer',
      'Articulates "so what this means for you is..."',
    ],
    whatItMeasures: 'How clearly the rep connects information to what matters to the customer and explains why it matters.',
    whatStrongPerformanceLooksLike: [
      'Value is framed in customer terms, not product terms',
      '"So what" is clear without persuasion',
      'Outcomes are easy to understand',
    ],
    observableBehaviors: [
      'References customer priorities or challenges',
      'Translates information into real-world impact',
      'Avoids feature-centric explanations',
    ],
    whyItMatters: 'Information alone does not create value. Customers engage when relevance and impact are unmistakable.',
    coachingInsight: [
      'Low relevance → coach discovery usage',
      'Low impact clarity → coach outcome articulation',
    ],
    icon: 'Target',
    color: 'hsl(271, 76%, 53%)',
    isCore: true,
  },
  {
    id: 'customer-engagement-monitoring',
    name: 'Customer Engagement Monitoring',
    behavioralMetric: 'Customer Engagement Cues',
    category: 'engagement',
    description: 'Noticing changes in customer participation and conversational momentum and adjusting accordingly.',
    showsUpWhen: 'Rep notices and responds to shifts in engagement, maintains conversational flow, and strengthens engagement by building on customer input.',
    examples: [
      'Customer contributes regularly with complete responses',
      'Rep responds promptly to subtle cues and adjusts pacing or direction',
      'Conversation flows with smooth transitions between topics',
      'Rep consistently deepens engagement by expanding on customer signals',
    ],
    whatItMeasures: 'How well the rep notices and responds to changes in customer participation and conversational momentum.',
    whatStrongPerformanceLooksLike: [
      'Balanced dialogue, not rep-dominated',
      'Rep adjusts when engagement shifts',
      'Momentum feels natural and sustained',
    ],
    observableBehaviors: [
      'Customer actively participates and elaborates',
      'Rep responds to verbal and pacing cues',
      'Customer input is built upon, not bypassed',
    ],
    whyItMatters: 'Engagement is dynamic. Skilled reps continuously read participation signals and adjust before disengagement occurs.',
    coachingInsight: [
      'Low participation → coach invitation and pacing',
      'Missed cues → coach real-time awareness',
    ],
    icon: 'Activity',
    color: 'hsl(24, 95%, 53%)',
    isCore: true,
  },
  {
    id: 'objection-navigation',
    name: 'Objection Navigation',
    behavioralMetric: 'Objection Handling',
    category: 'navigation',
    description: 'Responding to resistance with composure and engaging it in a way that sustains productive dialogue.',
    showsUpWhen: 'Rep maintains composure and openness when resistance appears, works with the objection rather than around it, and leaves it clearer than it began.',
    examples: [
      'Remains calm and acknowledges the objection appropriately',
      'Responds with openness and curiosity, sustaining constructive tone',
      'Explores the objection to understand its basis',
      'Objection is clearly reframed or positioned for next steps',
    ],
    whatItMeasures: 'How constructively a rep responds when resistance appears, without defensiveness or avoidance.',
    whatStrongPerformanceLooksLike: [
      'Objections are acknowledged, not dismissed',
      'Rep explores the concern before responding',
      'Dialogue remains calm and productive',
    ],
    observableBehaviors: [
      'Maintains composure under resistance',
      'Engages objections directly and respectfully',
      'Leaves concerns clearer than before',
    ],
    whyItMatters: 'Objections are moments of risk and opportunity. Skillful navigation preserves trust and forward motion.',
    coachingInsight: [
      'Defensiveness → coach stance and regulation',
      'Avoidance → coach curiosity and engagement',
    ],
    icon: 'Shield',
    color: 'hsl(0, 84%, 60%)',
    isCore: true,
  },
  {
    id: 'conversation-management',
    name: 'Conversation Management',
    behavioralMetric: 'Conversation Control & Structure',
    category: 'management',
    description: 'Providing clear direction and structure while guiding the conversation toward purposeful progress.',
    showsUpWhen: 'Rep provides a clear sense of where the conversation is headed, adjusts direction appropriately as new input emerges, and maintains purpose throughout.',
    examples: [
      'Signals purpose, focus, or intent at key moments',
      'Transitions are framed rather than abrupt',
      'Integrates new topics without losing coherence',
      'Adjusts pacing, depth, or focus in response to customer input',
    ],
    whatItMeasures: 'How effectively the rep provides structure and direction while remaining responsive.',
    whatStrongPerformanceLooksLike: [
      'Clear conversational direction',
      'Smooth transitions between topics',
      'Intentional closure',
    ],
    observableBehaviors: [
      'Frames purpose and transitions',
      'Adapts structure without losing coherence',
      'Summarizes and aligns on next steps',
    ],
    whyItMatters: 'Well-managed conversations feel purposeful, not rushed or scattered—supporting clarity and execution.',
    coachingInsight: [
      'Drift → coach framing',
      'Rigidity → coach adaptive steering',
    ],
    icon: 'Map',
    color: 'hsl(221, 83%, 53%)',
    isCore: true,
  },
  {
    id: 'adaptive-response',
    name: 'Adaptive Response',
    behavioralMetric: 'Adaptability',
    category: 'adaptation',
    description: 'Making timely, appropriate adjustments to approach based on what is happening in the interaction.',
    showsUpWhen: 'Rep recognizes and responds to changes in the interaction as they occur, makes appropriate and helpful adjustments, and maintains coherence across the conversation.',
    examples: [
      'Adjusts pacing, depth, or focus in response to new input',
      'Acknowledges shifts in context, constraints, or priorities',
      'Adjustment aligns with customer\'s needs or direction',
      'Adaptation feels intentional and maintains conversational coherence',
    ],
    whatItMeasures: 'How effectively a rep adjusts approach, depth, tone, or pacing as conditions change.',
    whatStrongPerformanceLooksLike: [
      'Adjustments are timely and intentional',
      'Changes improve clarity or momentum',
      'Conversation remains coherent',
    ],
    observableBehaviors: [
      'Recognizes shifts in context or constraints',
      'Avoids autopilot responses',
      'Adapts without disrupting flow',
    ],
    whyItMatters: 'Adaptability separates situational judgment from scripted behavior.',
    coachingInsight: [
      'Missed shifts → coach noticing',
      'Poor adjustments → coach response quality',
    ],
    icon: 'Shuffle',
    color: 'hsl(173, 58%, 39%)',
    isCore: true,
  },
  {
    id: 'commitment-generation',
    name: 'Commitment Generation',
    behavioralMetric: 'Commitment Gaining',
    category: 'commitment',
    description: 'Establishing clear next actions that are voluntarily owned by the customer.',
    showsUpWhen: 'A specific, concrete next action is clearly articulated and voluntarily accepted or initiated by the customer.',
    examples: [
      'Next step is explicitly stated (who, what, when)',
      'Customer verbally agrees to or proposes the next step',
      'Language reflects ownership ("I will...", "We\'ll...")',
      'Commitment is firm, specific, and highly credible',
    ],
    whatItMeasures: 'How clearly and voluntarily the customer commits to next actions.',
    whatStrongPerformanceLooksLike: [
      'Next steps are explicit and concrete',
      'Customer owns the commitment',
      'Roles and timing are clear',
    ],
    observableBehaviors: [
      'Specific actions are agreed upon',
      'Customer language reflects ownership',
      'No vague or forced endings',
    ],
    whyItMatters: 'Commitment is about clarity and ownership—not pressure or persuasion.',
    coachingInsight: [
      'Vague endings → coach specificity',
      'Weak ownership → coach invitation vs. imposition',
    ],
    icon: 'CheckCircle',
    color: 'hsl(142, 71%, 45%)',
    isCore: true,
  },
];

// EQ-i 2.0 Composite categories for grouping
export const eqCategories = {
  "self-perception": {
    name: "Self-Perception",
    description: "Understanding your inner self and confidence",
    metrics: ["confidence"]
  },
  "self-expression": {
    name: "Self-Expression", 
    description: "Expressing yourself and your ideas openly",
    metrics: ["clarity"]
  },
  "interpersonal": {
    name: "Interpersonal",
    description: "Building and maintaining relationships",
    metrics: ["empathy", "discovery", "active-listening"]
  },
  "decision-making": {
    name: "Decision Making",
    description: "Using emotions in problem-solving",
    metrics: ["compliance", "action-insight"]
  },
  "stress-management": {
    name: "Stress Management",
    description: "Coping with challenging situations",
    metrics: ["objection-handling", "adaptability", "resilience"]
  }
};

export const sampleSqlQueries = [
  {
    natural: "Show me all sales calls this month",
    sql: "SELECT * FROM sales_calls WHERE call_date >= DATE_TRUNC('month', CURRENT_DATE) ORDER BY call_date DESC;"
  },
  {
    natural: "Which products had the highest prescriptions last quarter?",
    sql: "SELECT product_name, SUM(prescription_count) as total_rx FROM prescriptions WHERE prescription_date >= DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '3 months') AND prescription_date < DATE_TRUNC('quarter', CURRENT_DATE) GROUP BY product_name ORDER BY total_rx DESC LIMIT 10;"
  },
  {
    natural: "Find physicians who haven't been contacted in 30 days",
    sql: "SELECT p.name, p.specialty, p.institution, MAX(c.contact_date) as last_contact FROM physicians p LEFT JOIN contacts c ON p.id = c.physician_id GROUP BY p.id, p.name, p.specialty, p.institution HAVING MAX(c.contact_date) < CURRENT_DATE - INTERVAL '30 days' OR MAX(c.contact_date) IS NULL;"
  },
  {
    natural: "What's my average samples per call by territory?",
    sql: "SELECT t.territory_name, AVG(sc.samples_distributed) as avg_samples FROM sales_calls sc JOIN territories t ON sc.territory_id = t.id GROUP BY t.territory_name ORDER BY avg_samples DESC;"
  },
  {
    natural: "Compare prescription trends for oncology vs cardiology",
    sql: "SELECT therapeutic_area, DATE_TRUNC('month', prescription_date) as month, COUNT(*) as rx_count FROM prescriptions WHERE therapeutic_area IN ('Oncology', 'Cardiology') AND prescription_date >= CURRENT_DATE - INTERVAL '12 months' GROUP BY therapeutic_area, month ORDER BY month, therapeutic_area;"
  }
];

// HCP Categories for dropdown selection
export const hcpCategories = [
  { id: "kol", name: "KOL / Thought Leader", description: "Key Opinion Leader with significant influence in their specialty" },
  { id: "prescriber", name: "Prescriber / Treater", description: "Active prescriber with regular patient volume" },
  { id: "non-prescribing", name: "Non-Prescribing Influencer", description: "Influences treatment decisions but doesn't directly prescribe" },
  { id: "low-engagement", name: "Low Engagement", description: "Limited interaction history or minimal prescribing activity" },
];

// Influence & Decision Drivers for AI Coach context
export const influenceDrivers = [
  { id: "evidence-based", name: "Evidence-Based", description: "Prioritizes clinical trial data and peer-reviewed research" },
  { id: "patient-centric", name: "Patient-Centric", description: "Focuses on patient outcomes, quality of life, and adherence" },
  { id: "risk-averse", name: "Risk-Averse", description: "Cautious about new treatments; values safety profile and long-term data" },
  { id: "guideline-anchored", name: "Guideline-Anchored", description: "Follows established guidelines and society recommendations closely" },
];

// Specialties filtered by Disease State
export const specialtiesByDiseaseState: Record<string, string[]> = {
  "hiv": ["Infectious Diseases", "Family Medicine", "Internal Medicine"],
  "prep": ["Infectious Diseases", "Family Medicine", "Internal Medicine"],
  "oncology": ["Hem/Onc", "Medical Oncology", "Surgical Oncology", "Radiation Oncology"],
  "cardiology": ["Cardiology", "Internal Medicine", "Family Medicine"],
  "neurology": ["Neurology", "Psychiatry", "Pain Medicine"],
  "infectious-disease": ["Infectious Diseases", "Internal Medicine", "Pulmonology"],
  "endocrinology": ["Endocrinology", "Internal Medicine", "Family Medicine"],
  "respiratory": ["Pulmonology", "Allergy/Immunology", "Internal Medicine"],
  "hepatology": ["Hepatology", "Gastroenterology", "Infectious Diseases"],
  "vaccines": ["Pediatrics", "Family Medicine", "Internal Medicine", "Infectious Diseases"],
  "general-medicine": ["Family Medicine", "Internal Medicine", "Pediatrics"],
};

// All unique specialties for when no disease state is selected
export const allSpecialties = [
  "Family Medicine",
  "Internal Medicine",
  "Infectious Diseases",
  "Hem/Onc",
  "Medical Oncology",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Pulmonology",
  "Hepatology",
  "Gastroenterology",
  "Endocrinology",
  "Psychiatry",
  "Allergy/Immunology",
  "Pain Medicine",
  "Surgical Oncology",
  "Radiation Oncology",
];

// BEHAVIORAL METRICS: The 8 scored metrics (NOT Signal Intelligence capabilities)
export const behavioralMetrics: SignalCapability[] = [
  {
    id: 'question_quality',
    name: 'Question Quality',
    behavioralMetric: 'Question Quality',
    category: 'awareness',
    description: 'The degree to which the rep asks timely, relevant, open, and forward-moving questions that advance understanding or momentum.',
    showsUpWhen: 'Questions are context-anchored and advance the interaction.',
    examples: [
      'Open-ended vs closed questions',
      'Relevance to the immediately preceding customer statement',
      'Logical sequencing of questions',
      'Questions that clarify priorities, constraints, or intent',
      'Avoidance of generic or disconnected questions',
    ],
    whatItMeasures: 'Observable sub-metrics: open-ended vs closed questions, relevance to immediately preceding customer statement, logical sequencing, clarification of priorities/constraints/intent, avoidance of generic questions.',
    whatStrongPerformanceLooksLike: [
      'Questions are context-anchored and advance the interaction',
      'Questions clarify priorities, constraints, or intent',
      'Avoids generic or disconnected questions',
    ],
    observableBehaviors: [
      'Open-ended questions',
      'Relevant to immediately preceding customer statement',
      'Logical sequencing',
      'Clarifies priorities, constraints, or intent',
    ],
    whyItMatters: 'Score increases when questions are context-anchored and advance the interaction. Score decreases when questions are generic, redundant, or misaligned.',
    coachingInsight: [
      'Generic questions → coach context-anchoring',
      'Redundant questions → coach sequencing',
    ],
    icon: 'MessageSquareQuote',
    color: 'hsl(210, 100%, 50%)',
    isCore: true,
  },
  {
    id: 'listening_responsiveness',
    name: 'Listening & Responsiveness',
    behavioralMetric: 'Listening & Responsiveness',
    category: 'interpretation',
    description: 'How accurately and promptly the rep responds to customer input in a way that reflects understanding.',
    showsUpWhen: 'Rep directly acknowledges customer statements and incorporates customer language or concepts.',
    examples: [
      'Direct acknowledgment of customer statements',
      'Incorporation of customer language or concepts',
      'Response latency aligned with conversational flow',
      'Avoidance of topic-shifting without acknowledgment',
    ],
    whatItMeasures: 'Observable sub-metrics: direct acknowledgment of customer statements, incorporation of customer language/concepts, response latency aligned with flow, avoidance of topic-shifting without acknowledgment.',
    whatStrongPerformanceLooksLike: [
      'Consistent demonstrated understanding across turns',
      'References prior customer input',
      'Response latency aligned with conversational flow',
    ],
    observableBehaviors: [
      'Direct acknowledgment of customer statements',
      'Incorporates customer language or concepts',
      'Avoids topic-shifting without acknowledgment',
    ],
    whyItMatters: 'Score reflects consistency of demonstrated understanding across turns. Failure to reference prior customer input lowers the score.',
    coachingInsight: [
      'Topic-shifting without acknowledgment → coach listening precision',
      'Failure to reference prior input → coach responsiveness',
    ],
    icon: 'Ear',
    color: 'hsl(142, 76%, 36%)',
    isCore: true,
  },
  {
    id: 'making_it_matter',
    name: 'Making It Matter',
    behavioralMetric: 'Making It Matter',
    category: 'engagement',
    description: 'The rep\'s ability to connect information, evidence, or statements to what is explicitly important to the customer.',
    showsUpWhen: 'Relevance is explicit and contextual.',
    examples: [
      'Explicit linkage to customer priorities or concerns',
      'Personalization of information to stated needs',
      'Framing benefits in customer-relevant terms',
      'Avoidance of abstract or self-focused value claims',
    ],
    whatItMeasures: 'Observable sub-metrics: explicit linkage to customer priorities/concerns, personalization to stated needs, framing benefits in customer-relevant terms, avoidance of abstract/self-focused claims.',
    whatStrongPerformanceLooksLike: [
      'Relevance is explicit and contextual',
      'Information personalized to stated needs',
      'Benefits framed in customer-relevant terms',
    ],
    observableBehaviors: [
      'Explicit linkage to customer priorities or concerns',
      'Personalization of information to stated needs',
      'Avoids abstract or self-focused value claims',
    ],
    whyItMatters: 'Score increases when relevance is explicit and contextual. Score decreases when information is presented without relevance.',
    coachingInsight: [
      'Abstract claims → coach explicit linkage',
      'Self-focused value → coach customer-relevant framing',
    ],
    icon: 'Target',
    color: 'hsl(280, 100%, 50%)',
    isCore: true,
  },
  {
    id: 'customer_engagement_signals',
    name: 'Customer Engagement Signals',
    behavioralMetric: 'Customer Engagement Signals',
    category: 'engagement',
    description: 'The rep\'s ability to notice and respond to changes in customer engagement during the interaction.',
    showsUpWhen: 'Rep adjusts following engagement changes.',
    examples: [
      'Adjustments following shortened responses or hesitation',
      'Responses to increased curiosity or follow-up questions',
      'Sensitivity to tone, pacing, or conversational energy shifts',
    ],
    whatItMeasures: 'Observable sub-metrics: adjustments following shortened responses/hesitation, responses to increased curiosity/follow-up questions, sensitivity to tone/pacing/energy shifts.',
    whatStrongPerformanceLooksLike: [
      'Responsiveness to engagement changes',
      'Adjusts following shortened responses or hesitation',
      'Responds to increased curiosity or follow-up questions',
    ],
    observableBehaviors: [
      'Adjustments following shortened responses or hesitation',
      'Responses to increased curiosity or follow-up questions',
      'Sensitivity to tone, pacing, or conversational energy shifts',
    ],
    whyItMatters: 'Score reflects responsiveness to engagement changes. Ignoring engagement shifts lowers the score.',
    coachingInsight: [
      'Ignoring engagement shifts → coach sensitivity',
      'Missing shortened responses → coach awareness',
    ],
    icon: 'Activity',
    color: 'hsl(45, 100%, 50%)',
    isCore: true,
  },
  {
    id: 'objection_navigation',
    name: 'Objection Navigation',
    behavioralMetric: 'Objection Navigation',
    category: 'contextual',
    description: 'How effectively the rep recognizes, explores, and responds to resistance or objections.',
    showsUpWhen: 'Rep acknowledges objections constructively.',
    examples: [
      'Acknowledgment of objections without defensiveness',
      'Clarifying the underlying concern',
      'Providing relevant, proportionate responses',
      'Avoidance of dismissal or topic avoidance',
    ],
    whatItMeasures: 'Observable sub-metrics: acknowledgment of objections without defensiveness, clarifying underlying concern, providing relevant/proportionate responses, avoidance of dismissal/topic avoidance.',
    whatStrongPerformanceLooksLike: [
      'Constructive handling of resistance',
      'Acknowledges objections without defensiveness',
      'Clarifies underlying concern',
    ],
    observableBehaviors: [
      'Acknowledgment of objections without defensiveness',
      'Clarifying the underlying concern',
      'Avoids dismissal or topic avoidance',
    ],
    whyItMatters: 'Score reflects constructive handling of resistance. Failure to acknowledge objections lowers the score.',
    coachingInsight: [
      'Defensive responses → coach acknowledgment',
      'Dismissal → coach exploration',
    ],
    icon: 'Shield',
    color: 'hsl(0, 70%, 50%)',
    isCore: true,
  },
  {
    id: 'conversation_control_structure',
    name: 'Conversation Control & Structure',
    behavioralMetric: 'Conversation Control & Structure',
    category: 'contextual',
    description: 'The rep\'s ability to guide the conversation with clarity, direction, and coherence.',
    showsUpWhen: 'Rep demonstrates structural clarity across the session.',
    examples: [
      'Clear transitions between topics',
      'Logical progression of discussion',
      'Summarizing or confirming shared understanding',
      'Avoidance of rambling or abrupt shifts',
    ],
    whatItMeasures: 'Observable sub-metrics: clear transitions between topics, logical progression of discussion, summarizing/confirming shared understanding, avoidance of rambling/abrupt shifts.',
    whatStrongPerformanceLooksLike: [
      'Structural clarity across the session',
      'Clear transitions between topics',
      'Logical progression of discussion',
    ],
    observableBehaviors: [
      'Clear transitions between topics',
      'Logical progression of discussion',
      'Summarizing or confirming shared understanding',
    ],
    whyItMatters: 'Score reflects structural clarity across the session. Disorganized flow lowers the score.',
    coachingInsight: [
      'Disorganized flow → coach structural clarity',
      'Abrupt shifts → coach transitions',
    ],
    icon: 'List',
    color: 'hsl(200, 70%, 50%)',
    isCore: true,
  },
  {
    id: 'commitment_gaining',
    name: 'Commitment Gaining',
    behavioralMetric: 'Commitment Gaining',
    category: 'contextual',
    description: 'The rep\'s effectiveness in advancing toward clear next steps or commitments.',
    showsUpWhen: 'Rep proposes explicit next steps and requests agreement.',
    examples: [
      'Explicit next-step proposals',
      'Requests for agreement or confirmation',
      'Scheduling or follow-up alignment',
      'Avoidance of passive endings',
    ],
    whatItMeasures: 'Observable sub-metrics: explicit next-step proposals, requests for agreement/confirmation, scheduling/follow-up alignment, avoidance of passive endings.',
    whatStrongPerformanceLooksLike: [
      'Clarity and explicitness of commitments',
      'Explicit next-step proposals',
      'Requests for agreement or confirmation',
    ],
    observableBehaviors: [
      'Explicit next-step proposals',
      'Requests for agreement or confirmation',
      'Avoids passive endings',
    ],
    whyItMatters: 'Score reflects clarity and explicitness of commitments. Absence of next steps yields low scores.',
    coachingInsight: [
      'Passive endings → coach explicit proposals',
      'No agreement requests → coach confirmation',
    ],
    icon: 'Handshake',
    color: 'hsl(120, 70%, 50%)',
    isCore: true,
  },
  {
    id: 'adaptability',
    name: 'Adaptability',
    behavioralMetric: 'Adaptability',
    category: 'contextual',
    description: 'The rep\'s demonstrated ability to adjust approach based on customer input or context changes.',
    showsUpWhen: 'Rep demonstrates visible adjustment behavior.',
    examples: [
      'Willingness to reschedule or reframe',
      'Adjusting depth or pace based on customer signals',
      'Flexibility in response strategy',
    ],
    whatItMeasures: 'Observable sub-metrics: willingness to reschedule/reframe, adjusting depth/pace based on customer signals, flexibility in response strategy.',
    whatStrongPerformanceLooksLike: [
      'Visible adjustment behavior',
      'Willingness to reschedule or reframe',
      'Adjusts depth or pace based on customer signals',
    ],
    observableBehaviors: [
      'Willingness to reschedule or reframe',
      'Adjusting depth or pace based on customer signals',
      'Flexibility in response strategy',
    ],
    whyItMatters: 'Score reflects visible adjustment behavior. Sticking rigidly to a script lowers the score.',
    coachingInsight: [
      'Rigid script adherence → coach flexibility',
      'Missing customer signals → coach awareness',
    ],
    icon: 'Zap',
    color: 'hsl(280, 70%, 50%)',
    isCore: true,
  },
];

// Backward compatibility exports (deprecated - use behavioralMetrics instead)
export type EQMetric = SignalCapability;
export const eqMetrics = behavioralMetrics;  // NOW points to behavioral metrics, not signal capabilities
