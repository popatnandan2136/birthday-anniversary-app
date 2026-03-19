@echo off
REM 🚀 MONGODB MIGRATION - COMPLETE SETUP SCRIPT (Windows)
REM This script sets up both backend and frontend for local development

echo.
echo 🎯 Birthday ^& Anniversary Website - MongoDB Migration Complete!
echo.
echo 📋 Setting up Backend...
echo ════════════════════════════════════════════════════════════

REM Check if in root directory
if not exist "package.json" (
    echo ❌ Please run this from the root directory of the project
    exit /b 1
)

REM Backend setup
echo.
echo 1️⃣  Installing backend dependencies...
cd api
call npm install

echo.
echo 2️⃣  Creating .env file from template...
if not exist ".env" (
    copy .env.example .env
    echo ✅ .env created. Please edit it with:
    echo    - MONGODB_URI (already provided)
    echo    - Cloudinary credentials
    echo    - JWT_SECRET (any strong string)
) else (
    echo ✅ .env already exists
)

cd ..

REM Frontend setup
echo.
echo 📋 Setting up Frontend...
echo ════════════════════════════════════════════════════════════
echo.
echo 3️⃣  Installing frontend dependencies...
call npm install

echo.
echo 4️⃣  Creating .env.local...
if not exist ".env.local" (
    (echo VITE_API_URL=http://localhost:3001/api) > .env.local
    echo ✅ .env.local created
) else (
    echo ✅ .env.local already exists
)

REM Final instructions
echo.
echo ════════════════════════════════════════════════════════════
echo ✅ Setup Complete!
echo ════════════════════════════════════════════════════════════
echo.
echo 📝 Before running the app, edit /api/.env:
echo    • Add your Cloudinary Cloud Name
echo    • Add your Cloudinary API Key
echo    • Add your Cloudinary API Secret
echo.
echo 🚀 To start development:
echo.
echo    Terminal 1 (Backend):
echo    ^> cd api
echo    ^> npm run dev
echo    → Server will run on http://localhost:3001
echo.
echo    Terminal 2 (Frontend):
echo    ^> npm run dev
echo    → App will run on http://localhost:5173
echo.
echo ✅ Then open http://localhost:5173 and test!
echo.
echo 📚 For more info, read:
echo    • QUICKSTART.md (5-minute setup)
echo    • MIGRATION_GUIDE.md (complete guide)
echo    • API_DOCUMENTATION.md (API reference)
echo.
pause
