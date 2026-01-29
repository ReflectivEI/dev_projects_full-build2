#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync } from 'fs';

const GITHUB_TOKEN = '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';

console.log('🚀 Starting GitHub deployment...');

try {
  // Configure git
  console.log('⚙️  Configuring git...');
  execSync('git config user.email "airo@reflectivai.com"', { stdio: 'inherit' });
  execSync('git config user.name "Airo Deploy"', { stdio: 'inherit' });

  // Get current remote
  let repoUrl;
  try {
    repoUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    console.log('📦 Repository:', repoUrl);
  } catch (e) {
    console.error('❌ No git remote found');
    process.exit(1);
  }

  // Extract repo path
  const match = repoUrl.match(/github\.com[:\/](.+?)(\.git)?$/);
  if (!match) {
    console.error('❌ Not a GitHub repository');
    process.exit(1);
  }
  const repoPath = match[1];
  console.log('📂 Repo path:', repoPath);

  // Check for uncommitted changes
  console.log('🔍 Checking for changes...');
  try {
    execSync('git diff-index --quiet HEAD --');
    console.log('✅ No uncommitted changes');
  } catch (e) {
    console.log('📝 Committing changes...');
    execSync('git add -A', { stdio: 'inherit' });
    execSync('git commit -m "Deploy: Behavioral metrics real-time calculation and HCP mood/opening scene display"', { stdio: 'inherit' });
  }

  // Construct authenticated URL
  const authUrl = `https://${GITHUB_TOKEN}@github.com/${repoPath}.git`;

  // Push to GitHub
  console.log('⬆️  Pushing to GitHub...');
  execSync(`git push "${authUrl}" main`, { stdio: 'inherit' });

  console.log('\n✅ Successfully pushed to GitHub!');
  console.log('🚀 Cloudflare Pages will auto-deploy from GitHub Actions');
  console.log('🌐 Your site: https://reflectivai-app-prod.pages.dev');
  console.log('');
  console.log('⏱️  Deployment usually takes 2-3 minutes');
  console.log(`📊 Check status: https://github.com/${repoPath}/actions`);

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
