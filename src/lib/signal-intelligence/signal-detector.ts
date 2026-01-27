/**
 * Signal Detector - Real-time observable signal detection
 * Analyzes conversation turns to detect behavioral signals
 * Maps signals to behavioral metrics from metrics-spec.ts
 */

import { METRICS_SPEC, type BehavioralMetricId } from './metrics-spec';
import type { Message } from '@shared/schema';

export interface DetectedSignal {
  id: string;
  timestamp: string;
  metricId: BehavioralMetricId;
  metricName: string;
  componentName: string;
  signal: string;
  interpretation: string;
  type: 'verbal' | 'conversational' | 'engagement' | 'contextual';
}

/**
 * Detect signals in a new message based on metrics-spec indicators
 */
export function detectSignals(
  messages: Message[],
  newMessage: string,
  role: 'user' | 'assistant' = 'user'
): DetectedSignal[] {
  const signals: DetectedSignal[] = [];
  const timestamp = new Date().toISOString();
  const messageIndex = messages.length;

  // Only analyze user (rep) messages for now
  if (role !== 'user') return signals;

  const lowerMessage = newMessage.toLowerCase();

  // Iterate through all metrics and their components
  METRICS_SPEC.forEach(metric => {
    metric.components.forEach(component => {
      // Check each indicator
      component.indicators.forEach((indicator, idx) => {
        const detected = checkIndicator(lowerMessage, indicator, component.name);
        if (detected) {
          signals.push({
            id: `signal-${messageIndex}-${metric.id}-${idx}`,
            timestamp,
            metricId: metric.id,
            metricName: metric.metric,
            componentName: component.name,
            signal: detected.signal,
            interpretation: detected.interpretation,
            type: getSignalType(metric.id)
          });
        }
      });
    });
  });

  return signals;
}

/**
 * Check if a message matches an indicator pattern
 */
function checkIndicator(
  message: string,
  indicator: string,
  componentName: string
): { signal: string; interpretation: string } | null {
  const lowerIndicator = indicator.toLowerCase();

  // Question Quality - Open-ended questions
  if (lowerIndicator.includes('how') || lowerIndicator.includes('what') || lowerIndicator.includes('why')) {
    const openQuestionPatterns = [
      /\bhow\s+(do|does|did|can|would|should|might)/i,
      /\bwhat\s+(is|are|was|were|do|does|did|would|could)/i,
      /\bwhy\s+(do|does|did|is|are|was|were)/i,
      /\btell\s+me\s+(about|more)/i,
      /\bwalk\s+me\s+through/i,
      /\bhelp\s+me\s+understand/i
    ];

    for (const pattern of openQuestionPatterns) {
      if (pattern.test(message)) {
        return {
          signal: 'Open-ended question detected',
          interpretation: `Used "${pattern.source.replace(/\\b|\\s\+/g, ' ')}" to encourage elaboration`
        };
      }
    }
  }

  // Listening & Responsiveness - Paraphrasing
  if (lowerIndicator.includes('paraphras') || lowerIndicator.includes('reflect')) {
    const paraphrasePatterns = [
      /\bwhat\s+i'?m\s+hearing/i,
      /\bso\s+what\s+you'?re\s+saying/i,
      /\bif\s+i\s+understand\s+correctly/i,
      /\blet\s+me\s+make\s+sure/i,
      /\bto\s+summarize/i
    ];

    for (const pattern of paraphrasePatterns) {
      if (pattern.test(message)) {
        return {
          signal: 'Paraphrasing detected',
          interpretation: 'Reflected back customer statements to confirm understanding'
        };
      }
    }
  }

  // Making It Matter - Outcome-based language
  if (lowerIndicator.includes('outcome') || lowerIndicator.includes('so that') || lowerIndicator.includes('which means')) {
    const outcomePatterns = [
      /\bso\s+that/i,
      /\bwhich\s+means/i,
      /\bso\s+you\s+can/i,
      /\bthis\s+will\s+help\s+you/i,
      /\bthe\s+impact\s+is/i,
      /\bthe\s+benefit\s+is/i
    ];

    for (const pattern of outcomePatterns) {
      if (pattern.test(message)) {
        return {
          signal: 'Outcome-based language used',
          interpretation: 'Connected features to customer outcomes and benefits'
        };
      }
    }
  }

  // Objection Navigation - Acknowledging concerns
  if (lowerIndicator.includes('acknowledg') || lowerIndicator.includes('concern')) {
    const acknowledgmentPatterns = [
      /\bi\s+understand\s+(your|the)\s+concern/i,
      /\bthat'?s\s+a\s+(valid|good|fair)\s+(point|concern|question)/i,
      /\bi\s+appreciate\s+you\s+(raising|bringing\s+up)/i,
      /\bmany\s+(people|customers|physicians)\s+(have|share)\s+that/i
    ];

    for (const pattern of acknowledgmentPatterns) {
      if (pattern.test(message)) {
        return {
          signal: 'Concern acknowledged',
          interpretation: 'Acknowledged objection before addressing it'
        };
      }
    }
  }

  // Conversation Control - Agenda setting
  if (lowerIndicator.includes('agenda') || lowerIndicator.includes('transition')) {
    const agendaPatterns = [
      /\btoday\s+i'?d\s+like\s+to/i,
      /\blet'?s\s+start\s+by/i,
      /\bfirst\s+i'?d\s+like\s+to/i,
      /\bmoving\s+on\s+to/i,
      /\bnext\s+i'?d\s+like\s+to\s+discuss/i
    ];

    for (const pattern of agendaPatterns) {
      if (pattern.test(message)) {
        return {
          signal: 'Agenda setting detected',
          interpretation: 'Set clear direction for the conversation'
        };
      }
    }
  }

  // Commitment Gaining - Proposing next steps
  if (lowerIndicator.includes('next step') || lowerIndicator.includes('commitment')) {
    const commitmentPatterns = [
      /\bwhat\s+if\s+we/i,
      /\bcan\s+we\s+schedule/i,
      /\bshall\s+we\s+plan/i,
      /\bnext\s+step\s+(is|would\s+be)/i,
      /\bi'?ll\s+follow\s+up/i,
      /\blet'?s\s+set\s+up/i
    ];

    for (const pattern of commitmentPatterns) {
      if (pattern.test(message)) {
        return {
          signal: 'Next step proposed',
          interpretation: 'Proposed concrete action to move forward'
        };
      }
    }
  }

  return null;
}

/**
 * Map metric ID to signal type
 */
function getSignalType(metricId: BehavioralMetricId): DetectedSignal['type'] {
  switch (metricId) {
    case 'question_quality':
      return 'conversational';
    case 'listening_responsiveness':
      return 'verbal';
    case 'making_it_matter':
      return 'contextual';
    case 'customer_engagement_signals':
      return 'engagement';
    case 'objection_navigation':
      return 'verbal';
    case 'conversation_control_structure':
      return 'conversational';
    case 'commitment_gaining':
      return 'conversational';
    case 'adaptability':
      return 'contextual';
    default:
      return 'contextual';
  }
}

/**
 * Extract all signals from a complete transcript
 */
export function extractAllSignals(messages: Message[]): DetectedSignal[] {
  const allSignals: DetectedSignal[] = [];

  messages.forEach((msg, idx) => {
    if (msg.role === 'user') {
      const signals = detectSignals(messages.slice(0, idx), msg.content, 'user');
      allSignals.push(...signals);
    }
  });

  return allSignals;
}
