// EMERGENCY FIX - Push to GitHub using Node.js
const https = require('https');

const GITHUB_TOKEN = '***REMOVED***';
const REPO = 'ReflectivEI/dev_projects_full-build2';
const FILE_PATH = 'client/src/pages/knowledge.tsx';
const BRANCH = 'main';

const options = {
  hostname: 'api.github.com',
  path: `/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Node.js'
  }
};

console.log('🚨 EMERGENCY FIX - Fetching current file...');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error('❌ ERROR:', res.statusCode, data);
      process.exit(1);
    }
    
    const fileData = JSON.parse(data);
    const sha = fileData.sha;
    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    
    console.log('✅ Current SHA:', sha);
    console.log('✅ File size:', currentContent.length, 'bytes');
    
    // Apply the fix
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
    
    let newContent;
    if (currentContent.includes(oldPattern)) {
      newContent = currentContent.replace(oldPattern, newCode);
      console.log('✅ Fix applied!');
    } else {
      console.error('❌ Pattern not found in file');
      process.exit(1);
    }
    
    // Push the fix
    console.log('🚀 Pushing fix to GitHub...');
    
    const encodedContent = Buffer.from(newContent).toString('base64');
    const payload = JSON.stringify({
      message: '🚨 EMERGENCY: Knowledge Base - Handle plain text Worker responses',
      content: encodedContent,
      sha: sha,
      branch: BRANCH
    });
    
    const pushOptions = {
      hostname: 'api.github.com',
      path: `/repos/${REPO}/contents/${FILE_PATH}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Node.js',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    
    const pushReq = https.request(pushOptions, (pushRes) => {
      let pushData = '';
      
      pushRes.on('data', (chunk) => {
        pushData += chunk;
      });
      
      pushRes.on('end', () => {
        if (pushRes.statusCode === 200 || pushRes.statusCode === 201) {
          const result = JSON.parse(pushData);
          console.log('✅ FIX PUSHED SUCCESSFULLY!');
          console.log('✅ New SHA:', result.content.sha);
          console.log('✅ Commit:', result.commit.html_url);
          console.log('');
          console.log('=' .repeat(60));
          console.log('🎯 NEXT STEPS:');
          console.log('=' .repeat(60));
          console.log('1. ⏱️  WAIT 2-3 MINUTES for deployment');
          console.log('2. 🔄 HARD REFRESH: Ctrl+Shift+R');
          console.log('3. 🧪 TEST: https://reflectivai-app-prod.pages.dev/knowledge');
          console.log('=' .repeat(60));
          console.log('✅ YOUR PRESENTATION IS SAVED!');
          console.log('=' .repeat(60));
        } else {
          console.error('❌ Push failed:', pushRes.statusCode, pushData);
          process.exit(1);
        }
      });
    });
    
    pushReq.on('error', (error) => {
      console.error('❌ Request error:', error);
      process.exit(1);
    });
    
    pushReq.write(payload);
    pushReq.end();
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error);
  process.exit(1);
});

req.end();
