import type { Request, Response } from 'express';

const mockHcpResponses = [
  "I see. Can you provide more specific data on the efficacy compared to current standard of care?",
  "That's interesting, but I'm concerned about the side effect profile. What does the safety data show?",
  "I appreciate the information. How does this fit into the current treatment guidelines?",
  "The data looks promising, but what about the cost? Will my patients' insurance cover this?",
  "I'd need to see more long-term data before I feel comfortable prescribing this to my patients."
];

export default async function handler(req: Request, res: Response) {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Session ID and message are required' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomResponse = mockHcpResponses[Math.floor(Math.random() * mockHcpResponses.length)];

    res.json({
      message: randomResponse,
      eqMetrics: {
        empathy: Math.floor(Math.random() * 30) + 70,
        activeListening: Math.floor(Math.random() * 30) + 65,
        adaptability: Math.floor(Math.random() * 30) + 60,
        emotionalRegulation: Math.floor(Math.random() * 30) + 75,
        socialAwareness: Math.floor(Math.random() * 30) + 70,
        relationshipManagement: Math.floor(Math.random() * 30) + 65
      },
      feedback: {
        strengths: ['Good use of data', 'Professional tone'],
        improvements: ['Could ask more open-ended questions', 'Address concerns more directly']
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
