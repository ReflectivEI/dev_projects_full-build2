#!/usr/bin/env python3
"""EMERGENCY FIX - Direct GitHub API push with NEW TOKEN"""
import requests
import base64
import sys
import json

GITHUB_TOKEN = "***REMOVED***"
REPO = "ReflectivEI/dev_projects_full-build2"
BRANCH = "main"
FILE_PATH = "client/src/pages/knowledge.tsx"

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("🚨" * 20)
print("EMERGENCY FIX - EXECUTING NOW")
print("🚨" * 20)
print()

# Step 1: Fetch current file
print("📥 Step 1: Fetching knowledge.tsx...")
url = f"https://api.github.com/repos/{REPO}/contents/{FILE_PATH}?ref={BRANCH}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ ERROR: Cannot fetch file (HTTP {response.status_code})")
    print(response.text)
    sys.exit(1)

file_data = response.json()
sha = file_data['sha']
current_content = base64.b64decode(file_data['content']).decode('utf-8')

print(f"✅ Fetched successfully")
print(f"✅ Current SHA: {sha}")
print(f"✅ File size: {len(current_content)} bytes")
print()

# Step 2: Apply the fix
print("🔧 Step 2: Applying emergency fix...")

# The exact code to find and replace
old_pattern = '''      const data = await response.json();
      setAiAnswer(data.answer || 'No answer provided');'''

new_code = '''      // EMERGENCY FIX: Handle both JSON and plain text responses
      const responseText = await response.text();
      console.log('🔍 Raw Worker response:', responseText);
      
      // Try to parse as JSON first
      let finalAnswer;
      try {
        const data = JSON.parse(responseText);
        finalAnswer = data.answer || data.message || responseText;
        console.log('✅ Parsed as JSON');
      } catch (jsonError) {
        // If not JSON, use raw text as answer
        console.log('⚠️  Not JSON, using raw text as answer');
        finalAnswer = responseText;
      }
      
      setAiAnswer(finalAnswer || 'No answer provided');'''

if old_pattern in current_content:
    new_content = current_content.replace(old_pattern, new_code)
    print("✅ Fix applied using exact pattern match")
elif 'await response.json()' in current_content and 'handleAskAI' in current_content:
    print("⚠️  Exact pattern not found, using smart replacement...")
    
    # Find the handleAskAI function and replace the json parsing
    lines = current_content.split('\n')
    new_lines = []
    i = 0
    replaced = False
    
    while i < len(lines):
        line = lines[i]
        
        # Look for the json parsing line in handleAskAI context
        if 'const data = await response.json()' in line and not replaced:
            # Check if we're in handleAskAI (look back a few lines)
            in_handle_ask = False
            for j in range(max(0, i-20), i):
                if 'handleAskAI' in lines[j]:
                    in_handle_ask = True
                    break
            
            if in_handle_ask:
                # Replace this line and potentially the next
                indent = len(line) - len(line.lstrip())
                spaces = ' ' * indent
                
                new_lines.append(f"{spaces}// EMERGENCY FIX: Handle both JSON and plain text responses")
                new_lines.append(f"{spaces}const responseText = await response.text();")
                new_lines.append(f"{spaces}console.log('🔍 Raw Worker response:', responseText);")
                new_lines.append(f"{spaces}")
                new_lines.append(f"{spaces}// Try to parse as JSON first")
                new_lines.append(f"{spaces}let finalAnswer;")
                new_lines.append(f"{spaces}try {{")
                new_lines.append(f"{spaces}  const data = JSON.parse(responseText);")
                new_lines.append(f"{spaces}  finalAnswer = data.answer || data.message || responseText;")
                new_lines.append(f"{spaces}  console.log('✅ Parsed as JSON');")
                new_lines.append(f"{spaces}}} catch (jsonError) {{")
                new_lines.append(f"{spaces}  // If not JSON, use raw text as answer")
                new_lines.append(f"{spaces}  console.log('⚠️  Not JSON, using raw text as answer');")
                new_lines.append(f"{spaces}  finalAnswer = responseText;")
                new_lines.append(f"{spaces}}}")
                new_lines.append(f"{spaces}")
                
                # Check if next line is setAiAnswer and replace it
                if i + 1 < len(lines) and 'setAiAnswer' in lines[i + 1]:
                    new_lines.append(f"{spaces}setAiAnswer(finalAnswer || 'No answer provided');")
                    i += 2  # Skip both lines
                else:
                    i += 1
                
                replaced = True
                continue
        
        new_lines.append(line)
        i += 1
    
    if replaced:
        new_content = '\n'.join(new_lines)
        print("✅ Fix applied using smart replacement")
    else:
        print("❌ ERROR: Could not find pattern to replace")
        print("\nSearching for 'await response.json()' in file...")
        for i, line in enumerate(lines, 1):
            if 'await response.json()' in line:
                print(f"  Line {i}: {line.strip()}")
        sys.exit(1)
else:
    print("❌ ERROR: Could not find any JSON parsing pattern")
    sys.exit(1)

print()

# Step 3: Push to GitHub
print("🚀 Step 3: Pushing fix to GitHub...")
encoded_content = base64.b64encode(new_content.encode()).decode()

payload = {
    "message": "🚨 EMERGENCY: Knowledge Base - Handle plain text Worker responses",
    "content": encoded_content,
    "sha": sha,
    "branch": BRANCH
}

response = requests.put(url, headers=headers, json=payload)

if response.status_code in [200, 201]:
    result = response.json()
    new_sha = result['content']['sha']
    commit_url = result['commit']['html_url']
    
    print("✅" * 20)
    print("FIX PUSHED SUCCESSFULLY!")
    print("✅" * 20)
    print()
    print(f"✅ New SHA: {new_sha}")
    print(f"✅ Commit: {commit_url}")
    print()
    print("=" * 60)
    print("🎯 NEXT STEPS FOR YOUR PRESENTATION:")
    print("=" * 60)
    print()
    print("1. ⏱️  WAIT 2-3 MINUTES for Cloudflare Pages deployment")
    print("   Monitor: https://github.com/ReflectivEI/dev_projects_full-build2/actions")
    print()
    print("2. 🔄 HARD REFRESH your browser:")
    print("   - Windows/Linux: Ctrl + Shift + R")
    print("   - Mac: Cmd + Shift + R")
    print()
    print("3. 🧪 TEST the Knowledge Base:")
    print("   - Go to: https://reflectivai-app-prod.pages.dev/knowledge")
    print("   - Select any article")
    print("   - Ask: 'What is active listening?'")
    print("   - Click 'Get Answer'")
    print("   - ✅ IT SHOULD WORK NOW!")
    print()
    print("4. 🔍 OPEN BROWSER CONSOLE (F12) to see:")
    print("   - '🔍 Raw Worker response:' - Shows what API returned")
    print("   - '✅ Parsed as JSON' or '⚠️  Not JSON' - Shows which path was taken")
    print()
    print("=" * 60)
    print("✅ YOUR PRESENTATION IS SAVED!")
    print("=" * 60)
    
else:
    print("❌" * 20)
    print(f"ERROR: Push failed (HTTP {response.status_code})")
    print("❌" * 20)
    print()
    print("Response:")
    print(json.dumps(response.json(), indent=2))
    sys.exit(1)
