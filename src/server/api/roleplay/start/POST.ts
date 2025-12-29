import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { startRoleplaySession } from '../sessionStore.js';

// Initial messages with situational cues
const initialMessagesWithCues = [
  "*The HCP looks up from reviewing patient charts* Good morning. I understand you wanted to discuss a new treatment option. I have about 15 minutes before my next patient. What can you tell me about this?",
  "*Leans back in chair, arms crossed* Hello. I've been hearing about this medication from a few colleagues. What makes it different from what we're currently using?",
  "*Sets down coffee cup* Thanks for coming in. I'm always interested in new treatment options, but I need to see solid evidence. What data do you have?",
  "*Glances at watch* Hi there. I appreciate you taking the time. My main concern is always patient outcomes. How does this improve on current standards of care?",
  "*Adjusts glasses, looks directly at you* Good afternoon. I have to be honest - I'm quite satisfied with my current treatment protocols. What would convince me to change?"
];

export default async function handler(req: Request, res: Response) {
  try {
    // Generate or reuse session ID
    const sessionId = req.headers['x-session-id'] as string || randomUUID();
    res.setHeader('x-session-id', sessionId);
    
    const { scenarioId, difficulty, scenario } = req.body;

    if (!scenarioId) {
      return res.status(400).json({ error: 'Scenario ID is required' });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use scenario-specific initial cue if provided, otherwise use random
    let initialMessage;
    if (scenario?.initialCue) {
      // Use scenario's initial cue with contextual opening
      initialMessage = `${scenario.initialCue} Good to see you. ${scenario.environmentalContext ? 'I have about 15 minutes before my next patient.' : ''} What would you like to discuss?`;
    } else {
      // Fallback to random initial message with cues
      initialMessage = initialMessagesWithCues[Math.floor(Math.random() * initialMessagesWithCues.length)];
    }

    // Create the session
    const session = startRoleplaySession(
      sessionId,
      scenarioId,
      difficulty || 'intermediate',
      initialMessage
    );

    res.json({
      sessionId: session.sessionId,
      scenarioId: session.scenarioId,
      difficulty: session.difficulty,
      hcpProfile: session.hcpProfile,
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
