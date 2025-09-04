@echo off
echo 🆘 EMERGENCY BACKEND RESTART WITH OPEN SECURITY
echo.

echo Stopping all Java processes...
taskkill /f /im "java.exe" 2>nul
timeout /t 3 >nul

echo Navigating to backend directory...
cd /d "D:\itech-backend\itech-backend"

echo.
echo 🚨 STARTING WITH EMERGENCY DEBUG CONFIGURATION
echo This will disable ALL security temporarily for testing
echo.

echo Building and starting backend with emergency profile...
mvn clean compile spring-boot:run -Dspring.profiles.active=emergency

pause