import type { Request, Response } from 'express';
import { getSecret } from '#airo/secrets';

/**
 * Chat API Proxy to Cloudflare Worker
 * 
 * This endpoint proxies all chat requests to the Cloudflare Worker backend.
 * This ensures frontend and backend are always in sync (same deployment).
 * 
 * Root Cause Fix: Frontend calling worker directly caused version mismatches.
 * Solution: Proxy through GoDaddy backend to maintain consistency.
 */

export default async function handler(req: Request, res: Response) {
  try {
    const workerUrl = getSecret('CLOUDFLARE_WORKER_URL');
    
    if (!workerUrl) {
      return res.status(503).json({ 
        error: 'Worker URL not configured',
        message: 'Please configure CLOUDFLARE_WORKER_URL in secrets'
      });
    }

    // Proxy the request to Cloudflare Worker
    const workerResponse = await fetch(`${workerUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward original headers that might be needed
        'x-forwarded-for': req.ip || '',
        'user-agent': req.headers['user-agent'] || ''
      },
      body: JSON.stringify(req.body)
    });

    if (!workerResponse.ok) {
      const errorText = await workerResponse.text();
      console.error('Worker error:', workerResponse.status, errorText);
      return res.status(workerResponse.status).json({
        error: 'Worker request failed',
        status: workerResponse.status,
        message: errorText
      });
    }

    const data = await workerResponse.json();
    res.json(data);

  } catch (error) {
    console.error('Chat proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error',
      message: String(error)
    });
  }
}
