import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { getActiveSession, endRoleplaySession } from '../sessionStore.js';

export default async function handler(req: Request, res: Response) {
  try {
    // Generate or reuse session ID
    const sessionId = req.headers['x-session-id'] as string || randomUUID();
    res.setHeader('x-session-id', sessionId);
    
    // Get active session
    const session = getActiveSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'No active roleplay session found' });
    }

    // End the session
    endRoleplaySession(sessionId);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate comprehensive feedback
    const feedback = {
      overallScore: Math.floor(Math.random() * 15) + 80, // 80-95
      performanceLevel: 'strong' as const,
      eqScores: [
        {
          metricId: 'empathy',
          score: 4.2,
          feedback: 'Demonstrated good understanding of HCP concerns and patient needs',
          observedBehaviors: 8,
          totalOpportunities: 10
        },
        {
          metricId: 'adaptability',
          score: 3.8,
          feedback: 'Adjusted approach based on HCP responses, but could be more flexible',
          observedBehaviors: 6,
          totalOpportunities: 10
        },
        {
          metricId: 'discovery',
          score: 3.5,
          feedback: 'Asked some good questions, but could probe deeper into HCP needs',
          observedBehaviors: 5,
          totalOpportunities: 10
        },
        {
          metricId: 'resilience',
          score: 4.0,
          feedback: 'Handled objections well and maintained composure',
          observedBehaviors: 7,
          totalOpportunities: 10
        }
      ],
      salesSkillScores: [
        {
          skillId: 'needs-assessment',
          skillName: 'Needs Assessment',
          score: 3.9,
          feedback: 'Good at identifying HCP priorities, could ask more discovery questions',
          observedBehaviors: 7,
          totalOpportunities: 10
        },
        {
          skillId: 'objection-handling',
          skillName: 'Objection Handling',
          score: 4.1,
          feedback: 'Effectively addressed concerns with data and empathy',
          observedBehaviors: 8,
          totalOpportunities: 10
        },
        {
          skillId: 'value-communication',
          skillName: 'Value Communication',
          score: 3.7,
          feedback: 'Communicated product benefits, but could tie more closely to patient outcomes',
          observedBehaviors: 6,
          totalOpportunities: 10
        }
      ],
      topStrengths: [
        'Strong use of clinical evidence to support claims',
        'Maintained professional and respectful tone throughout',
        'Effectively addressed safety concerns with specific data',
        'Demonstrated active listening by acknowledging HCP perspectives'
      ],
      priorityImprovements: [
        'Ask 2-3 discovery questions before presenting solutions',
        'Use more patient case examples to illustrate product benefits',
        'Practice handling cost objections with value-based messaging',
        'Probe deeper into HCP\'s specific patient population needs'
      ],
      specificExamples: [
        {
          quote: 'You mentioned concerns about safety - let me share the data from our Phase 3 trials',
          analysis: 'Excellent acknowledgment of concern followed by evidence-based response',
          isPositive: true
        },
        {
          quote: 'This product offers significant benefits for your patients',
          analysis: 'Could be more specific - which patients? What specific benefits?',
          isPositive: false
        },
        {
          quote: 'I understand time is limited - what\'s most important for you to know?',
          analysis: 'Great example of respecting HCP\'s time and prioritizing their needs',
          isPositive: true
        }
      ],
      nextSteps: [
        'Review the conversation and identify 3 moments where you could have asked a discovery question',
        'Prepare 5 patient case examples that demonstrate product value for different scenarios',
        'Practice your 30-second opening that establishes rapport before presenting information',
        'Role-play handling cost objections with a colleague using value-based messaging'
      ],
      overallSummary: `Strong performance overall. You demonstrated good clinical knowledge and maintained professionalism throughout the interaction. Your use of evidence-based responses was particularly effective. To take your skills to the next level, focus on asking more discovery questions early in the conversation and using specific patient examples to illustrate value. The HCP showed genuine interest, which indicates you built good rapport. Keep practicing these techniques to continue improving.`
    };

    res.json({
      success: true,
      sessionId: sessionId,
      feedback,
      messageCount: session.messages.length,
      duration: Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
