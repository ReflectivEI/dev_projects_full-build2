#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const functionsDir = path.join(__dirname, '..', 'functions');
const distFunctionsDir = path.join(__dirname, '..', 'dist', 'client', 'functions');

if (fs.existsSync(functionsDir)) {
  console.log('📦 Copying functions/ to dist/client/functions/');
  
  // Create dist/client/functions directory
  if (!fs.existsSync(distFunctionsDir)) {
    fs.mkdirSync(distFunctionsDir, { recursive: true });
  }
  
  // Copy all files from functions/ to dist/client/functions/
  const files = fs.readdirSync(functionsDir);
  files.forEach(file => {
    const src = path.join(functionsDir, file);
    const dest = path.join(distFunctionsDir, file);
    fs.copyFileSync(src, dest);
    console.log(`  ✅ Copied ${file}`);
  });
  
  console.log('\n✅ Functions prepared for Cloudflare Pages deployment!');
} else {
  console.log('⚠️  No functions/ directory found');
}
