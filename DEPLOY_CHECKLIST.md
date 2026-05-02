# Quick Deployment Checklist - 5 Steps

## ✅ Step 1: Create Vercel Account (2 minutes)

```
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
5. Done ✓
```

---

## ✅ Step 2: Deploy Frontend (5 minutes)

```
1. In Vercel: Click "Add New..." → "Project"
2. Select: harshilhirani0007/tirupati-metal-cast
3. Configure:
   - Root Directory: ./client
   - Build Command: npm run build
   - Output: dist
4. Environment Variables:
   - VITE_API_URL = https://your-backend-url
5. Click "Deploy"
6. Wait 2-3 minutes
7. Get URL: https://tirupati-metal-cast.vercel.app ✓
```

---

## ✅ Step 3: Create Render Account (2 minutes)

```
1. Go to https://render.com
2. Sign up with GitHub
3. Done ✓
```

---

## ✅ Step 4: Deploy Backend (5 minutes)

```
1. In Render: Click "New +" → "Web Service"
2. Connect GitHub repository
3. Select "server" directory
4. Configure:
   - Name: tirupati-metal-cast-backend
   - Runtime: Node
   - Build: npm install && npm run build
   - Start: npm start
5. Environment Variables:
   - DATABASE_URL = (your postgres URL)
   - JWT_SECRET = (generate random key)
   - NODE_ENV = production
   - CORS_ORIGIN = https://tirupati-metal-cast.vercel.app
6. Click "Deploy"
7. Wait 3-5 minutes
8. Get URL: https://tirupati-metal-cast-backend.onrender.com ✓
```

---

## ✅ Step 5: Connect Domain (10 minutes)

### Option A: Use Vercel + Render URLs (Quickest)

```
Frontend: https://tirupati-metal-cast.vercel.app
Backend: https://tirupati-metal-cast-backend.onrender.com
```

Update in Vercel environment:
```
VITE_API_URL = https://tirupati-metal-cast-backend.onrender.com
```

**Done! Your app is live!** 🚀

---

### Option B: Connect Your Domain (Optional)

#### For Frontend Domain (tirupati-metal-cast.com)

In your domain registrar (GoDaddy, Namecheap, etc.):

```
Update DNS to Vercel nameservers:
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Then in Vercel Project Settings → Domains:
```
Add: tirupati-metal-cast.com
Add: www.tirupati-metal-cast.com
```

#### For Backend API Subdomain (api.tirupati-metal-cast.com)

In your domain registrar, add CNAME:
```
Type: CNAME
Name: api
Value: tirupati-metal-cast-backend.onrender.com
```

Wait 5-15 minutes for DNS to propagate.

---

## 🎯 Post-Deployment Testing

### Test 1: Frontend Works
```
Open: https://tirupati-metal-cast.vercel.app
Check:
- [ ] Homepage loads
- [ ] Click "Admin" → Login works
- [ ] Products page loads
- [ ] Dark mode works
```

### Test 2: Backend Works
```
curl https://tirupati-metal-cast-backend.onrender.com/api/products
Should return: JSON array of products
```

### Test 3: Full Flow
```
1. Open frontend
2. Login with admin credentials
3. Add a new product
4. Refresh page
5. Product should still be there ✓
```

---

## 🔧 If Something Breaks

### Frontend not loading?
```
Check:
1. Vercel deployment logs (Vercel Dashboard → Deployments)
2. Build errors
3. Environment variables set
```

### Backend API not responding?
```
Check:
1. Render deployment logs (Render Dashboard → Logs)
2. Database connection
3. Environment variables
4. CORS settings
```

### Stuck? 
```
Delete deployment and redeploy:
1. Vercel: Deployments → Click previous → Redeploy
2. Render: Dashboard → Click previous deploy
```

---

## 📊 URLs After Deployment

### Quickest (Use these):
```
Frontend: https://tirupati-metal-cast.vercel.app
Backend: https://tirupati-metal-cast-backend.onrender.com
Admin: https://tirupati-metal-cast.vercel.app/admin/login
```

### Custom Domain (Optional):
```
Frontend: https://tirupati-metal-cast.com
Backend: https://api.tirupati-metal-cast.com
Admin: https://tirupati-metal-cast.com/admin/login
```

---

## ⏱️ Estimated Total Time: 30 minutes

```
Vercel signup: 2 min
Frontend deploy: 5 min
Render signup: 2 min
Backend deploy: 5 min
Testing: 5 min
Domain setup: 10 min (optional)
───────────────────
Total: 30 min ✓
```

---

## ✨ You're Done!

Your app is now live on the internet!

```
✅ Frontend deployed to Vercel
✅ Backend deployed to Render
✅ Database connected
✅ Everything working
✅ Ready for production! 🚀
```

Share your URL:
```
https://tirupati-metal-cast.vercel.app
```
