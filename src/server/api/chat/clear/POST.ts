import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  res.json({
    success: true,
    message: 'Chat history cleared',
    sessionId: 'mock-session-' + Date.now()
  });
}
