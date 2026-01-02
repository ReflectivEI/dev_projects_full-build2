/**
 * Signal Intelligence™ Capability & Behavioral Metrics Data
 * 
 * This file contains the authoritative definitions for the 8 Signal Intelligence™
 * Capabilities used throughout the ReflectivAI platform.
 * 
 * DO NOT MODIFY without approval from product/marketing teams.
 * These definitions must match the marketing site exactly.
 */

import { LucideIcon } from 'lucide-react';
import {
  MessageSquare,
  Ear,
  Target,
  Users,
  Shield,
  Compass,
  Zap,
  CheckCircle,
} from 'lucide-react';

export interface SignalIntelligenceCapability {
  id: string;
  name: string;
  behavioralMetric: string;
  definition: string;
  howEvaluated: string;
  whatGoodLooksLike: string[];
  howCalculated: string[];
  scoreCalculationExample: {
    components: Array<{
      name: string;
      value: number;
      weight: number;
    }>;
    total: number;
  };
  howMeasured: string;
  exampleScore: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export interface BehavioralMetricScore {
  capabilityId: string;
  score: number;
  maxScore: number;
  feedback?: string;
  evidence?: string[];
}

export interface BehavioralMetricsResult {
  scores: BehavioralMetricScore[];
  observableSignals: Array<{
    type: 'verbal' | 'conversational' | 'engagement' | 'contextual';
    signal: string;
    interpretation: string;
    suggestedResponse?: string;
    relatedCapability?: string;
  }>;
  coachingFeedback: {
    strengths: string[];
    areasToFocusOn: string[];
  };
  timestamp: string;
}

/**
 * The 8 Signal Intelligence™ Capabilities
 * 
 * These are the core behavioral metrics evaluated during practice sessions.
 * Each capability represents an observable communication behavior that can be
 * measured and improved through practice.
 */
export const signalIntelligenceCapabilities: SignalIntelligenceCapability[] = [
  {
    id: 'signal-awareness',
    name: 'Signal Awareness',
    behavioralMetric: 'Question Quality',
    definition:
      'The ability to notice what matters in the conversation and ask purposeful, customer-centric questions.',
    howEvaluated:
      'How consistently questions surface customer priorities rather than gathering surface-level information.',
    whatGoodLooksLike: [
      'Open-ended, diagnostic questions',
      'Follow-ups that build on prior answers',
      'Logical sequencing without interrogation',
    ],
    howCalculated: [
      'Open vs. closed question ratio',
      'Relevance to stated customer goals',
      'Depth of follow-up questioning',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Open Questions Ratio', value: 0.92, weight: 2.0 },
        { name: 'Goal Relevance Score', value: 0.88, weight: 2.0 },
        { name: 'Follow-Up Depth Score', value: 0.85, weight: 1.0 },
      ],
      total: 4.3,
    },
    howMeasured:
      'Question structure classification, topic–goal alignment detection, turn-to-turn continuity analysis.',
    exampleScore: 4.3,
    icon: MessageSquare,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'signal-interpretation',
    name: 'Signal Interpretation',
    behavioralMetric: 'Listening & Responsiveness',
    definition:
      'The ability to accurately acknowledge, reflect, and build on customer input without inferring intent or emotion.',
    howEvaluated:
      'How consistently the professional acknowledges input and adjusts based on new information.',
    whatGoodLooksLike: [
      'Paraphrasing customer statements',
      'Explicit acknowledgment of concerns',
      'Adjustments based on customer input',
    ],
    howCalculated: [
      'Paraphrase accuracy',
      'Acknowledgment frequency',
      'Responsiveness latency',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Paraphrase Accuracy', value: 0.9, weight: 2.0 },
        { name: 'Acknowledgment Rate', value: 0.85, weight: 1.5 },
        { name: 'Adjustment Responsiveness', value: 0.82, weight: 1.5 },
      ],
      total: 4.1,
    },
    howMeasured:
      'Semantic similarity analysis, acknowledgment markers, response adaptation tracking.',
    exampleScore: 4.1,
    icon: Ear,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'value-connection',
    name: 'Value Connection',
    behavioralMetric: 'Value Framing (Making It Matter)',
    definition:
      'The ability to connect information to customer-relevant outcomes rather than features.',
    howEvaluated:
      'How consistently messaging reflects customer priorities and impact.',
    whatGoodLooksLike: [
      'Outcome-based language',
      'Clear linkage to customer goals',
      'Avoidance of feature dumping',
    ],
    howCalculated: [
      'Outcome vs. feature language ratio',
      'Priority alignment score',
      'Message relevance weighting',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Outcome Language Ratio', value: 0.88, weight: 2.0 },
        { name: 'Priority Alignment', value: 0.8, weight: 2.0 },
        { name: 'Relevance Weighting', value: 0.84, weight: 1.0 },
      ],
      total: 4.0,
    },
    howMeasured:
      'Language classification, outcome mapping, priority reference detection.',
    exampleScore: 4.0,
    icon: Target,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'customer-engagement-monitoring',
    name: 'Customer Engagement Monitoring',
    behavioralMetric: 'Customer Engagement Cues',
    definition:
      'Observable indicators of customer participation and momentum that inform how a professional adjusts pacing, focus, or next steps.',
    howEvaluated:
      'How consistently engagement cues are noticed and appropriately responded to during the conversation.',
    whatGoodLooksLike: [
      'Monitoring customer talk time',
      'Recognizing forward-looking statements',
      'Adjusting responses when momentum shifts',
    ],
    howCalculated: [
      'Customer talk ratio',
      'Forward-looking cue detection',
      'Engagement-shift response rate',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Talk Ratio Balance', value: 0.85, weight: 1.5 },
        { name: 'Forward Cue Detection', value: 0.9, weight: 2.0 },
        { name: 'Response Timeliness', value: 0.88, weight: 1.5 },
      ],
      total: 4.2,
    },
    howMeasured:
      'Turn-taking analysis, cue classification, engagement trend detection.',
    exampleScore: 4.2,
    icon: Users,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 'objection-navigation',
    name: 'Objection Navigation',
    behavioralMetric: 'Objection Handling',
    definition:
      'The ability to respond constructively to resistance without defensiveness.',
    howEvaluated:
      'Quality of acknowledgment and composure during objections.',
    whatGoodLooksLike: [
      'Acknowledgment before rebuttal',
      'Calm pacing',
      'Exploratory questioning',
    ],
    howCalculated: [
      'Acknowledgment presence',
      'Rebuttal timing',
      'Defensive language absence',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Acknowledgment Score', value: 0.85, weight: 2.0 },
        { name: 'Rebuttal Timing Score', value: 0.75, weight: 1.5 },
        { name: 'Defensive Language Avoidance', value: 0.8, weight: 1.5 },
      ],
      total: 3.9,
    },
    howMeasured: 'Objection–response sequencing, tone marker detection.',
    exampleScore: 3.9,
    icon: Shield,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    id: 'conversation-management',
    name: 'Conversation Management',
    behavioralMetric: 'Conversation Control & Structure',
    definition:
      'The ability to guide conversations with purpose and clarity.',
    howEvaluated:
      'How well the professional structures, transitions, and summarizes the interaction.',
    whatGoodLooksLike: [
      'Clear purpose setting',
      'Smooth transitions',
      'Summarized next steps',
    ],
    howCalculated: [
      'Purpose clarity score',
      'Transition smoothness',
      'Summary completeness',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Purpose Clarity', value: 0.92, weight: 2.0 },
        { name: 'Transition Quality', value: 0.9, weight: 1.5 },
        { name: 'Summary Completeness', value: 0.88, weight: 1.5 },
      ],
      total: 4.4,
    },
    howMeasured:
      'Intent modeling, transition detection, summary extraction.',
    exampleScore: 4.4,
    icon: Compass,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    id: 'adaptive-response',
    name: 'Adaptive Response',
    behavioralMetric: 'Adaptability',
    definition:
      'The ability to adjust approach based on observable conversational signals.',
    howEvaluated:
      'How consistently tone, depth, or pacing changes are appropriate to the situation.',
    whatGoodLooksLike: [
      'Adjusting depth based on cues',
      'Shifting tone when needed',
      'Modifying pace appropriately',
    ],
    howCalculated: [
      'Adaptation frequency',
      'Contextual appropriateness',
      'Timing accuracy',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Adaptation Frequency', value: 0.85, weight: 1.5 },
        { name: 'Appropriateness Score', value: 0.88, weight: 2.0 },
        { name: 'Timing Accuracy', value: 0.84, weight: 1.5 },
      ],
      total: 4.1,
    },
    howMeasured:
      'Signal–response matching, timing analysis, context evaluation.',
    exampleScore: 4.1,
    icon: Zap,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'commitment-generation',
    name: 'Commitment Generation',
    behavioralMetric: 'Commitment Gaining',
    definition:
      'The ability to secure clear, voluntary next actions with mutual agreement.',
    howEvaluated:
      'How consistently next steps are explicit and mutually owned.',
    whatGoodLooksLike: [
      'Specific next steps',
      'Mutual agreement language',
      'Ownership clarity',
    ],
    howCalculated: [
      'Next-step specificity',
      'Agreement confirmation rate',
      'Ownership language presence',
    ],
    scoreCalculationExample: {
      components: [
        { name: 'Specificity Score', value: 0.92, weight: 2.0 },
        { name: 'Agreement Rate', value: 0.9, weight: 2.0 },
        { name: 'Ownership Clarity', value: 0.88, weight: 1.0 },
      ],
      total: 4.5,
    },
    howMeasured:
      'Action extraction, agreement detection, ownership phrasing analysis.',
    exampleScore: 4.5,
    icon: CheckCircle,
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
  },
];

/**
 * Get a capability by ID
 */
export function getCapabilityById(
  id: string
): SignalIntelligenceCapability | undefined {
  return signalIntelligenceCapabilities.find((cap) => cap.id === id);
}

/**
 * Get capability by behavioral metric name
 */
export function getCapabilityByMetric(
  metric: string
): SignalIntelligenceCapability | undefined {
  return signalIntelligenceCapabilities.find(
    (cap) => cap.behavioralMetric.toLowerCase() === metric.toLowerCase()
  );
}

/**
 * Mandatory disclaimer text for Signal Intelligence™ scores
 */
export const SIGNAL_INTELLIGENCE_DISCLAIMER = {
  full: 'Signal Intelligence™ scores reflect observable communication behaviors during structured practice. They are not assessments of personality, intent, emotional state, or professional competence, and are not used for automated decision-making. AI identifies behavioral patterns; interpretation and judgment remain with the professional.',
  short:
    'Signal Intelligence™ observes communication behaviors. AI identifies patterns; interpretation remains with the professional.',
  micro: 'Illustrative scores for practice only',
};
