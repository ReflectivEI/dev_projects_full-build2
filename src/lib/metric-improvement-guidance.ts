/**
 * Metric Improvement Guidance
 * Frontend-only, read-only mapping for UI display
 * NO SCORING LOGIC - Pure UI guidance layer
 */

import type { BehavioralMetricId } from './signal-intelligence/metrics-spec';

export type ImprovementGuidance = {
  metricId: BehavioralMetricId;
  componentName: string;
  improvementTips: string[];
};

/**
 * Static improvement guidance for each metric component
 * Used ONLY for UI display when showing "How to Improve This Score"
 */
export const IMPROVEMENT_GUIDANCE: ImprovementGuidance[] = [
  // Question Quality
  {
    metricId: 'question_quality',
    componentName: 'open_closed_ratio',
    improvementTips: [
      'Start questions with "how", "what", or "why" to encourage detailed responses',
      'Replace yes/no questions with open-ended alternatives',
      'Use phrases like "tell me more about..." or "walk me through..."'
    ]
  },
  {
    metricId: 'question_quality',
    componentName: 'relevance_to_goals',
    improvementTips: [
      'Reference specific goals or priorities the customer mentioned earlier',
      'Connect your questions to their stated business objectives',
      'Use phrases like "you mentioned [goal], how does..."'
    ]
  },
  {
    metricId: 'question_quality',
    componentName: 'sequencing_logic',
    improvementTips: [
      'Use transition phrases like "building on that..." or "to understand that better..."',
      'Build each question on the previous answer before changing topics',
      'Avoid abrupt topic switches without context'
    ]
  },
  {
    metricId: 'question_quality',
    componentName: 'follow_up_depth',
    improvementTips: [
      'Ask "tell me more about that" when customers share important points',
      'Reference their prior statements: "you mentioned X, can you help me understand..."',
      'Probe deeper with "what led to that?" or "how does that impact..."'
    ]
  },

  // Listening & Responsiveness
  {
    metricId: 'listening_responsiveness',
    componentName: 'paraphrasing',
    improvementTips: [
      'Use "what I\'m hearing is..." to reflect back their key points',
      'Summarize their statements before moving forward',
      'Check understanding with "did I get that right?"'
    ]
  },
  {
    metricId: 'listening_responsiveness',
    componentName: 'direct_response',
    improvementTips: [
      'Answer the specific question they asked before adding context',
      'Avoid tangents that don\'t address their immediate concern',
      'If you need to redirect, acknowledge their question first'
    ]
  },
  {
    metricId: 'listening_responsiveness',
    componentName: 'acknowledgment_of_concerns',
    improvementTips: [
      'Explicitly acknowledge concerns: "I understand that\'s a priority for you"',
      'Validate their perspective before responding',
      'Use empathetic language: "that makes sense" or "I can see why that matters"'
    ]
  },

  // Making It Matter
  {
    metricId: 'making_it_matter',
    componentName: 'outcome_based_language',
    improvementTips: [
      'Focus on results and outcomes, not just features',
      'Use phrases like "this means you can..." or "the impact is..."',
      'Connect features to tangible benefits'
    ]
  },
  {
    metricId: 'making_it_matter',
    componentName: 'link_to_customer_priorities',
    improvementTips: [
      'Explicitly connect your solution to their stated goals',
      'Reference their priorities: "you mentioned [goal], this addresses that by..."',
      'Show how your solution solves their specific challenges'
    ]
  },
  {
    metricId: 'making_it_matter',
    componentName: 'no_feature_dumping',
    improvementTips: [
      'Limit feature mentions to 2-3 most relevant points',
      'Always explain "why this matters" after mentioning a feature',
      'Pause to check understanding rather than listing more features'
    ]
  },

  // Customer Engagement Signals
  {
    metricId: 'customer_engagement_signals',
    componentName: 'energy_shifts',
    improvementTips: [
      'Notice when the customer becomes more engaged and explore that topic',
      'If energy drops, check in: "is this the right area to focus on?"',
      'Match their energy level to maintain rapport'
    ]
  },
  {
    metricId: 'customer_engagement_signals',
    componentName: 'question_frequency',
    improvementTips: [
      'Encourage questions: "what questions do you have about this?"',
      'Pause after key points to invite their input',
      'When they ask questions, it signals engagement—explore further'
    ]
  },
  {
    metricId: 'customer_engagement_signals',
    componentName: 'elaboration_depth',
    improvementTips: [
      'Ask open-ended questions that invite detailed responses',
      'When they give short answers, probe deeper: "tell me more about that"',
      'Create space for them to elaborate on their priorities'
    ]
  },

  // Objection Navigation
  {
    metricId: 'objection_navigation',
    componentName: 'acknowledge_before_response',
    improvementTips: [
      'Start with "I understand your concern about..." before responding',
      'Validate their objection as legitimate before addressing it',
      'Never dismiss or minimize their concerns'
    ]
  },
  {
    metricId: 'objection_navigation',
    componentName: 'explore_underlying_concern',
    improvementTips: [
      'Ask "what\'s driving that concern?" to understand the root issue',
      'Probe deeper: "help me understand what you\'re worried about"',
      'Address the underlying concern, not just the surface objection'
    ]
  },
  {
    metricId: 'objection_navigation',
    componentName: 'calm_demeanor',
    improvementTips: [
      'Maintain a measured, professional tone when objections arise',
      'Avoid defensive language like "but" or "actually"',
      'Use collaborative language: "let\'s explore that together"'
    ]
  },

  // Conversation Control & Structure
  {
    metricId: 'conversation_control_structure',
    componentName: 'topic_management',
    improvementTips: [
      'Set clear agendas: "I\'d like to cover X, Y, and Z today"',
      'Use signposting: "let\'s move to the next area..."',
      'Gently redirect if the conversation drifts: "that\'s interesting, let\'s come back to..."'
    ]
  },
  {
    metricId: 'conversation_control_structure',
    componentName: 'time_awareness',
    improvementTips: [
      'Reference time constraints: "we have 20 minutes, let\'s focus on..."',
      'Check time periodically: "we\'re halfway through, let\'s make sure we cover..."',
      'Prioritize topics based on customer goals and available time'
    ]
  },
  {
    metricId: 'conversation_control_structure',
    componentName: 'agenda_setting',
    improvementTips: [
      'Propose an agenda at the start: "I\'d like to discuss X, does that work?"',
      'Get their input: "what\'s most important for you to cover today?"',
      'Confirm alignment before proceeding'
    ]
  },

  // Commitment Gaining
  {
    metricId: 'commitment_gaining',
    componentName: 'explicit_next_step',
    improvementTips: [
      'Clearly state the next step: "the next step would be..."',
      'Be specific about actions, timing, and ownership',
      'Avoid vague endings like "I\'ll follow up soon"'
    ]
  },
  {
    metricId: 'commitment_gaining',
    componentName: 'mutual_agreement',
    improvementTips: [
      'Confirm their agreement: "does that next step work for you?"',
      'Use collaborative language: "let\'s plan to..."',
      'Ensure they\'re committed, not just passively agreeing'
    ]
  },
  {
    metricId: 'commitment_gaining',
    componentName: 'timeline_specificity',
    improvementTips: [
      'Propose specific dates/times: "can we schedule for next Tuesday?"',
      'Avoid vague timelines like "sometime next week"',
      'Get calendar commitment when possible'
    ]
  },

  // Adaptability
  {
    metricId: 'adaptability',
    componentName: 'adjustment_to_new_info',
    improvementTips: [
      'When new information emerges, acknowledge it: "that changes things, let\'s..."',
      'Adjust your approach based on what you learn',
      'Don\'t rigidly stick to your plan if their needs shift'
    ]
  },
  {
    metricId: 'adaptability',
    componentName: 'approach_shift',
    improvementTips: [
      'If your current approach isn\'t landing, try a different angle',
      'Notice when they\'re not engaged and pivot: "let me try a different way..."',
      'Be flexible in how you present information'
    ]
  },
  {
    metricId: 'adaptability',
    componentName: 'recovery_from_missteps',
    improvementTips: [
      'If you make a mistake, acknowledge it: "I misspoke, let me clarify..."',
      'Don\'t dwell on errors—correct and move forward',
      'Use missteps as opportunities to show professionalism'
    ]
  }
];

/**
 * Get improvement tips for a specific metric component
 * Returns empty array if no guidance found
 */
export function getImprovementTips(
  metricId: BehavioralMetricId,
  componentName: string
): string[] {
  const guidance = IMPROVEMENT_GUIDANCE.find(
    g => g.metricId === metricId && g.componentName === componentName
  );
  return guidance?.improvementTips ?? [];
}

/**
 * Get all improvement guidance for a metric
 * Returns all component guidance for the metric
 */
export function getAllImprovementTipsForMetric(
  metricId: BehavioralMetricId
): ImprovementGuidance[] {
  return IMPROVEMENT_GUIDANCE.filter(g => g.metricId === metricId);
}
