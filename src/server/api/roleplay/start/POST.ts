import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    const { scenarioId, scenario, context } = req.body;

    if (!scenarioId || !scenario) {
      return res.status(400).json({ error: 'Missing scenarioId or scenario' });
    }

    // Forward to Worker API
    const WORKER_URL = 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev';
    const workerResponse = await fetch(`${WORKER_URL}/api/roleplay/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenarioId, scenario, context }),
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.error('[roleplay/start] Worker error:', errorText);
      return res.status(workerResponse.status).json({ 
        error: 'Worker API error', 
        details: errorText 
      });
    }

    const data = await workerResponse.json();
    res.json(data);
  } catch (error) {
    console.error('[roleplay/start] Error:', error);
    res.status(500).json({ 
      error: 'Failed to start roleplay', 
      message: String(error) 
    });
  }
}
