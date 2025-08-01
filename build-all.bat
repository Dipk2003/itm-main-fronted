@echo off
echo ========================================
echo   Complete Build Pipeline - ITM
echo ========================================
echo.

set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

:: Get build type from user
echo %BLUE%Select build type:%NC%
echo 1. Development Build
echo 2. Production Build
echo 3. Docker Build
echo 4. Full Pipeline (All builds)
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto dev_build
if "%choice%"=="2" goto prod_build
if "%choice%"=="3" goto docker_build
if "%choice%"=="4" goto full_pipeline
echo %RED%Invalid choice. Exiting.%NC%
pause
exit /b 1

:dev_build
echo %BLUE%[INFO]%NC% Starting development build...
call build.bat
goto end

:prod_build
echo %BLUE%[INFO]%NC% Starting production build...
call build-production.bat
goto end

:docker_build
echo %BLUE%[INFO]%NC% Starting Docker build...
echo %BLUE%[INFO]%NC% Building Docker image...
docker build -t itm-frontend:latest .
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Docker build failed
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Docker image built successfully
echo.
echo %BLUE%[INFO]%NC% Docker image: itm-frontend:latest
echo %BLUE%To run:%NC% docker run -p 3000:3000 itm-frontend:latest
goto end

:full_pipeline
echo %BLUE%[INFO]%NC% Starting full build pipeline...
echo.

:: Step 1: Development build
echo %BLUE%=== STEP 1: Development Build ===%NC%
call build.bat
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Development build failed
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Development build completed
echo.

:: Step 2: Production build
echo %BLUE%=== STEP 2: Production Build ===%NC%
call build-production.bat
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Production build failed
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Production build completed
echo.

:: Step 3: Docker build
echo %BLUE%=== STEP 3: Docker Build ===%NC%
docker build -t itm-frontend:latest .
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Docker build failed
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Docker build completed
echo.

:: Step 4: Generate comprehensive report
echo %BLUE%=== STEP 4: Generating Comprehensive Report ===%NC%
echo ======================================== > full-build-report.txt
echo   COMPLETE BUILD PIPELINE REPORT >> full-build-report.txt
echo ======================================== >> full-build-report.txt
echo Build Date: %date% %time% >> full-build-report.txt
echo. >> full-build-report.txt
echo BUILDS COMPLETED: >> full-build-report.txt
echo ✓ Development Build >> full-build-report.txt
echo ✓ Production Build >> full-build-report.txt
echo ✓ Docker Build >> full-build-report.txt
echo. >> full-build-report.txt
echo ARTIFACTS GENERATED: >> full-build-report.txt
echo - .next/ (Next.js build output) >> full-build-report.txt
echo - deployment/ (Production deployment package) >> full-build-report.txt
echo - Docker image: itm-frontend:latest >> full-build-report.txt
echo - build-report.txt (Development build report) >> full-build-report.txt
echo - production-build-report.txt (Production build report) >> full-build-report.txt
echo. >> full-build-report.txt
echo DEPLOYMENT OPTIONS: >> full-build-report.txt
echo 1. Traditional: Upload 'deployment' folder to server >> full-build-report.txt
echo 2. Docker: docker run -p 3000:3000 itm-frontend:latest >> full-build-report.txt
echo 3. Docker Compose: docker-compose up -d >> full-build-report.txt
echo. >> full-build-report.txt

echo %GREEN%[SUCCESS]%NC% Full pipeline completed successfully!
echo %BLUE%[INFO]%NC% Comprehensive report: full-build-report.txt

:end
echo.
echo ========================================
echo           BUILD COMPLETED
echo ========================================
echo %GREEN%✓ Build process finished successfully%NC%
echo.
echo %BLUE%Available artifacts:%NC%
if exist ".next" echo   - .next/ (Next.js build)
if exist "deployment" echo   - deployment/ (Production package)
if exist "build-report.txt" echo   - build-report.txt
if exist "production-build-report.txt" echo   - production-build-report.txt
if exist "full-build-report.txt" echo   - full-build-report.txt
echo.
echo %BLUE%Next steps:%NC%
echo   1. Test the build: npm start
echo   2. Deploy to server
echo   3. Monitor application
echo.
pause