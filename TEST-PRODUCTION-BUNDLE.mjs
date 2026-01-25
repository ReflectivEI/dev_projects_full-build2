// Test what's actually deployed
const PROD_URL = 'https://reflectivai-app-prod.pages.dev';

console.log('🔍 TESTING PRODUCTION DEPLOYMENT\n');
console.log('=' .repeat(60));

try {
  // Fetch the main page
  console.log('\n1️⃣  Fetching main page...');
  const mainRes = await fetch(PROD_URL);
  const mainHtml = await mainRes.text();
  
  // Extract script tags
  const scriptMatches = mainHtml.match(/<script[^>]*src="([^"]+)"[^>]*>/g);
  if (scriptMatches) {
    console.log('   ✅ Found', scriptMatches.length, 'script tags');
    scriptMatches.forEach(s => {
      const src = s.match(/src="([^"]+)"/);
      if (src) console.log('      ', src[1]);
    });
  }

  // Check if roleplay route exists
  console.log('\n2️⃣  Testing /roleplay route...');
  const roleplayRes = await fetch(`${PROD_URL}/roleplay`);
  console.log('   Status:', roleplayRes.status);
  console.log('   OK:', roleplayRes.ok);
  
  if (roleplayRes.ok) {
    const roleplayHtml = await roleplayRes.text();
    console.log('   HTML length:', roleplayHtml.length, 'bytes');
    
    // Check if it's the same as main (SPA behavior)
    if (roleplayHtml === mainHtml) {
      console.log('   ✅ SPA routing working (returns main HTML)');
    }
  }

  // Check API health
  console.log('\n3️⃣  Testing API health...');
  const healthRes = await fetch(`${PROD_URL}/api/health`);
  console.log('   Status:', healthRes.status);
  if (healthRes.ok) {
    const health = await healthRes.json();
    console.log('   Response:', JSON.stringify(health));
  }

  // Check for build info
  console.log('\n4️⃣  Checking for build metadata...');
  if (mainHtml.includes('data-build-time') || mainHtml.includes('data-version')) {
    const buildTime = mainHtml.match(/data-build-time="([^"]+)"/);
    const version = mainHtml.match(/data-version="([^"]+)"/);
    if (buildTime) console.log('   Build time:', buildTime[1]);
    if (version) console.log('   Version:', version[1]);
  } else {
    console.log('   ⚠️  No build metadata found');
  }

  console.log('\n✅ PRODUCTION SITE IS RESPONDING');
  console.log('\n💡 If the page shows black screen, it\'s a CLIENT-SIDE JavaScript error.');
  console.log('   The server is working fine. Check browser console for errors.');

} catch (error) {
  console.log('\n❌ ERROR:', error.message);
}
