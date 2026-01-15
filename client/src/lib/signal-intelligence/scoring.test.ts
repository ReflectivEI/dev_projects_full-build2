/**
 * Unit Tests for Behavioral Metrics Scoring Engine
 * Tests rounding, optional metric exclusion, and component applicability
 */

import { describe, it, expect } from 'vitest';
import {
  round1,
  averageApplicable,
  weightedAverageApplicable,
  scoreConversation,
  type Turn,
  type ComponentResult
} from './scoring';

describe('Utility Functions', () => {
  describe('round1', () => {
    it('rounds to 1 decimal place', () => {
      expect(round1(3.14159)).toBe(3.1);
      expect(round1(3.95)).toBe(4.0);
      expect(round1(3.05)).toBe(3.1);
      expect(round1(3.0)).toBe(3.0);
    });
  });

  describe('averageApplicable', () => {
    it('averages only applicable components', () => {
      const components: ComponentResult[] = [
        { name: 'a', score: 5, applicable: true, weight: 0.33 },
        { name: 'b', score: 3, applicable: true, weight: 0.33 },
        { name: 'c', score: null, applicable: false, weight: 0.34 }
      ];
      expect(averageApplicable(components)).toBe(4.0);
    });

    it('returns null when no applicable components', () => {
      const components: ComponentResult[] = [
        { name: 'a', score: null, applicable: false, weight: 0.5 },
        { name: 'b', score: null, applicable: false, weight: 0.5 }
      ];
      expect(averageApplicable(components)).toBeNull();
    });
  });

  describe('weightedAverageApplicable', () => {
    it('computes weighted average of applicable components', () => {
      const components: ComponentResult[] = [
        { name: 'a', score: 5, applicable: true, weight: 0.25 },
        { name: 'b', score: 4, applicable: true, weight: 0.25 },
        { name: 'c', score: 3, applicable: true, weight: 0.25 },
        { name: 'd', score: 2, applicable: true, weight: 0.25 }
      ];
      const result = weightedAverageApplicable(components);
      expect(result).toBe(3.5);
    });

    it('ignores non-applicable components in weighting', () => {
      const components: ComponentResult[] = [
        { name: 'a', score: 5, applicable: true, weight: 0.5 },
        { name: 'b', score: 3, applicable: true, weight: 0.5 },
        { name: 'c', score: 1, applicable: false, weight: 0.5 }
      ];
      const result = weightedAverageApplicable(components);
      expect(result).toBe(4.0);
    });
  });
});

describe('Optional Metric Exclusion', () => {
  it('marks objection_navigation as not_applicable when no objections exist', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'How can I help you today?' },
      { speaker: 'customer', text: 'I am interested in learning more about your product.' },
      { speaker: 'rep', text: 'Great! Let me tell you about our features.' },
      { speaker: 'customer', text: 'That sounds good.' }
    ];

    const results = scoreConversation(transcript);
    const objectionMetric = results.find(r => r.id === 'objection_navigation');

    expect(objectionMetric).toBeDefined();
    expect(objectionMetric?.optional).toBe(true);
    expect(objectionMetric?.not_applicable).toBe(true);
    expect(objectionMetric?.overall_score).toBeNull();
    expect(objectionMetric?.components.every(c => !c.applicable)).toBe(true);
  });

  it('scores objection_navigation when objections are present', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'How can I help you today?' },
      { speaker: 'customer', text: 'I am concerned about the cost.' },
      { speaker: 'rep', text: 'I understand your concern. Can you tell me more about your budget?' },
      { speaker: 'customer', text: 'We have limited funds.' }
    ];

    const results = scoreConversation(transcript);
    const objectionMetric = results.find(r => r.id === 'objection_navigation');

    expect(objectionMetric).toBeDefined();
    expect(objectionMetric?.optional).toBe(true);
    expect(objectionMetric?.not_applicable).toBe(false);
    expect(objectionMetric?.overall_score).not.toBeNull();
    expect(objectionMetric?.components.some(c => c.applicable)).toBe(true);
  });
});

describe('Component Applicability', () => {
  it('marks acknowledgment_of_concerns as not applicable when no concerns exist', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'What are your goals?' },
      { speaker: 'customer', text: 'We want to improve efficiency.' },
      { speaker: 'rep', text: 'That makes sense. How can we help?' },
      { speaker: 'customer', text: 'Tell me about your solution.' }
    ];

    const results = scoreConversation(transcript);
    const listeningMetric = results.find(r => r.id === 'listening_responsiveness');

    expect(listeningMetric).toBeDefined();
    const concernComponent = listeningMetric?.components.find(c => c.name === 'acknowledgment_of_concerns');
    expect(concernComponent?.applicable).toBe(false);
    expect(concernComponent?.score).toBeNull();
  });

  it('marks acknowledgment_of_concerns as applicable when concerns exist', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'What are your thoughts?' },
      { speaker: 'customer', text: 'I am worried about implementation time.' },
      { speaker: 'rep', text: 'I hear you. That is a valid concern.' },
      { speaker: 'customer', text: 'Yes, we are on a tight timeline.' }
    ];

    const results = scoreConversation(transcript);
    const listeningMetric = results.find(r => r.id === 'listening_responsiveness');

    expect(listeningMetric).toBeDefined();
    const concernComponent = listeningMetric?.components.find(c => c.name === 'acknowledgment_of_concerns');
    expect(concernComponent?.applicable).toBe(true);
    expect(concernComponent?.score).not.toBeNull();
    expect(concernComponent?.score).toBeGreaterThan(0);
  });

  it('averages only applicable components in listening_responsiveness', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'Tell me about your needs.' },
      { speaker: 'customer', text: 'We need better reporting tools.' },
      { speaker: 'rep', text: 'So you are saying you need better reporting. Got it.' },
      { speaker: 'customer', text: 'Yes, and we also need real-time data.' },
      { speaker: 'rep', text: 'Real-time data is important. Let me show you how we handle that.' }
    ];

    const results = scoreConversation(transcript);
    const listeningMetric = results.find(r => r.id === 'listening_responsiveness');

    expect(listeningMetric).toBeDefined();
    expect(listeningMetric?.score_formula).toBe('average');

    const concernComponent = listeningMetric?.components.find(c => c.name === 'acknowledgment_of_concerns');
    expect(concernComponent?.applicable).toBe(false);

    const applicableComponents = listeningMetric?.components.filter(c => c.applicable) || [];
    expect(applicableComponents.length).toBeGreaterThan(0);
    expect(listeningMetric?.overall_score).not.toBeNull();
  });
});

describe('Adaptability Metric - No Cues Baseline', () => {
  it('marks all adaptability components as not applicable when no cues exist', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'How can I help you?' },
      { speaker: 'customer', text: 'I want to learn about your product.' },
      { speaker: 'rep', text: 'Great! Let me explain our features.' },
      { speaker: 'customer', text: 'That sounds interesting.' }
    ];

    const results = scoreConversation(transcript);
    const adaptabilityMetric = results.find(r => r.id === 'adaptability');

    expect(adaptabilityMetric).toBeDefined();
    expect(adaptabilityMetric?.components.every(c => !c.applicable)).toBe(true);
    expect(adaptabilityMetric?.overall_score).toBeNull();
  });

  it('scores adaptability components when cues are present', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'Let me explain our solution in detail.' },
      { speaker: 'customer', text: 'I am confused. What do you mean?' },
      { speaker: 'rep', text: 'Let me simplify. We help you save time.' },
      { speaker: 'customer', text: 'Oh, I see now.' }
    ];

    const results = scoreConversation(transcript);
    const adaptabilityMetric = results.find(r => r.id === 'adaptability');

    expect(adaptabilityMetric).toBeDefined();
    expect(adaptabilityMetric?.components.some(c => c.applicable)).toBe(true);
    expect(adaptabilityMetric?.overall_score).not.toBeNull();
  });
});

describe('Integration Tests', () => {
  it('scores all 8 metrics for a complete conversation', () => {
    const transcript: Turn[] = [
      { speaker: 'rep', text: 'Today I would like to discuss your needs. What are your goals?' },
      { speaker: 'customer', text: 'We need to improve patient outcomes and reduce costs.' },
      { speaker: 'rep', text: 'So you are saying you want to improve outcomes. Tell me more about that.' },
      { speaker: 'customer', text: 'Yes, we struggle with adherence.' },
      { speaker: 'rep', text: 'I understand. Our solution can help you increase adherence so that you see better outcomes.' },
      { speaker: 'customer', text: 'That sounds good. What are the next steps?' },
      { speaker: 'rep', text: 'I will send you a proposal by Friday. You can review it and we will schedule a follow-up next week.' },
      { speaker: 'customer', text: 'Yes, that works for me.' }
    ];

    const results = scoreConversation(transcript);

    expect(results).toHaveLength(8);
    expect(results.every(r => r.id && r.metric && r.components.length > 0)).toBe(true);

    const metricIds = results.map(r => r.id);
    expect(metricIds).toContain('question_quality');
    expect(metricIds).toContain('listening_responsiveness');
    expect(metricIds).toContain('making_it_matter');
    expect(metricIds).toContain('customer_engagement_signals');
    expect(metricIds).toContain('objection_navigation');
    expect(metricIds).toContain('conversation_control_structure');
    expect(metricIds).toContain('commitment_gaining');
    expect(metricIds).toContain('adaptability');
  });

  it('handles empty transcript gracefully', () => {
    const transcript: Turn[] = [];
    const results = scoreConversation(transcript);

    expect(results).toHaveLength(8);
    expect(results.every(r => r.overall_score !== undefined)).toBe(true);
  });
});
