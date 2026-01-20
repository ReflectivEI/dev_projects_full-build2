const aiMessage = 'Active listening is a crucial skill in stakeholder conversations, allowing you to fully engage with the healthcare professional and understand their concerns. It involves paying attention to observable interaction signals, such as verbal cues, conversational patterns, and engagement levels.';

let parsed = null;
try {
  parsed = JSON.parse(aiMessage);
  console.log('Strategy 1 SUCCESS:', parsed);
} catch {
  const codeBlockMatch = aiMessage.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      parsed = JSON.parse(codeBlockMatch[1].trim());
      console.log('Strategy 2 SUCCESS:', parsed);
    } catch {}
  }
  if (!parsed) {
    const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
        console.log('Strategy 3 SUCCESS:', parsed);
      } catch {}
    }
  }
}

if (parsed && typeof parsed === 'object' && parsed.answer) {
  console.log('FINAL: Valid answer found');
} else {
  console.log('FINAL: No valid JSON, using fallback');
  console.log('Fallback answer:', aiMessage);
}
