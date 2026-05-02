@echo off
REM Build script for Windows
REM This script builds both frontend and backend

echo.
echo ========================================
echo Building Shree Tirupati Metal Cast
echo ========================================
echo.

REM Build Frontend
echo [1/2] Building Frontend...
cd client
call npm run build
if %ERRORLEVEL% neq 0 (
  echo.
  echo ❌ Frontend build FAILED
  cd ..
  goto build_failed
)
echo ✅ Frontend build SUCCESS
cd ..

echo.

REM Build Backend
echo [2/2] Building Backend...
cd server
call npm run build
if %ERRORLEVEL% neq 0 (
  echo.
  echo ❌ Backend build FAILED
  cd ..
  goto build_failed
)
echo ✅ Backend build SUCCESS
cd ..

echo.
echo ========================================
echo 🎉 ALL BUILDS SUCCESSFUL!
echo ========================================
echo.
echo Frontend output: client/dist/
echo Backend output: server/dist/
echo.
exit /b 0

:build_failed
echo.
echo ========================================
echo ⚠️ BUILD FAILED
echo ========================================
echo.
echo Check the errors above and fix them.
echo.
exit /b 1
