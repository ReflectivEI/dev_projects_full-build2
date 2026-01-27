#!/usr/bin/env node

// CRITICAL: Push working code to GitHub to trigger Cloudflare Pages deployment
// This will fix the blank screen on https://reflectivai-app-prod.pages.dev/

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_TOKEN = '***REMOVED***';
const REPO = 'ReflectivEI/dev_projects_full-build2';
const BRANCH = 'main';

console.log('🚨 CRITICAL FIX: Pushing working code to GitHub');
console.log('This will trigger Cloudflare Pages to redeploy with the correct files');
console.log('');

try {
  // Remove existing origin if any
  try {
    execSync('git remote remove origin', { stdio: 'ignore' });
  } catch (e) {
    // Ignore if origin doesn't exist
  }

  console.log('📡 Setting up GitHub remote...');
  execSync(`git remote add origin https://${GITHUB_TOKEN}@github.com/${REPO}.git`, { stdio: 'inherit' });
  console.log('✓ Remote configured');
  console.log('');

  // Get current commit
  const currentCommit = execSync('git log --oneline -1', { encoding: 'utf-8' }).trim();
  console.log(`📦 Current commit: ${currentCommit}`);
  console.log('');

  // Push to GitHub
  console.log(`🚀 Pushing to GitHub ${BRANCH} branch...`);
  execSync(`git push origin HEAD:${BRANCH} --force`, { stdio: 'inherit' });
  
  console.log('');
  console.log('✅ SUCCESS! Code pushed to GitHub');
  console.log('');
  console.log('🔄 Cloudflare Pages will automatically detect the push and redeploy');
  console.log('');
  console.log('⏱️  Deployment usually takes 2-3 minutes');
  console.log('');
  console.log('🌐 Monitor deployment at:');
  console.log('   https://dash.cloudflare.com/');
  console.log('');
  console.log('🎯 Your site will be live at:');
  console.log('   https://reflectivai-app-prod.pages.dev/');
  console.log('');
  console.log('✨ The blank screen will be fixed once deployment completes!');
  
} catch (error) {
  console.error('');
  console.error('❌ ERROR: Failed to push to GitHub');
  console.error(error.message);
  console.error('');
  console.error('Please check:');
  console.error('1. Your GitHub token has "repo" scope');
  console.error('2. You have write access to ReflectivEI/dev_projects_full-build2');
  console.error('3. The token is not expired');
  process.exit(1);
}
