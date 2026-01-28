import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default async function handler(req: Request, res: Response) {
  try {
    // Path to the tar.gz file in project root
    const filePath = path.join(process.cwd(), 'reflectivai-CRITICAL-FIX.tar.gz');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        error: 'File not found',
        message: 'The deployment package has not been generated yet. Please run: npm run build && cd dist/client && tar -czf ../../reflectivai-CRITICAL-FIX.tar.gz .'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="reflectivai-CRITICAL-FIX.tar.gz"');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream file' });
      }
    });
    
  } catch (error) {
    console.error('Error in download-fix handler:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: String(error)
    });
  }
}
