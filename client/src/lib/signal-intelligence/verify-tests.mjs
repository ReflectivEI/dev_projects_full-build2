import { scoreConversation, round1, averageApplicable } from './scoring.ts';

console.log('Running verification tests...');

// Test 1: round1
const test1 = round1(3.14159) === 3.1;
console.log('✓ Test round1:', test1 ? 'PASS' : 'FAIL');

// Test 2: Optional metric exclusion (no objections)
const transcript1 = [
  { speaker: 'rep', text: 'How can I help you?' },
  { speaker: 'customer', text: 'I am interested in your product.' }
];
const results1 = scoreConversation(transcript1);
const objection1 = results1.find(r => r.id === 'objection_navigation');
const test2 = objection1?.not_applicable === true;
console.log('✓ Test optional metric (no objections):', test2 ? 'PASS' : 'FAIL');

// Test 3: Objection present
const transcript2 = [
  { speaker: 'customer', text: 'I am concerned about the cost.' },
  { speaker: 'rep', text: 'I understand your concern.' }
];
const results2 = scoreConversation(transcript2);
const objection2 = results2.find(r => r.id === 'objection_navigation');
const test3 = objection2?.not_applicable === false;
console.log('✓ Test optional metric (with objections):', test3 ? 'PASS' : 'FAIL');

// Test 4: acknowledgment_of_concerns applicability
const transcript3 = [
  { speaker: 'rep', text: 'What are your goals?' },
  { speaker: 'customer', text: 'We want to improve efficiency.' }
];
const results3 = scoreConversation(transcript3);
const listening3 = results3.find(r => r.id === 'listening_responsiveness');
const concern3 = listening3?.components.find(c => c.name === 'acknowledgment_of_concerns');
const test4 = concern3?.applicable === false;
console.log('✓ Test acknowledgment_of_concerns (no concerns):', test4 ? 'PASS' : 'FAIL');

// Test 5: All 8 metrics present
const test5 = results1.length === 8;
console.log('✓ Test all 8 metrics present:', test5 ? 'PASS' : 'FAIL');

const allPassed = test1 && test2 && test3 && test4 && test5;
console.log('\n' + (allPassed ? '✅ All tests PASSED' : '❌ Some tests FAILED'));
process.exit(allPassed ? 0 : 1);
