/**
 * Behavioral Metrics Scoring Engine (v1)
 * Frontend-only, deterministic scoring implementation
 * No ML, no external deps, no network calls
 */

import { METRICS_SPEC, type BehavioralMetricId } from './metrics-spec';

export type Turn = {
  speaker: 'rep' | 'customer';
  text: string;
  t0?: number;
  t1?: number;
};

export type Transcript = Turn[];

export type ComponentResult = {
  name: string;
  score: number | null;
  applicable: boolean;
  weight: number;
  rationale?: string;
};

export type MetricResult = {
  id: string;
  metric: string;
  optional: boolean;
  score_formula: 'average' | 'weighted_average';
  components: ComponentResult[];
  overall_score: number | null;
  not_applicable?: boolean;
  metricsVersion?: string;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function averageApplicable(components: ComponentResult[]): number | null {
  const applicable = components.filter(c => c.applicable && c.score !== null);
  if (applicable.length === 0) return null;
  const sum = applicable.reduce((acc, c) => acc + (c.score || 0), 0);
  return round1(sum / applicable.length);
}

export function weightedAverageApplicable(components: ComponentResult[]): number | null {
  // Kept for backward compatibility; now intentionally identical to averageApplicable
  // Canonical rule: all metrics roll up via simple arithmetic mean over applicable components
  return averageApplicable(components);
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

export function overlap(tokens1: string[], tokens2: string[]): number {
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const intersection = [...set1].filter(t => set2.has(t));
  return intersection.length / Math.max(set1.size, set2.size);
}

export function containsAny(text: string, phrases: string[]): boolean {
  const lower = text.toLowerCase();
  return phrases.some(p => lower.includes(p.toLowerCase()));
}

export function startsWithAny(text: string, prefixes: string[]): boolean {
  const lower = text.toLowerCase().trim();
  return prefixes.some(p => lower.startsWith(p.toLowerCase()));
}

// ============================================================================
// SIGNAL-TO-METRIC ATTRIBUTION MAP
// ============================================================================

/**
 * Canonical mapping of signal patterns to behavioral metrics
 * Each metric becomes applicable when its mapped signals are detected
 */
const SIGNAL_TO_METRIC_MAP: Record<string, string[]> = {
  'question_quality': [
    'how', 'what', 'why', 'when', 'where', 'who',
    'tell me', 'walk me through', 'help me understand',
    'can you explain', 'could you share'
  ],
  'listening_responsiveness': [
    'what i\'m hearing', 'if i understand', 'let me make sure',
    'so what you\'re saying', 'you mentioned', 'you said',
    'building on that', 'that makes sense'
  ],
  'making_it_matter': [
    'this means', 'impact', 'benefit', 'result',
    'help you', 'for your', 'in your situation',
    'specifically for', 'relevant to'
  ],
  'customer_engagement_signals': [
    'tell me more', 'that\'s interesting', 'i see',
    'makes sense', 'i understand', 'good point',
    'question', 'concern', 'wondering'
  ],
  'objection_navigation': [
    'concern', 'worry', 'hesitant', 'not sure',
    'but what about', 'however', 'challenge',
    'i understand your concern', 'that\'s a fair point'
  ],
  'conversation_control_structure': [
    'let\'s start', 'first', 'next', 'finally',
    'to summarize', 'in summary', 'key takeaway',
    'agenda', 'plan', 'structure'
  ],
  'commitment_gaining': [
    'next step', 'follow up', 'schedule', 'meeting',
    'would you be open', 'can we', 'shall we',
    'action item', 'move forward'
  ],
  'adaptability': [
    'let me adjust', 'different approach', 'another way',
    'based on what you said', 'given that', 'in light of',
    'pivot', 'shift', 'change direction'
  ]
};

/**
 * Detect if transcript contains any observable signals for a metric
 * Returns true if at least one signal pattern is detected
 */
function hasObservableSignals(transcript: Transcript, signalPatterns: string[]): boolean {
  const allText = transcript.map(t => t.text.toLowerCase()).join(' ');
  return signalPatterns.some(pattern => allText.includes(pattern.toLowerCase()));
}

/**
 * Check if transcript contains signals mapped to a specific metric
 */
function hasMetricSignals(transcript: Transcript, metricId: string): boolean {
  const signalPatterns = SIGNAL_TO_METRIC_MAP[metricId] || [];
  return hasObservableSignals(transcript, signalPatterns);
}

/**
 * Apply weak-signal fallback: if signals exist but threshold not met,
 * mark first component as applicable with score=1
 */
function applyWeakSignalFallback(
  components: ComponentResult[],
  transcript: Transcript,
  signalPatterns: string[]
): ComponentResult[] {
  // If any component is already applicable, no fallback needed
  if (components.some(c => c.applicable)) {
    return components;
  }
  
  // Check if observable signals exist
  if (!hasObservableSignals(transcript, signalPatterns)) {
    return components;
  }
  
  // Apply fallback: mark first component as applicable with score=1
  const fallbackComponents = [...components];
  fallbackComponents[0] = {
    ...fallbackComponents[0],
    score: 1,
    applicable: true,
    rationale: 'Observable signals detected, but threshold not met for higher score'
  };
  
  return fallbackComponents;
}

// ============================================================================
// METRIC-SPECIFIC SCORING FUNCTIONS
// ============================================================================

function scoreQuestionQuality(transcript: Transcript): ComponentResult[] {
  const repTurns = transcript.filter(t => t.speaker === 'rep');
  const customerTurns = transcript.filter(t => t.speaker === 'customer');

  // Detect questions
  const isQuestion = (text: string) => {
    return text.includes('?') || startsWithAny(text, [
      'how', 'what', 'why', 'when', 'where', 'who',
      'tell me', 'walk me through', 'help me understand'
    ]);
  };

  const questions = repTurns.filter(t => isQuestion(t.text));
  if (questions.length === 0) {
    const components = [
      { name: 'open_closed_ratio', score: null, applicable: false, weight: 0.25, rationale: 'No questions asked' },
      { name: 'relevance_to_goals', score: null, applicable: false, weight: 0.25, rationale: 'No questions asked' },
      { name: 'sequencing_logic', score: null, applicable: false, weight: 0.25, rationale: 'No questions asked' },
      { name: 'follow_up_depth', score: null, applicable: false, weight: 0.25, rationale: 'No questions asked' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['how', 'what', 'why', 'when', 'where', 'who', '?', 'tell me', 'walk me through', 'help me understand'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // 1. Open/Closed Ratio
  const openPrefixes = ['how', 'what', 'why', 'tell me', 'walk me through', 'help me understand'];
  const closedPrefixes = ['do', 'does', 'did', 'is', 'are', 'can', 'will', 'has', 'have'];
  const openQuestions = questions.filter(q => startsWithAny(q.text, openPrefixes));
  const closedQuestions = questions.filter(q => startsWithAny(q.text, closedPrefixes));
  const ratio = openQuestions.length / (openQuestions.length + closedQuestions.length);
  const openClosedScore = ratio >= 0.70 ? 5 : ratio >= 0.55 ? 4 : ratio >= 0.40 ? 3 : ratio >= 0.25 ? 2 : 1;

  // 2. Relevance to Goals
  const goalPatterns = ['need', 'goal', 'priority', 'concern', 'issue', 'challenge', 'want', 'trying', 'struggle'];
  const goalTokens = new Set<string>();
  customerTurns.forEach(turn => {
    const tokens = tokenize(turn.text);
    tokens.forEach((token, i) => {
      if (goalPatterns.some(p => tokens[i - 1] === p || tokens[i + 1] === p)) {
        goalTokens.add(token);
      }
    });
  });
  const questionsWithGoals = questions.filter(q => {
    const qTokens = tokenize(q.text);
    return qTokens.some(t => goalTokens.has(t));
  });
  const goalRelevance = questionsWithGoals.length / questions.length;
  const goalScore = goalRelevance >= 0.60 ? 5 : goalRelevance >= 0.45 ? 4 : goalRelevance >= 0.30 ? 3 : goalRelevance >= 0.15 ? 2 : 1;

  // 3. Sequencing Logic
  const bridgePhrases = ['got it', 'that makes sense', 'building on that', 'to understand that better'];
  let jumps = 0;
  for (let i = 0; i < transcript.length - 1; i++) {
    if (transcript[i].speaker === 'customer' && transcript[i + 1].speaker === 'rep' && isQuestion(transcript[i + 1].text)) {
      const custTokens = tokenize(transcript[i].text);
      const repTokens = tokenize(transcript[i + 1].text);
      const overlapScore = overlap(custTokens, repTokens);
      const hasBridge = containsAny(transcript[i + 1].text, bridgePhrases);
      if (overlapScore < 0.10 && !hasBridge) {
        jumps++;
      }
    }
  }
  const jumpRate = jumps / questions.length;
  const sequencingScore = jumpRate <= 0.10 ? 5 : jumpRate <= 0.20 ? 4 : jumpRate <= 0.35 ? 3 : jumpRate <= 0.50 ? 2 : 1;

  // 4. Follow-up Depth
  const followUpPhrases = ['you mentioned', 'when you said', 'say more about', 'help me understand more'];
  let followUps = 0;
  for (let i = 0; i < transcript.length - 1; i++) {
    if (transcript[i].speaker === 'customer' && transcript[i + 1].speaker === 'rep' && isQuestion(transcript[i + 1].text)) {
      const custTokens = tokenize(transcript[i].text);
      const repTokens = tokenize(transcript[i + 1].text);
      const overlapScore = overlap(custTokens, repTokens);
      const hasFollowUpPhrase = containsAny(transcript[i + 1].text, followUpPhrases);
      if (overlapScore >= 0.20 || hasFollowUpPhrase) {
        followUps++;
      }
    }
  }
  const followUpRate = followUps / questions.length;
  const followUpScore = followUpRate >= 0.60 ? 5 : followUpRate >= 0.40 ? 4 : followUpRate >= 0.25 ? 3 : followUpRate >= 0.10 ? 2 : 1;

  return [
    { name: 'open_closed_ratio', score: openClosedScore, applicable: true, weight: 0.25, rationale: `${openQuestions.length}/${questions.length} open` },
    { name: 'relevance_to_goals', score: goalScore, applicable: true, weight: 0.25, rationale: `${questionsWithGoals.length}/${questions.length} goal-aligned` },
    { name: 'sequencing_logic', score: sequencingScore, applicable: true, weight: 0.25, rationale: `${jumps} jumps in ${questions.length} questions` },
    { name: 'follow_up_depth', score: followUpScore, applicable: true, weight: 0.25, rationale: `${followUps}/${questions.length} follow-ups` }
  ];
}

function scoreListeningResponsiveness(transcript: Transcript): ComponentResult[] {
  const repTurns = transcript.filter(t => t.speaker === 'rep');
  const customerTurns = transcript.filter(t => t.speaker === 'customer');

  if (customerTurns.length === 0) {
    const components = [
      { name: 'paraphrasing', score: null, applicable: false, weight: 0.33, rationale: 'No customer turns' },
      { name: 'acknowledgment_of_concerns', score: null, applicable: false, weight: 0.33, rationale: 'No customer turns' },
      { name: 'adjustment_to_new_info', score: null, applicable: false, weight: 0.34, rationale: 'No customer turns' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['what i\'m hearing', 'it sounds like', 'if i understand', 'so you\'re saying', 'i hear you', 'i understand', 'that makes sense', 'let me adjust'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // 1. Paraphrasing
  const paraphrasePhrases = ['what i\'m hearing', 'it sounds like', 'if i understand', 'so you\'re saying'];
  let paraphrases = 0;
  for (let i = 0; i < transcript.length - 1; i++) {
    if (transcript[i].speaker === 'customer' && transcript[i + 1].speaker === 'rep') {
      const custTokens = tokenize(transcript[i].text);
      const repTokens = tokenize(transcript[i + 1].text);
      const overlapScore = overlap(custTokens, repTokens);
      const hasParaphrasePhrase = containsAny(transcript[i + 1].text, paraphrasePhrases);
      if (overlapScore >= 0.30 || hasParaphrasePhrase) {
        paraphrases++;
      }
    }
  }
  const paraphraseRate = paraphrases / customerTurns.length;
  const paraphraseScore = paraphraseRate >= 0.50 ? 5 : paraphraseRate >= 0.35 ? 4 : paraphraseRate >= 0.20 ? 3 : paraphraseRate >= 0.10 ? 2 : 1;

  // 2. Acknowledgment of Concerns
  const concernWords = ['worried', 'concern', 'hesitant', 'problem', 'issue', 'not sure', 'don\'t like', 'no', 'can\'t', 'won\'t', 'too busy', 'budget'];
  const concernTurns = customerTurns.filter(t => containsAny(t.text, concernWords));
  let acknowledgedConcerns = 0;
  if (concernTurns.length > 0) {
    const ackPhrases = ['i hear you', 'i understand', 'that makes sense', 'i can see why', 'you\'re right', 'fair point'];
    for (let i = 0; i < transcript.length - 1; i++) {
      if (transcript[i].speaker === 'customer' && containsAny(transcript[i].text, concernWords)) {
        if (transcript[i + 1].speaker === 'rep' && containsAny(transcript[i + 1].text, ackPhrases)) {
          acknowledgedConcerns++;
        }
      }
    }
  }
  const concernAckRate = concernTurns.length > 0 ? acknowledgedConcerns / concernTurns.length : 0;
  const concernScore = concernTurns.length > 0
    ? (concernAckRate >= 0.80 ? 5 : concernAckRate >= 0.60 ? 4 : concernAckRate >= 0.40 ? 3 : concernAckRate >= 0.20 ? 2 : 1)
    : null;
  const concernApplicable = concernTurns.length > 0;

  // 3. Adjustment to New Info
  const seenTokens = new Set<string>();
  let adjustments = 0;
  let newInfoCount = 0;
  for (let i = 0; i < transcript.length; i++) {
    if (transcript[i].speaker === 'customer') {
      const tokens = tokenize(transcript[i].text);
      const novelTokens = tokens.filter(t => !seenTokens.has(t));
      if (novelTokens.length > 0) {
        newInfoCount++;
        // Check if rep references any novel tokens in next 1-2 turns
        for (let j = i + 1; j < Math.min(i + 3, transcript.length); j++) {
          if (transcript[j].speaker === 'rep') {
            const repTokens = tokenize(transcript[j].text);
            if (novelTokens.some(nt => repTokens.includes(nt))) {
              adjustments++;
              break;
            }
          }
        }
      }
      tokens.forEach(t => seenTokens.add(t));
    }
  }
  const adjustRate = newInfoCount > 0 ? adjustments / newInfoCount : 0;
  const adjustScore = adjustRate >= 0.70 ? 5 : adjustRate >= 0.55 ? 4 : adjustRate >= 0.40 ? 3 : adjustRate >= 0.25 ? 2 : 1;

  return [
    { name: 'paraphrasing', score: paraphraseScore, applicable: true, weight: 0.33, rationale: `${paraphrases}/${customerTurns.length} paraphrases` },
    { name: 'acknowledgment_of_concerns', score: concernScore, applicable: concernApplicable, weight: 0.33, rationale: concernApplicable ? `${acknowledgedConcerns}/${concernTurns.length} concerns ack'd` : 'No concerns raised' },
    { name: 'adjustment_to_new_info', score: adjustScore, applicable: true, weight: 0.34, rationale: `${adjustments}/${newInfoCount} adjustments` }
  ];
}

function scoreMakingItMatter(transcript: Transcript, goalTokens: Set<string>): ComponentResult[] {
  const repTurns = transcript.filter(t => t.speaker === 'rep');
  const repStatements = repTurns.filter(t => !t.text.includes('?'));

  if (repStatements.length === 0) {
    const components = [
      { name: 'outcome_based_language', score: null, applicable: false, weight: 0.33, rationale: 'No rep statements' },
      { name: 'link_to_customer_priorities', score: null, applicable: false, weight: 0.34, rationale: 'No rep statements' },
      { name: 'no_feature_dumping', score: null, applicable: false, weight: 0.33, rationale: 'No rep statements' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['improve', 'reduce', 'increase', 'impact', 'outcome', 'results', 'so that', 'which means', 'so you can'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // 1. Outcome-Based Language
  const outcomeTerms = ['improve', 'reduce', 'increase', 'impact', 'outcome', 'results', 'patients', 'workflow', 'time', 'burden', 'adherence', 'access', 'efficiency', 'safety'];
  const connectorPhrases = ['so that', 'which means', 'so you can'];
  const outcomeStatements = repStatements.filter(s => {
    return containsAny(s.text, outcomeTerms) || containsAny(s.text, connectorPhrases);
  });
  const outcomeRate = outcomeStatements.length / repStatements.length;
  const outcomeScore = outcomeRate >= 0.60 ? 5 : outcomeRate >= 0.45 ? 4 : outcomeRate >= 0.30 ? 3 : outcomeRate >= 0.15 ? 2 : 1;

  // 2. Link to Customer Priorities
  const linkedStatements = repStatements.filter(s => {
    const tokens = tokenize(s.text);
    return tokens.some(t => goalTokens.has(t));
  });
  const linkRate = linkedStatements.length / repStatements.length;
  const linkScore = linkRate >= 0.50 ? 5 : linkRate >= 0.35 ? 4 : linkRate >= 0.20 ? 3 : linkRate >= 0.10 ? 2 : 1;

  // 3. No Feature Dumping
  const featureDumps = repStatements.filter(s => {
    const isLong = s.text.length > 220;
    const commaCount = (s.text.match(/,/g) || []).length;
    const bulletCount = (s.text.match(/•/g) || []).length;
    const dashCount = (s.text.match(/-\s/g) || []).length;
    const hasListSeparators = commaCount >= 4 || bulletCount >= 3 || dashCount >= 3;
    const hasBenefitConnector = containsAny(s.text, connectorPhrases);
    return isLong && hasListSeparators && !hasBenefitConnector;
  });
  const dumpRate = featureDumps.length / repStatements.length;
  const dumpScore = dumpRate <= 0.05 ? 5 : dumpRate <= 0.12 ? 4 : dumpRate <= 0.25 ? 3 : dumpRate <= 0.40 ? 2 : 1;

  return [
    { name: 'outcome_based_language', score: outcomeScore, applicable: true, weight: 0.33, rationale: `${outcomeStatements.length}/${repStatements.length} outcome-focused` },
    { name: 'link_to_customer_priorities', score: linkScore, applicable: true, weight: 0.34, rationale: `${linkedStatements.length}/${repStatements.length} linked to goals` },
    { name: 'no_feature_dumping', score: dumpScore, applicable: true, weight: 0.33, rationale: `${featureDumps.length}/${repStatements.length} feature dumps` }
  ];
}

function scoreCustomerEngagement(transcript: Transcript): ComponentResult[] {
  const customerTurns = transcript.filter(t => t.speaker === 'customer');
  const repTurns = transcript.filter(t => t.speaker === 'rep');

  if (customerTurns.length === 0) {
    const components = [
      { name: 'customer_talk_time', score: null, applicable: false, weight: 0.25, rationale: 'No customer turns' },
      { name: 'customer_question_quality', score: null, applicable: false, weight: 0.25, rationale: 'No customer turns' },
      { name: 'forward_looking_cues', score: null, applicable: false, weight: 0.25, rationale: 'No customer turns' },
      { name: 'energy_shifts', score: null, applicable: false, weight: 0.25, rationale: 'No customer turns' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['when', 'next', 'after', 'once', 'timeline', 'schedule', 'interesting', 'tell me more', 'how does', 'what about'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // 1. Customer Talk Time
  let customerShare: number;
  const hasTimestamps = transcript.every(t => t.t0 !== undefined && t.t1 !== undefined);
  if (hasTimestamps) {
    const customerTime = customerTurns.reduce((sum, t) => sum + ((t.t1 || 0) - (t.t0 || 0)), 0);
    const totalTime = transcript.reduce((sum, t) => sum + ((t.t1 || 0) - (t.t0 || 0)), 0);
    customerShare = totalTime > 0 ? customerTime / totalTime : 0;
  } else {
    customerShare = customerTurns.length / transcript.length;
  }
  const talkTimeScore =
    (customerShare >= 0.45 && customerShare <= 0.65) ? 5 :
    (customerShare >= 0.35 && customerShare < 0.45) || (customerShare > 0.65 && customerShare <= 0.75) ? 4 :
    (customerShare >= 0.25 && customerShare < 0.35) || (customerShare > 0.75 && customerShare <= 0.85) ? 3 :
    (customerShare >= 0.15 && customerShare < 0.25) || (customerShare > 0.85 && customerShare <= 0.92) ? 2 : 1;

  // 2. Customer Question Quality
  const customerQuestions = customerTurns.filter(t => t.text.includes('?'));
  const questionScore = customerQuestions.length >= 3 ? 5 : customerQuestions.length === 2 ? 4 : customerQuestions.length === 1 ? 3 : 2;

  // 3. Forward-Looking Cues
  const forwardPhrases = ['next', 'follow up', 'send', 'schedule', 'i will', 'let\'s', 'when can we', 'trial', 'pilot', 'talk again'];
  const forwardCues = customerTurns.filter(t => containsAny(t.text, forwardPhrases)).length;
  const forwardScore = forwardCues >= 2 ? 5 : forwardCues === 1 ? 4 : 3;

  // 4. Energy Shifts
  const disengagementPhrases = ['okay', 'sure', 'fine', 'whatever', 'i have to go', 'another meeting', 'short on time'];
  const disengagedTurns = customerTurns.filter(t => containsAny(t.text, disengagementPhrases));
  const firstThird = customerTurns.slice(0, Math.ceil(customerTurns.length / 3));
  const lastThird = customerTurns.slice(-Math.ceil(customerTurns.length / 3));
  const avgFirstLength = firstThird.reduce((sum, t) => sum + t.text.length, 0) / firstThird.length;
  const avgLastLength = lastThird.reduce((sum, t) => sum + t.text.length, 0) / lastThird.length;
  const shrinking = avgLastLength < avgFirstLength * 0.5;
  const energyScore = (disengagedTurns.length > 2 || shrinking) ? 2 : disengagedTurns.length > 0 ? 3 : 4;

  return [
    { name: 'customer_talk_time', score: talkTimeScore, applicable: true, weight: 0.25, rationale: `${Math.round(customerShare * 100)}% customer share` },
    { name: 'customer_question_quality', score: questionScore, applicable: true, weight: 0.25, rationale: `${customerQuestions.length} customer questions` },
    { name: 'forward_looking_cues', score: forwardScore, applicable: true, weight: 0.25, rationale: `${forwardCues} forward cues` },
    { name: 'energy_shifts', score: energyScore, applicable: true, weight: 0.25, rationale: disengagedTurns.length > 0 ? 'Disengagement detected' : 'Stable energy' }
  ];
}

function scoreObjectionNavigation(transcript: Transcript): ComponentResult[] {
  const objectionWords = ['not interested', 'no budget', 'too expensive', 'can\'t', 'won\'t', 'don\'t', 'concern', 'hesitant', 'problem', 'issue'];
  const objectionTurns: number[] = [];
  transcript.forEach((turn, i) => {
    if (turn.speaker === 'customer' && containsAny(turn.text, objectionWords)) {
      objectionTurns.push(i);
    }
  });

  if (objectionTurns.length === 0) {
    const components = [
      { name: 'acknowledge_before_response', score: null, applicable: false, weight: 0.33, rationale: 'No objections' },
      { name: 'explore_underlying_concern', score: null, applicable: false, weight: 0.34, rationale: 'No objections' },
      { name: 'calm_demeanor', score: null, applicable: false, weight: 0.33, rationale: 'No objections' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['not interested', 'no budget', 'too expensive', 'can\'t', 'won\'t', 'don\'t', 'concern', 'hesitant', 'problem', 'issue', 'i hear you', 'i understand', 'that makes sense'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // 1. Acknowledge Before Response
  const ackPhrases = ['i hear you', 'i understand', 'that makes sense', 'i can see why', 'you\'re right', 'fair point'];
  const rebuttalMarkers = ['but', 'however', 'actually'];
  let acknowledged = 0;
  objectionTurns.forEach(i => {
    if (i + 1 < transcript.length && transcript[i + 1].speaker === 'rep') {
      const repText = transcript[i + 1].text.toLowerCase();
      const hasAck = ackPhrases.some(p => repText.includes(p));
      const rebuttalIndex = Math.min(
        ...rebuttalMarkers.map(m => repText.indexOf(m)).filter(idx => idx >= 0),
        repText.length
      );
      const ackIndex = Math.min(
        ...ackPhrases.map(p => repText.indexOf(p)).filter(idx => idx >= 0),
        repText.length
      );
      if (hasAck && ackIndex < rebuttalIndex) {
        acknowledged++;
      }
    }
  });
  const ackRate = acknowledged / objectionTurns.length;
  const ackScore = ackRate >= 0.80 ? 5 : ackRate >= 0.60 ? 4 : ackRate >= 0.40 ? 3 : ackRate >= 0.20 ? 2 : 1;

  // 2. Explore Underlying Concern
  let explored = 0;
  objectionTurns.forEach(i => {
    for (let j = i + 1; j < Math.min(i + 3, transcript.length); j++) {
      if (transcript[j].speaker === 'rep' && transcript[j].text.includes('?')) {
        explored++;
        break;
      }
    }
  });
  const exploreRate = explored / objectionTurns.length;
  const exploreScore = exploreRate >= 0.70 ? 5 : exploreRate >= 0.55 ? 4 : exploreRate >= 0.40 ? 3 : exploreRate >= 0.25 ? 2 : 1;

  // 3. Calm Demeanor
  const steadyingPhrases = ['fair point', 'that makes sense', 'i hear you'];
  let calm = 0;
  objectionTurns.forEach(i => {
    if (i + 1 < transcript.length && transcript[i + 1].speaker === 'rep') {
      const repText = transcript[i + 1].text.toLowerCase();
      const hasRebuttal = rebuttalMarkers.some(m => repText.startsWith(m) || repText.includes(` ${m} `));
      const hasSteadying = steadyingPhrases.some(p => repText.includes(p));
      if (!hasRebuttal && hasSteadying) {
        calm++;
      }
    }
  });
  const calmRate = calm / objectionTurns.length;
  const calmScore = calmRate >= 0.80 ? 5 : calmRate >= 0.50 ? 4 : calmRate >= 0.30 ? 3 : calmRate >= 0.10 ? 2 : 1;

  return [
    { name: 'acknowledge_before_response', score: ackScore, applicable: true, weight: 0.33, rationale: `${acknowledged}/${objectionTurns.length} acknowledged` },
    { name: 'explore_underlying_concern', score: exploreScore, applicable: true, weight: 0.34, rationale: `${explored}/${objectionTurns.length} explored` },
    { name: 'calm_demeanor', score: calmScore, applicable: true, weight: 0.33, rationale: `${calm}/${objectionTurns.length} calm responses` }
  ];
}

function scoreConversationControl(transcript: Transcript): ComponentResult[] {
  const repTurns = transcript.filter(t => t.speaker === 'rep');

  if (repTurns.length === 0) {
    const components = [
      { name: 'purpose_setting', score: null, applicable: false, weight: 0.25, rationale: 'No rep turns' },
      { name: 'topic_management', score: null, applicable: false, weight: 0.25, rationale: 'No rep turns' },
      { name: 'time_management', score: null, applicable: false, weight: 0.25, rationale: 'No rep turns' },
      { name: 'summarizing', score: null, applicable: false, weight: 0.25, rationale: 'No rep turns' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['today i\'d like', 'agenda', 'goal', 'building on that', 'to recap', 'summary', 'next steps'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // 1. Purpose Setting
  const agendaPhrases = ['today i\'d like', 'agenda', 'goal', 'what i\'d like to cover'];
  const firstThree = repTurns.slice(0, 3);
  const hasEarlyAgenda = firstThree.some(t => containsAny(t.text, agendaPhrases));
  const hasLateAgenda = repTurns.slice(3).some(t => containsAny(t.text, agendaPhrases));
  const purposeScore = hasEarlyAgenda ? 5 : hasLateAgenda ? 3 : 1;

  // 2. Topic Management
  const transitionPhrases = ['building on that', 'to connect this', 'since you said'];
  const transitionCount = repTurns.filter(t => containsAny(t.text, transitionPhrases)).length;
  const topicScore = transitionCount >= repTurns.length * 0.3 ? 5 : transitionCount >= repTurns.length * 0.15 ? 4 : transitionCount > 0 ? 3 : 2;

  // 4. Summarizing (calculate early for use in early return)
  const summaryPhrases = ['to recap', 'summary', 'what we covered', 'next steps'];
  const lastThree = repTurns.slice(-3);
  const hasSummary = lastThree.some(t => containsAny(t.text, summaryPhrases));
  const summaryScore = hasSummary ? 5 : 1;

  // 3. Time Management
  const timeCues = ['have to go', 'another meeting', 'short on time'];
  const customerTurns = transcript.filter(t => t.speaker === 'customer');
  const timeCueTurns = customerTurns.filter(t => containsAny(t.text, timeCues));
  if (timeCueTurns.length === 0) {
    return [
      { name: 'purpose_setting', score: purposeScore, applicable: true, weight: 0.25, rationale: hasEarlyAgenda ? 'Early agenda' : 'No agenda' },
      { name: 'topic_management', score: topicScore, applicable: true, weight: 0.25, rationale: `${transitionCount} transitions` },
      { name: 'time_management', score: null, applicable: false, weight: 0.25, rationale: 'No time constraints' },
      { name: 'summarizing', score: summaryScore, applicable: true, weight: 0.25, rationale: hasSummary ? 'Summary present' : 'No summary' }
    ];
  }
  const adaptPhrases = ['next step', 'follow up', 'send', 'schedule'];
  let adapted = 0;
  timeCueTurns.forEach(cue => {
    const cueIndex = transcript.indexOf(cue);
    if (cueIndex + 1 < transcript.length && transcript[cueIndex + 1].speaker === 'rep') {
      if (containsAny(transcript[cueIndex + 1].text, adaptPhrases)) {
        adapted++;
      }
    }
  });
  const timeScore = adapted === timeCueTurns.length ? 5 : adapted > 0 ? 3 : 2;

  return [
    { name: 'purpose_setting', score: purposeScore, applicable: true, weight: 0.25, rationale: hasEarlyAgenda ? 'Early agenda' : 'No agenda' },
    { name: 'topic_management', score: topicScore, applicable: true, weight: 0.25, rationale: `${transitionCount} transitions` },
    { name: 'time_management', score: timeScore, applicable: true, weight: 0.25, rationale: `${adapted}/${timeCueTurns.length} adapted` },
    { name: 'summarizing', score: summaryScore, applicable: true, weight: 0.25, rationale: hasSummary ? 'Summary present' : 'No summary' }
  ];
}

function scoreCommitmentGaining(transcript: Transcript): ComponentResult[] {
  const repTurns = transcript.filter(t => t.speaker === 'rep');
  const customerTurns = transcript.filter(t => t.speaker === 'customer');

  // 1. Next Step Specificity
  const nextStepPhrases = ['schedule', 'follow up', 'send', 'connect', 'align', 'next step', 'set up', 'confirm'];
  const nextStepTurns = repTurns.filter(t => containsAny(t.text, nextStepPhrases));
  const specificNextSteps = nextStepTurns.filter(t => {
    const hasDate = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week|\d{1,2}\/\d{1,2})\b/i.test(t.text);
    const hasAction = /\b(send|email|call|meet|review|discuss)\b/i.test(t.text);
    return hasDate || hasAction;
  });
  const specificityScore = specificNextSteps.length > 0 ? 5 : nextStepTurns.length > 0 ? 3 : 1;

  // 2. Mutual Agreement
  const agreementPhrases = ['yes', 'sounds good', 'that works', 'okay let\'s'];
  let agreements = 0;
  nextStepTurns.forEach(nst => {
    const nstIndex = transcript.indexOf(nst);
    for (let i = nstIndex + 1; i < Math.min(nstIndex + 3, transcript.length); i++) {
      if (transcript[i].speaker === 'customer' && containsAny(transcript[i].text, agreementPhrases)) {
        agreements++;
        break;
      }
    }
  });
  const agreementScore = nextStepTurns.length > 0
    ? (agreements === nextStepTurns.length ? 5 : agreements > 0 ? 3 : 1)
    : 1;

  // 3. Ownership Clarity
  const ownershipPhrases = ['i\'ll send', 'you\'ll review', 'we will', 'i will', 'you will'];
  const ownershipTurns = repTurns.filter(t => containsAny(t.text, ownershipPhrases));
  const ownershipScore = ownershipTurns.length >= 2 ? 5 : ownershipTurns.length === 1 ? 3 : 1;

  return [
    { name: 'next_step_specificity', score: specificityScore, applicable: true, weight: 0.33, rationale: `${specificNextSteps.length}/${nextStepTurns.length} specific` },
    { name: 'mutual_agreement', score: agreementScore, applicable: true, weight: 0.33, rationale: `${agreements}/${nextStepTurns.length} agreements` },
    { name: 'ownership_clarity', score: ownershipScore, applicable: true, weight: 0.34, rationale: `${ownershipTurns.length} ownership statements` }
  ];
}

function scoreAdaptability(transcript: Transcript): ComponentResult[] {
  const customerTurns = transcript.filter(t => t.speaker === 'customer');
  const repTurns = transcript.filter(t => t.speaker === 'rep');

  // Detect cues
  const timeCues = ['have to go', 'another meeting', 'short on time'];
  const confusionCues = ['confused', 'don\'t understand', 'not clear', 'what do you mean'];
  const disinterestCues = ['not interested', 'not sure', 'don\'t think'];
  const emotionalCues = ['frustrated', 'upset', 'concerned', 'worried'];

  const hasTimeCue = customerTurns.some(t => containsAny(t.text, timeCues));
  const hasConfusionCue = customerTurns.some(t => containsAny(t.text, confusionCues));
  const hasDisinterestCue = customerTurns.some(t => containsAny(t.text, disinterestCues));
  const hasEmotionalCue = customerTurns.some(t => containsAny(t.text, emotionalCues));

  if (!hasTimeCue && !hasConfusionCue && !hasDisinterestCue && !hasEmotionalCue) {
    const components = [
      { name: 'approach_shift', score: null, applicable: false, weight: 0.25, rationale: 'No adaptation cues' },
      { name: 'tone_adjustment', score: null, applicable: false, weight: 0.25, rationale: 'No adaptation cues' },
      { name: 'depth_adjustment', score: null, applicable: false, weight: 0.25, rationale: 'No adaptation cues' },
      { name: 'pacing_adjustment', score: null, applicable: false, weight: 0.25, rationale: 'No adaptation cues' }
    ];
    // Apply weak-signal fallback
    const signalPatterns = ['have to go', 'another meeting', 'short on time', 'confused', 'don\'t understand', 'not interested', 'frustrated', 'upset', 'concerned', 'worried'];
    return applyWeakSignalFallback(components, transcript, signalPatterns);
  }

  // Simple heuristic: if rep responds to cues, score higher
  const approachScore = (hasDisinterestCue && repTurns.some(t => t.text.includes('?'))) ? 4 : 3;
  const toneScore = (hasEmotionalCue && repTurns.some(t => containsAny(t.text, ['i understand', 'i hear you']))) ? 4 : 3;
  const depthScore = (hasConfusionCue || hasTimeCue) ? 4 : 3;
  const pacingScore = hasTimeCue ? 4 : 3;

  return [
    { name: 'approach_shift', score: approachScore, applicable: hasDisinterestCue, weight: 0.25, rationale: hasDisinterestCue ? 'Adapted to disinterest' : 'No cue' },
    { name: 'tone_adjustment', score: toneScore, applicable: hasEmotionalCue, weight: 0.25, rationale: hasEmotionalCue ? 'Adapted tone' : 'No cue' },
    { name: 'depth_adjustment', score: depthScore, applicable: hasConfusionCue || hasTimeCue, weight: 0.25, rationale: 'Adjusted depth' },
    { name: 'pacing_adjustment', score: pacingScore, applicable: hasTimeCue, weight: 0.25, rationale: hasTimeCue ? 'Adjusted pacing' : 'No cue' }
  ];
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

export function scoreConversation(transcript: Transcript, meta?: Record<string, any>): MetricResult[] {
  // Extract goal tokens for reuse across metrics
  const goalPatterns = ['need', 'goal', 'priority', 'concern', 'issue', 'challenge', 'want', 'trying', 'struggle'];
  const goalTokens = new Set<string>();
  transcript.filter(t => t.speaker === 'customer').forEach(turn => {
    const tokens = tokenize(turn.text);
    tokens.forEach((token, i) => {
      if (goalPatterns.some(p => tokens[i - 1] === p || tokens[i + 1] === p)) {
        goalTokens.add(token);
      }
    });
  });

  const results: MetricResult[] = [];

  METRICS_SPEC.forEach(spec => {
    let components: ComponentResult[] = [];

    switch (spec.id) {
      case 'question_quality':
        components = scoreQuestionQuality(transcript);
        break;
      case 'listening_responsiveness':
        components = scoreListeningResponsiveness(transcript);
        break;
      case 'making_it_matter':
        components = scoreMakingItMatter(transcript, goalTokens);
        break;
      case 'customer_engagement_signals':
        components = scoreCustomerEngagement(transcript);
        break;
      case 'objection_navigation':
        components = scoreObjectionNavigation(transcript);
        break;
      case 'conversation_control_structure':
        components = scoreConversationControl(transcript);
        break;
      case 'commitment_gaining':
        components = scoreCommitmentGaining(transcript);
        break;
      case 'adaptability':
        components = scoreAdaptability(transcript);
        break;
    }

    // Apply metric-scoped signal attribution
    // If no components are applicable but metric-specific signals exist,
    // mark first component as applicable with score=1
    if (!components.some(c => c.applicable) && hasMetricSignals(transcript, spec.id)) {
      components = [...components];
      components[0] = {
        ...components[0],
        score: 1,
        applicable: true,
        rationale: `Observable ${spec.metric.toLowerCase()} signals detected, but threshold not met for higher score`
      };
    }

    const applicableComponents = components.filter(c => c.applicable);
    
    // PROMPT #20: Metric Applicability Promotion
    // Canonical rule: not_applicable = !(components.applicable || signals.exist)
    // If any component is applicable OR signals were attributed, metric is applicable
    const hasApplicableComponents = applicableComponents.length > 0;
    const hasSignalsAttributed = hasMetricSignals(transcript, spec.id);
    const notApplicable = spec.optional && !hasApplicableComponents && !hasSignalsAttributed;

    let overallScore: number | null = null;
    if (!notApplicable) {
      // Canonical rule: all metrics roll up via simple arithmetic mean over applicable components
      overallScore = averageApplicable(components);
    }

    // PROMPT #21: Minimum Viable Signal Seeding (Scoring Guardrail)
    // If signals exist but score is 0 or null, seed minimum viable score
    const MIN_SIGNAL_SCORE = 1.0;
    const hasSignals = hasApplicableComponents || hasMetricSignals(transcript, spec.id);
    if (hasSignals && (overallScore === null || overallScore === 0)) {
      overallScore = MIN_SIGNAL_SCORE;
    }

    results.push({
      id: spec.id,
      metric: spec.metric,
      optional: spec.optional,
      score_formula: spec.score_formula,
      components,
      overall_score: overallScore,
      not_applicable: notApplicable,
      metricsVersion: 'SI-v1'
    });
  });

  return results;
}
