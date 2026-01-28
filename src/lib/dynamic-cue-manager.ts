/**
 * Dynamic Cue Manager
 * Ensures HCP cues evolve dynamically based on conversation flow
 * Prevents repeated cues and simulates realistic HCP state changes
 */

import { BehavioralCue, HCP_CUES, detectObservableCues } from './observable-cues';
import { RepMetricCue } from './observable-cues';

export interface ConversationContext {
  turnNumber: number;
  previousCues: string[]; // IDs of previously shown cues
  repPerformance: 'poor' | 'fair' | 'good' | 'excellent';
  hcpMood: 'improving' | 'stable' | 'declining';
}

/**
 * Analyze rep performance based on detected metrics
 */
function analyzeRepPerformance(detectedMetrics: RepMetricCue[]): 'poor' | 'fair' | 'good' | 'excellent' {
  const metricCount = detectedMetrics.length;
  
  if (metricCount === 0) return 'poor';
  if (metricCount === 1) return 'fair';
  if (metricCount === 2) return 'good';
  return 'excellent';
}

/**
 * Determine HCP mood trend based on rep performance
 */
function determineHCPMoodTrend(
  currentMood: 'improving' | 'stable' | 'declining',
  repPerformance: 'poor' | 'fair' | 'good' | 'excellent'
): 'improving' | 'stable' | 'declining' {
  // Good rep performance improves HCP mood
  if (repPerformance === 'excellent' || repPerformance === 'good') {
    return 'improving';
  }
  
  // Poor rep performance declines HCP mood
  if (repPerformance === 'poor') {
    return 'declining';
  }
  
  // Fair performance keeps mood stable
  return 'stable';
}

/**
 * Select next cues based on conversation context
 * Ensures variety and realistic progression
 */
export function selectDynamicCues(
  rawDetectedCues: BehavioralCue[],
  context: ConversationContext,
  repMetrics: RepMetricCue[]
): BehavioralCue[] {
  // Analyze current rep performance
  const repPerformance = analyzeRepPerformance(repMetrics);
  
  // Update HCP mood trend
  const newMood = determineHCPMoodTrend(context.hcpMood, repPerformance);
  
  // Get cues that haven't been shown in last 3 turns
  const recentCues = context.previousCues.slice(-6); // Last 3 turns (2 cues per turn)
  const availableCues = Object.values(HCP_CUES).filter(
    cue => !recentCues.includes(cue.id)
  );
  
  // If no raw cues detected, generate contextual cues
  if (rawDetectedCues.length === 0) {
    return generateContextualCues(context.turnNumber, newMood, availableCues);
  }
  
  // Filter out recently shown cues
  const filteredCues = rawDetectedCues.filter(
    cue => !recentCues.includes(cue.id)
  );
  
  // If all detected cues were recent, substitute with contextual cues
  if (filteredCues.length === 0) {
    return generateContextualCues(context.turnNumber, newMood, availableCues);
  }
  
  // Enhance with mood-appropriate cues
  const enhancedCues = enhanceCuesBasedOnMood(filteredCues, newMood, availableCues);
  
  return enhancedCues.slice(0, 2); // Return max 2 cues per turn
}

/**
 * Generate contextual cues when none are detected
 * Based on conversation turn and HCP mood
 * CRITICAL FIX: Ensures cues are ALWAYS generated, never returns empty array
 */
function generateContextualCues(
  turnNumber: number,
  mood: 'improving' | 'stable' | 'declining',
  availableCues: BehavioralCue[]
): BehavioralCue[] {
  console.log('[DynamicCueManager] generateContextualCues called:', {
    turnNumber,
    mood,
    availableCount: availableCues.length,
    availableIds: availableCues.map(c => c.id)
  });
  
  // CRITICAL: If no available cues, return random selection from all cues
  if (availableCues.length === 0) {
    console.log('[DynamicCueManager] No available cues! Using all cues as fallback');
    const allCues = Object.values(HCP_CUES);
    const selected = selectRandomCues(allCues, 2);
    console.log('[DynamicCueManager] Emergency fallback selected:', selected.map(c => c.id));
    return selected;
  }
  
  // SIMPLIFIED LOGIC: Just return random cues from available pool
  // This ensures variety without complex filtering that might return empty
  const selected = selectRandomCues(availableCues, 2);
  console.log('[DynamicCueManager] Selected cues:', selected.map(c => c.id));
  return selected;
}
/**
 * Enhance detected cues based on HCP mood
 */
function enhanceCuesBasedOnMood(
  detectedCues: BehavioralCue[],
  mood: 'improving' | 'stable' | 'declining',
  availableCues: BehavioralCue[]
): BehavioralCue[] {
  const enhanced = [...detectedCues];
  
  // If mood is improving, replace high-severity cues with lower ones
  if (mood === 'improving') {
    const highSeverityCues = enhanced.filter(c => c.severity === 'high');
    highSeverityCues.forEach(cue => {
      const index = enhanced.indexOf(cue);
      const replacement = availableCues.find(c => 
        c.category === cue.category && c.severity !== 'high'
      );
      if (replacement) {
        enhanced[index] = replacement;
      }
    });
  }
  
  // If mood is declining, escalate severity
  if (mood === 'declining') {
    const lowSeverityCues = enhanced.filter(c => c.severity === 'low');
    lowSeverityCues.forEach(cue => {
      const index = enhanced.indexOf(cue);
      const replacement = availableCues.find(c => 
        c.category === cue.category && c.severity === 'high'
      );
      if (replacement) {
        enhanced[index] = replacement;
      }
    });
  }
  
  return enhanced;
}

/**
 * Select random cues from a pool
 */
function selectRandomCues(pool: BehavioralCue[], count: number): BehavioralCue[] {
  if (pool.length === 0) return [];
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

/**
 * Create initial conversation context
 */
export function createInitialContext(): ConversationContext {
  return {
    turnNumber: 0,
    previousCues: [],
    repPerformance: 'fair',
    hcpMood: 'stable',
  };
}

/**
 * Update conversation context after each turn
 */
export function updateContext(
  context: ConversationContext,
  newCues: BehavioralCue[],
  repMetrics: RepMetricCue[]
): ConversationContext {
  const repPerformance = analyzeRepPerformance(repMetrics);
  const newMood = determineHCPMoodTrend(context.hcpMood, repPerformance);
  
  return {
    turnNumber: context.turnNumber + 1,
    previousCues: [...context.previousCues, ...newCues.map(c => c.id)],
    repPerformance,
    hcpMood: newMood,
  };
}
