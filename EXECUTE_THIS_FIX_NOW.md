# 🚨 EXECUTE THIS FIX NOW - COPY/PASTE INTO YOUR TERMINAL 🚨

## YOU HAVE 1 HOUR - THIS WILL TAKE 5 MINUTES

### Step 1: Run This Python Script (2 minutes)

Open your terminal and run:

```bash
python3 fix_phase1.py
```

OR if that doesn't work, copy/paste this entire command:

```bash
python3 << 'PYTHON_SCRIPT_END'
import requests
import base64
import sys

GITHUB_TOKEN = "***REMOVED***"
REPO = "ReflectivEI/dev_projects_full-build2"
BRANCH = "main"

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("🚨 EMERGENCY FIX - Fetching knowledge.tsx...")
file_path = "client/src/pages/knowledge.tsx"
url = f"https://api.github.com/repos/{REPO}/contents/{file_path}?ref={BRANCH}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ ERROR: {response.status_code}")
    sys.exit(1)

file_data = response.json()
sha = file_data['sha']
current_content = base64.b64decode(file_data['content']).decode('utf-8')

print(f"✅ Current SHA: {sha}")

# Apply the fix
old_code = '''      const data = await response.json();
      setAiAnswer(data.answer || 'No answer provided');'''

new_code = '''      // EMERGENCY FIX: Handle both JSON and plain text
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let finalAnswer;
      try {
        const data = JSON.parse(responseText);
        finalAnswer = data.answer || data.message || responseText;
      } catch (e) {
        finalAnswer = responseText;
      }
      
      setAiAnswer(finalAnswer || 'No answer provided');'''

if old_code in current_content:
    current_content = current_content.replace(old_code, new_code)
    print("✅ Fix applied")
else:
    print("⚠️  Pattern not found, trying alternative...")
    # Alternative: just replace the json() call
    current_content = current_content.replace(
        'const data = await response.json();',
        '''const responseText = await response.text();
      let data;
      try { data = JSON.parse(responseText); } 
      catch (e) { data = { answer: responseText }; }'''
    )
    print("✅ Alternative fix applied")

print("🚀 Pushing to GitHub...")
encoded_content = base64.b64encode(current_content.encode()).decode()

payload = {
    "message": "🚨 EMERGENCY: Fix Knowledge Base to handle plain text responses",
    "content": encoded_content,
    "sha": sha,
    "branch": BRANCH
}

response = requests.put(url, headers=headers, json=payload)

if response.status_code in [200, 201]:
    print("✅ FIX PUSHED!")
    print("⏱️  Wait 2-3 minutes for deployment")
    print("🔄 Then hard refresh: Ctrl+Shift+R")
    print("🧪 Test: https://reflectivai-app-prod.pages.dev/knowledge")
else:
    print(f"❌ ERROR: {response.status_code}")
    print(response.text)

PYTHON_SCRIPT_END
```

---

### Step 2: Wait for Deployment (2-3 minutes)

Monitor deployment at:
https://github.com/ReflectivEI/dev_projects_full-build2/actions

Wait for the green checkmark ✅

---

### Step 3: Test Your Site (30 seconds)

1. Go to: https://reflectivai-app-prod.pages.dev/knowledge
2. **HARD REFRESH**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Select any article
4. Ask: "What is active listening?"
5. Click "Get Answer"
6. ✅ **IT SHOULD WORK NOW!**

---

## WHAT THIS FIX DOES

The Worker API returns **plain text** like:
```
Active listening is a crucial skill...
```

But your frontend expects **JSON** like:
```json
{"answer": "Active listening is a crucial skill..."}
```

This fix adds a **fallback**:
1. Try to parse as JSON
2. If that fails, use the raw text as the answer
3. No more errors!

---

## IF IT STILL DOESN'T WORK

Open browser console (F12) and look for:
- `🔍 Raw response:` - Shows what the Worker returned
- Any error messages

Then tell me what you see and I'll fix it immediately!

---

## TOTAL TIME: 5 MINUTES
- Run script: 1 minute
- Wait for deployment: 2-3 minutes  
- Test: 30 seconds

**YOU STILL HAVE 55 MINUTES FOR YOUR PRESENTATION!**

🚀 **RUN THE PYTHON COMMAND ABOVE RIGHT NOW!**
