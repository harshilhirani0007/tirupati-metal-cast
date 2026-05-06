# Build Guide - Shri Tirupati Metal Cast

This guide explains how to build and verify the project.

## Backend Build

### Build Command
```bash
cd server
npm run build
```

### What It Does
- Compiles TypeScript files to JavaScript
- Output goes to `server/dist` directory
- Checks for TypeScript errors

### Success Indicator
✅ If successful, you'll see no errors and the command completes.

### Common Errors & Fixes
| Error | Cause | Fix |
|-------|-------|-----|
| `command not found: npm` | Node.js not installed | Install Node.js from nodejs.org |
| `Cannot find module` | Dependencies not installed | Run `npm install` first |
| `TS2322` (TypeScript error) | Type mismatch in code | Check error line in source |

---

## Frontend Build

### Build Command
```bash
cd client
npm run build
```

### What It Does
- Runs TypeScript type checking (`tsc`)
- Builds optimized production bundle with Vite
- Output goes to `client/dist` directory

### Success Indicator
✅ If successful, you'll see:
```
✓ built in 2.34s
```

### Common Errors & Fixes
| Error | Cause | Fix |
|-------|-------|-----|
| `TypeScript error: Cannot find name` | Missing import | Add missing import statement |
| `is not exported from` | Wrong import path | Verify import path in file |
| `Cannot find module '@/'` | Path alias issue | Check vite.config.ts paths |

---

## Full Project Build (Both Frontend & Backend)

### Build Everything
```bash
# Build frontend
cd client && npm run build

# Build backend
cd ../server && npm run build
```

### Quick Check Script
Run this to verify both builds:

```bash
#!/bin/bash
echo "Building frontend..."
cd client && npm run build
FRONTEND_STATUS=$?

echo ""
echo "Building backend..."
cd ../server && npm run build
BACKEND_STATUS=$?

echo ""
echo "========== BUILD RESULTS =========="
if [ $FRONTEND_STATUS -eq 0 ]; then
  echo "✅ Frontend: SUCCESS"
else
  echo "❌ Frontend: FAILED"
fi

if [ $BACKEND_STATUS -eq 0 ]; then
  echo "✅ Backend: SUCCESS"
else
  echo "❌ Backend: FAILED"
fi

if [ $FRONTEND_STATUS -eq 0 ] && [ $BACKEND_STATUS -eq 0 ]; then
  echo ""
  echo "🎉 All builds successful!"
  exit 0
else
  echo ""
  echo "⚠️ Some builds failed. Check errors above."
  exit 1
fi
```

---

## Development Workflow

### Start Both Services
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend (in new terminal)
cd client
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Production Deployment

### Backend Deployment
```bash
cd server
npm install
npm run build
npm start
```

### Frontend Deployment (Vercel)
```bash
cd client
npm install
npm run build
# Push to GitHub, Vercel auto-deploys
```

---

## Troubleshooting

### "Module not found" Errors
1. Delete `node_modules` folder
2. Delete lock file (`package-lock.json` or `yarn.lock`)
3. Run `npm install` again

### TypeScript Errors After Update
```bash
# Clear TypeScript cache
rm -rf client/dist
rm -rf server/dist

# Rebuild
npm run build
```

### Port Already in Use
```bash
# Frontend (default 5173)
cd client && npm run dev -- --port 3000

# Backend (default 5000)
PORT=3001 npm run dev
```

---

## Build Output Locations

| Component | Build Output | Environment |
|-----------|--------------|-------------|
| Frontend | `client/dist/` | Production |
| Backend | `server/dist/` | Production |
| Frontend Dev | `localhost:5173` | Development |
| Backend Dev | `localhost:5000` | Development |

---

## Version Info
- Node.js: 18+
- npm: 9+
- React: 18.3.1
- Express: 5.2.1
- TypeScript: 6.0.3 (backend), 5.6.2 (frontend)
