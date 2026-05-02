# How to Build & Verify the Project

## Quick Start

### Option 1: Using Build Script (Recommended)

#### Windows Users
```bash
build.bat
```

#### Mac/Linux Users
```bash
chmod +x build.sh
./build.sh
```

Both scripts will:
- ✅ Build frontend and check for errors
- ✅ Build backend and check for errors  
- ✅ Show success/failure status for each

---

## Manual Build Commands

### Build Frontend Only
```bash
cd client
npm run build
```

**Expected Output (Success):**
```
✓ built in 2.34s
```

**Expected Output (Failure):**
```
error TS2322: Type 'string' is not assignable to type 'number'
```

---

### Build Backend Only
```bash
cd server
npm run build
```

**Expected Output (Success):**
- No error messages
- Command completes and returns to prompt

**Expected Output (Failure):**
```
src/index.ts(10,5): error TS2304: Cannot find name 'app'
```

---

### Build Both (Step by Step)
```bash
# Step 1: Build frontend
cd client
npm run build

# Step 2: Build backend
cd ../server
npm run build

# Step 3: Check if both succeeded
echo "Done!"
```

---

## Verifying Build Success

### Frontend Build Verification ✅

1. **No TypeScript Errors**
   - Check for `error TS` messages

2. **Output Directory Exists**
   ```bash
   ls -la client/dist/  (Mac/Linux)
   dir client\dist\     (Windows)
   ```
   
3. **Check Built Files**
   - Should contain: `index.html`, `.js` files, `.css` files

### Backend Build Verification ✅

1. **No Compilation Errors**
   - Check for `error TS` messages

2. **Output Directory Exists**
   ```bash
   ls -la server/dist/  (Mac/Linux)
   dir server\dist\     (Windows)
   ```

3. **Check Built Files**
   - Should contain: `.js` files corresponding to `.ts` files

---

## Common Build Issues & Solutions

### Issue: `npm: command not found`
**Cause:** Node.js not installed
**Solution:**
1. Download from https://nodejs.org/
2. Install version 18 or higher
3. Verify: `node --version`

### Issue: `Cannot find module 'react'`
**Cause:** Dependencies not installed
**Solution:**
```bash
cd client
npm install
npm run build
```

### Issue: TypeScript Compilation Errors
**Cause:** Code has type errors
**Solution:**
1. Read the error message (shows file and line number)
2. Fix the code in the mentioned file
3. Run build again

Example error:
```
src/components/Hero.tsx:15:5 - error TS2322: 
Type 'string' is not assignable to type 'number'
```
Fix: Open `Hero.tsx` line 15 and correct the type.

### Issue: Port Already in Use
**Cause:** Another process using the same port
**Solution:**
```bash
# Kill the process using the port
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

---

## Step-by-Step Build Process

### 1. Install Dependencies (First Time Only)
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Build Frontend
```bash
cd client
npm run build
```

Check output:
- ✅ Should see: `✓ built in X.XXs`
- ❌ Should NOT see: `error TS`

### 3. Build Backend
```bash
cd ../server
npm run build
```

Check output:
- ✅ Should see: Command completes silently
- ❌ Should NOT see: `error TS`

### 4. Verify Output
```bash
# Check if dist directories exist
ls -la client/dist/
ls -la server/dist/
```

### 5. Summary
If you see:
- ✅ `client/dist/` directory with files
- ✅ `server/dist/` directory with files
- ✅ No error messages in console

**Then your build is successful! 🎉**

---

## Checking Build Output

### Frontend Build Output Location
```
client/
├── dist/
│   ├── index.html
│   ├── assets/
│   │   ├── index-XXXXX.js
│   │   └── index-XXXXX.css
│   └── ...
```

### Backend Build Output Location
```
server/
├── dist/
│   ├── index.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── testimonials.js
│   │   ├── enquiries.js
│   │   ├── auth.js
│   │   └── settings.js
│   ├── middleware/
│   │   └── auth.js
│   ├── db.js
│   └── types.js
```

---

## After Successful Build

### Run Frontend
```bash
cd client
npm run preview
# Opens at http://localhost:4173
```

### Run Backend
```bash
cd ../server
npm start
# Runs at http://localhost:5000
```

### Run Both Together
```bash
# Terminal 1
cd client
npm run dev

# Terminal 2
cd server
npm run dev
```

---

## Deployment

### Deploy Frontend to Vercel
```bash
cd client
npm run build
# Push to GitHub
# Vercel auto-deploys from GitHub
```

### Deploy Backend to Render
```bash
cd server
npm run build
# Push to GitHub
# Render auto-deploys from GitHub
```

---

## Troubleshooting Checklist

- [ ] Node.js version 18+ installed
- [ ] npm version 9+ installed
- [ ] Run `npm install` in both client and server
- [ ] No `node_modules` conflicts (run `npm install` in correct directory)
- [ ] All files saved before building
- [ ] No syntax errors in code
- [ ] No missing imports
- [ ] Environment variables configured (.env file)
- [ ] Port 5173 and 5000 are available

---

## Quick Help

| Task | Command |
|------|---------|
| Build everything | `./build.sh` (Mac/Linux) or `build.bat` (Windows) |
| Build frontend | `cd client && npm run build` |
| Build backend | `cd server && npm run build` |
| Check Node version | `node --version` |
| Check npm version | `npm version` |
| Install dependencies | `npm install` |
| Run in development | `npm run dev` |
| Preview build | `npm run preview` |

---

## Need More Help?

See `BUILD_GUIDE.md` for detailed information about each component.

Remember: **If your build succeeds, you'll see no error messages!** ✅
