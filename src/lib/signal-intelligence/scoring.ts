/**
 * Signal Intelligence Scoring System
 * Evaluates sales rep performance across 8 behavioral metrics
 */

export interface Transcript {
  speaker: 'rep' | 'customer';
  text: string;
}

export interface ComponentScore {
  component: string;
  score: number | null;
  rationale: string;
  applicable: boolean;
}

export interface MetricResult {
  id: string;
  name: string;
  overall_score: number | null;
  not_applicable: boolean;
  components: ComponentScore[];
}

/**
 * Score a conversation transcript across all 8 metrics
 */
export function scoreConversation(transcript: Transcript[]): MetricResult[] {
  const repMessages = transcript.filter(t => t.speaker === 'rep').map(t => t.text.toLowerCase());
  const customerMessages = transcript.filter(t => t.speaker === 'customer').map(t => t.text.toLowerCase());
  
  if (repMessages.length === 0) {
    return createNotApplicableResults('No sales rep messages to evaluate');
  }

  const allRepText = repMessages.join(' ');
  const allCustomerText = customerMessages.join(' ');

  return [
    scoreQuestionQuality(repMessages),
    scoreListeningResponsiveness(repMessages, customerMessages),
    scoreMakingItMatter(repMessages),
    scoreCustomerEngagement(customerMessages),
    scoreConversationControl(repMessages, transcript),
    scoreAdaptability(repMessages, transcript),
    scoreCommitmentGaining(repMessages),
    scoreObjectionNavigation(repMessages, customerMessages),
  ];
}

function scoreQuestionQuality(repMessages: string[]): MetricResult {
  const openEndedPatterns = [
    /\bhow\b/,
    /\bwhat\b/,
    /\bwhy\b/,
    /\btell me about\b/,
    /\bcould you explain\b/,
    /\bhelp me understand\b/,
  ];

  const closedPatterns = [
    /\bdo you\b/,
    /\bare you\b/,
    /\bcan you\b/,
    /\bwill you\b/,
  ];

  let openEndedCount = 0;
  let closedCount = 0;

  repMessages.forEach(msg => {
    openEndedPatterns.forEach(pattern => {
      if (pattern.test(msg)) openEndedCount++;
    });
    closedPatterns.forEach(pattern => {
      if (pattern.test(msg)) closedCount++;
    });
  });

  const totalQuestions = openEndedCount + closedCount;
  if (totalQuestions === 0) {
    return createNotApplicableMetric('question_quality', 'Question Quality', 'No questions detected');
  }

  const openEndedRatio = openEndedCount / totalQuestions;
  const score = Math.min(5, Math.round(1 + (openEndedRatio * 4)));

  return {
    id: 'question_quality',
    name: 'Question Quality',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Open-ended questions',
        score,
        rationale: `${openEndedCount} open-ended, ${closedCount} closed questions`,
        applicable: true,
      },
    ],
  };
}

function scoreListeningResponsiveness(repMessages: string[], customerMessages: string[]): MetricResult {
  const listeningPatterns = [
    /\bi hear you\b/,
    /\bit sounds like\b/,
    /\bif i understand correctly\b/,
    /\byou mentioned\b/,
    /\blet me make sure\b/,
    /\bso what you're saying\b/,
  ];

  let listeningCount = 0;
  repMessages.forEach(msg => {
    listeningPatterns.forEach(pattern => {
      if (pattern.test(msg)) listeningCount++;
    });
  });

  if (customerMessages.length === 0) {
    return createNotApplicableMetric('listening_responsiveness', 'Listening & Responsiveness', 'No customer messages to respond to');
  }

  const score = Math.min(5, Math.round(1 + (listeningCount * 1.5)));

  return {
    id: 'listening_responsiveness',
    name: 'Listening & Responsiveness',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Active listening signals',
        score,
        rationale: `${listeningCount} listening acknowledgments detected`,
        applicable: true,
      },
    ],
  };
}

function scoreMakingItMatter(repMessages: string[]): MetricResult {
  const valuePatterns = [
    /\bbenefit\b/,
    /\bhelp you\b/,
    /\bimprove\b/,
    /\bsolution\b/,
    /\baddress your\b/,
    /\bspecifically for\b/,
  ];

  let valueCount = 0;
  repMessages.forEach(msg => {
    valuePatterns.forEach(pattern => {
      if (pattern.test(msg)) valueCount++;
    });
  });

  if (valueCount === 0) {
    return createNotApplicableMetric('making_it_matter', 'Making It Matter', 'No value articulation detected');
  }

  const score = Math.min(5, Math.round(1 + (valueCount * 1.2)));

  return {
    id: 'making_it_matter',
    name: 'Making It Matter',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Value articulation',
        score,
        rationale: `${valueCount} value statements detected`,
        applicable: true,
      },
    ],
  };
}

function scoreCustomerEngagement(customerMessages: string[]): MetricResult {
  if (customerMessages.length === 0) {
    return createNotApplicableMetric('customer_engagement_signals', 'Customer Engagement Signals', 'No customer messages');
  }

  const avgLength = customerMessages.reduce((sum, msg) => sum + msg.split(/\s+/).length, 0) / customerMessages.length;
  const hasQuestions = customerMessages.some(msg => msg.includes('?'));
  
  let score = 3;
  if (avgLength > 15 && hasQuestions) score = 5;
  else if (avgLength > 10 || hasQuestions) score = 4;
  else if (avgLength < 5) score = 2;

  return {
    id: 'customer_engagement_signals',
    name: 'Customer Engagement Signals',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Engagement level',
        score,
        rationale: `Average response length: ${Math.round(avgLength)} words`,
        applicable: true,
      },
    ],
  };
}

function scoreConversationControl(repMessages: string[], transcript: Transcript[]): MetricResult {
  const structurePatterns = [
    /\bnext step\b/,
    /\blet me\b/,
    /\bfirst\b/,
    /\bthen\b/,
    /\bfinally\b/,
  ];

  let structureCount = 0;
  repMessages.forEach(msg => {
    structurePatterns.forEach(pattern => {
      if (pattern.test(msg)) structureCount++;
    });
  });

  const score = Math.min(5, Math.round(2 + (structureCount * 0.8)));

  return {
    id: 'conversation_control_structure',
    name: 'Conversation Control & Structure',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Structural control',
        score,
        rationale: `${structureCount} control phrases detected`,
        applicable: true,
      },
    ],
  };
}

function scoreAdaptability(repMessages: string[], transcript: Transcript[]): MetricResult {
  const adaptPatterns = [
    /\blet me adjust\b/,
    /\bdifferent approach\b/,
    /\bperhaps instead\b/,
    /\banother way\b/,
  ];

  let adaptCount = 0;
  repMessages.forEach(msg => {
    adaptPatterns.forEach(pattern => {
      if (pattern.test(msg)) adaptCount++;
    });
  });

  if (adaptCount === 0) {
    return createNotApplicableMetric('adaptability', 'Adaptability', 'No adaptation signals detected');
  }

  const score = Math.min(5, Math.round(2 + (adaptCount * 1.5)));

  return {
    id: 'adaptability',
    name: 'Adaptability',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Adaptive responses',
        score,
        rationale: `${adaptCount} adaptation signals detected`,
        applicable: true,
      },
    ],
  };
}

function scoreCommitmentGaining(repMessages: string[]): MetricResult {
  const commitmentPatterns = [
    /\bnext step\b/,
    /\bwould you like\b/,
    /\bshall we\b/,
    /\bcan we schedule\b/,
    /\bmove forward\b/,
  ];

  let commitmentCount = 0;
  repMessages.forEach(msg => {
    commitmentPatterns.forEach(pattern => {
      if (pattern.test(msg)) commitmentCount++;
    });
  });

  if (commitmentCount === 0) {
    return createNotApplicableMetric('commitment_gaining', 'Commitment Gaining', 'No commitment attempts detected');
  }

  const score = Math.min(5, Math.round(2 + (commitmentCount * 1.5)));

  return {
    id: 'commitment_gaining',
    name: 'Commitment Gaining',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Commitment attempts',
        score,
        rationale: `${commitmentCount} commitment signals detected`,
        applicable: true,
      },
    ],
  };
}

function scoreObjectionNavigation(repMessages: string[], customerMessages: string[]): MetricResult {
  const objectionPatterns = [
    /\bi understand your concern\b/,
    /\bthat's a valid point\b/,
    /\blet me address that\b/,
    /\bmany doctors have said\b/,
    /\bwhat if we\b/,
  ];

  let objectionCount = 0;
  repMessages.forEach(msg => {
    objectionPatterns.forEach(pattern => {
      if (pattern.test(msg)) objectionCount++;
    });
  });

  if (objectionCount === 0) {
    return createNotApplicableMetric('objection_navigation', 'Objection Navigation', 'No objection handling detected');
  }

  const score = Math.min(5, Math.round(2 + (objectionCount * 1.5)));

  return {
    id: 'objection_navigation',
    name: 'Objection Navigation',
    overall_score: score,
    not_applicable: false,
    components: [
      {
        component: 'Objection handling',
        score,
        rationale: `${objectionCount} objection responses detected`,
        applicable: true,
      },
    ],
  };
}

function createNotApplicableMetric(id: string, name: string, reason: string): MetricResult {
  return {
    id,
    name,
    overall_score: null,
    not_applicable: true,
    components: [
      {
        component: 'N/A',
        score: null,
        rationale: reason,
        applicable: false,
      },
    ],
  };
}

function createNotApplicableResults(reason: string): MetricResult[] {
  const metricIds = [
    'question_quality',
    'listening_responsiveness',
    'making_it_matter',
    'customer_engagement_signals',
    'conversation_control_structure',
    'adaptability',
    'commitment_gaining',
    'objection_navigation',
  ];

  return metricIds.map(id => createNotApplicableMetric(id, id.replace(/_/g, ' '), reason));
}
