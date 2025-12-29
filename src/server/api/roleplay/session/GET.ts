import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { getActiveSession } from '../sessionStore.js';

export default async function handler(req: Request, res: Response) {
  // Generate or reuse session ID
  const sessionId = req.headers['x-session-id'] as string || randomUUID();
  res.setHeader('x-session-id', sessionId);
  
  // Get active session
  const session = getActiveSession(sessionId);
  
  if (!session) {
    // No active session - return empty state
    return res.json({
      session: null,
      messages: [],
      signals: []
    });
  }

  // Return active session data
  res.json({
    session: {
      sessionId: session.sessionId,
      scenarioId: session.scenarioId,
      difficulty: session.difficulty,
      messages: session.messages,
      hcpProfile: session.hcpProfile,
      active: session.active,
      startTime: session.startTime
    },
    messages: session.messages,
    signals: [] // Signals are returned per-response in the respond endpoint
  });
}
