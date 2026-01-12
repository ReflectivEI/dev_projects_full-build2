# 🔒 SAFE DEPLOYMENT WORKFLOW

## ⚠️ NEVER DEPLOY DIRECTLY TO PRODUCTION AGAIN!

This document explains how to make changes safely without breaking the live site.

---

## 🎯 THE TWO-STEP PROCESS

### Step 1: Deploy to STAGING (Test Environment)
```bash
# Build the app
npm run build

# Deploy to STAGING
CLOUDFLARE_API_TOKEN="rQSEvfDkypQIm31Zwu68_Zhk6yCgy4Qp_IQMUlNB" \
CLOUDFLARE_ACCOUNT_ID="59fea97fab54fbd4d4168ccaa1fa3410" \
npx wrangler pages deploy client/dist \
  --project-name=reflectivai-app-staging \
  --branch=staging
```

**Test URL:** https://reflectivai-app-staging.pages.dev/

### Step 2: Deploy to PRODUCTION (Only After Testing!)
```bash
# Same build from Step 1 - DO NOT rebuild

# Deploy to PRODUCTION
CLOUDFLARE_API_TOKEN="rQSEvfDkypQIm31Zwu68_Zhk6yCgy4Qp_IQMUlNB" \
CLOUDFLARE_ACCOUNT_ID="59fea97fab54fbd4d4168ccaa1fa3410" \
npx wrangler pages deploy client/dist \
  --project-name=reflectivai-app-prod \
  --branch=main
```

**Live URL:** https://reflectivai-app-prod.pages.dev/

---

## 🛡️ SAFETY RULES

1. **ALWAYS deploy to staging first**
2. **ALWAYS test on staging before production**
3. **NEVER skip staging** - even for "small" changes
4. **ALWAYS hard refresh** (Ctrl+Shift+R) after deployment
5. **If staging breaks** - fix it before touching production

---

## 🚨 EMERGENCY ROLLBACK

If production breaks, rollback to the last working deployment:

```bash
# List recent deployments
CLOUDFLARE_API_TOKEN="rQSEvfDkypQIm31Zwu68_Zhk6yCgy4Qp_IQMUlNB" \
CLOUDFLARE_ACCOUNT_ID="59fea97fab54fbd4d4168ccaa1fa3410" \
npx wrangler pages deployment list --project-name=reflectivai-app-prod

# Rollback to specific deployment (replace DEPLOYMENT_ID)
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/59fea97fab54fbd4d4168ccaa1fa3410/pages/projects/reflectivai-app-prod/deployments/DEPLOYMENT_ID/rollback" \
  -H "Authorization: Bearer rQSEvfDkypQIm31Zwu68_Zhk6yCgy4Qp_IQMUlNB" \
  -H "Content-Type: application/json"
```

**Last Known Good Deployment:** `95ca07c5-b0ca-4dbf-a159-2cb00e9f2c2f` (Dec 27, 2025)

---

## 📊 DEPLOYMENT CHECKLIST

### Before Deploying to Staging:
- [ ] Code changes committed to git
- [ ] Build completes without errors
- [ ] TypeScript check passes (`npm run type-check`)

### Before Deploying to Production:
- [ ] Staging deployment successful
- [ ] All pages load on staging
- [ ] Dashboard shows data correctly
- [ ] No console errors in browser
- [ ] Mobile view tested
- [ ] All links work

### After Production Deployment:
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Verify homepage loads
- [ ] Verify dashboard loads
- [ ] Check browser console for errors

---

## 🔗 QUICK LINKS

- **Production:** https://reflectivai-app-prod.pages.dev/
- **Staging:** https://reflectivai-app-staging.pages.dev/
- **Worker API:** https://reflectivai-api-parity-prod.tonyabdelmalak.workers.dev
- **Cloudflare Dashboard:** https://dash.cloudflare.com/59fea97fab54fbd4d4168ccaa1fa3410/pages

---

## 💡 WHY THIS MATTERS

Today we learned the hard way:
- Deploying directly to production is dangerous
- Browser caching can hide problems
- Rollbacks are your safety net
- Testing on staging prevents disasters

**NEVER SKIP STAGING AGAIN!**
