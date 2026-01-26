#!/usr/bin/env node
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

async function getFile(filePath) {
  console.log(`📥 Fetching ${filePath}...`);
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`, {
    headers: { 
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!res.ok) {
    console.log(`⚠️  ${filePath} not found (${res.status})`);
    return null;
  }
  
  const data = await res.json();
  if (data.content) {
    return Buffer.from(data.content, 'base64').toString('utf-8');
  }
  return null;
}

async function listDir(dirPath) {
  console.log(`📂 Listing ${dirPath}...`);
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${dirPath}?ref=${BRANCH}`, {
    headers: { 
      'Authorization': `token ${TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!res.ok) {
    console.log(`⚠️  ${dirPath} not found (${res.status})`);
    return [];
  }
  
  return await res.json();
}

async function main() {
  console.log('🚑 EMERGENCY RESTORATION STARTING...');
  console.log(`Repository: ${REPO}`);
  console.log(`Branch: ${BRANCH}`);
  console.log('');

  try {
    // First, list what's in src/pages on GitHub
    const pages = await listDir('src/pages');
    console.log('\n📁 Files in production src/pages:');
    const pageFiles = pages.filter(f => f.type === 'file').map(f => f.name);
    console.log(pageFiles.join(', '));
    console.log('');

    // Restore each missing file
    let restored = 0;
    for (const filePath of MISSING_FILES) {
      const content = await getFile(filePath);
      if (content) {
        const localPath = path.join(process.cwd(), filePath);
        fs.writeFileSync(localPath, content, 'utf-8');
        console.log(`✅ Restored: ${filePath}`);
        restored++;
      }
    }

    // Also check for any other .tsx files in src/pages
    for (const file of pages) {
      if (file.type === 'file' && file.name.endsWith('.tsx')) {
        const filePath = `src/pages/${file.name}`;
        if (!MISSING_FILES.includes(filePath) && !fs.existsSync(path.join(process.cwd(), filePath))) {
          const content = await getFile(filePath);
          if (content) {
            const localPath = path.join(process.cwd(), filePath);
            fs.writeFileSync(localPath, content, 'utf-8');
            console.log(`✅ Restored: ${filePath}`);
            restored++;
          }
        }
      }
    }

    console.log(`\n🎉 RESTORATION COMPLETE!`);
    console.log(`✅ Restored ${restored} files`);
    console.log('');
    console.log('🔄 Next steps:');
    console.log('1. Check src/pages/ directory');
    console.log('2. Update src/routes.tsx if needed');
    console.log('3. Restart dev server if necessary');

  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
