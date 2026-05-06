# Deployment Guide - Shri Tirupati Metal Cast

## Prerequisites

✅ GitHub account (already have)
✅ Vercel account (https://vercel.com)
✅ Render account (https://render.com) for backend
✅ Domain (you have: tirupati-metal-cast.com or similar)
✅ Project pushed to GitHub (already done)

---

## Step 1: Deploy Frontend to Vercel

### 1.1 Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub repositories
4. Click **"Import Project"**
5. Select your repository: **harshilhirani0007/tirupati-metal-cast**

### 1.2 Configure Vercel Project

**Project Settings:**
- Framework Preset: **Vite** ✓
- Root Directory: **./client** ✓
- Build Command: **npm run build** ✓
- Output Directory: **dist** ✓

**Environment Variables:**

Add these variables in Vercel dashboard:
```
VITE_API_URL=https://tirupati-metal-casting.onrender.com
```

Or update later in Project Settings → Environment Variables

### 1.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (2-3 minutes)
3. You'll get a URL like: `https://tirupati-metal-cast.vercel.app`

**✅ Frontend deployed!**

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**

### 2.2 Connect Repository

1. Select your GitHub repository
2. Choose **"server"** directory
3. Enter these settings:

**Build & Deploy:**
```
Name: tirupati-metal-cast-backend
Environment: Node
Region: Frankfurt (closest to India)
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables:**

Click **"Add Environment Variable"** and add:

```
DATABASE_URL=your_neon_postgres_url
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### 2.3 Add Custom Domain to Render

1. Go to Settings → Custom Domain
2. Add: `api.tirupati-metal-cast.com`
3. Add DNS records (Render will show them)
4. Wait for DNS to propagate (5-15 minutes)

**✅ Backend deployed!**

---

## Step 3: Update Environment Variables

### 3.1 Update Frontend Environment

In Vercel Dashboard:

**Settings → Environment Variables:**

```
VITE_API_URL=https://tirupati-metal-casting.onrender.com
```

Or if using custom domain:
```
VITE_API_URL=https://api.tirupati-metal-cast.com
```

### 3.2 Update Backend Environment

In Render Dashboard:

**Settings → Environment:**
```
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your_secret_key_here
NODE_ENV=production
CORS_ORIGIN=https://tirupati-metal-cast.vercel.app
```

---

## Step 4: Connect Your Custom Domain

### 4.1 Point Domain to Vercel (Frontend)

If using **tirupati-metal-cast.com**:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update DNS records to point to Vercel

**Using Vercel Nameservers (Recommended):**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Or CNAME:**
```
CNAME: cname.vercel-dns.com
```

3. In Vercel Dashboard:
   - Project Settings → Domains
   - Add: `tirupati-metal-cast.com`
   - Add: `www.tirupati-metal-cast.com`

### 4.2 Point Subdomain to Render (Backend)

For API subdomain: `api.tirupati-metal-cast.com`

**In Domain Registrar:**
```
Type: CNAME
Name: api
Value: tirupati-metal-cast-backend.onrender.com
```

Wait for DNS propagation (5-15 minutes).

---

## Step 5: Test Deployment

### 5.1 Test Frontend

```
Frontend URL: https://tirupati-metal-cast.vercel.app
OR: https://tirupati-metal-cast.com
```

Check:
- ✅ Homepage loads
- ✅ All pages accessible
- ✅ Dark/Light mode works
- ✅ Navigation works

### 5.2 Test Backend

```
API URL: https://api.tirupati-metal-cast.com
OR: https://tirupati-metal-casting.onrender.com
```

Test endpoints:
```bash
# Test products API
curl https://api.tirupati-metal-cast.com/api/products

# Test with auth (replace TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  https://api.tirupati-metal-cast.com/api/products/all
```

### 5.3 Test Full Flow

1. Open your domain in browser
2. Try login
3. Add product in admin
4. Check if it saves
5. Refresh page
6. Verify product is still there

---

## Deployment Checklist

### Before Deploying

- [ ] All code committed to GitHub
- [ ] No `.env` files in repo (only `.env.example`)
- [ ] All tests passing
- [ ] Build runs locally: `npm run build`
- [ ] No console errors

### Frontend (Vercel)

- [ ] GitHub repository connected
- [ ] Build command correct
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate enabled (automatic)
- [ ] All pages loading
- [ ] API calls working

### Backend (Render)

- [ ] GitHub repository connected
- [ ] Node.js environment selected
- [ ] Database connection string added
- [ ] Start command correct
- [ ] Environment variables complete
- [ ] Custom domain configured
- [ ] API endpoints responding
- [ ] CORS configured

### Post-Deployment

- [ ] Test login functionality
- [ ] Test create/edit/delete
- [ ] Test all admin pages
- [ ] Check error handling
- [ ] Verify emails if applicable
- [ ] Test mobile responsiveness
- [ ] Monitor for errors in logs

---

## Troubleshooting

### Frontend Issues

**Issue: "Cannot find module react"**
```
Solution: Run npm install in client directory
```

**Issue: "Build fails"**
```
Solution: 
1. Check build.log in Vercel
2. Ensure all imports are correct
3. Run locally: npm run build
```

**Issue: "API calls fail"**
```
Solution:
1. Check VITE_API_URL environment variable
2. Verify backend is running
3. Check CORS settings
```

### Backend Issues

**Issue: "Cannot connect to database"**
```
Solution:
1. Verify DATABASE_URL is correct
2. Check database allows external connections
3. Test connection locally
```

**Issue: "Port already in use"**
```
Solution:
Render automatically assigns a port. Use process.env.PORT
```

**Issue: "Deployment fails"**
```
Solution:
1. Check build.log
2. Run npm run build locally
3. Check Node version (18+)
```

---

## Environment Variables Reference

### Frontend (.env or Vercel)
```
VITE_API_URL=https://api.yourdomain.com
```

### Backend (.env or Render)
```
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your_secret_key_minimum_32_chars
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
PORT=3000 (optional, Render assigns automatically)
```

---

## Manual Build & Test

### Build Frontend Locally
```bash
cd client
npm install
npm run build
```

Output: `client/dist/`

### Build Backend Locally
```bash
cd server
npm install
npm run build
```

Output: `server/dist/`

---

## Monitoring Deployments

### Vercel Dashboard
- Real-time build logs
- Deployment history
- Performance metrics
- Analytics

### Render Dashboard
- Service logs
- Environment variables
- Resource usage
- Deployment history

---

## Rollback Deployment

### Vercel
1. Dashboard → Deployments
2. Click previous deployment
3. Click "Redeploy"

### Render
1. Dashboard → Latest Deploy
2. Scroll to Render Events
3. Select previous deployment to redeploy

---

## Continuous Deployment

Both Vercel and Render support auto-deployment:

**Vercel:**
- Automatically deploys on push to main
- Can configure to deploy on specific branches
- Works out of the box

**Render:**
- Automatically deploys on push to main
- Can trigger manual deploys
- Check Settings → Auto-Deploy

---

## Performance Optimization

### Frontend (Vercel)
- ✅ Automatic compression
- ✅ Image optimization
- ✅ Code splitting
- ✅ Global CDN

### Backend (Render)
- ✅ Auto-scaling
- ✅ Connection pooling
- ✅ Caching headers
- ✅ Geographic regions

---

## SSL/HTTPS

✅ **Automatic** for both Vercel and Render
- HTTPS enabled by default
- Free SSL certificates
- Auto-renewal

---

## Getting Help

### Vercel Support
- Docs: https://vercel.com/docs
- Help: https://vercel.com/support

### Render Support
- Docs: https://render.com/docs
- Help: https://render.com/support

### GitHub
- Issues: https://github.com/harshilhirani0007/tirupati-metal-cast/issues

---

## Summary

Your deployment flow:

```
Local Development
     ↓
Push to GitHub (main branch)
     ↓
Vercel auto-deploys frontend
     ↓
Render auto-deploys backend
     ↓
Your domain serves both
     ↓
Production ready! 🚀
```

---

**Your production URL:**
```
Frontend: https://tirupati-metal-cast.com
Backend: https://api.tirupati-metal-cast.com
```

**Deployment is live once DNS propagates!** (usually 5-15 minutes)
