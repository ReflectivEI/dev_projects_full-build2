import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  res.json({
    status: 'ok',
    message: 'Mock API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0-mock'
  });
}
