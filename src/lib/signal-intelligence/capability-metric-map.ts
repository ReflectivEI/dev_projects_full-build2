/**
 * Canonical 1:1 mapping between Signal Intelligence™ capabilities and behavioral metrics
 * This is the single source of truth for capability ↔ metric relationships
 */

export const SIGNAL_CAPABILITY_TO_METRIC = {
  "signal-awareness": "question_quality",
  "signal-interpretation": "listening_responsiveness",
  "value-connection": "making_it_matter",
  "customer-engagement-monitoring": "customer_engagement_signals",
  "objection-navigation": "objection_navigation",
  "conversation-management": "conversation_control_structure",
  "adaptive-response": "adaptability",
  "commitment-generation": "commitment_gaining",
} as const;

export const METRIC_TO_CAPABILITY: Record<string, { id: string; label: string }> = {
  question_quality: {
    id: "signal-awareness",
    label: "Signal Awareness",
  },
  listening_responsiveness: {
    id: "signal-interpretation",
    label: "Signal Interpretation",
  },
  making_it_matter: {
    id: "value-connection",
    label: "Value Connection",
  },
  customer_engagement_signals: {
    id: "customer-engagement-monitoring",
    label: "Customer Engagement Monitoring",
  },
  objection_navigation: {
    id: "objection-navigation",
    label: "Objection Navigation",
  },
  conversation_control_structure: {
    id: "conversation-management",
    label: "Conversation Management",
  },
  adaptability: {
    id: "adaptive-response",
    label: "Adaptive Response",
  },
  commitment_gaining: {
    id: "commitment-generation",
    label: "Commitment Generation",
  },
};

/**
 * Coaching insights for each behavioral metric
 * These are actionable tips that help reps improve specific skills
 */
export const COACHING_INSIGHTS: Record<string, string[]> = {
  question_quality: [
    "Ask open-ended questions that encourage HCPs to share their clinical priorities and challenges.",
    "Use follow-up questions to dig deeper into initial responses rather than moving to the next topic.",
    "Frame questions around patient outcomes and clinical workflows, not just product features.",
    "Balance discovery questions with clarifying questions to ensure mutual understanding.",
  ],
  listening_responsiveness: [
    "Use paraphrasing to reflect key HCP statements before answering ('So what I'm hearing is...').",
    "Actively acknowledge concerns before pivoting to solutions ('That's a valid concern...').",
    "Allow natural pauses after HCP statements—don't rush to fill silence.",
    "Reference specific points the HCP made earlier in the conversation to show you're tracking.",
  ],
  making_it_matter: [
    "Connect product features directly to the HCP's stated priorities and patient population.",
    "Use clinical evidence that aligns with the HCP's specialty and practice setting.",
    "Quantify impact in terms the HCP cares about (patient outcomes, workflow efficiency, cost).",
    "Avoid generic value propositions—tailor every statement to this specific HCP's context.",
  ],
  customer_engagement_signals: [
    "Watch for verbal cues like 'tell me more,' 'how does that work,' or 'interesting' as engagement signals.",
    "Notice when the HCP asks questions—this indicates active interest and should be encouraged.",
    "Be alert to disengagement signals like short responses, topic changes, or time pressure cues.",
    "Adjust your approach when engagement drops—ask a question, shift topics, or offer to follow up.",
  ],
  objection_navigation: [
    "Acknowledge objections fully before responding—never dismiss or minimize concerns.",
    "Ask clarifying questions to understand the root cause of the objection.",
    "Provide evidence-based responses that directly address the specific concern raised.",
    "If you can't resolve an objection immediately, commit to following up with more information.",
  ],
  conversation_control_structure: [
    "Set clear expectations at the start: 'I'd like to understand your current approach, then share some insights.'",
    "Use transitions to guide the conversation: 'Before we move on, let me make sure I understand...'",
    "Respect time constraints by being concise and offering to schedule follow-ups for deeper topics.",
    "Summarize key points periodically to maintain shared understanding and momentum.",
  ],
  adaptability: [
    "When an approach isn't working, explicitly pivot: 'Let me try a different angle...'",
    "Match the HCP's communication style—if they're data-driven, lead with evidence; if they're patient-focused, lead with outcomes.",
    "Be willing to abandon your planned agenda if the HCP's priorities differ.",
    "Adjust pacing based on HCP cues—slow down for complex topics, speed up when they're familiar.",
  ],
  commitment_gaining: [
    "Ask for specific next steps rather than vague commitments: 'Can we schedule 15 minutes next week to review the data?'",
    "Tie commitments to the HCP's stated goals: 'Since you mentioned wanting to improve adherence, would you be open to...'",
    "Make commitments easy and low-risk—start small and build from there.",
    "Confirm mutual commitments: 'I'll send the study by Friday, and you'll review it before our next meeting—does that work?'",
  ],
};

/**
 * Get capability information for a given metric ID
 */
export function getCapabilityForMetric(metricId: string): { id: string; label: string } | undefined {
  return METRIC_TO_CAPABILITY[metricId];
}

/**
 * Get metric ID for a given capability ID
 */
export function getMetricForCapability(capabilityId: string): string | undefined {
  return SIGNAL_CAPABILITY_TO_METRIC[capabilityId as keyof typeof SIGNAL_CAPABILITY_TO_METRIC];
}

/**
 * Get coaching insights for a given metric ID
 */
export function getCoachingInsights(metricId: string): string[] {
  return COACHING_INSIGHTS[metricId] ?? [];
}
