import os
import re
import subprocess

# Configuration
REPO_PATH = '/tmp/reflectivai'
BRANCH = 'staging'
TOKEN = '***REMOVED***'

# Files to update
files_to_update = [
    'client/src/pages/ei-metrics.tsx',
    'client/src/components/signal-intelligence-panel.tsx',
    'client/src/components/roleplay-feedback-dialog.tsx',
    'client/src/pages/roleplay.tsx',
    'client/src/pages/dashboard.tsx'
]

# Replacement patterns
replacements = [
    (r'\bEQ\b', 'Signal Intelligence'),
    (r'\bEI\b', 'Signal Intelligence'),
    (r'Emotional Intelligence', 'Signal Intelligence'),
    (r'EI Metrics', 'Signal Intelligence'),
    (r'EI Framework', 'Signal Intelligence Framework'),
    (r'EI frameworks', 'Signal Intelligence frameworks'),
    (r'ObservableSignal', 'Signal Intelligence capability'),
]

os.chdir(REPO_PATH)

# Checkout staging branch
subprocess.run(['git', 'checkout', 'staging'], check=True)
subprocess.run(['git', 'pull', 'origin', 'staging'], check=True)

changes_made = False

for file_path in files_to_update:
    full_path = os.path.join(REPO_PATH, file_path)
    if not os.path.exists(full_path):
        print(f"⚠️  File not found: {file_path}")
        continue
    
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
    
    if content != original_content:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {file_path}")
        changes_made = True
    else:
        print(f"ℹ️  No changes needed: {file_path}")

if changes_made:
    subprocess.run(['git', 'config', 'user.email', 'airo@reflectivai.com'], check=True)
    subprocess.run(['git', 'config', 'user.name', 'Airo Agent'], check=True)
    subprocess.run(['git', 'add', '.'], check=True)
    subprocess.run(['git', 'commit', '-m', 'Phase 1 Complete: Signal Intelligence terminology updates'], check=True)
    subprocess.run(['git', 'push', f'https://{TOKEN}@github.com/reflectivei/dev_projects_full-build2.git', 'staging'], check=True)
    print("\n🎉 PHASE 1 COMPLETE - PUSHED TO STAGING!")
else:
    print("\n⚠️  No changes were needed")
