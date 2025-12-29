import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  res.json({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI Sales Coach. How can I help you today?',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        role: 'user',
        content: 'I need help preparing for a meeting with a cardiologist.',
        timestamp: new Date(Date.now() - 3500000).toISOString()
      },
      {
        id: '3',
        role: 'assistant',
        content: 'Great! Let\'s prepare for your cardiology meeting. What product are you presenting?',
        timestamp: new Date(Date.now() - 3400000).toISOString()
      }
    ],
    sessionId: 'mock-session-123'
  });
}
