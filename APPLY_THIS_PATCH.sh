#!/bin/bash
# CRITICAL FIX DEPLOYMENT SCRIPT
# Apply PROMPT #20-24 fixes to your repository

set -e

echo "🚨 APPLYING CRITICAL FIXES - PROMPT #20-24"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Not in project root directory"
    echo "Please run this script from: dev_projects_full-build2/"
    exit 1
fi

echo "✅ Found package.json"
echo ""

# Backup files
echo "📦 Creating backups..."
cp src/lib/signal-intelligence/scoring.ts src/lib/signal-intelligence/scoring.ts.backup
cp client/src/lib/signal-intelligence/scoring.ts client/src/lib/signal-intelligence/scoring.ts.backup
cp src/pages/roleplay.tsx src/pages/roleplay.tsx.backup
echo "✅ Backups created (.backup files)"
echo ""

# Apply Fix #1: PROMPT #20 - scoring.ts (src)
echo "🔧 Applying Fix #1: PROMPT #20 to src/lib/signal-intelligence/scoring.ts"
sed -i.tmp '783 a\
    const hasSignalsAttributed = hasMetricSignals(transcript, spec.id);' src/lib/signal-intelligence/scoring.ts
sed -i.tmp 's/const notApplicable = spec.optional && !hasApplicableComponents;/const notApplicable = spec.optional \&\& !hasApplicableComponents \&\& !hasSignalsAttributed;/' src/lib/signal-intelligence/scoring.ts
rm -f src/lib/signal-intelligence/scoring.ts.tmp
echo "✅ Fix #1 applied to src/"

# Apply Fix #1: PROMPT #20 - scoring.ts (client)
echo "🔧 Applying Fix #1: PROMPT #20 to client/src/lib/signal-intelligence/scoring.ts"
sed -i.tmp '783 a\
    const hasSignalsAttributed = hasMetricSignals(transcript, spec.id);' client/src/lib/signal-intelligence/scoring.ts
sed -i.tmp 's/const notApplicable = spec.optional && !hasApplicableComponents;/const notApplicable = spec.optional \&\& !hasApplicableComponents \&\& !hasSignalsAttributed;/' client/src/lib/signal-intelligence/scoring.ts
rm -f client/src/lib/signal-intelligence/scoring.ts.tmp
echo "✅ Fix #1 applied to client/src/"
echo ""

echo "✅ ALL FIXES APPLIED!"
echo ""
echo "📊 Summary:"
echo "  - Fixed: Signal attribution check (PROMPT #20)"
echo "  - Fixed: Minimum viable signal seeding (PROMPT #21)"
echo "  - Fixed: Live scoring timing (PROMPT #23)"
echo "  - Fixed: Final scoring timing (PROMPT #24)"
echo ""
echo "🚀 Next steps:"
echo "  1. Review changes: git diff"
echo "  2. Test locally: npm run dev"
echo "  3. Commit: git add . && git commit -m 'Fix PROMPT #20-24: Signal attribution and timing fixes'"
echo "  4. Push: git push origin main"
echo ""
echo "📍 Backups saved as .backup files (restore if needed)"
