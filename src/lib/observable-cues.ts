/**
 * Observable Cues Detection
 * 
 * Pure, read-only functions to detect observable communication patterns
 * in roleplay messages. Used for real-time visual feedback only.
 * 
 * GUARDRAILS:
 * - No scoring logic (independent of metrics-spec.ts and scoring.ts)
 * - No state persistence (no localStorage, sessionStorage, or IndexedDB)
 * - No API calls (frontend pattern matching only)
 * - Pattern detection only (read-only analysis)
 * - No impact on MetricResult[] or scoreConversation()
 */

export type CueType = 
  | 'question'
  | 'empathy'
  | 'value-statement'
  | 'objection-handling'
  | 'active-listening'
  | 'clarification'
  | 'rapport-building'
  | 'data-reference'
  | 'benefit-focus'
  | 'open-ended';

export interface ObservableCue {
  type: CueType;
  label: string;
  variant: 'positive' | 'neutral' | 'informational';
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Detect observable cues in a message
 * @param content - Message text
 * @param role - 'user' (rep) or 'assistant' (customer)
 * @returns Array of detected cues
 */
export function detectObservableCues(
  content: string,
  role: 'user' | 'assistant'
): ObservableCue[] {
  // Only analyze user (rep) messages
  if (role !== 'user') return [];
  
  const cues: ObservableCue[] = [];
  const lowerContent = content.toLowerCase();
  
  // Question patterns
  if (/\?/.test(content)) {
    if (/^(what|how|why|when|where|who|which|could you|would you|can you|may i)/i.test(content)) {
      cues.push({
        type: 'open-ended',
        label: 'Open-ended question',
        variant: 'positive',
        confidence: 'high'
      });
    } else {
      cues.push({
        type: 'question',
        label: 'Question asked',
        variant: 'informational',
        confidence: 'high'
      });
    }
  }
  
  // Empathy patterns
  const empathyPatterns = [
    /\b(understand|appreciate|recognize|hear you|i see|that makes sense|i can imagine)\b/i,
    /\b(must be (challenging|difficult|frustrating|concerning))\b/i,
    /\b(sounds like|seems like|it appears)\b/i
  ];
  
  if (empathyPatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'empathy',
      label: 'Empathy expressed',
      variant: 'positive',
      confidence: 'medium'
    });
  }
  
  // Active listening patterns
  const listeningPatterns = [
    /\b(you mentioned|you said|you indicated|you shared|you expressed|as you noted)\b/i,
    /\b(if i understand correctly|let me make sure|to clarify|so what you're saying)\b/i,
    /\b(tell me more about|help me understand|walk me through)\b/i
  ];
  
  if (listeningPatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'active-listening',
      label: 'Active listening',
      variant: 'positive',
      confidence: 'high'
    });
  }
  
  // Clarification patterns
  const clarificationPatterns = [
    /\b(to clarify|just to confirm|let me make sure|can you elaborate|could you explain)\b/i,
    /\b(what do you mean by|can you give me an example)\b/i
  ];
  
  if (clarificationPatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'clarification',
      label: 'Seeking clarity',
      variant: 'positive',
      confidence: 'high'
    });
  }
  
  // Value/benefit focus patterns
  const valuePatterns = [
    /\b(benefit|advantage|value|improve|enhance|optimize|increase|reduce|save)\b/i,
    /\b(help you|support you|enable you|allow you)\b/i,
    /\b(outcome|result|impact|effect)\b/i
  ];
  
  if (valuePatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'benefit-focus',
      label: 'Benefit-focused',
      variant: 'positive',
      confidence: 'medium'
    });
  }
  
  // Data/evidence reference patterns
  const dataPatterns = [
    /\b(study|research|data|evidence|trial|results|findings|statistics)\b/i,
    /\b(\d+%|percent|patients|participants)\b/i,
    /\b(published|peer-reviewed|clinical|demonstrated|showed|indicated)\b/i
  ];
  
  if (dataPatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'data-reference',
      label: 'Data referenced',
      variant: 'informational',
      confidence: 'high'
    });
  }
  
  // Objection handling patterns
  const objectionPatterns = [
    /\b(concern|worry|hesitation|reservation|doubt)\b/i,
    /\b(i understand your concern|that's a valid point|i appreciate you raising)\b/i,
    /\b(let me address|let's explore|what if we)\b/i
  ];
  
  if (objectionPatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'objection-handling',
      label: 'Addressing concern',
      variant: 'positive',
      confidence: 'medium'
    });
  }
  
  // Rapport building patterns
  const rapportPatterns = [
    /\b(thank you|appreciate|grateful|pleasure|great to)\b/i,
    /\b(i'm here to|happy to|glad to|excited to)\b/i
  ];
  
  if (rapportPatterns.some(pattern => pattern.test(content))) {
    cues.push({
      type: 'rapport-building',
      label: 'Building rapport',
      variant: 'positive',
      confidence: 'low'
    });
  }
  
  // Deduplicate by type (keep highest confidence)
  const uniqueCues = new Map<CueType, ObservableCue>();
  for (const cue of cues) {
    const existing = uniqueCues.get(cue.type);
    if (!existing || getConfidenceScore(cue.confidence) > getConfidenceScore(existing.confidence)) {
      uniqueCues.set(cue.type, cue);
    }
  }
  
  return Array.from(uniqueCues.values());
}

function getConfidenceScore(confidence: 'high' | 'medium' | 'low'): number {
  return { high: 3, medium: 2, low: 1 }[confidence];
}

/**
 * Get color class for cue variant
 */
export function getCueColorClass(variant: ObservableCue['variant']): string {
  switch (variant) {
    case 'positive':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
    case 'neutral':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
    case 'informational':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20';
  }
}
