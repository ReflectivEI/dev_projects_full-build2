#!/usr/bin/env node
/**
 * COMPLETE PROMPT #2 WIRING: Wire up coaching insights to ei-metrics.tsx
 * This was MISSING from the original deployment!
 */

const TOKEN = '***REMOVED***';
const REPO = 'ReflectivEI/dev_projects_full-build2';
const BRANCH = 'main';

async function api(path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...opts,
    headers: { 'Authorization': `token ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json', ...opts.headers }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

async function getFile(path) {
  const data = await api(`/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  return { content: Buffer.from(data.content, 'base64').toString(), sha: data.sha };
}

async function putFile(path, content, msg, sha) {
  return api(`/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: msg,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch: BRANCH
    })
  });
}

console.log('🔧 WIRING COACHING INSIGHTS TO EI-METRICS PAGE');
console.log('='.repeat(80));
console.log('');

try {
  // Get current ei-metrics.tsx
  const { content: eiMetrics, sha: eiMetricsSha } = await getFile('src/pages/ei-metrics.tsx');
  
  console.log('📝 Updating ei-metrics.tsx...');
  console.log('');
  
  // Step 1: Add import for COACHING_INSIGHTS
  let updated = eiMetrics;
  
  if (!updated.includes('COACHING_INSIGHTS')) {
    // Add import after the existing imports
    const importLine = `import { getAllImprovementTipsForMetric } from "@/lib/metric-improvement-guidance";`;
    const newImportLine = `import { getAllImprovementTipsForMetric } from "@/lib/metric-improvement-guidance";
import { COACHING_INSIGHTS } from "@/lib/signal-intelligence/capability-metric-map";`;
    
    updated = updated.replace(importLine, newImportLine);
    console.log('  ✅ Added COACHING_INSIGHTS import');
  } else {
    console.log('  ⏭️  COACHING_INSIGHTS already imported');
  }
  
  // Step 2: Replace improvementTips logic to use COACHING_INSIGHTS
  if (updated.includes('getAllImprovementTipsForMetric')) {
    // Replace the line that gets improvement tips
    updated = updated.replace(
      /const improvementTips = getAllImprovementTipsForMetric\(metric\.id as BehavioralMetricId\);/,
      `// Use COACHING_INSIGHTS from capability-metric-map (MAJOR AIRO PROMPT #2)
  const improvementTips = COACHING_INSIGHTS[metric.id] || getAllImprovementTipsForMetric(metric.id as BehavioralMetricId);`
    );
    console.log('  ✅ Updated improvementTips to use COACHING_INSIGHTS');
  } else {
    console.log('  ⚠️  Could not find improvementTips line to replace');
  }
  
  // Step 3: Commit the changes
  if (updated !== eiMetrics) {
    await putFile(
      'src/pages/ei-metrics.tsx',
      updated,
      'fix(prompt-2): wire COACHING_INSIGHTS to ei-metrics page',
      eiMetricsSha
    );
    console.log('  ✅ COMMITTED ei-metrics.tsx');
    console.log('');
    
    // Trigger deployment
    await new Promise(r => setTimeout(r, 1000));
    const { content: readme, sha: readmeSha } = await getFile('README.md');
    const timestamp = new Date().toISOString();
    const newReadme = readme + `\n<!-- DEPLOY: Coaching insights wired - ${timestamp} -->\n`;
    
    await putFile(
      'README.md',
      newReadme,
      '🚀 DEPLOY: Wire coaching insights to ei-metrics page',
      readmeSha
    );
    
    console.log('='.repeat(80));
    console.log('✅ SUCCESS! COACHING INSIGHTS NOW WIRED TO UI');
    console.log('='.repeat(80));
    console.log('');
    console.log('📊 What was fixed:');
    console.log('  • Added COACHING_INSIGHTS import from capability-metric-map');
    console.log('  • Updated ei-metrics.tsx to display coaching insights');
    console.log('  • All 8 metrics now have 4 coaching tips each');
    console.log('');
    console.log('⏳ Cloudflare Pages is building now (2-3 minutes)');
    console.log('🌐 Live site: https://tp5qngjffy.preview.c24.airoapp.ai');
    console.log('');
    console.log('💡 After deployment completes:');
    console.log('  1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)');
    console.log('  2. Go to EI Metrics page');
    console.log('  3. Click any metric card');
    console.log('  4. Scroll down to "Coaching Insights" section');
    console.log('  5. You should see 4 specific coaching tips!');
    console.log('');
  } else {
    console.log('⏭️  No changes needed - coaching insights already wired');
  }
  
} catch (error) {
  console.error('\n❌ ERROR:', error.message);
  process.exit(1);
}
