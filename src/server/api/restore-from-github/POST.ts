import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const TOKEN = '***REMOVED***';
const REPO = 'ReflectivEI/dev_projects_full-build2';
const BRANCH = 'main';

const MISSING_FILES = [
  'src/pages/dashboard.tsx',
  'src/pages/knowledge.tsx',
  'src/pages/ei-metrics.tsx',
  'src/pages/coaching.tsx',
  'src/pages/modules.tsx',
  'src/pages/sql-translator.tsx'
];

async function getFile(filePath: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`, {
    headers: { 
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!res.ok) {
    return null;
  }
  
  const data = await res.json();
  if (data.content) {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  return null;
}

async function listDir(dirPath: string) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${dirPath}?ref=${BRANCH}`, {
    headers: { 
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!res.ok) {
    return [];
  }
  
  return await res.json();
}

export default async function handler(req: Request, res: Response) {
  try {
    const log: string[] = [];
    log.push('🚑 EMERGENCY RESTORATION STARTING...');
    log.push(`Repository: ${REPO}`);
    log.push(`Branch: ${BRANCH}`);

    // List what's in src/pages on GitHub
    const pages = await listDir('src/pages');
    log.push('\n📁 Files in production src/pages:');
    const pageFiles = pages.filter((f: any) => f.type === 'file').map((f: any) => f.name);
    log.push(pageFiles.join(', '));

    // Restore each missing file
    let restored = 0;
    const restoredFiles: string[] = [];
    
    for (const filePath of MISSING_FILES) {
      const content = await getFile(filePath);
      if (content) {
        const localPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(localPath, content, 'utf-8');
        log.push(`✅ Restored: ${filePath}`);
        restoredFiles.push(filePath);
        restored++;
      } else {
        log.push(`⚠️  Not found: ${filePath}`);
      }
    }

    // Check for any other .tsx files in src/pages
    for (const file of pages) {
      if (file.type === 'file' && file.name.endsWith('.tsx')) {
        const filePath = `src/pages/${file.name}`;
        if (!MISSING_FILES.includes(filePath) && !fs.existsSync(path.join(process.cwd(), filePath))) {
          const content = await getFile(filePath);
          if (content) {
            const localPath = path.join(process.cwd(), filePath);
            fs.writeFileSync(localPath, content, 'utf-8');
            log.push(`✅ Restored: ${filePath}`);
            restoredFiles.push(filePath);
            restored++;
          }
        }
      }
    }

    log.push(`\n🎉 RESTORATION COMPLETE!`);
    log.push(`✅ Restored ${restored} files`);

    res.json({
      success: true,
      restored,
      files: restoredFiles,
      log: log.join('\n')
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
      message: 'Failed to restore files from GitHub'
    });
  }
}
