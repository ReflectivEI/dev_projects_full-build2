/**
 * UI Adapter for Behavioral Metrics
 * Maps metrics-spec.ts to UI display requirements
 * Frontend-only, read-only wiring
 */

import { METRICS_SPEC, type BehavioralMetricId, type MetricSpec } from './signal-intelligence/metrics-spec';

export interface MetricUIData {
  id: string;
  definition: string;
  measurementMethod: string;
  indicators: string[];
  heuristicsExplanation: string;
}

const METRIC_ID_MAP: Record<string, BehavioralMetricId> = {
  'question_quality': 'question_quality',
  'listening_responsiveness': 'listening_responsiveness',
  'making_it_matter': 'making_it_matter',
  'customer_engagement_signals': 'customer_engagement_signals',
  'objection_navigation': 'objection_navigation',
  'conversation_control_structure': 'conversation_control_structure',
  'commitment_gaining': 'commitment_gaining',
  'adaptability': 'adaptability'
};

function generateDefinition(spec: MetricSpec): string {
  const componentDescriptions = spec.components.map(c => c.description).join(', ');
  return `${spec.metric} evaluates ${componentDescriptions}.`;
}

function generateMeasurementMethod(spec: MetricSpec): string {
  const formula = spec.score_formula === 'weighted_average' ? 'weighted average' : 'average';
  const componentCount = spec.components.length;
  const optional = spec.optional ? ' This metric is optional and only scores when applicable behaviors are detected.' : '';
  return `Scored using ${formula} of ${componentCount} components based on observable behaviors in conversation transcripts. Each component is evaluated using deterministic heuristics that analyze question patterns, response quality, and conversational dynamics.${optional}`;
}

function generateIndicators(spec: MetricSpec): string[] {
  const allIndicators: string[] = [];
  spec.components.forEach(component => {
    allIndicators.push(...component.indicators);
  });
  return allIndicators;
}

function generateHeuristicsExplanation(spec: MetricSpec): string {
  const explanations: string[] = [];
  
  spec.components.forEach(component => {
    const weight = component.weight;
    const weightPercent = Math.round(weight * 100);
    explanations.push(`**${component.name.replace(/_/g, ' ')}** (${weightPercent}% weight): ${component.heuristics}`);
  });
  
  return explanations.join('\n\n');
}

export function getMetricUIData(metricId: string): MetricUIData | null {
  const specId = METRIC_ID_MAP[metricId];
  if (!specId) return null;
  
  const spec = METRICS_SPEC.find(m => m.id === specId);
  if (!spec) return null;
  
  return {
    id: metricId,
    definition: generateDefinition(spec),
    measurementMethod: generateMeasurementMethod(spec),
    indicators: generateIndicators(spec),
    heuristicsExplanation: generateHeuristicsExplanation(spec)
  };
}

export function getAllMetricUIData(): Record<string, MetricUIData> {
  const result: Record<string, MetricUIData> = {};
  
  Object.keys(METRIC_ID_MAP).forEach(metricId => {
    const data = getMetricUIData(metricId);
    if (data) {
      result[metricId] = data;
    }
  });
  
  return result;
}
