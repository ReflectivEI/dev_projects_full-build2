# 🚨 EMERGENCY FIX - DO THIS NOW (5 MINUTES) 🚨

## THE PROBLEM
Your Worker API is returning **plain text** but the frontend expects **JSON**.

## THE SOLUTION
Replace the Knowledge Base parsing logic with a fallback that handles BOTH formats.

---

## STEP 1: Open Your Repository
1. Go to: https://github.com/ReflectivEI/dev_projects_full-build2
2. Navigate to: `client/src/pages/knowledge.tsx`
3. Click the **Edit** button (pencil icon)

---

## STEP 2: Find This Code (Around Line 45)

Look for this section:

```typescript
const handleAskAI = async () => {
  if (!aiQuestion.trim()) return;
  
  setIsAskingAI(true);
  setAiAnswer(null);
  setAiError(null);
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/knowledge/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: selectedArticle.id,
        question: aiQuestion,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to get AI response');
    
    const data = await response.json();
    setAiAnswer(data.answer || 'No answer provided');
  } catch (error) {
    console.error('AI question error:', error);
    setAiError('Could not parse AI response');
  } finally {
    setIsAskingAI(false);
  }
};
```

---

## STEP 3: Replace With This EXACT Code

```typescript
const handleAskAI = async () => {
  if (!aiQuestion.trim()) return;
  
  setIsAskingAI(true);
  setAiAnswer(null);
  setAiError(null);
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/knowledge/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        articleId: selectedArticle.id,
        question: aiQuestion,
      }),
    });
    
    if (!response.ok) throw new Error('Failed to get AI response');
    
    // Get the raw response text first
    const responseText = await response.text();
    console.log('Raw Worker response:', responseText);
    
    // Try to parse as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
      console.log('Parsed as JSON:', parsedData);
    } catch (jsonError) {
      console.log('Not JSON, using raw text as answer');
      // If it's not JSON, use the raw text as the answer
      parsedData = { answer: responseText };
    }
    
    // Set the answer
    const finalAnswer = parsedData.answer || parsedData.message || responseText || 'No answer provided';
    setAiAnswer(finalAnswer);
    
  } catch (error) {
    console.error('AI question error:', error);
    setAiError(`Error: ${error.message}`);
  } finally {
    setIsAskingAI(false);
  }
};
```

---

## STEP 4: Commit and Deploy

1. Scroll to bottom of GitHub editor
2. Commit message: `EMERGENCY: Fix Knowledge Base to handle plain text responses`
3. Click **Commit changes**
4. Wait 2-3 minutes for auto-deployment
5. Go to https://reflectivai-app-prod.pages.dev/knowledge
6. **HARD REFRESH**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
7. Test the "Ask AI" feature

---

## WHAT THIS DOES

✅ **Tries JSON first** - If Worker returns JSON, it works
✅ **Falls back to plain text** - If Worker returns plain text, it uses that
✅ **Shows actual errors** - If something fails, you see the real error
✅ **Logs everything** - Check browser console (F12) to see what's happening

---

## IF IT STILL DOESN'T WORK

Open browser console (F12) and look for:
- `Raw Worker response:` - Shows what the Worker actually returned
- `Parsed as JSON:` - Shows if JSON parsing worked
- `Not JSON, using raw text as answer` - Shows fallback triggered

Then tell me what you see and I'll fix it immediately!

---

## TIME ESTIMATE
- Edit file: 2 minutes
- Commit: 30 seconds
- Deploy: 2-3 minutes
- Test: 30 seconds

**TOTAL: 5-6 MINUTES TO FIX**

🚀 **DO THIS NOW AND YOUR PRESENTATION WILL WORK!**
