#!/usr/bin/env node
/**
 * CRITICAL DEPLOYMENT SCRIPT
 * Pushes all changes to GitHub: ReflectivEI/dev_projects_full-build2
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

const GITHUB_TOKEN = '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';
const GITHUB_REPO = 'ReflectivEI/dev_projects_full-build2';
const AUTH_URL = `https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git`;

console.log('\n🚀 CRITICAL DEPLOYMENT STARTING...\n');
console.log('📦 Repository:', GITHUB_REPO);
console.log('');

try {
  // Configure git
  console.log('⚙️  Configuring git...');
  try {
    execSync('git config user.email "airo@reflectivai.com"');
    execSync('git config user.name "Airo Deploy"');
    console.log('✅ Git configured');
  } catch (e) {
    console.log('⚠️  Git config warning (may already be set):', e.message);
  }

  // Check/set remote
  console.log('\n🔗 Setting up remote...');
  try {
    const currentRemote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    console.log('📍 Current remote:', currentRemote);
    
    if (!currentRemote.includes(GITHUB_REPO)) {
      console.log('🔄 Updating remote URL...');
      execSync(`git remote set-url origin https://github.com/${GITHUB_REPO}.git`);
    }
  } catch (e) {
    console.log('➕ Adding remote...');
    execSync(`git remote add origin https://github.com/${GITHUB_REPO}.git`);
  }
  console.log('✅ Remote configured');

  // Check for uncommitted changes
  console.log('\n🔍 Checking for changes...');
  let hasChanges = false;
  try {
    execSync('git diff-index --quiet HEAD --');
    console.log('✅ No uncommitted changes');
  } catch (e) {
    hasChanges = true;
    console.log('📝 Found uncommitted changes, committing...');
    execSync('git add -A');
    execSync('git commit -m "CRITICAL: Deploy behavioral metrics and HCP mood/opening scene display"');
    console.log('✅ Changes committed');
  }

  // Push to GitHub
  console.log('\n⬆️  Pushing to GitHub...');
  console.log('🎯 Target:', GITHUB_REPO);
  
  const pushCommand = `git push "${AUTH_URL}" main`;
  execSync(pushCommand, { stdio: 'inherit' });

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ ✅ ✅  SUCCESSFULLY PUSHED TO GITHUB!  ✅ ✅ ✅');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('🚀 Cloudflare Pages will auto-deploy from GitHub Actions');
  console.log('🌐 Your site: https://reflectivai-app-prod.pages.dev');
  console.log('');
  console.log('⏱️  Deployment takes 2-3 minutes');
  console.log(`📊 Check status: https://github.com/${GITHUB_REPO}/actions`);
  console.log('');
  console.log('🎉 ALL YOUR 45 HOURS OF WORK IS NOW DEPLOYING!');
  console.log('');

} catch (error) {
  console.error('\n❌ DEPLOYMENT FAILED');
  console.error('Error:', error.message);
  console.error('\nStack:', error.stack);
  
  console.log('\n📋 MANUAL DEPLOYMENT INSTRUCTIONS:');
  console.log('1. Download your code from Airo (Download button)');
  console.log('2. Extract the ZIP file');
  console.log('3. Open terminal in that folder');
  console.log('4. Run:');
  console.log(`   git remote add origin https://github.com/${GITHUB_REPO}.git`);
  console.log('   git add -A');
  console.log('   git commit -m "Deploy: Behavioral metrics"');
  console.log(`   git push https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git main`);
  
  process.exit(1);
}
