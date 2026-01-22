// READ-ONLY Worker Contract Verification Probe
// This script sends a minimal roleplay end request to production
// and logs the raw response structure

const WORKER_URL = 'https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev';

const minimalPayload = {
  messages: [
    {
      role: 'user',
      content: 'Hello, I would like to discuss treatment options for my patient.'
    },
    {
      role: 'assistant',
      content: 'Thank you for reaching out. I would be happy to discuss treatment options with you. What specific condition are you looking to address?'
    }
  ],
  scenarioId: 'contract-verification-probe'
};

async function probeWorker() {
  console.log('\n🔍 WORKER CONTRACT VERIFICATION PROBE');
  console.log('=' .repeat(60));
  console.log('Target:', WORKER_URL + '/api/roleplay/end');
  console.log('Payload:', JSON.stringify(minimalPayload, null, 2));
  console.log('=' .repeat(60));
  console.log('\n⏳ Sending request...\n');

  try {
    const response = await fetch(WORKER_URL + '/api/roleplay/end', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': `probe-${Date.now()}`
      },
      body: JSON.stringify(minimalPayload)
    });

    console.log('📡 Response Status:', response.status, response.statusText);
    console.log('\n📋 Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    const data = await response.json();

    console.log('\n' + '=' .repeat(60));
    console.log('📦 RAW RESPONSE STRUCTURE');
    console.log('=' .repeat(60));
    console.log(JSON.stringify(data, null, 2));

    console.log('\n' + '=' .repeat(60));
    console.log('🔬 CONTRACT ANALYSIS');
    console.log('=' .repeat(60));

    const topLevelKeys = Object.keys(data);
    console.log('\n✅ Top-level keys:', topLevelKeys.join(', '));

    console.log('\n🎯 Key Presence Check:');
    console.log('  - data.coach:', data.coach ? '✅ PRESENT' : '❌ MISSING');
    console.log('  - data.coach.metricResults:', data.coach?.metricResults ? '✅ PRESENT' : '❌ MISSING');
    console.log('  - data.analysis:', data.analysis ? '✅ PRESENT' : '❌ MISSING');
    console.log('  - data.analysis.eqMetrics:', data.analysis?.eqMetrics ? '✅ PRESENT' : '❌ MISSING');

    if (data.coach?.metricResults) {
      console.log('\n📊 coach.metricResults content:');
      console.log(JSON.stringify(data.coach.metricResults, null, 2));
      
      const metricKeys = Object.keys(data.coach.metricResults);
      console.log('\n  Metrics found:', metricKeys.length);
      console.log('  Metric IDs:', metricKeys.join(', '));
      
      // Check if scores are non-zero
      const nonZeroScores = metricKeys.filter(key => {
        const score = data.coach.metricResults[key];
        return typeof score === 'number' && score > 0;
      });
      console.log('  Non-zero scores:', nonZeroScores.length, '/', metricKeys.length);
    }

    if (data.coach?.overall !== undefined) {
      console.log('\n📈 coach.overall:', data.coach.overall);
    }

    console.log('\n' + '=' .repeat(60));
    console.log('🎯 VERDICT');
    console.log('=' .repeat(60));

    if (data.coach?.metricResults && Object.keys(data.coach.metricResults).length > 0) {
      console.log('\n✅ CASE 1: Worker is returning coach.metricResults');
      console.log('✅ Scoring is present');
      console.log('➡️  UI issue is 100% frontend cache or adapter guard');
      console.log('\n📋 RECOMMENDATION:');
      console.log('   1. Hard refresh browser (Ctrl+Shift+R)');
      console.log('   2. Clear browser cache');
      console.log('   3. Verify adapter is running (check for [WORKER ADAPTER] logs)');
    } else if (data.analysis?.eqMetrics) {
      console.log('\n⚠️  CASE 2: Response has analysis.eqMetrics');
      console.log('⚠️  You are hitting a different backend than expected');
      console.log('➡️  Environment mismatch (wrong Worker / preview / proxy)');
    } else if (data.coach && Object.keys(data.coach.metricResults || {}).length === 0) {
      console.log('\n❌ CASE 3: coach.metricResults is empty');
      console.log('❌ Worker scoring failed or fallback executed');
      console.log('➡️  This is the only case where Worker needs attention');
    } else {
      console.log('\n❓ UNEXPECTED: Response structure does not match any known case');
      console.log('➡️  Manual inspection required');
    }

    console.log('\n' + '=' .repeat(60));
    console.log('✅ PROBE COMPLETE');
    console.log('=' .repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack:', error.stack);
  }
}

probeWorker();
