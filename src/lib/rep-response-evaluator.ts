/**
 * Sales Rep Response Evaluator
 * Real-time evaluation of rep responses against 8 behavioral metrics
 */

import { detectRepMetrics, REP_METRIC_CUES, type RepMetricCue } from './observable-cues';
import { scoreConversation, type Transcript, type MetricResult } from './signal-intelligence/scoring';
import type { RepMetricScore } from '@/components/rep-metric-evaluation';

/**
 * Evaluate a single rep response in real-time
 * Returns scores for all 8 metrics based on the current response
 */
export function evaluateRepResponse(
  repMessage: string,
  previousHcpMessage: string | undefined,
  conversationHistory: Transcript
): RepMetricScore[] {
  // Detect which metrics were demonstrated in this response
  const detectedMetrics = detectRepMetrics(repMessage, previousHcpMessage);
  const detectedIds = new Set(detectedMetrics.map((m) => m.id));

  // Score the full conversation to get metric scores
  const fullScoring = scoreConversation(conversationHistory);

  // Map all 8 metrics to RepMetricScore format
  const allMetrics: RepMetricScore[] = [
    {
      metricId: 'question_quality',
      metricName: 'Question Quality',
      score: getMetricScore(fullScoring, 'question_quality'),
      detected: detectedIds.has('question-quality'),
      rationale: getMetricRationale(fullScoring, 'question_quality', detectedIds.has('question-quality')),
      category: 'question',
    },
    {
      metricId: 'listening_responsiveness',
      metricName: 'Listening & Responsiveness',
      score: getMetricScore(fullScoring, 'listening_responsiveness'),
      detected: detectedIds.has('listening-responsiveness'),
      rationale: getMetricRationale(fullScoring, 'listening_responsiveness', detectedIds.has('listening-responsiveness')),
      category: 'listening',
    },
    {
      metricId: 'making_it_matter',
      metricName: 'Making It Matter',
      score: getMetricScore(fullScoring, 'making_it_matter'),
      detected: detectedIds.has('making-it-matter'),
      rationale: getMetricRationale(fullScoring, 'making_it_matter', detectedIds.has('making-it-matter')),
      category: 'value',
    },
    {
      metricId: 'customer_engagement_signals',
      metricName: 'Customer Engagement',
      score: getMetricScore(fullScoring, 'customer_engagement_signals'),
      detected: detectedIds.has('customer-engagement'),
      rationale: getMetricRationale(fullScoring, 'customer_engagement_signals', detectedIds.has('customer-engagement')),
      category: 'engagement',
    },
    {
      metricId: 'objection_navigation',
      metricName: 'Objection Navigation',
      score: getMetricScore(fullScoring, 'objection_navigation'),
      detected: detectedIds.has('objection-navigation'),
      rationale: getMetricRationale(fullScoring, 'objection_navigation', detectedIds.has('objection-navigation')),
      category: 'objection',
    },
    {
      metricId: 'conversation_control_structure',
      metricName: 'Conversation Control',
      score: getMetricScore(fullScoring, 'conversation_control_structure'),
      detected: detectedIds.has('conversation-control'),
      rationale: getMetricRationale(fullScoring, 'conversation_control_structure', detectedIds.has('conversation-control')),
      category: 'control',
    },
    {
      metricId: 'commitment_gaining',
      metricName: 'Commitment Gaining',
      score: getMetricScore(fullScoring, 'commitment_gaining'),
      detected: detectedIds.has('commitment-gaining'),
      rationale: getMetricRationale(fullScoring, 'commitment_gaining', detectedIds.has('commitment-gaining')),
      category: 'commitment',
    },
    {
      metricId: 'adaptability',
      metricName: 'Adaptability',
      score: getMetricScore(fullScoring, 'adaptability'),
      detected: detectedIds.has('adaptability'),
      rationale: getMetricRationale(fullScoring, 'adaptability', detectedIds.has('adaptability')),
      category: 'adaptability',
    },
  ];

  return allMetrics;
}

/**
 * Extract score for a specific metric from scoring results
 */
function getMetricScore(scoringResults: MetricResult[], metricId: string): number | null {
  const metric = scoringResults.find((m) => m.metric_id === metricId);
  return metric?.overall_score ?? null;
}

/**
 * Generate rationale for a metric based on scoring results and detection
 */
function getMetricRationale(
  scoringResults: MetricResult[],
  metricId: string,
  detected: boolean
): string {
  const metric = scoringResults.find((m) => m.metric_id === metricId);

  if (!metric || metric.overall_score === null) {
    return detected
      ? 'Detected in your response but not yet scored across the conversation.'
      : 'Not demonstrated in this response.';
  }

  // Extract component rationales
  const componentRationales = metric.components
    .filter((c) => c.score !== null && c.rationale)
    .map((c) => c.rationale)
    .filter(Boolean);

  if (componentRationales.length > 0) {
    // Return the most recent/relevant rationale
    return componentRationales[componentRationales.length - 1] || 'Evaluated based on conversation patterns.';
  }

  // Fallback rationales based on score
  const score = metric.overall_score;
  if (score >= 4.5) {
    return 'Excellent demonstration of this skill throughout the conversation.';
  } else if (score >= 3.5) {
    return 'Strong performance with room for minor refinement.';
  } else if (score >= 2.5) {
    return 'Adequate performance with opportunities for improvement.';
  } else if (score >= 1.5) {
    return 'Developing skill - focus on consistent application.';
  } else {
    return 'Needs focus - this skill requires significant development.';
  }
}

/**
 * Quick evaluation for inline display (detected metrics only)
 */
export function quickEvaluateRepResponse(
  repMessage: string,
  previousHcpMessage: string | undefined
): RepMetricCue[] {
  return detectRepMetrics(repMessage, previousHcpMessage);
}
