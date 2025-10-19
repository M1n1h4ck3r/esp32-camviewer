# Production Deployment Guide
## ESP32 CamViewer - Deploy to Production

Generated: 2025-10-19

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free Tier)
### Option 2: Netlify
### Option 3: Self-Hosted (Docker)

---

## 📦 Option 1: Vercel Deployment (Recommended)

### Prerequisites:
- GitHub account
- Vercel account (free tier available)
- Git repository initialized

### Step 1: Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ESP32 CamViewer v1.0"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/esp32-camviewer.git
git branch -M main
git push -u origin main
```

### Step 2: Configure Environment Variables

Create `.env.production` file:

```env
# Admin Credentials (CHANGE IN PRODUCTION!)
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here

# Privacy Password (CHANGE IN PRODUCTION!)
NEXT_PUBLIC_DEFAULT_PRIVACY_PASSWORD=your_privacy_password_here

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

**⚠️ IMPORTANT**: Change default passwords before deployment!

### Step 3: Deploy to Vercel

#### Via CLI:
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Via Web Interface:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variables (from `.env.production`)
6. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your domain: `esp32camviewer.com`
3. Update DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.19.19

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)

### Step 5: Enable Analytics

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 📦 Option 2: Netlify Deployment

### Step 1: Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
```

### Step 2: Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Or use Netlify web interface:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

---

## 🐳 Option 3: Docker Self-Hosted

### Step 1: Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### Step 2: Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
```

### Step 3: Build and Run

```bash
# Build Docker image
docker build -t esp32-camviewer .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_ADMIN_USERNAME=admin \
  -e NEXT_PUBLIC_ADMIN_PASSWORD=secure_password \
  -e NEXT_PUBLIC_DEFAULT_PRIVACY_PASSWORD=privacy_password \
  esp32-camviewer
```

### Step 4: Docker Compose (Optional)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_ADMIN_USERNAME=admin
      - NEXT_PUBLIC_ADMIN_PASSWORD=secure_password
      - NEXT_PUBLIC_DEFAULT_PRIVACY_PASSWORD=privacy_password
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## 🔒 Production Security Checklist

### Before Deployment:
- [ ] Change default admin password
- [ ] Change default privacy password
- [ ] Remove all console.logs
- [ ] Enable HTTPS/SSL
- [ ] Set secure HTTP headers
- [ ] Configure CORS if needed
- [ ] Run security audit: `npm audit`
- [ ] Update all dependencies

### HTTP Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 📊 Post-Deployment Monitoring

### 1. Vercel Analytics

Monitor in real-time:
- Page views
- Unique visitors
- Web Vitals (FCP, LCP, CLS)
- Geographical distribution

### 2. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.js`:

```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 3. Uptime Monitoring

Recommended services:
- UptimeRobot (free)
- Pingdom
- StatusCake

### 4. Performance Monitoring

```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --config=lighthouserc.js
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npx tsc --noEmit

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_ADMIN_USERNAME: ${{ secrets.ADMIN_USERNAME }}
          NEXT_PUBLIC_ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🌐 DNS Configuration

### Cloudflare (Recommended for CDN + DDoS protection)

1. Add site to Cloudflare
2. Update nameservers at domain registrar
3. Configure DNS records:
   ```
   Type: A
   Name: @
   Value: [Vercel IP]
   Proxy: Enabled (orange cloud)

   Type: CNAME
   Name: www
   Value: esp32camviewer.com
   Proxy: Enabled
   ```
4. Enable SSL/TLS: Full (strict)
5. Enable Automatic HTTPS Rewrites
6. Enable Brotli compression

---

## 📱 PWA Configuration (Optional)

### Step 1: Create manifest.json

```json
{
  "name": "ESP32 CamViewer",
  "short_name": "CamViewer",
  "description": "Monitor your ESP32 cameras in real-time",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Step 2: Add to layout

```typescript
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#2563eb',
};
```

### Step 3: Service Worker (next-pwa)

```bash
npm install next-pwa
```

Update `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // existing config
});
```

---

## 🚦 Deployment Checklist

### Pre-Deployment:
- [ ] All tests passing
- [ ] Production build successful
- [ ] Environment variables configured
- [ ] Security headers enabled
- [ ] HTTPS/SSL configured
- [ ] Default passwords changed
- [ ] Error tracking configured
- [ ] Analytics enabled

### Post-Deployment:
- [ ] Test login functionality
- [ ] Test camera add/edit/delete
- [ ] Test on mobile devices
- [ ] Verify HTTPS working
- [ ] Check Web Vitals scores
- [ ] Monitor error rates
- [ ] Set up uptime monitoring
- [ ] Create backup strategy

---

## 🔧 Troubleshooting

### Issue: Build fails on Vercel
**Solution**: Check Node.js version matches local (18+)
```json
// package.json
"engines": {
  "node": ">=18.0.0"
}
```

### Issue: Environment variables not working
**Solution**: Ensure `NEXT_PUBLIC_` prefix for client-side vars

### Issue: Images not loading
**Solution**: Check camera URLs are accessible from server IP

### Issue: High latency
**Solution**: Enable Cloudflare CDN, optimize images

---

## 📞 Support & Maintenance

### Regular Maintenance:
- Weekly: Check error logs
- Monthly: Update dependencies (`npm update`)
- Quarterly: Security audit (`npm audit`)
- Yearly: Review and update passwords

### Backup Strategy:
- localStorage data backed up per user
- No server-side database (stateless)
- Configuration stored in environment variables

---

**Status**: Deployment Guide Complete ✅
**Next**: Environment Variables Documentation
