/**
 * Observable Cue to Behavioral Metric Mapping
 * Read-only explainability layer - NO SCORING LOGIC
 * Maps detected cues to metrics for transparency only
 */

import type { BehavioralMetricId } from './signal-intelligence/metrics-spec';
import type { CueType } from './observable-cues';

export type CueMetricMapping = {
  cueType: CueType;
  metricId: BehavioralMetricId;
  component?: string;
  explanation: string;
};

export const CUE_TO_METRIC_MAP: CueMetricMapping[] = [
  // Open-ended questions
  {
    cueType: 'open_ended_question',
    metricId: 'question_quality',
    component: 'open_closed_ratio',
    explanation: 'Open-ended questions encourage exploration and deeper dialogue.'
  },
  {
    cueType: 'open_ended_question',
    metricId: 'conversation_control_structure',
    component: 'topic_management',
    explanation: 'Open questions help guide conversation flow naturally.'
  },

  // Empathy
  {
    cueType: 'empathy_expressed',
    metricId: 'listening_responsiveness',
    component: 'acknowledgment_of_concerns',
    explanation: 'Empathetic language shows acknowledgment of customer concerns.'
  },
  {
    cueType: 'empathy_expressed',
    metricId: 'objection_navigation',
    component: 'acknowledge_before_response',
    explanation: 'Empathy validates concerns before responding to objections.'
  },

  // Active listening
  {
    cueType: 'active_listening',
    metricId: 'listening_responsiveness',
    component: 'paraphrasing',
    explanation: 'Active listening reflects back customer statements to confirm understanding.'
  },
  {
    cueType: 'active_listening',
    metricId: 'adaptability',
    component: 'adjustment_to_new_info',
    explanation: 'Active listening enables adaptation to new information shared.'
  },

  // Clarification
  {
    cueType: 'clarification_seeking',
    metricId: 'question_quality',
    component: 'follow_up_depth',
    explanation: 'Clarifying questions deepen understanding of customer needs.'
  },
  {
    cueType: 'clarification_seeking',
    metricId: 'objection_navigation',
    component: 'explore_underlying_concern',
    explanation: 'Clarification probes deeper to understand root concerns.'
  },

  // Benefit focus
  {
    cueType: 'benefit_focus',
    metricId: 'making_it_matter',
    component: 'outcome_based_language',
    explanation: 'Benefit-focused language emphasizes outcomes over features.'
  },
  {
    cueType: 'benefit_focus',
    metricId: 'making_it_matter',
    component: 'no_feature_dumping',
    explanation: 'Connecting features to benefits avoids overwhelming with details.'
  },

  // Data reference
  {
    cueType: 'data_reference',
    metricId: 'making_it_matter',
    component: 'outcome_based_language',
    explanation: 'Data and evidence support outcome-based value propositions.'
  },

  // Objection handling
  {
    cueType: 'objection_handling',
    metricId: 'objection_navigation',
    component: 'calm_demeanor',
    explanation: 'Calm, measured responses maintain professionalism during objections.'
  },
  {
    cueType: 'objection_handling',
    metricId: 'adaptability',
    component: 'approach_shift',
    explanation: 'Addressing objections often requires shifting strategy or approach.'
  },

  // Rapport building
  {
    cueType: 'rapport_building',
    metricId: 'customer_engagement_signals',
    component: 'energy_shifts',
    explanation: 'Rapport-building language helps maintain positive customer engagement.'
  },
  {
    cueType: 'rapport_building',
    metricId: 'listening_responsiveness',
    component: 'acknowledgment_of_concerns',
    explanation: 'Building rapport involves acknowledging and validating customer perspectives.'
  },

  // Question technique
  {
    cueType: 'question_technique',
    metricId: 'question_quality',
    component: 'sequencing_logic',
    explanation: 'Effective questioning techniques create logical conversation flow.'
  },

  // Confidence
  {
    cueType: 'confidence',
    metricId: 'conversation_control_structure',
    component: 'purpose_setting',
    explanation: 'Confident language helps set clear agendas and expectations.'
  },
  {
    cueType: 'confidence',
    metricId: 'commitment_gaining',
    component: 'next_step_specificity',
    explanation: 'Confidence enables proposing concrete, specific next steps.'
  },

  // Value articulation
  {
    cueType: 'value_articulation',
    metricId: 'making_it_matter',
    component: 'link_to_customer_priorities',
    explanation: 'Value articulation connects solutions to customer-stated priorities.'
  },
  {
    cueType: 'value_articulation',
    metricId: 'commitment_gaining',
    component: 'mutual_agreement',
    explanation: 'Clear value articulation helps gain customer agreement on next steps.'
  },

  // Adaptability
  {
    cueType: 'adaptability',
    metricId: 'adaptability',
    component: 'tone_adjustment',
    explanation: 'Adaptive language adjusts tone to match customer mood and context.'
  },
  {
    cueType: 'adaptability',
    metricId: 'listening_responsiveness',
    component: 'adjustment_to_new_info',
    explanation: 'Adaptability enables incorporating new information into the discussion.'
  }
];

/**
 * Get all cue types that map to a specific metric
 * Read-only utility for UI display
 */
export function getCuesForMetric(metricId: BehavioralMetricId): CueMetricMapping[] {
  return CUE_TO_METRIC_MAP.filter(m => m.metricId === metricId);
}

/**
 * Get all metrics influenced by a specific cue type
 * Read-only utility for UI display
 */
export function getMetricsForCue(cueType: CueType): CueMetricMapping[] {
  return CUE_TO_METRIC_MAP.filter(m => m.cueType === cueType);
}

/**
 * Check if a cue type maps to a specific metric
 * Read-only utility for UI display
 */
export function cueInfluencesMetric(cueType: CueType, metricId: BehavioralMetricId): boolean {
  return CUE_TO_METRIC_MAP.some(m => m.cueType === cueType && m.metricId === metricId);
}
