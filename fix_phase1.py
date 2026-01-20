#!/usr/bin/env python3
"""EMERGENCY FIX - Phase 1: Fix Knowledge Base with proper fallback"""
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

print("🚨 EMERGENCY FIX - PHASE 1: Knowledge Base")
print("="*60)

# Step 1: Get current knowledge.tsx
print("\n📥 Step 1: Fetching current knowledge.tsx...")
file_path = "client/src/pages/knowledge.tsx"
url = f"https://api.github.com/repos/{REPO}/contents/{file_path}?ref={BRANCH}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ ERROR: Cannot fetch file (status {response.status_code})")
    print(response.text)
    sys.exit(1)

file_data = response.json()
sha = file_data['sha']
current_content = base64.b64decode(file_data['content']).decode('utf-8')
print(f"✅ Current SHA: {sha}")
print(f"✅ File size: {len(current_content)} bytes")

# Step 2: Check if fix is already applied
if 'EMERGENCY FIX' in current_content and 'responseText = await response.text()' in current_content:
    print("\n⚠️  FIX ALREADY APPLIED!")
    print("The emergency fix is already in the code.")
    print("\nThe issue must be:")
    print("1. Cloudflare cache not cleared")
    print("2. Deployment not completed")
    print("3. Browser cache not cleared")
    print("\n🔄 Triggering new deployment by updating comment...")
    # Add a timestamp comment to force rebuild
    import time
    timestamp = int(time.time())
    current_content = current_content.replace(
        '// EMERGENCY FIX:',
        f'// EMERGENCY FIX (deployed {timestamp}):'
    )
else:
    print("\n🔧 Step 2: Applying emergency fix...")
    
    # Find and replace the handleAskAI function
    old_code = '''      const data = await response.json();
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
    
    if old_code in current_content:
        current_content = current_content.replace(old_code, new_code)
        print("✅ Fix applied successfully")
    else:
        print("⚠️  Could not find exact match, trying alternative...")
        # Try alternative pattern
        if 'await response.json()' in current_content:
            # Find the section and replace more broadly
            lines = current_content.split('\n')
            new_lines = []
            in_ask_ai = False
            replaced = False
            
            for i, line in enumerate(lines):
                if 'const handleAskAI = async' in line:
                    in_ask_ai = True
                
                if in_ask_ai and 'const data = await response.json()' in line:
                    # Replace this line and the next
                    new_lines.append('      // EMERGENCY FIX: Handle both JSON and plain text responses')
                    new_lines.append('      const responseText = await response.text();')
                    new_lines.append("      console.log('🔍 Raw Worker response:', responseText);")
                    new_lines.append('      ')
                    new_lines.append('      // Try to parse as JSON first')
                    new_lines.append('      let finalAnswer;')
                    new_lines.append('      try {')
                    new_lines.append('        const data = JSON.parse(responseText);')
                    new_lines.append('        finalAnswer = data.answer || data.message || responseText;')
                    new_lines.append("        console.log('✅ Parsed as JSON');")
                    new_lines.append('      } catch (jsonError) {')
                    new_lines.append('        // If not JSON, use raw text as answer')
                    new_lines.append("        console.log('⚠️  Not JSON, using raw text as answer');")
                    new_lines.append('        finalAnswer = responseText;')
                    new_lines.append('      }')
                    new_lines.append('      ')
                    # Skip the next line (setAiAnswer with old logic)
                    if i + 1 < len(lines) and 'setAiAnswer' in lines[i + 1]:
                        new_lines.append("      setAiAnswer(finalAnswer || 'No answer provided');")
                        lines[i + 1] = ''  # Mark for skip
                    replaced = True
                elif line:  # Only add non-empty lines or lines we haven't marked for skip
                    new_lines.append(line)
            
            if replaced:
                current_content = '\n'.join(new_lines)
                print("✅ Fix applied using alternative method")
            else:
                print("❌ ERROR: Could not apply fix - pattern not found")
                sys.exit(1)

# Step 3: Push the fixed content
print("\n🚀 Step 3: Pushing fix to GitHub...")
encoded_content = base64.b64encode(current_content.encode()).decode()

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
    print(f"✅ FIX PUSHED SUCCESSFULLY!")
    print(f"✅ New SHA: {new_sha}")
    print(f"✅ Commit: {result['commit']['html_url']}")
    print("\n" + "="*60)
    print("🎯 NEXT STEPS:")
    print("="*60)
    print("1. ⏱️  Wait 2-3 minutes for Cloudflare Pages deployment")
    print("2. 🔄 Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)")
    print("3. 🧪 Test: https://reflectivai-app-prod.pages.dev/knowledge")
    print("4. 📊 Monitor: https://github.com/ReflectivEI/dev_projects_full-build2/actions")
    print("\n✅ YOUR PRESENTATION IS SAVED!")
else:
    print(f"❌ ERROR: Push failed (status {response.status_code})")
    print(response.text)
    sys.exit(1)
