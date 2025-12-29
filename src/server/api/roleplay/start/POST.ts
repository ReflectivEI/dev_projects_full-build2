import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { scenarioId, difficulty } = req.body;

    if (!scenarioId) {
      return res.status(400).json({ error: 'Scenario ID is required' });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      sessionId: 'roleplay-session-' + Date.now(),
      scenarioId,
      difficulty: difficulty || 'intermediate',
      hcpProfile: {
        name: 'Dr. Sarah Mitchell',
        specialty: 'Cardiology',
        personality: 'Analytical and detail-oriented',
        concerns: ['Efficacy data', 'Patient safety', 'Cost-effectiveness']
      },
      initialMessage: "Good morning. I understand you wanted to discuss a new treatment option. I have about 15 minutes before my next patient. What can you tell me about this?",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
