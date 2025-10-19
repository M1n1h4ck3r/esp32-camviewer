# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/M1n1h4ck3r/esp32-camviewer)

---

## Manual Deployment Steps

### 1. **Import Project**

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Add New..." → "Project"
3. Import Git Repository: `M1n1h4ck3r/esp32-camviewer`
4. Click "Import"

---

### 2. **Configure Project**

- **Framework Preset:** Next.js (auto-detected ✅)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (default ✅)
- **Output Directory:** `.next` (default ✅)
- **Install Command:** `npm install` (default ✅)

---

### 3. **⚠️ CRITICAL: Set Environment Variables**

Click on **"Environment Variables"** and add the following:

```env
NEXT_PUBLIC_ADMIN_USERNAME=your_secure_admin_username
NEXT_PUBLIC_ADMIN_PASSWORD=YourV3ryS3cur3P@ssw0rd!2024
NEXT_PUBLIC_DEFAULT_PRIVACY_PASSWORD=Pr1v@cyP@ss123!
```

**Security Requirements:**
- ✅ Use **strong passwords** (12+ characters)
- ✅ Include **uppercase, lowercase, numbers, symbols**
- ✅ **Never use** default values (`admin`, `admin123`, etc.)
- ✅ Keep credentials **secure** and private

**Optional Variables:**
```env
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_TELEMETRY_DISABLED=1
```

---

### 4. **Deploy**

1. Click **"Deploy"**
2. Wait ~2 minutes for build to complete
3. You'll get a URL like: `https://esp32-camviewer-xxx.vercel.app`

---

## Post-Deployment

### ✅ Verify Deployment

1. Visit your Vercel URL
2. Test login with your configured credentials
3. Add a camera and test the feed
4. Test all features:
   - ✅ Camera management
   - ✅ Resolution controls
   - ✅ Privacy toggle
   - ✅ Fullscreen viewer

### 🔒 Security Checklist

- [ ] Changed default admin credentials
- [ ] Changed privacy password
- [ ] Tested login with new credentials
- [ ] Verified `.env.example` has no real credentials
- [ ] Set up custom domain (optional)

---

## Updating Your Deployment

### Auto-Deploy (Recommended)

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

Vercel will detect the push and deploy automatically.

### Manual Redeploy

1. Go to Vercel Dashboard
2. Find your project
3. Click "Redeploy"

---

## Custom Domain Setup

1. In Vercel Dashboard → Settings → Domains
2. Add your domain: `camviewer.yourdomain.com`
3. Configure DNS as instructed by Vercel
4. Wait for SSL certificate to provision (~5 minutes)

---

## Troubleshooting

### Build Fails

**Error:** Missing environment variables
- **Solution:** Go to Settings → Environment Variables and add required vars

**Error:** TypeScript errors
- **Solution:** Check GitHub Actions or build logs for details

### Can't Login

**Issue:** Invalid credentials
- **Solution:** Verify environment variables match what you're typing

### Cameras Not Loading

**Issue:** CORS errors
- **Solution:** Ensure your ESP32-CAM firmware allows CORS or serves from same origin

---

## Performance Optimization

### Vercel Analytics (Optional)

Add to environment variables:
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Image Optimization

Vercel automatically optimizes images. No configuration needed.

---

## Monitoring

- **Vercel Dashboard:** Real-time deployment status
- **Functions:** Monitor serverless function invocations
- **Analytics:** Track Web Vitals (if enabled)

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project Issues:** https://github.com/M1n1h4ck3r/esp32-camviewer/issues

---

**🎉 Your ESP32 CamViewer is now live on Vercel!**
