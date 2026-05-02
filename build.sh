#!/bin/bash
# Build script for Linux/Mac
# This script builds both frontend and backend

echo ""
echo "========================================"
echo "Building Shree Tirupati Metal Cast"
echo "========================================"
echo ""

# Build Frontend
echo "[1/2] Building Frontend..."
cd client
npm run build
FRONTEND_STATUS=$?

if [ $FRONTEND_STATUS -ne 0 ]; then
  echo ""
  echo "❌ Frontend build FAILED"
  cd ..
  exit 1
fi
echo "✅ Frontend build SUCCESS"
cd ..

echo ""

# Build Backend
echo "[2/2] Building Backend..."
cd server
npm run build
BACKEND_STATUS=$?

if [ $BACKEND_STATUS -ne 0 ]; then
  echo ""
  echo "❌ Backend build FAILED"
  cd ..
  exit 1
fi
echo "✅ Backend build SUCCESS"
cd ..

echo ""
echo "========================================"
echo "🎉 ALL BUILDS SUCCESSFUL!"
echo "========================================"
echo ""
echo "Frontend output: client/dist/"
echo "Backend output: server/dist/"
echo ""
exit 0
