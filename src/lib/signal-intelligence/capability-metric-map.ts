/**
 * MAJOR AIRO PROMPT #2: Capability ↔ Metric Mapping
 * 
 * Canonical mapping between Signal Intelligence capabilities
 * and behavioral metrics for dashboard linking and project cards.
 */

export const SIGNAL_CAPABILITY_TO_METRIC: Record<string, { metricId: string; displayName: string }> = {
  'Signal Awareness': {
    metricId: 'question_quality',
    displayName: 'Question Quality',
  },
  'Signal Interpretation': {
    metricId: 'listening_responsiveness',
    displayName: 'Listening & Responsiveness',
  },
  'Value Connection': {
    metricId: 'making_it_matter',
    displayName: 'Making It Matter',
  },
  'Customer Engagement Monitoring': {
    metricId: 'customer_engagement_signals',
    displayName: 'Customer Engagement Signals',
  },
  'Objection Navigation': {
    metricId: 'objection_navigation',
    displayName: 'Objection Navigation',
  },
  'Conversation Management': {
    metricId: 'conversation_control_structure',
    displayName: 'Conversation Control & Structure',
  },
  'Adaptive Response': {
    metricId: 'adaptability',
    displayName: 'Adaptability',
  },
  'Commitment Generation': {
    metricId: 'commitment_gaining',
    displayName: 'Commitment Gaining',
  },
};

// Reverse mapping: metricId → capability
export const METRIC_TO_CAPABILITY: Record<string, string> = {
  question_quality: 'Signal Awareness',
  listening_responsiveness: 'Signal Interpretation',
  making_it_matter: 'Value Connection',
  customer_engagement_signals: 'Customer Engagement Monitoring',
  objection_navigation: 'Objection Navigation',
  conversation_control_structure: 'Conversation Management',
  adaptability: 'Adaptive Response',
  commitment_gaining: 'Commitment Generation',
};

// Coaching insights for all 8 behavioral metrics
export const COACHING_INSIGHTS: Record<string, string[]> = {
  question_quality: [
    "Ask more open-ended questions (how, what, why) to uncover deeper needs and priorities.",
    "Sequence questions logically: start broad, then narrow based on HCP responses.",
    "Follow up on HCP statements with clarifying questions before moving to your agenda.",
    "Ensure questions are relevant to the HCP's stated goals and challenges, not just your product features."
  ],
  listening_responsiveness: [
    "Paraphrase key customer statements to confirm you understood them before responding.",
    "Explicitly acknowledge concerns ('I hear that budget is a real constraint') before offering options.",
    "When new information surfaces, pause and adjust your response instead of continuing your original plan.",
    "Use phrases like 'What I'm hearing is...' or 'It sounds like...' to demonstrate active listening."
  ],
  making_it_matter: [
    "Frame product features in terms of outcomes and results, not technical specifications.",
    "Connect your solution directly to the HCP's stated priorities and pain points.",
    "Avoid feature dumping; focus on 2-3 key benefits that align with the HCP's workflow.",
    "Use outcome-based language: 'This helps you reduce...' or 'This enables you to improve...'"
  ],
  customer_engagement_signals: [
    "Monitor customer talk time; aim for 45-65% customer speaking to ensure engagement.",
    "Watch for forward-looking cues like 'when', 'next', 'after' that signal interest in next steps.",
    "Notice energy shifts: shorter responses or time pressure statements may indicate disengagement.",
    "Encourage customer questions as a sign of active engagement and interest."
  ],
  objection_navigation: [
    "Acknowledge objections before responding: 'I understand that's a concern' or 'That's a fair point'.",
    "Explore the underlying concern with questions before offering solutions.",
    "Maintain a calm, non-defensive demeanor even when facing pushback.",
    "Avoid immediately countering with 'but' or 'however'; pause and validate first."
  ],
  conversation_control_structure: [
    "Set a clear agenda at the start: 'Today I'd like to cover...' or 'My goal for this call is...'",
    "Use transition phrases to manage topic flow: 'Building on that...' or 'Let's shift to...'",
    "Summarize key points periodically to ensure alignment and maintain structure.",
    "Propose clear next steps before ending: specific actions, timelines, and owners."
  ],
  commitment_gaining: [
    "Propose specific, concrete next steps rather than vague follow-ups.",
    "Confirm commitment explicitly: 'Can we schedule that for next Tuesday?' rather than 'I'll follow up'.",
    "Address barriers proactively: 'What would need to happen for us to move forward?'",
    "Use trial closes throughout: 'Does that approach make sense?' or 'Would that work for you?'"
  ],
  adaptability: [
    "Recognize when your approach isn't landing and pivot strategy mid-conversation.",
    "Adjust your messaging based on HCP cues: technical depth, time pressure, priorities.",
    "Be willing to abandon your planned script when the conversation takes a different direction.",
    "Match the HCP's communication style: analytical, relational, or results-oriented."
  ],
};
