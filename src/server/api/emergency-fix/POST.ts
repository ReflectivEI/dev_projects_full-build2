import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const GITHUB_TOKEN = '***REMOVED***';
  const REPO = 'ReflectivEI/dev_projects_full-build2';
  const FILE_PATH = 'client/src/pages/ei-metrics.tsx';
  const BRANCH = 'main';

  const headers = {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Node.js'
  };

  try {
    console.log('🚨 EMERGENCY FIX - Fetching file from GitHub...');
    
    // Step 1: Fetch current file
    const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }
    
    const fileData = await response.json();
    const sha = fileData.sha;
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    
    console.log('✅ Fetched successfully, SHA:', sha);
    
    // Step 2: Check if fix is needed
    if (!currentContent.includes('function MetricDetailDialog')) {
      throw new Error('MetricDetailDialog function not found');
    }
    
    const startIdx = currentContent.indexOf('function MetricDetailDialog');
    const dialogContentIdx = currentContent.indexOf('<DialogContent', startIdx);
    const dialogContentEnd = currentContent.indexOf('>', dialogContentIdx);
    const nextSection = currentContent.substring(dialogContentEnd + 1, dialogContentEnd + 500);
    
    // Check if fix is already applied
    if (nextSection.includes('DialogHeader') && nextSection.includes('sr-only')) {
      console.log('⚠️ Fix already applied');
      return res.json({ 
        success: true, 
        message: 'Fix already applied',
        alreadyFixed: true 
      });
    }
    
    console.log('🔧 Applying fix...');
    
    // Apply the fix
    let newContent = currentContent;
    
    // 1. Change visible DialogTitle to h2
    const visibleTitlePattern = '<DialogTitle className="text-2xl font-bold mb-2">{metric.name}</DialogTitle>';
    if (newContent.includes(visibleTitlePattern)) {
      newContent = newContent.replace(
        visibleTitlePattern,
        '<h2 className="text-2xl font-bold mb-2">{metric.name}</h2>'
      );
      console.log('✅ Changed visible DialogTitle to h2');
    }
    
    // 2. Insert hidden DialogHeader after DialogContent opening
    const fixToInsert = `\n        {/* CRITICAL: DialogHeader with DialogTitle for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>{metric.name}</DialogTitle>
        </DialogHeader>

        {/* Visual header (not using DialogTitle component) */}`;
    
    const insertPosition = dialogContentEnd + 1;
    newContent = newContent.substring(0, insertPosition) + fixToInsert + newContent.substring(insertPosition);
    
    console.log('✅ Fix applied to content');
    
    // Step 3: Push to GitHub
    console.log('🚀 Pushing fix to GitHub...');
    
    const encodedContent = Buffer.from(newContent).toString('base64');
    const pushPayload = {
      message: '🚨 EMERGENCY: Fix metric card dialog crash - add required DialogHeader',
      content: encodedContent,
      sha: sha,
      branch: BRANCH
    };
    
    const pushResponse = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pushPayload)
    });
    
    if (!pushResponse.ok) {
      const errorData = await pushResponse.text();
      throw new Error(`Push failed: ${pushResponse.status} - ${errorData}`);
    }
    
    const result = await pushResponse.json();
    
    console.log('✅✅✅ SUCCESS! FIX PUSHED TO GITHUB!');
    console.log('✅ New SHA:', result.content.sha);
    console.log('✅ Commit URL:', result.commit.html_url);
    
    res.json({
      success: true,
      message: 'Fix pushed successfully to GitHub',
      sha: result.content.sha,
      commitUrl: result.commit.html_url,
      deploymentInfo: {
        message: 'Cloudflare Pages will auto-deploy in 2-3 minutes',
        monitorUrl: 'https://github.com/ReflectivEI/dev_projects_full-build2/actions',
        productionUrl: 'https://reflectivai-app-prod.pages.dev/'
      }
    });
    
  } catch (error: any) {
    console.error('❌ ERROR:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
