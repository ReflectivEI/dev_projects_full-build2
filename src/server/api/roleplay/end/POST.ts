import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    res.json({
      success: true,
      sessionId,
      summary: {
        duration: '12 minutes',
        exchanges: 8,
        overallScore: 78,
        eqMetrics: {
          empathy: 82,
          activeListening: 75,
          adaptability: 70,
          emotionalRegulation: 80,
          socialAwareness: 76,
          relationshipManagement: 72
        },
        strengths: [
          'Excellent use of clinical data',
          'Strong rapport building',
          'Effective objection handling'
        ],
        improvements: [
          'Could ask more discovery questions',
          'Practice active listening techniques',
          'Address cost concerns earlier'
        ]
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
