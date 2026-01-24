// Metric improvement guidance
// This file provides improvement tips for behavioral metrics

export type BehavioralMetricId = string;

export interface ImprovementTip {
  title: string;
  description: string;
  example?: string;
}

/**
 * Get all improvement tips for a specific metric
 * Returns an array of improvement tips
 */
export function getAllImprovementTipsForMetric(metricId: BehavioralMetricId): ImprovementTip[] {
  // Return empty array for now - tips can be added later
  return [];
}
