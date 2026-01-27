#!/usr/bin/env node

/**
 * EMERGENCY: Deploy to Cloudflare Pages using API
 * This bypasses the webhook and forces a deployment
 */

import https from 'https';
import { execSync } from 'child_process';

const GITHUB_TOKEN = '***REMOVED***';
const REPO_OWNER = 'ReflectivEI';
const REPO_NAME = 'dev_projects_full-build2';
const BRANCH = 'main';

console.log('🚨 EMERGENCY CLOUDFLARE DEPLOYMENT');
console.log('===================================');
console.log('');

// Step 1: Create a dummy file to trigger webhook
console.log('📝 Step 1: Creating deployment trigger file...');

const timestamp = new Date().toISOString();
const triggerContent = `# Cloudflare Deployment Trigger\n\nDeployment requested at: ${timestamp}\n\nThis file forces Cloudflare Pages webhook to detect changes.\n`;

try {
  // Get current file SHA if it exists
  const getFileOptions = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/.cloudflare-deploy`,
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  let fileSha = null;

  await new Promise((resolve, reject) => {
    const req = https.request(getFileOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const fileData = JSON.parse(data);
          fileSha = fileData.sha;
          console.log('  ✓ Found existing trigger file');
        } else {
          console.log('  ℹ No existing trigger file (will create new)');
        }
        resolve();
      });
    });
    req.on('error', reject);
    req.end();
  });

  // Create or update the file
  const updateFileOptions = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/contents/.cloudflare-deploy`,
    method: 'PUT',
    headers: {
      'User-Agent': 'Node.js',
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  };

  const payload = {
    message: `🚀 EMERGENCY: Force Cloudflare deployment at ${timestamp}`,
    content: Buffer.from(triggerContent).toString('base64'),
    branch: BRANCH
  };

  if (fileSha) {
    payload.sha = fileSha;
  }

  await new Promise((resolve, reject) => {
    const req = https.request(updateFileOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          console.log('  ✓ Trigger file committed to GitHub');
          console.log(`  ✓ Commit: ${result.commit.html_url}`);
          resolve();
        } else {
          console.error(`  ✗ Failed: HTTP ${res.statusCode}`);
          console.error(`  Response: ${data}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(payload));
    req.end();
  });

  console.log('');
  console.log('✅ SUCCESS! Deployment trigger committed to GitHub');
  console.log('');
  console.log('🔄 Cloudflare Pages webhook should detect this change');
  console.log('');
  console.log('⏱️  Expected deployment time: 2-3 minutes');
  console.log('');
  console.log('🌐 Monitor deployment:');
  console.log('   • GitHub Actions: https://github.com/ReflectivEI/dev_projects_full-build2/actions');
  console.log('   • Cloudflare Dashboard: https://dash.cloudflare.com/');
  console.log('');
  console.log('🎯 Your site: https://reflectivai-app-prod.pages.dev/');
  console.log('');
  console.log('💡 If site still shows blank screen after 3 minutes:');
  console.log('   1. Go to Cloudflare Dashboard');
  console.log('   2. Pages → reflectivai-app-prod');
  console.log('   3. Click "View build" to check for errors');
  console.log('');

} catch (error) {
  console.error('');
  console.error('❌ DEPLOYMENT FAILED');
  console.error(error.message);
  console.error('');
  console.error('🔧 ALTERNATIVE: Manual Cloudflare Dashboard Deploy');
  console.error('   1. Go to: https://dash.cloudflare.com/');
  console.error('   2. Navigate to: Pages → reflectivai-app-prod');
  console.error('   3. Click: "Create deployment"');
  console.error('   4. Select branch: main');
  console.error('   5. Click: "Save and Deploy"');
  console.error('');
  process.exit(1);
}
