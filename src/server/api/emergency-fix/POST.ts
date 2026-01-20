import type { Request, Response } from 'express';

const GITHUB_TOKEN = '***REMOVED***';
const REPO = 'ReflectivEI/dev_projects_full-build2';
const FILE_PATH = 'client/src/pages/knowledge.tsx';
const BRANCH = 'main';

export default async function handler(req: Request, res: Response) {
  try {
    console.log('🚨 EMERGENCY FIX - Starting...');
    
    // Step 1: Get current file
    const getUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ReflectivAI-Emergency-Fix'
      }
    });
    
    if (!getResponse.ok) {
      throw new Error(`Failed to fetch file: ${getResponse.status}`);
    }
    
    const fileData = await getResponse.json();
    const sha = fileData.sha;
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    
    console.log('✅ Fetched file, SHA:', sha);
    
    // Step 2: Apply the fix
    const oldPattern = `      const data = await response.json();
      setAiAnswer(data.answer || 'No answer provided');`;
    
    const newCode = `      // EMERGENCY FIX: Handle both JSON and plain text responses
      const responseText = await response.text();
      console.log('🔍 Raw Worker response:', responseText);
      
      // Try to parse as JSON first
      let finalAnswer;
      try {
        const data = JSON.parse(responseText);
        finalAnswer = data.answer || data.message || responseText;
        console.log('✅ Parsed as JSON');
      } catch (jsonError) {
        // If not JSON, use raw text as answer
        console.log('⚠️  Not JSON, using raw text as answer');
        finalAnswer = responseText;
      }
      
      setAiAnswer(finalAnswer || 'No answer provided');`;
    
    if (!currentContent.includes(oldPattern)) {
      return res.status(400).json({ error: 'Pattern not found in file' });
    }
    
    const newContent = currentContent.replace(oldPattern, newCode);
    console.log('✅ Fix applied');
    
    // Step 3: Push to GitHub
    const encodedContent = Buffer.from(newContent).toString('base64');
    const putUrl = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
    
    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'ReflectivAI-Emergency-Fix',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: '🚨 EMERGENCY: Knowledge Base - Handle plain text Worker responses',
        content: encodedContent,
        sha: sha,
        branch: BRANCH
      })
    });
    
    if (!putResponse.ok) {
      const errorData = await putResponse.text();
      throw new Error(`Failed to push: ${putResponse.status} - ${errorData}`);
    }
    
    const result = await putResponse.json();
    console.log('✅ FIX PUSHED!', result.commit.html_url);
    
    res.json({
      success: true,
      message: 'Fix pushed successfully!',
      commitUrl: result.commit.html_url,
      newSha: result.content.sha
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: 'Failed to apply fix',
      message: error instanceof Error ? error.message : String(error)
    });
  }
}
