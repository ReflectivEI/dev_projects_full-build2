/**
 * MAJOR AIRO PROMPT #2: Capability ↔ Metric Mapping
 * Canonical mapping between SI capabilities and behavioral metrics
 */

export const SI_CAPABILITY_METRIC_MAP: Record<string, string[]> = {
  'question-quality': ['open-ended-questions'],
  'active-listening': ['acknowledgment-statements', 'follow-up-questions'],
  'objection-handling': ['reframing-objections'],
  'value-articulation': ['benefit-statements', 'evidence-citations'],
  'discovery-effectiveness': ['needs-assessment-questions'],
  'closing-ability': ['trial-closes', 'commitment-asks'],
  'relationship-building': ['rapport-building-statements'],
  'adaptability': ['approach-shifts', 'pacing-adjustments']
};

export function getMetricsForCapability(capabilityId: string): string[] {
  return SI_CAPABILITY_METRIC_MAP[capabilityId] || [];
}

export function getCapabilityForMetric(metricId: string): string | undefined {
  for (const [capId, metrics] of Object.entries(SI_CAPABILITY_METRIC_MAP)) {
    if (metrics.includes(metricId)) return capId;
  }
  return undefined;
}
