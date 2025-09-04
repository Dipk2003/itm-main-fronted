@echo off
echo 🔧 iTech Marketplace - Fix and Restart Backend
echo.

echo 1️⃣ Stopping any existing backend processes...
taskkill /f /im "java.exe" 2>nul
timeout /t 2 >nul

echo.
echo 2️⃣ Navigating to backend directory...
cd /d "D:\itech-backend\itech-backend"

echo.
echo 3️⃣ Checking if SecurityConfig.java was updated...
findstr /c:"/api/v1/auth/**" "src\main\java\com\itech\itech_backend\config\SecurityConfig.java" >nul
if %errorlevel%==0 (
    echo ✅ SecurityConfig.java has been updated with /api/v1/auth/** endpoint
) else (
    echo ❌ SecurityConfig.java needs manual update
    echo.
    echo Please add "/api/v1/auth/**" to the permitAll() section in SecurityConfig.java
    echo Line should be: .requestMatchers("/auth/**", "/api/v1/auth/**", "/actuator/**",
    echo.
    pause
)

echo.
echo 4️⃣ Checking MySQL connection...
mysql -u root -p -e "SELECT 1;" 2>nul
if %errorlevel%==0 (
    echo ✅ MySQL is accessible
) else (
    echo ❌ MySQL connection failed - please start MySQL service
    echo.
    echo Starting MySQL service...
    net start MySQL80 2>nul
)

echo.
echo 5️⃣ Building and starting backend...
echo This may take a few minutes...
mvn clean compile spring-boot:run

echo.
echo 6️⃣ Backend startup completed!
echo.
echo 🎯 Next steps:
echo 1. Open new terminal and run: node fix-403-cors-issue.js --test-cors
echo 2. Test vendor login at: http://localhost:3000/auth/vendor/login
echo 3. Backend should now accept API requests properly
echo.
pause
