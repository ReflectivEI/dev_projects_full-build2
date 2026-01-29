#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 EMERGENCY PUSH - RESTORING WORKFLOW FILE');

// Check if workflow file exists
const workflowPath = '.github/workflows/deploy-to-cloudflare.yml';
if (!fs.existsSync(workflowPath)) {
    console.error('❌ ERROR: Workflow file not found!');
    process.exit(1);
}

console.log('✅ Workflow file exists');
console.log('📄 File size:', fs.statSync(workflowPath).size, 'bytes');

try {
    // Configure git
    console.log('⚙️  Configuring git...');
    execSync('git config user.email "airo@godaddy.com"', { stdio: 'inherit' });
    execSync('git config user.name "Airo Builder"', { stdio: 'inherit' });

    // Add workflow file
    console.log('📝 Adding workflow file to git...');
    execSync('git add .github/workflows/deploy-to-cloudflare.yml', { stdio: 'inherit' });
    execSync('git add public/_redirects', { stdio: 'inherit' });
    execSync('git add dist/client/_redirects', { stdio: 'inherit' });

    // Commit
    console.log('💾 Committing changes...');
    try {
        execSync('git commit -m "RESTORE: Workflow + Fixed _redirects (single spaces)"', { stdio: 'inherit' });
    } catch (e) {
        console.log('ℹ️  No changes to commit or already committed');
    }

    // Check status
    console.log('🔍 Git status:');
    execSync('git status', { stdio: 'inherit' });

    // Push to GitHub
    console.log('📤 Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });

    console.log('\n✅ SUCCESS! WORKFLOW PUSHED TO GITHUB!');
    console.log('🔗 Check: https://github.com/ReflectivEI/dev_projects_full-build2/tree/main/.github/workflows');
    console.log('🔗 Actions: https://github.com/ReflectivEI/dev_projects_full-build2/actions');

} catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
}
