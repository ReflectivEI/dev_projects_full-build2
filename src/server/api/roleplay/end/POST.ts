import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  try {
    // Forward to Worker API
    const WORKER_URL = 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev';
    const workerResponse = await fetch(`${WORKER_URL}/api/roleplay/end`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.error('[roleplay/end] Worker error:', errorText);
      return res.status(workerResponse.status).json({ 
        error: 'Worker API error', 
        details: errorText 
      });
    }

    const data = await workerResponse.json();
    res.json(data);
  } catch (error) {
    console.error('[roleplay/end] Error:', error);
    res.status(500).json({ 
      error: 'Failed to end roleplay', 
      message: String(error) 
    });
  }
}
