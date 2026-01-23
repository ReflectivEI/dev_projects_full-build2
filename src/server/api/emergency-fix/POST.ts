import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  // Fresh token from user
  const GITHUB_TOKEN = '***REMOVED***';
  
  const REPO = 'ReflectivEI/dev_projects_full-build2';
  const BRANCH = 'main';

  // Get file path from request body, default to ei-metrics
  const FILE_PATH = req.body?.filePath || 'client/src/pages/ei-metrics.tsx';
  
  console.log('🔑 Using GitHub token...');
  console.log('📁 Target file:', FILE_PATH);

  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ReflectivAI-Emergency-Fix'
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
    console.log('📄 File size:', currentContent.length, 'bytes');
    
    // Detect what kind of fix is needed
    let newContent = currentContent;
    let fixApplied = false;
    let fixDescription = '';
    
    // FIX 1: MetricDetailDialog - DialogHeader issue
    if (currentContent.includes('function MetricDetailDialog')) {
      const startIdx = currentContent.indexOf('function MetricDetailDialog');
      const dialogContentIdx = currentContent.indexOf('<DialogContent', startIdx);
      const dialogContentEnd = currentContent.indexOf('>', dialogContentIdx);
      const nextSection = currentContent.substring(dialogContentEnd + 1, dialogContentEnd + 500);
      
      if (!nextSection.includes('DialogHeader') || !nextSection.includes('sr-only')) {
        console.log('🔧 Applying MetricDetailDialog fix...');
        
        // Change visible DialogTitle to h2
        const visibleTitlePattern = '<DialogTitle className="text-2xl font-bold mb-2">{metric.name}</DialogTitle>';
        if (newContent.includes(visibleTitlePattern)) {
          newContent = newContent.replace(
            visibleTitlePattern,
            '<h2 className="text-2xl font-bold mb-2">{metric.name}</h2>'
          );
        }
        
        // Insert hidden DialogHeader
        const fixToInsert = `\n        {/* CRITICAL: DialogHeader with DialogTitle for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>{metric.name}</DialogTitle>
        </DialogHeader>

        {/* Visual header */}`;
        
        const insertPosition = dialogContentEnd + 1;
        newContent = newContent.substring(0, insertPosition) + fixToInsert + newContent.substring(insertPosition);
        
        fixApplied = true;
        fixDescription = 'Added DialogHeader wrapper to MetricDetailDialog';
        console.log('✅', fixDescription);
      }
    }
    
    // FIX 2: Any Dialog component missing DialogHeader
    const dialogMatches = currentContent.matchAll(/<Dialog[^>]*>[\s\S]*?<DialogContent[^>]*>/g);
    for (const match of dialogMatches) {
      const dialogSection = match[0];
      const afterContent = currentContent.substring(match.index! + dialogSection.length, match.index! + dialogSection.length + 500);
      
      // Check if DialogTitle exists without DialogHeader
      if (afterContent.includes('<DialogTitle') && !afterContent.includes('<DialogHeader')) {
        console.log('🔧 Found Dialog with DialogTitle but no DialogHeader');
        
        // Find the DialogTitle
        const titleMatch = afterContent.match(/<DialogTitle[^>]*>([\s\S]*?)<\/DialogTitle>/);
        if (titleMatch) {
          const titleElement = titleMatch[0];
          const titleContent = titleMatch[1];
          
          // Replace with wrapped version
          const wrappedTitle = `<DialogHeader className="sr-only">
          <DialogTitle>${titleContent}</DialogTitle>
        </DialogHeader>`;
          
          newContent = newContent.replace(titleElement, wrappedTitle);
          fixApplied = true;
          fixDescription += (fixDescription ? ' + ' : '') + 'Wrapped DialogTitle in DialogHeader';
          console.log('✅ Wrapped DialogTitle in DialogHeader');
        }
      }
    }
    
    // FIX 3: Loading state issues - add error boundaries
    if (currentContent.includes('Loading...') && !currentContent.includes('ErrorBoundary')) {
      console.log('🔧 Found Loading state without error handling');
      // This is informational - we can't auto-fix without knowing the component structure
    }
    
    if (!fixApplied) {
      console.log('⚠️ No fixes needed or fix already applied');
      return res.json({ 
        success: true, 
        message: 'No fixes needed - file is already correct',
        alreadyFixed: true,
        fileAnalysis: {
          hasMetricDialog: currentContent.includes('MetricDetailDialog'),
          hasDialogHeader: currentContent.includes('DialogHeader'),
          hasLoadingState: currentContent.includes('Loading...')
        }
      });
    }
    
    // Step 3: Push to GitHub
    console.log('🚀 Pushing fix to GitHub...');
    
    const encodedContent = Buffer.from(newContent).toString('base64');
    const pushPayload = {
      message: `🚨 EMERGENCY: ${fixDescription}`,
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
      fixDescription,
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
