import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';

export default async function handler(req: Request, res: Response) {
  // Generate or reuse session ID
  const sessionId = req.headers['x-session-id'] as string || randomUUID();
  res.setHeader('x-session-id', sessionId);
  
  res.json({
    dailyTip: 'Today, focus on asking Situation questions to understand your HCP\'s current challenges. This builds the foundation for effective needs-based selling.',
    focusArea: 'Active Listening - Practice paraphrasing HCP concerns before responding',
    suggestedExercise: {
      title: 'Handling Price Objections',
      description: 'Practice responding to common pricing concerns from HCPs using value-based selling techniques'
    },
    motivationalQuote: 'Success in pharmaceutical sales comes from understanding that you\'re not just selling a product - you\'re providing solutions that improve patient outcomes.'
  });
}
