/**
 * Observable Behavioral Cues Detection System
 * Detects 10 real-world HCP behavioral signals from conversation text
 */

export interface BehavioralCue {
  id: string;
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: 'engagement' | 'resistance' | 'interest' | 'stress';
}

export const HCP_CUES: Record<string, BehavioralCue> = {
  TIME_PRESSURE: {
    id: 'time-pressure',
    label: 'Time Pressure',
    description: 'Repeated glances at clock or doorway',
    severity: 'high',
    category: 'stress',
  },
  LOW_ENGAGEMENT: {
    id: 'low-engagement',
    label: 'Low Engagement',
    description: 'Short, clipped responses with minimal elaboration',
    severity: 'medium',
    category: 'engagement',
  },
  FRUSTRATION: {
    id: 'frustration',
    label: 'Frustration',
    description: 'Sighing or exhaling audibly before answering',
    severity: 'high',
    category: 'resistance',
  },
  DEFENSIVE: {
    id: 'defensive',
    label: 'Defensive',
    description: 'Arms crossed tightly or shoulders hunched forward',
    severity: 'medium',
    category: 'resistance',
  },
  DISTRACTED: {
    id: 'distracted',
    label: 'Distracted',
    description: 'Multitasking behavior (typing, signing forms, checking phone)',
    severity: 'medium',
    category: 'engagement',
  },
  HESITANT: {
    id: 'hesitant',
    label: 'Hesitant',
    description: 'Delayed responses or long pauses before replying',
    severity: 'low',
    category: 'resistance',
  },
  UNCOMFORTABLE: {
    id: 'uncomfortable',
    label: 'Uncomfortable',
    description: 'Avoidance of eye contact while listening',
    severity: 'medium',
    category: 'resistance',
  },
  IMPATIENT: {
    id: 'impatient',
    label: 'Impatient',
    description: 'Interrupting mid-sentence to redirect or move on',
    severity: 'high',
    category: 'stress',
  },
  DISINTERESTED: {
    id: 'disinterested',
    label: 'Disinterested',
    description: 'Flat or monotone vocal delivery despite neutral words',
    severity: 'medium',
    category: 'engagement',
  },
  WITHDRAWN: {
    id: 'withdrawn',
    label: 'Withdrawn',
    description: 'Physically turning body away (chair angled, half-standing posture)',
    severity: 'high',
    category: 'engagement',
  },
};

/**
 * Detect behavioral cues from HCP message text
 */
export function detectObservableCues(message: string): BehavioralCue[] {
  const detected: BehavioralCue[] = [];
  const lowerMessage = message.toLowerCase();

  // Time Pressure patterns
  if (
    lowerMessage.includes('busy') ||
    lowerMessage.includes('time') ||
    lowerMessage.includes('quick') ||
    lowerMessage.includes('hurry') ||
    lowerMessage.includes('clock') ||
    lowerMessage.includes('late')
  ) {
    detected.push(HCP_CUES.TIME_PRESSURE);
  }

  // Low Engagement patterns
  if (
    message.split(' ').length < 10 ||
    lowerMessage.includes('okay') ||
    lowerMessage.includes('fine') ||
    lowerMessage.includes('sure')
  ) {
    detected.push(HCP_CUES.LOW_ENGAGEMENT);
  }

  // Frustration patterns
  if (
    lowerMessage.includes('sigh') ||
    lowerMessage.includes('exhale') ||
    lowerMessage.includes('frustrated') ||
    lowerMessage.includes('annoyed')
  ) {
    detected.push(HCP_CUES.FRUSTRATION);
  }

  // Defensive patterns
  if (
    lowerMessage.includes('already') ||
    lowerMessage.includes('know that') ||
    lowerMessage.includes('aware') ||
    lowerMessage.includes('defensive')
  ) {
    detected.push(HCP_CUES.DEFENSIVE);
  }

  // Distracted patterns
  if (
    lowerMessage.includes('typing') ||
    lowerMessage.includes('phone') ||
    lowerMessage.includes('multitask') ||
    lowerMessage.includes('distract')
  ) {
    detected.push(HCP_CUES.DISTRACTED);
  }

  // Hesitant patterns
  if (
    lowerMessage.includes('um') ||
    lowerMessage.includes('uh') ||
    lowerMessage.includes('well') ||
    lowerMessage.includes('pause') ||
    lowerMessage.includes('hesitat')
  ) {
    detected.push(HCP_CUES.HESITANT);
  }

  // Uncomfortable patterns
  if (
    lowerMessage.includes('uncomfortable') ||
    lowerMessage.includes('awkward') ||
    lowerMessage.includes('eye contact')
  ) {
    detected.push(HCP_CUES.UNCOMFORTABLE);
  }

  // Impatient patterns
  if (
    lowerMessage.includes('interrupt') ||
    lowerMessage.includes('wait') ||
    lowerMessage.includes('impatient') ||
    lowerMessage.includes('move on')
  ) {
    detected.push(HCP_CUES.IMPATIENT);
  }

  // Disinterested patterns
  if (
    lowerMessage.includes('monotone') ||
    lowerMessage.includes('flat') ||
    lowerMessage.includes('disinterest') ||
    lowerMessage.includes('bored')
  ) {
    detected.push(HCP_CUES.DISINTERESTED);
  }

  // Withdrawn patterns
  if (
    lowerMessage.includes('turn') ||
    lowerMessage.includes('away') ||
    lowerMessage.includes('withdraw') ||
    lowerMessage.includes('distance')
  ) {
    detected.push(HCP_CUES.WITHDRAWN);
  }

  return detected;
}
