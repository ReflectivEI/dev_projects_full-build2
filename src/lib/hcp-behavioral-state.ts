/**
 * HCP Behavioral State System
 * Generates rich behavioral descriptions for HCP responses including:
 * - Body language (posture, gestures, eye contact)
 * - Vocal tone and speech patterns
 * - Physical cues (facial expressions, movements)
 * - Emotional state indicators
 */

import { BehavioralCue } from './observable-cues';

export interface HCPBehavioralState {
  emotionalState: 'engaged' | 'neutral' | 'resistant' | 'stressed' | 'interested';
  energyLevel: 'high' | 'medium' | 'low';
  openness: 'open' | 'guarded' | 'closed';
  timeAwareness: 'relaxed' | 'aware' | 'pressured';
}

export interface HCPBehavioralDescription {
  bodyLanguage: string[];
  vocalTone: string[];
  physicalCues: string[];
  overallDescription: string;
}

/**
 * Generate behavioral descriptions based on detected cues
 */
export function generateHCPBehavioralDescription(
  cues: BehavioralCue[],
  messageContent: string
): HCPBehavioralDescription {
  const bodyLanguage: string[] = [];
  const vocalTone: string[] = [];
  const physicalCues: string[] = [];

  // Map cues to behavioral descriptions
  cues.forEach((cue) => {
    switch (cue.id) {
      case 'time-pressure':
        bodyLanguage.push('Glancing repeatedly at the clock on the wall');
        bodyLanguage.push('Shifting weight from foot to foot');
        physicalCues.push('Quick, darting eye movements toward the door');
        vocalTone.push('Speaking more rapidly than usual');
        break;

      case 'low-engagement':
        bodyLanguage.push('Minimal eye contact, gaze drifting to computer screen');
        bodyLanguage.push('Slouched posture with arms resting loosely');
        vocalTone.push('Monotone delivery with little inflection');
        physicalCues.push('Nodding mechanically without genuine acknowledgment');
        break;

      case 'frustration':
        physicalCues.push('Audible sigh before responding');
        bodyLanguage.push('Pinching bridge of nose briefly');
        physicalCues.push('Jaw tightening slightly');
        vocalTone.push('Clipped, terse responses');
        break;

      case 'defensive':
        bodyLanguage.push('Arms crossed tightly across chest');
        bodyLanguage.push('Shoulders hunched forward protectively');
        bodyLanguage.push('Leaning back in chair, creating distance');
        vocalTone.push('Slightly elevated pitch when responding');
        break;

      case 'distracted':
        physicalCues.push('Typing on keyboard while listening');
        bodyLanguage.push('Eyes scanning documents on desk');
        physicalCues.push('Reaching for phone intermittently');
        vocalTone.push('Delayed responses, as if processing other tasks');
        break;

      case 'hesitant':
        vocalTone.push('Long pauses before answering');
        vocalTone.push('Frequent "um" and "uh" fillers');
        physicalCues.push('Rubbing back of neck uncertainly');
        bodyLanguage.push('Avoiding direct eye contact');
        break;

      case 'uncomfortable':
        bodyLanguage.push('Shifting in seat frequently');
        physicalCues.push('Breaking eye contact and looking down');
        bodyLanguage.push('Fidgeting with pen or papers');
        vocalTone.push('Voice slightly quieter than normal');
        break;

      case 'impatient':
        physicalCues.push('Interrupting mid-sentence');
        bodyLanguage.push('Tapping fingers on desk rhythmically');
        vocalTone.push('Speaking over your words to redirect');
        physicalCues.push('Checking watch conspicuously');
        break;

      case 'disinterested':
        vocalTone.push('Flat, emotionless vocal delivery');
        bodyLanguage.push('Minimal facial expressions');
        physicalCues.push('Staring blankly without engagement');
        bodyLanguage.push('Body angled away from conversation');
        break;

      case 'withdrawn':
        bodyLanguage.push('Chair angled toward the door');
        bodyLanguage.push('Half-standing posture, ready to leave');
        bodyLanguage.push('Physically turning body away');
        physicalCues.push('Creating physical distance');
        break;
    }
  });

  // Generate overall description
  const overallDescription = generateOverallDescription(cues, bodyLanguage, vocalTone, physicalCues);

  return {
    bodyLanguage: deduplicateDescriptions(bodyLanguage),
    vocalTone: deduplicateDescriptions(vocalTone),
    physicalCues: deduplicateDescriptions(physicalCues),
    overallDescription,
  };
}

/**
 * Generate a cohesive overall description from individual cues
 */
function generateOverallDescription(
  cues: BehavioralCue[],
  bodyLanguage: string[],
  vocalTone: string[],
  physicalCues: string[]
): string {
  if (cues.length === 0) {
    return 'The HCP appears neutral and attentive, maintaining professional composure.';
  }

  const highSeverityCues = cues.filter((c) => c.severity === 'high');
  const categories = [...new Set(cues.map((c) => c.category))];

  // Build description based on dominant patterns
  if (highSeverityCues.length >= 2) {
    if (categories.includes('stress')) {
      return 'The HCP is visibly stressed and time-pressured, showing clear signs of urgency through body language and vocal tone. Their attention is divided and they appear eager to conclude the conversation.';
    }
    if (categories.includes('resistance')) {
      return 'The HCP displays strong resistance signals with defensive body language and dismissive vocal patterns. They seem guarded and skeptical about the conversation.';
    }
  }

  if (categories.includes('engagement') && cues.every((c) => c.category === 'engagement')) {
    return 'The HCP shows low engagement with minimal participation. Their body language and responses suggest disinterest or distraction.';
  }

  if (categories.length >= 3) {
    return 'The HCP exhibits mixed signals - combining elements of stress, resistance, and disengagement. The conversation appears challenging with multiple barriers to overcome.';
  }

  // Default to specific description
  const primaryCue = cues[0];
  return `The HCP shows signs of ${primaryCue.label.toLowerCase()} through ${bodyLanguage[0]?.toLowerCase() || 'subtle behavioral cues'}.`;
}

/**
 * Remove duplicate descriptions
 */
function deduplicateDescriptions(descriptions: string[]): string[] {
  return [...new Set(descriptions)];
}

/**
 * Determine HCP behavioral state from detected cues
 */
export function determineHCPState(cues: BehavioralCue[]): HCPBehavioralState {
  const categories = cues.map((c) => c.category);
  const severities = cues.map((c) => c.severity);

  // Determine emotional state
  let emotionalState: HCPBehavioralState['emotionalState'] = 'neutral';
  if (categories.includes('stress')) {
    emotionalState = 'stressed';
  } else if (categories.includes('resistance')) {
    emotionalState = 'resistant';
  } else if (categories.includes('interest')) {
    emotionalState = 'interested';
  } else if (categories.includes('engagement') && cues.length > 0) {
    emotionalState = 'engaged';
  }

  // Determine energy level
  let energyLevel: HCPBehavioralState['energyLevel'] = 'medium';
  if (severities.filter((s) => s === 'high').length >= 2) {
    energyLevel = 'low'; // High severity cues indicate low energy/engagement
  } else if (cues.length === 0) {
    energyLevel = 'high';
  }

  // Determine openness
  let openness: HCPBehavioralState['openness'] = 'open';
  if (categories.includes('resistance')) {
    openness = cues.filter((c) => c.category === 'resistance').length >= 2 ? 'closed' : 'guarded';
  }

  // Determine time awareness
  let timeAwareness: HCPBehavioralState['timeAwareness'] = 'relaxed';
  if (cues.some((c) => c.id === 'time-pressure' || c.id === 'impatient')) {
    timeAwareness = 'pressured';
  } else if (cues.some((c) => c.id === 'distracted')) {
    timeAwareness = 'aware';
  }

  return {
    emotionalState,
    energyLevel,
    openness,
    timeAwareness,
  };
}

/**
 * Format behavioral description for UI display
 */
export function formatBehavioralDescriptionForUI(description: HCPBehavioralDescription): string {
  const parts: string[] = [];

  if (description.bodyLanguage.length > 0) {
    parts.push(`**Body Language:** ${description.bodyLanguage.slice(0, 2).join('; ')}`);
  }

  if (description.vocalTone.length > 0) {
    parts.push(`**Vocal Tone:** ${description.vocalTone.slice(0, 2).join('; ')}`);
  }

  if (description.physicalCues.length > 0) {
    parts.push(`**Physical Cues:** ${description.physicalCues.slice(0, 2).join('; ')}`);
  }

  return parts.join('\n\n');
}
