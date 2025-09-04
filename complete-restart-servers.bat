@echo off
echo 🔧 Complete Frontend-Backend Integration Restart
echo.

echo 1️⃣ Stopping existing processes...
taskkill /f /im "java.exe" 2>nul
taskkill /f /im "node.exe" 2>nul
timeout /t 3 >nul

echo.
echo 2️⃣ Starting Backend Server...
echo Navigating to backend directory...
cd /d "D:\itech-backend\itech-backend"

echo.
echo Cleaning and building backend...
start "Backend Server" cmd /k "mvn clean compile spring-boot:run && pause"

echo.
echo 3️⃣ Waiting for backend to start...
timeout /t 30 >nul

echo.
echo 4️⃣ Testing backend health...
curl -s http://localhost:8080/actuator/health
if %errorlevel%==0 (
    echo ✅ Backend is running
) else (
    echo ❌ Backend not yet ready, please wait...
)

echo.
echo 5️⃣ Starting Frontend Server...
cd /d "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"

echo.
echo Installing dependencies...
call npm install

echo.
echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev && pause"

echo.
echo 6️⃣ Testing Integration...
timeout /t 10 >nul
node complete-integration-test.js

echo.
echo 🎉 Complete Integration Setup Completed!
echo.
echo 📱 Access Points:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080/api/v1
echo Backend Health: http://localhost:8080/actuator/health
echo Vendor Login: http://localhost:3000/auth/vendor/login
echo.
echo 🧪 Test vendor login with any credentials - should work now!
pause