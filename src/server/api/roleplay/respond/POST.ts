import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { getActiveSession, addMessageToSession } from '../sessionStore.js';

// Mock HCP responses with situational cues (wrapped in *asterisks*)
const mockHcpResponsesWithCues = [
  "*Leans forward slightly* I see. Can you provide more specific data on the efficacy compared to current standard of care? *Picks up pen* I need to see head-to-head comparisons.",
  "*Crosses arms* That's interesting, but I'm concerned about the side effect profile. What does the safety data show, particularly for elderly patients?",
  "*Nods slowly* I appreciate the information. How does this fit into the current treatment guidelines? *Glances at computer screen* Has it been endorsed by any major medical societies?",
  "*Phone buzzes on desk* The data looks promising, but what about the cost? Will my patients' insurance cover this, or will they face significant out-of-pocket expenses?",
  "*Furrows brow* I'd need to see more long-term data before I feel comfortable prescribing this to my patients. What's the longest follow-up period in your studies?",
  "*Leans back in chair* That makes sense. Can you walk me through a typical patient case where this would be the preferred option over existing treatments?",
  "*Raises eyebrow* I'm intrigued. What about drug interactions? *Adjusts glasses* Many of my patients are on multiple medications.",
  "*Nods approvingly* Interesting. How does the dosing compare to what we're currently using? Is it more convenient for patients?",
  "*Nurse enters briefly with a question, then leaves* I appreciate your thoroughness. What kind of patient monitoring is required? Will this add to my practice's workload?",
  "*Smiles slightly* Good point. Are there any specific patient populations where this therapy shows particularly strong results?"
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

    // Generate HCP response with situational cues
    const randomResponse = mockHcpResponsesWithCues[Math.floor(Math.random() * mockHcpResponsesWithCues.length)];
    
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

    // Extract situational cues from response for Signal Intelligence panel
    const cuePattern = /\*([^*]+)\*/g;
    const signals: any[] = [];
    let match;
    
    while ((match = cuePattern.exec(randomResponse)) !== null) {
      const cue = match[1].trim();
      const signal = interpretCue(cue);
      if (signal) {
        signals.push({
          id: randomUUID(),
          type: signal.type,
          signal: cue,
          interpretation: signal.interpretation,
          suggestedResponse: signal.suggestedResponse,
          timestamp: new Date().toISOString()
        });
      }
    }

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

// Helper function to interpret situational cues
function interpretCue(cue: string): { type: string; interpretation: string; suggestedResponse: string } | null {
  const cueLower = cue.toLowerCase();

  // Engagement signals
  if (cueLower.includes('lean') && cueLower.includes('forward')) {
    return {
      type: 'engagement',
      interpretation: 'HCP is showing increased interest in this topic',
      suggestedResponse: 'Good opportunity to provide more detail or ask a discovery question'
    };
  }
  if (cueLower.includes('nod')) {
    return {
      type: 'engagement',
      interpretation: 'HCP appears to agree or understand the point',
      suggestedResponse: 'Continue building on this topic or move to next key message'
    };
  }

  // Disengagement signals
  if (cueLower.includes('glance') && (cueLower.includes('watch') || cueLower.includes('clock'))) {
    return {
      type: 'contextual',
      interpretation: 'Time pressure signal - HCP may be feeling rushed',
      suggestedResponse: 'Consider summarizing key points or asking about priorities'
    };
  }
  if (cueLower.includes('cross') && cueLower.includes('arm')) {
    return {
      type: 'engagement',
      interpretation: 'Possible resistance or skepticism',
      suggestedResponse: 'Acknowledge their perspective, ask an open-ended question'
    };
  }

  // Environmental signals
  if (cueLower.includes('phone') || cueLower.includes('pager') || cueLower.includes('buzz')) {
    return {
      type: 'contextual',
      interpretation: 'External interruption - may affect attention',
      suggestedResponse: 'Offer to pause or recap when they return focus'
    };
  }
  if (cueLower.includes('nurse') || cueLower.includes('staff') || cueLower.includes('enter')) {
    return {
      type: 'contextual',
      interpretation: 'Clinical environment interruption',
      suggestedResponse: 'Remain patient, acknowledge the demands of their role'
    };
  }

  // Body language signals
  if (cueLower.includes('frown') || cueLower.includes('furrow')) {
    return {
      type: 'verbal',
      interpretation: 'Possible confusion or concern about what was said',
      suggestedResponse: 'Clarify or ask if they have questions about the point'
    };
  }
  if (cueLower.includes('eyebrow') || cueLower.includes('raise')) {
    return {
      type: 'verbal',
      interpretation: 'Curiosity or skepticism signal',
      suggestedResponse: 'Provide evidence or ask what specifically prompted the reaction'
    };
  }
  if (cueLower.includes('smile') || cueLower.includes('laugh')) {
    return {
      type: 'engagement',
      interpretation: 'Positive rapport signal',
      suggestedResponse: 'Good moment to reinforce relationship or transition topics'
    };
  }
  if (cueLower.includes('picks up') || cueLower.includes('reaches for')) {
    return {
      type: 'engagement',
      interpretation: 'HCP taking action - may indicate readiness to engage',
      suggestedResponse: 'Allow moment to complete, then continue or transition'
    };
  }

  // Default
  return {
    type: 'contextual',
    interpretation: 'Observable behavior that may provide context',
    suggestedResponse: 'Continue observing and adapt approach as needed'
  };
}
