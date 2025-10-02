@echo off
echo 🚀 Restarting Indian Trade Mart Servers for Registration Fix Testing
echo.

REM Kill any existing processes on ports 3000 and 8080
echo 🔄 Stopping existing servers...
netstat -ano | findstr :3000 > nul && (
    echo Killing processes on port 3000
    FOR /F "tokens=5" %%G IN ('netstat -ano ^| findstr :3000') DO (
        taskkill /PID %%G /F > nul 2>&1
    )
) || (
    echo No process found on port 3000
)

netstat -ano | findstr :8080 > nul && (
    echo Killing processes on port 8080
    FOR /F "tokens=5" %%G IN ('netstat -ano ^| findstr :8080') DO (
        taskkill /PID %%G /F > nul 2>&1
    )
) || (
    echo No process found on port 8080
)

echo.
echo ⏰ Waiting 3 seconds for processes to terminate...
timeout /t 3 > nul

REM Clear Next.js cache
echo 🧹 Clearing Next.js cache...
if exist ".next" (
    rmdir /s /q ".next"
    echo Cache cleared
) else (
    echo No cache to clear
)

echo.
echo 🏗️ Starting Backend Server...
start "Backend Server" cmd /k "cd /d \"D:\itech-backend\itech-backend\" && mvn spring-boot:run"

echo ⏰ Waiting 10 seconds for backend to start...
timeout /t 10 > nul

echo.
echo 🌐 Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d \"%~dp0\" && npm run dev"

echo ⏰ Waiting 5 seconds for frontend to start...
timeout /t 5 > nul

echo.
echo 🧪 Opening test pages in browser...
start "" http://localhost:3000/auth/user/register
start "" http://localhost:3000/auth/vendor/register

echo.
echo 📋 Testing Instructions:
echo 1. Check if both pages load without errors
echo 2. Test buyer registration form submission
echo 3. Test vendor registration and check console for OTP logs
echo 4. If issues persist, check the console output in both server windows
echo.
echo ✅ Setup Complete! Both servers should be running.
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:8080
echo.
pause
