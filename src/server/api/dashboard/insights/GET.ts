import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  res.json({
    dailyTip: {
      title: 'Master the SPIN Technique',
      content: 'Today, focus on asking Situation questions to understand your HCP\'s current challenges. This builds the foundation for effective needs-based selling.',
      category: 'Sales Technique'
    },
    focusAreas: [
      {
        title: 'Active Listening',
        score: 72,
        trend: 'up',
        recommendation: 'Practice paraphrasing HCP concerns before responding'
      },
      {
        title: 'Objection Handling',
        score: 68,
        trend: 'stable',
        recommendation: 'Review the LAER framework for handling objections'
      },
      {
        title: 'Relationship Building',
        score: 85,
        trend: 'up',
        recommendation: 'Excellent progress! Keep building on your rapport skills'
      }
    ],
    recentActivity: {
      roleplaySessions: 5,
      chatSessions: 12,
      exercisesCompleted: 8,
      lastActive: new Date(Date.now() - 7200000).toISOString()
    },
    suggestedExercises: [
      {
        id: 'ex-1',
        title: 'Handling Price Objections',
        difficulty: 'intermediate',
        duration: '15 minutes'
      },
      {
        id: 'ex-2',
        title: 'DISC Personality Assessment',
        difficulty: 'beginner',
        duration: '10 minutes'
      }
    ],
    timestamp: new Date().toISOString()
  });
}
