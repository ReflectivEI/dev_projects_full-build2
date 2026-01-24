import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const GITHUB_TOKEN = '***REMOVED***';
  const REPO = 'ReflectivEI/dev_projects_full-build2';
  const BRANCH = 'main';

  console.log('🚨🚨🚨 EMERGENCY FIX - SCANNING ALL FILES 🚨🚨🚨');

  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ReflectivAI-Emergency-Fix'
  };

  // List of ALL possible files to check
  const filesToCheck = [
    'client/src/pages/ei-metrics.tsx',
    'client/src/pages/dashboard.tsx',
    'client/src/pages/projects.tsx',
    'client/src/pages/project-card.tsx',
    'client/src/pages/roleplay.tsx',
    'client/src/pages/knowledge.tsx',
    'client/src/components/ProjectCard.tsx',
    'client/src/components/MetricCard.tsx'
  ];

  const results = [];
  const fixedFiles = [];

  try {
    for (const filePath of filesToCheck) {
      console.log(`\n🔍 Checking: ${filePath}`);
      
      const url = `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`;
      const response = await fetch(url, { headers });
      
      if (response.status === 404) {
        console.log(`  ⚠️  File not found, skipping`);
        continue;
      }
      
      if (!response.ok) {
        console.log(`  ❌ Error fetching: ${response.status}`);
        continue;
      }
      
      const fileData = await response.json();
      const sha = fileData.sha;
      const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
      
      console.log(`  ✅ Fetched (${currentContent.length} bytes)`);
      
      let newContent = currentContent;
      let fixApplied = false;
      const fixes = [];
      
      // FIX 1: Find ALL Dialog components with DialogTitle but no DialogHeader
      const dialogRegex = /<Dialog[^>]*>([\s\S]*?)<\/Dialog>/g;
      let dialogMatch;
      
      while ((dialogMatch = dialogRegex.exec(currentContent)) !== null) {
        const dialogContent = dialogMatch[1];
        const dialogStart = dialogMatch.index;
        
        // Check if this Dialog has DialogTitle but no DialogHeader
        if (dialogContent.includes('<DialogTitle') && !dialogContent.includes('<DialogHeader')) {
          console.log(`  🔧 Found Dialog without DialogHeader!`);
          
          // Find DialogContent opening
          const contentMatch = dialogContent.match(/<DialogContent[^>]*>/);
          if (contentMatch) {
            const contentTag = contentMatch[0];
            const contentIndex = dialogContent.indexOf(contentTag);
            const contentEnd = contentIndex + contentTag.length;
            
            // Find the DialogTitle
            const titleMatch = dialogContent.match(/<DialogTitle[^>]*>([\s\S]*?)<\/DialogTitle>/);
            if (titleMatch) {
              const titleContent = titleMatch[1];
              const titleElement = titleMatch[0];
              
              // Create the fix
              const fixToInsert = `\n        {/* EMERGENCY FIX: DialogHeader required for accessibility */}
        <DialogHeader className="sr-only">
          <DialogTitle>${titleContent}</DialogTitle>
        </DialogHeader>
        `;
              
              // Find where to insert (after DialogContent opening)
              const insertPoint = dialogStart + contentEnd;
              
              // Remove the old DialogTitle
              newContent = newContent.replace(titleElement, '');
              
              // Insert the new DialogHeader with DialogTitle
              const beforeInsert = newContent.substring(0, insertPoint);
              const afterInsert = newContent.substring(insertPoint);
              newContent = beforeInsert + fixToInsert + afterInsert;
              
              fixApplied = true;
              fixes.push('Added DialogHeader wrapper');
              console.log(`  ✅ Fixed Dialog component`);
            }
          }
        }
      }
      
      // FIX 2: Check for specific MetricDetailDialog pattern
      if (currentContent.includes('function MetricDetailDialog')) {
        const startIdx = currentContent.indexOf('function MetricDetailDialog');
        const dialogContentIdx = currentContent.indexOf('<DialogContent', startIdx);
        if (dialogContentIdx > 0) {
          const dialogContentEnd = currentContent.indexOf('>', dialogContentIdx);
          const nextSection = currentContent.substring(dialogContentEnd + 1, dialogContentEnd + 500);
          
          if (!nextSection.includes('DialogHeader') || !nextSection.includes('sr-only')) {
            console.log(`  🔧 Fixing MetricDetailDialog...`);
            
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
            fixes.push('Fixed MetricDetailDialog');
            console.log(`  ✅ Fixed MetricDetailDialog`);
          }
        }
      }
      
      // If we made changes, push them
      if (fixApplied) {
        console.log(`  🚀 Pushing fixes for ${filePath}...`);
        
        const encodedContent = Buffer.from(newContent).toString('base64');
        const pushPayload = {
          message: `🚨 EMERGENCY: ${fixes.join(', ')} in ${filePath}`,
          content: encodedContent,
          sha: sha,
          branch: BRANCH
        };
        
        const pushResponse = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pushPayload)
        });
        
        if (pushResponse.ok) {
          const result = await pushResponse.json();
          console.log(`  ✅✅✅ PUSHED! New SHA: ${result.content.sha}`);
          fixedFiles.push({
            file: filePath,
            fixes: fixes,
            commitUrl: result.commit.html_url
          });
        } else {
          console.log(`  ❌ Push failed: ${pushResponse.status}`);
        }
      } else {
        console.log(`  ✅ No fixes needed`);
      }
    }
    
    if (fixedFiles.length === 0) {
      return res.json({
        success: true,
        message: 'All files are already correct - no fixes needed',
        filesChecked: filesToCheck.length,
        filesFixed: 0
      });
    }
    
    console.log('\n✅✅✅ ALL FIXES PUSHED! ✅✅✅');
    
    res.json({
      success: true,
      message: `Fixed ${fixedFiles.length} file(s)`,
      filesChecked: filesToCheck.length,
      filesFixed: fixedFiles.length,
      fixedFiles: fixedFiles,
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
