# GitHub Pages Setup Instructions

## ✅ **Configuration Complete**

### **What I Did**

1. ✅ **Updated `vite.config.ts`**
   - Added `base: '/ReflectivEI-reflectivai-enhanced/'` at line 27
   - This ensures all asset paths work correctly on GitHub Pages

2. ✅ **Created GitHub Actions Workflow**
   - File: `.github/workflows/deploy.yml`
   - Automatically builds and deploys on every push to `main`
   - Uses Node 20 and npm ci for consistent builds

3. ✅ **Pushed to GitHub**
   - Both files committed and pushed
   - Workflow will trigger automatically

---

## 🚀 **Enable GitHub Pages (YOU MUST DO THIS)**

### **Step 1: Go to Repository Settings**
1. Visit: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/settings/pages
2. Or navigate: Repository → Settings → Pages (left sidebar)

### **Step 2: Configure Source**
- **Source**: Select **"GitHub Actions"** from the dropdown
- **DO NOT** select "Deploy from a branch"

### **Step 3: Save**
- The page will auto-save when you select "GitHub Actions"
- No additional configuration needed

---

## 📊 **Monitor Deployment**

### **Check Workflow Status**
1. Go to: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/actions
2. Look for "Deploy to GitHub Pages" workflow
3. It should start automatically after you enable Pages

### **Expected Timeline**
- **Build**: 2-3 minutes (npm install + build)
- **Deploy**: 30-60 seconds
- **Total**: ~3-5 minutes

---

## 🌐 **Your Site URL**

**Once deployed, your site will be live at:**

https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/

---

## ✅ **Verification Steps**

### **1. Check Actions Tab**
- Visit: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/actions
- Look for green checkmark ✅ on "Deploy to GitHub Pages"

### **2. Check Pages Settings**
- Visit: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/settings/pages
- Should show: "Your site is live at https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/"

### **3. Visit the Site**
- Open: https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/
- Should load the ReflectivAI dashboard

---

## 🔧 **Troubleshooting**

### **Workflow Not Running?**
1. Check that GitHub Pages source is set to "GitHub Actions"
2. Go to Actions tab and click "Run workflow" manually
3. Check repository permissions (Settings → Actions → General)

### **Build Failing?**
1. Check Actions tab for error logs
2. Common issues:
   - Missing dependencies (should be fixed with `npm ci`)
   - TypeScript errors (non-critical, build should still succeed)
   - Memory issues (GitHub Actions has 7GB RAM, should be fine)

### **Site Not Loading?**
1. Check browser console for errors
2. Verify base path in `vite.config.ts` matches repo name
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### **404 on Routes?**
- GitHub Pages doesn't support SPA routing by default
- Solution: Add a `404.html` that redirects to `index.html`
- I can add this if needed

---

## 🎯 **Next Steps After Deployment**

### **1. Verify Site Loads**
- Visit: https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/
- Check that dashboard loads correctly
- Test navigation between pages

### **2. Test Mock API**
- The mock API endpoints should work
- Chat functionality should be testable
- Roleplay functionality should be testable

### **3. Cloudflare Worker Integration**
- Once site is live, we can integrate your Cloudflare Worker
- Update API endpoints to point to your worker
- Configure CORS for GitHub Pages domain

---

## 📝 **Important Notes**

### **Automatic Deployments**
- Every push to `main` branch triggers a new deployment
- Takes ~3-5 minutes to go live
- No manual intervention needed

### **API Limitations**
- GitHub Pages is **static hosting only**
- Backend API routes (`/api/*`) won't work on GitHub Pages
- You'll need Cloudflare Worker for backend functionality
- Mock API in browser will work for testing

### **Custom Domain (Optional)**
- You can add a custom domain in Pages settings
- Requires DNS configuration
- Let me know if you want to set this up

---

## ✅ **Summary**

**Configuration Complete:**
- ✅ `vite.config.ts` updated with base path
- ✅ GitHub Actions workflow created
- ✅ Files pushed to GitHub

**You Must Do:**
- ⏳ Enable GitHub Pages in repository settings
- ⏳ Set source to "GitHub Actions"
- ⏳ Wait 3-5 minutes for deployment
- ⏳ Visit: https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/

**Then:**
- 🚀 Site will be live and testable
- 🚀 Mock API will work in browser
- 🚀 Ready for Cloudflare Worker integration

---

## 🔗 **Quick Links**

- **Repository**: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced
- **Settings → Pages**: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/settings/pages
- **Actions**: https://github.com/ReflectivEI/ReflectivEI-reflectivai-enhanced/actions
- **Live Site** (after deployment): https://reflectivei.github.io/ReflectivEI-reflectivai-enhanced/

---

**Go enable GitHub Pages now, and your site will be live in ~5 minutes!** 🚀
