import type { Request, Response } from 'express';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  userMessage: string;
  scenarioId?: string;
  scenarioTitle?: string;
}

export default async function handler(req: Request, res: Response) {
  try {
    const { messages, userMessage, scenarioId, scenarioTitle } = req.body as ChatRequest;

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get Cloudflare Worker configuration from environment
    const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
    const apiKey = process.env.CLOUDFLARE_API_KEY;

    if (!workerUrl) {
      console.error('CLOUDFLARE_WORKER_URL not configured');
      return res.status(500).json({ error: 'Chat service not configured' });
    }

    // Build context for the AI based on scenario
    let systemContext = 'You are an AI sales coach for life sciences professionals.';
    
    if (scenarioId && scenarioTitle) {
      systemContext += ` You are currently in a roleplay scenario: "${scenarioTitle}". Play the role of the healthcare professional in this scenario and respond realistically to the sales representative's approach.`;
    }

    // Prepare the request payload for Cloudflare Worker
    // Adjust this structure based on your worker's expected format
    const payload = {
      messages: [
        { role: 'system', content: systemContext },
        ...messages,
        { role: 'user', content: userMessage },
      ],
      // Add any additional parameters your worker expects
      scenarioId,
      scenarioTitle,
    };

    // Call Cloudflare Worker
    const workerResponse = await fetch(workerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication header if needed
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.error('Cloudflare Worker error:', errorText);
      throw new Error(`Worker responded with status ${workerResponse.status}`);
    }

    const data = await workerResponse.json();

    // Extract the AI response from the worker's response
    // Adjust this based on your worker's response format
    const aiMessage = data.message || data.response || data.content;

    if (!aiMessage) {
      throw new Error('Invalid response format from worker');
    }

    return res.json({ message: aiMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      message: String(error),
    });
  }
}
