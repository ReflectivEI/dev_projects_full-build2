# 🚨 EMERGENCY - SCAN ALL FILES FOR DIALOG ISSUES

## Common file paths to check:

1. `client/src/pages/ei-metrics.tsx` - Behavioral Metrics
2. `client/src/pages/dashboard.tsx` - Main Dashboard
3. `client/src/pages/projects.tsx` - Projects page
4. `client/src/pages/project-card.tsx` - Project Card
5. `client/src/components/ProjectCard.tsx` - Project Card Component
6. `client/src/pages/roleplay.tsx` - Roleplay scenarios
7. `client/src/pages/knowledge.tsx` - Knowledge Base

## Files to scan:

We need to check EVERY .tsx file in the repository for:
- Dialog components with DialogTitle but NO DialogHeader
- Loading states that never resolve
- Missing error boundaries

## Action Plan:

1. Scan client/src/pages/ directory
2. Scan client/src/components/ directory
3. Fix ALL Dialog issues at once
4. Push to GitHub
5. Wait for deployment
