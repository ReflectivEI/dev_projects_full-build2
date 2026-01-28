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
  // CRITICAL: If no available cues, return random selection from all cues
  if (availableCues.length === 0) {
    const allCues = Object.values(HCP_CUES);
    return selectRandomCues(allCues, 2);
  }
  
  const cues: BehavioralCue[] = [];
  
  // Early turns (1-3): Start with common opening cues
  if (turnNumber <= 3) {
    // Prioritize stress and resistance cues (common at start)
    const openingCues = availableCues.filter(c => 
      c.category === 'stress' || c.category === 'resistance'
    );
    if (openingCues.length > 0) {
      cues.push(...selectRandomCues(openingCues, 1));
    } else {
      cues.push(...selectRandomCues(availableCues, 1));
    }
  }
  
  // Mid turns (4-6): Introduce variety based on mood
  else if (turnNumber <= 6) {
    if (mood === 'improving') {
      // Show low-severity engagement cues (HCP warming up)
      const engagementCues = availableCues.filter(c => 
        c.category === 'engagement' && c.severity === 'low'
      );
      if (engagementCues.length > 0) {
        cues.push(...selectRandomCues(engagementCues, 1));
      } else {
        // Fallback to any engagement cues
        const anyEngagement = availableCues.filter(c => c.category === 'engagement');
        if (anyEngagement.length > 0) {
          cues.push(...selectRandomCues(anyEngagement, 1));
        } else {
          cues.push(...selectRandomCues(availableCues, 1));
        }
      }
    } else if (mood === 'declining') {
      // Show resistance cues (HCP pulling back)
      const resistanceCues = availableCues.filter(c => c.category === 'resistance');
      if (resistanceCues.length > 0) {
        cues.push(...selectRandomCues(resistanceCues, 1));
      } else {
        cues.push(...selectRandomCues(availableCues, 1));
      }
    } else {
      // Show stress cues (neutral mood)
      const stressCues = availableCues.filter(c => c.category === 'stress');
      if (stressCues.length > 0) {
        cues.push(...selectRandomCues(stressCues, 1));
      } else {
        cues.push(...selectRandomCues(availableCues, 1));
      }
    }
  }
  
  // Late turns (7+): Escalate or de-escalate based on mood
  else {
    if (mood === 'improving') {
      // Show low-severity engagement (HCP more receptive)
      const positiveCues = availableCues.filter(c => 
        c.category === 'engagement' && c.severity === 'low'
      );
      if (positiveCues.length > 0) {
        cues.push(...selectRandomCues(positiveCues, 1));
      } else {
        cues.push(...selectRandomCues(availableCues, 1));
      }
    } else if (mood === 'declining') {
      // Show high severity resistance or stress (HCP frustrated)
      const negativeCues = availableCues.filter(c => 
        c.severity === 'high' && (c.category === 'resistance' || c.category === 'stress')
      );
      if (negativeCues.length > 0) {
        cues.push(...selectRandomCues(negativeCues, 1));
      } else {
        cues.push(...selectRandomCues(availableCues, 1));
      }
    } else {
      // Show mixed signals
      cues.push(...selectRandomCues(availableCues, 1));
    }
  }
  
  // CRITICAL: Always add a secondary cue for variety
  const remainingCues = availableCues.filter(c => !cues.includes(c));
  if (remainingCues.length > 0) {
    cues.push(...selectRandomCues(remainingCues, 1));
  } else if (cues.length < 2) {
    // If we only have 1 cue and no remaining, add any available cue
    cues.push(...selectRandomCues(availableCues, 1));
  }
  
  // CRITICAL: Ensure we always return at least 2 cues
  if (cues.length === 0) {
    return selectRandomCues(availableCues, 2);
  }
  
  return cues.slice(0, 2);
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
