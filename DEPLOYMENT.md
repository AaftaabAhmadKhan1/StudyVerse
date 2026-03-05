# Deployment Guide - Style Atlas

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications and offers excellent performance.

#### Steps:

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Style Atlas"
   git branch -M main
   git remote add origin https://github.com/yourusername/style-atlas.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next

3. **Add Environment Variables**
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_WEATHER_API_KEY=your_key_here
     ```

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at: `https://your-project.vercel.app`

**Benefits:**

- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on push
- ✅ Preview deployments for PRs
- ✅ Free tier generous

---

### Option 2: Netlify

#### Steps:

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect GitHub repository

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variables in Site Settings

---

### Option 3: AWS Amplify

#### Steps:

1. **Create amplify.yml** (already included below)

2. **Deploy**
   - Visit AWS Amplify console
   - Connect your GitHub repository
   - AWS will auto-detect Next.js
   - Add environment variables
   - Deploy

---

### Option 4: DigitalOcean App Platform

#### Steps:

1. **Connect Repository**
   - Visit DigitalOcean App Platform
   - Create new app from GitHub

2. **Configure**
   - Detected: Node.js
   - Build command: `npm run build`
   - Run command: `npm start`

3. **Environment Variables**
   - Add in app settings

---

### Option 5: Self-Hosted (VPS/Cloud)

For more control, deploy to your own server.

#### Requirements:

- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)

#### Steps:

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Install PM2**

   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**

   ```bash
   pm2 start npm --name "style-atlas" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **SSL with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

### Option 6: Docker

Deploy using Docker containers.

#### Dockerfile (create this file):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

#### Docker Compose:

```yaml
version: '3.8'

services:
  style-atlas:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_WEATHER_API_KEY=${NEXT_PUBLIC_WEATHER_API_KEY}
    restart: unless-stopped
```

#### Deploy:

```bash
docker-compose up -d
```

---

## 🔧 Pre-Deployment Checklist

- [ ] Update environment variables for production
- [ ] Test build locally: `npm run build && npm start`
- [ ] Verify all API keys are working
- [ ] Check responsive design on multiple devices
- [ ] Test with real weather API data
- [ ] Optimize images (if added)
- [ ] Enable analytics (Google Analytics, Vercel Analytics)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure custom domain
- [ ] Set up SSL certificate

## 🌐 Custom Domain Setup

### For Vercel:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records at your registrar:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

### For Other Platforms:

Follow provider-specific instructions for domain configuration.

## 📊 Performance Optimization

After deployment:

1. **Enable Caching**
   - Vercel does this automatically
   - For self-hosted, configure Nginx caching

2. **Image Optimization**
   - Use Next.js Image component
   - Already configured in the project

3. **Analytics**

   ```bash
   # Add Vercel Analytics
   npm install @vercel/analytics
   ```

   In `layout.tsx`:

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

4. **Monitoring**
   - Set up Vercel Speed Insights
   - Configure error tracking with Sentry

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use different keys for production
   - Rotate API keys regularly

2. **Rate Limiting**
   Add to API routes:

   ```typescript
   // Install: npm install @upstash/ratelimit @upstash/redis
   import { Ratelimit } from '@upstash/ratelimit';
   import { Redis } from '@upstash/redis';

   const ratelimit = new Ratelimit({
     redis: Redis.fromEnv(),
     limiter: Ratelimit.slidingWindow(10, '1 h'),
   });
   ```

3. **CORS**
   Already handled by Next.js API routes

4. **Content Security Policy**
   Add to `next.config.ts`:
   ```typescript
   const securityHeaders = [
     {
       key: 'X-DNS-Prefetch-Control',
       value: 'on',
     },
     {
       key: 'X-Frame-Options',
       value: 'SAMEORIGIN',
     },
   ];
   ```

## 📱 Progressive Web App (Optional)

Convert to PWA:

```bash
npm install next-pwa
```

Add to `next.config.ts`:

```typescript
const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  // your next config
});
```

## 🎯 Post-Deployment

1. **Test Production Site**
   - Test all features
   - Check all pages load
   - Verify API endpoints work
   - Test on mobile devices

2. **Set Up Monitoring**
   - Google Search Console
   - Google Analytics
   - Uptime monitoring

3. **SEO**
   - Submit sitemap to search engines
   - Verify meta tags
   - Check Open Graph tags

4. **Backup**
   - Set up automated backups
   - Document recovery procedures

## 📞 Support

If you encounter deployment issues:

- Check build logs
- Verify environment variables
- Test locally first
- Contact platform support

---

**Deployment Version**: 1.0.0  
**Last Updated**: February 2026

Happy Deploying! 🚀
