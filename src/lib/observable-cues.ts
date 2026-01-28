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

// Type alias for compatibility
export type ObservableCue = BehavioralCue;

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

  // Low Engagement patterns - only trigger on very short responses with specific keywords
  const wordCount = message.trim().split(/\s+/).length;
  const hasLowEngagementKeywords = 
    lowerMessage.includes('okay') ||
    lowerMessage.includes('fine') ||
    lowerMessage.includes('sure') ||
    lowerMessage.includes('whatever');
  
  // Only flag if BOTH conditions are met: very short AND has disengaged keywords
  if (wordCount < 5 && hasLowEngagementKeywords) {
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

/**
 * Sales Rep Behavioral Metric Detection
 * Detects which of the 8 behavioral metrics a Sales Rep message demonstrates
 */

export interface RepMetricCue {
  id: string;
  label: string;
  description: string;
  category: 'question' | 'listening' | 'value' | 'engagement' | 'objection' | 'control' | 'commitment' | 'adaptability';
}

export const REP_METRIC_CUES: Record<string, RepMetricCue> = {
  QUESTION_QUALITY: {
    id: 'question-quality',
    label: 'Question Quality',
    description: 'Open-ended, relevant questions that uncover needs',
    category: 'question',
  },
  LISTENING_RESPONSIVENESS: {
    id: 'listening-responsiveness',
    label: 'Listening & Responsiveness',
    description: 'Paraphrasing, acknowledging, and adjusting based on HCP input',
    category: 'listening',
  },
  MAKING_IT_MATTER: {
    id: 'making-it-matter',
    label: 'Making It Matter',
    description: 'Connecting to patient outcomes and HCP priorities',
    category: 'value',
  },
  CUSTOMER_ENGAGEMENT: {
    id: 'customer-engagement',
    label: 'Customer Engagement',
    description: 'Encouraging dialogue and forward-looking conversation',
    category: 'engagement',
  },
  OBJECTION_NAVIGATION: {
    id: 'objection-navigation',
    label: 'Objection Navigation',
    description: 'Recognizing, reframing, and resolving concerns',
    category: 'objection',
  },
  CONVERSATION_CONTROL: {
    id: 'conversation-control',
    label: 'Conversation Control',
    description: 'Setting purpose, managing topics, respecting time',
    category: 'control',
  },
  COMMITMENT_GAINING: {
    id: 'commitment-gaining',
    label: 'Commitment Gaining',
    description: 'Proposing clear next steps with mutual agreement',
    category: 'commitment',
  },
  ADAPTABILITY: {
    id: 'adaptability',
    label: 'Adaptability',
    description: 'Adjusting approach based on HCP cues and context',
    category: 'adaptability',
  },
};

/**
 * Detect which behavioral metrics a Sales Rep message demonstrates
 * Returns 1-3 metrics typically (enhanced detection)
 */
export function detectRepMetrics(message: string, previousHcpMessage?: string): RepMetricCue[] {
  const detected: RepMetricCue[] = [];
  const lowerMessage = message.toLowerCase();
  const wordCount = message.trim().split(/\s+/).length;

  // Question Quality - open-ended questions (ENHANCED)
  const hasOpenQuestion = 
    lowerMessage.includes('how') ||
    lowerMessage.includes('what') ||
    lowerMessage.includes('why') ||
    lowerMessage.includes('tell me') ||
    lowerMessage.includes('describe') ||
    lowerMessage.includes('explain') ||
    lowerMessage.includes('walk me through') ||
    lowerMessage.includes('help me understand') ||
    lowerMessage.includes('could you share') ||
    lowerMessage.includes('what are your thoughts');
  
  const hasQuestionMark = message.includes('?');
  
  if (hasOpenQuestion && hasQuestionMark && wordCount > 5) {
    detected.push(REP_METRIC_CUES.QUESTION_QUALITY);
  }

  // Listening & Responsiveness - paraphrasing, acknowledging (ENHANCED)
  const hasListeningSignals = 
    lowerMessage.includes('i hear') ||
    lowerMessage.includes('i understand') ||
    lowerMessage.includes('you mentioned') ||
    lowerMessage.includes('you said') ||
    lowerMessage.includes('sounds like') ||
    lowerMessage.includes('it seems') ||
    lowerMessage.includes('so what you') ||
    lowerMessage.includes('let me make sure') ||
    lowerMessage.includes('if i\'m hearing you correctly') ||
    lowerMessage.includes('to summarize what you') ||
    lowerMessage.includes('i appreciate you sharing') ||
    lowerMessage.includes('that makes sense') ||
    lowerMessage.includes('i can see why');
  
  if (hasListeningSignals && wordCount > 8) {
    detected.push(REP_METRIC_CUES.LISTENING_RESPONSIVENESS);
  }

  // Making It Matter - patient outcomes, clinical impact (ENHANCED)
  const hasValueLanguage = 
    lowerMessage.includes('patient') ||
    lowerMessage.includes('outcome') ||
    lowerMessage.includes('result') ||
    lowerMessage.includes('benefit') ||
    lowerMessage.includes('improve') ||
    lowerMessage.includes('help') ||
    lowerMessage.includes('impact') ||
    lowerMessage.includes('practice') ||
    lowerMessage.includes('clinical') ||
    lowerMessage.includes('efficacy') ||
    lowerMessage.includes('quality of life') ||
    lowerMessage.includes('treatment goals') ||
    lowerMessage.includes('care') ||
    lowerMessage.includes('therapy');
  
  if (hasValueLanguage && wordCount > 10) {
    detected.push(REP_METRIC_CUES.MAKING_IT_MATTER);
  }

  // Objection Navigation - addressing concerns
  const hasObjectionHandling = 
    lowerMessage.includes('concern') ||
    lowerMessage.includes('understand your') ||
    lowerMessage.includes('valid point') ||
    lowerMessage.includes('appreciate') ||
    lowerMessage.includes('however') ||
    lowerMessage.includes('on the other hand') ||
    lowerMessage.includes('perspective');
  
  if (hasObjectionHandling && previousHcpMessage) {
    const prevLower = previousHcpMessage.toLowerCase();
    const hcpHadConcern = 
      prevLower.includes('but') ||
      prevLower.includes('concern') ||
      prevLower.includes('worry') ||
      prevLower.includes('not sure');
    
    if (hcpHadConcern) {
      detected.push(REP_METRIC_CUES.OBJECTION_NAVIGATION);
    }
  }

  // Conversation Control - time management, topic transitions
  const hasControlSignals = 
    lowerMessage.includes('let me') ||
    lowerMessage.includes('i\'d like to') ||
    lowerMessage.includes('to keep') ||
    lowerMessage.includes('briefly') ||
    lowerMessage.includes('moving to') ||
    lowerMessage.includes('next') ||
    lowerMessage.includes('before we');
  
  if (hasControlSignals && wordCount > 6) {
    detected.push(REP_METRIC_CUES.CONVERSATION_CONTROL);
  }

  // Commitment Gaining - next steps, follow-up
  const hasCommitmentLanguage = 
    lowerMessage.includes('next step') ||
    lowerMessage.includes('follow up') ||
    lowerMessage.includes('schedule') ||
    lowerMessage.includes('send you') ||
    lowerMessage.includes('would you') ||
    lowerMessage.includes('can we') ||
    lowerMessage.includes('shall we');
  
  if (hasCommitmentLanguage && wordCount > 5) {
    detected.push(REP_METRIC_CUES.COMMITMENT_GAINING);
  }

  // Adaptability - responding to HCP cues
  if (previousHcpMessage) {
    const prevLower = previousHcpMessage.toLowerCase();
    const hcpShowedTimePressure = 
      prevLower.includes('busy') ||
      prevLower.includes('time') ||
      prevLower.includes('quick');
    
    const repAdapted = 
      lowerMessage.includes('briefly') ||
      lowerMessage.includes('quick') ||
      lowerMessage.includes('short') ||
      lowerMessage.includes('respect your time');
    
    if (hcpShowedTimePressure && repAdapted) {
      detected.push(REP_METRIC_CUES.ADAPTABILITY);
    }
  }

  // Return top 3 metrics (increased from 2 for better evaluation)
  return detected.slice(0, 3);
}

/**
 * Generate rich behavioral description from detected HCP cues
 * Creates narrative text describing observable behaviors
 */
export function generateCueDescription(cues: BehavioralCue[]): string {
  if (cues.length === 0) return '';

  const descriptions: string[] = [];

  // Group cues by category for better narrative flow
  const byCategory: Record<string, BehavioralCue[]> = {
    stress: [],
    resistance: [],
    engagement: [],
    interest: [],
  };

  cues.forEach(cue => {
    byCategory[cue.category].push(cue);
  });

  // Build narrative based on detected cues
  if (byCategory.stress.length > 0) {
    const stressCues = byCategory.stress.map(c => c.id);
    if (stressCues.includes('time-pressure')) {
      descriptions.push('The HCP glances at the clock repeatedly and shifts in their chair');
    }
    if (stressCues.includes('impatient')) {
      descriptions.push('they interrupt mid-sentence, clearly wanting to move forward');
    }
  }

  if (byCategory.resistance.length > 0) {
    const resistCues = byCategory.resistance.map(c => c.id);
    if (resistCues.includes('frustration')) {
      descriptions.push('A visible sigh escapes before they respond');
    }
    if (resistCues.includes('defensive')) {
      descriptions.push('their arms cross tightly across their chest');
    }
    if (resistCues.includes('uncomfortable')) {
      descriptions.push('they avoid direct eye contact');
    }
    if (resistCues.includes('hesitant')) {
      descriptions.push('there\'s a long pause before they answer');
    }
  }

  if (byCategory.engagement.length > 0) {
    const engageCues = byCategory.engagement.map(c => c.id);
    if (engageCues.includes('low-engagement')) {
      descriptions.push('Their responses are clipped and minimal');
    }
    if (engageCues.includes('distracted')) {
      descriptions.push('they continue typing on their computer while talking');
    }
    if (engageCues.includes('disinterested')) {
      descriptions.push('their tone is flat and monotone despite neutral words');
    }
    if (engageCues.includes('withdrawn')) {
      descriptions.push('they angle their body slightly away from you');
    }
  }

  // Join descriptions into a natural sentence
  if (descriptions.length === 0) return '';
  if (descriptions.length === 1) return descriptions[0] + '.';
  if (descriptions.length === 2) return descriptions.join(', and ') + '.';
  
  const last = descriptions.pop();
  return descriptions.join(', ') + ', and ' + last + '.';
}

/**
 * Generate quick performance feedback for sales rep based on detected metrics
 */
export function generateRepFeedback(metrics: RepMetricCue[], hcpCues: BehavioralCue[]): string {
  if (metrics.length === 0) return '';

  const feedback: string[] = [];

  // Positive feedback based on metrics demonstrated
  metrics.forEach(metric => {
    switch (metric.id) {
      case 'question-quality':
        feedback.push('✓ Asked an open-ended question to uncover needs');
        break;
      case 'listening-responsiveness':
        feedback.push('✓ Demonstrated active listening and acknowledgment');
        break;
      case 'making-it-matter':
        feedback.push('✓ Connected to patient outcomes and clinical value');
        break;
      case 'customer-engagement':
        feedback.push('✓ Encouraged dialogue and forward momentum');
        break;
      case 'objection-navigation':
        feedback.push('✓ Addressed concerns with empathy and reframing');
        break;
      case 'conversation-control':
        feedback.push('✓ Managed conversation flow and respected time');
        break;
      case 'commitment-gaining':
        feedback.push('✓ Proposed clear next steps');
        break;
      case 'adaptability':
        feedback.push('✓ Adapted approach based on HCP cues');
        break;
    }
  });

  // Coaching tips based on HCP cues that weren't addressed
  const hasTimePressure = hcpCues.some(c => c.id === 'time-pressure');
  const hasResistance = hcpCues.some(c => c.category === 'resistance');
  const hasLowEngagement = hcpCues.some(c => c.category === 'engagement' && c.severity !== 'low');

  if (hasTimePressure && !metrics.some(m => m.id === 'adaptability')) {
    feedback.push('→ Consider acknowledging time constraints explicitly');
  }

  if (hasResistance && !metrics.some(m => m.id === 'objection-navigation')) {
    feedback.push('→ Address the HCP\'s concerns or hesitation directly');
  }

  if (hasLowEngagement && !metrics.some(m => m.id === 'customer-engagement')) {
    feedback.push('→ Try an engaging question to re-energize the conversation');
  }

  return feedback.join('\n');
}
