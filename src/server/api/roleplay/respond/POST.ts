import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { getActiveSession, addMessageToSession } from '../sessionStore.js';

const mockHcpResponses = [
  "I see. Can you provide more specific data on the efficacy compared to current standard of care? I need to see head-to-head comparisons.",
  "That's interesting, but I'm concerned about the side effect profile. What does the safety data show, particularly for elderly patients?",
  "I appreciate the information. How does this fit into the current treatment guidelines? Has it been endorsed by any major medical societies?",
  "The data looks promising, but what about the cost? Will my patients' insurance cover this, or will they face significant out-of-pocket expenses?",
  "I'd need to see more long-term data before I feel comfortable prescribing this to my patients. What's the longest follow-up period in your studies?",
  "That makes sense. Can you walk me through a typical patient case where this would be the preferred option over existing treatments?",
  "I'm intrigued. What about drug interactions? Many of my patients are on multiple medications.",
  "Interesting. How does the dosing compare to what we're currently using? Is it more convenient for patients?",
  "I appreciate your thoroughness. What kind of patient monitoring is required? Will this add to my practice's workload?",
  "Good point. Are there any specific patient populations where this therapy shows particularly strong results?"
];

export default async function handler(req: Request, res: Response) {
  try {
    // Generate or reuse session ID
    const sessionId = req.headers['x-session-id'] as string || randomUUID();
    res.setHeader('x-session-id', sessionId);
    
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get active session
    const session = getActiveSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'No active roleplay session found' });
    }

    // Add user message to session
    addMessageToSession(sessionId, 'user', message);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate HCP response
    const randomResponse = mockHcpResponses[Math.floor(Math.random() * mockHcpResponses.length)];
    
    // Add HCP response to session
    addMessageToSession(sessionId, 'assistant', randomResponse);

    // Generate realistic EQ metrics (0-100 scale)
    const eqAnalysis = {
      score: Math.floor(Math.random() * 20) + 75, // 75-95
      empathy: Math.floor(Math.random() * 20) + 75,
      adaptability: Math.floor(Math.random() * 20) + 70,
      curiosity: Math.floor(Math.random() * 20) + 65,
      resilience: Math.floor(Math.random() * 20) + 70,
      strengths: [
        'Demonstrated active listening',
        'Used evidence-based approach',
        'Maintained professional tone'
      ],
      improvements: [
        'Could ask more discovery questions',
        'Address concerns more directly',
        'Provide specific patient examples'
      ],
      frameworksUsed: ['SPIN Selling', 'Active Listening']
    };

    // Generate observable signals
    const signals = [
      {
        id: `signal-${Date.now()}-1`,
        type: 'verbal',
        signal: 'HCP expressed concern about safety data',
        interpretation: 'The physician is risk-averse and prioritizes patient safety',
        suggestedResponse: 'Acknowledge the concern and provide specific safety data from clinical trials',
        timestamp: new Date().toISOString()
      },
      {
        id: `signal-${Date.now()}-2`,
        type: 'engagement',
        signal: 'HCP asked follow-up question',
        interpretation: 'Showing genuine interest in the product',
        suggestedResponse: 'Continue providing detailed information and invite more questions',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({
      message: randomResponse,
      eqAnalysis,
      signals,
      session: {
        messages: session.messages,
        active: session.active
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
