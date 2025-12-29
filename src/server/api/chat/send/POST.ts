import type { Request, Response } from 'express';

const mockResponses = [
  "That's a great question! In pharmaceutical sales, building trust with HCPs is crucial. Let me share some insights...",
  "I understand your concern. When approaching objections, it's important to listen actively and validate their perspective first.",
  "Excellent point! The DISC framework can really help here. Based on what you've described, this HCP seems to have a high D (Dominance) profile.",
  "Let's break this down using the Signal Intelligence™ framework. Which of the 6 competencies would you like to focus on?",
  "That's a common challenge in life sciences sales. Have you considered using the SPIN selling technique to uncover their needs?"
];

export default async function handler(req: Request, res: Response) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    res.json({
      message: randomResponse,
      timestamp: new Date().toISOString(),
      sessionId: 'mock-session-' + Date.now(),
      context: context || {}
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
