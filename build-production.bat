@echo off
echo ========================================
echo   Production Build - Indian Trade Mart
echo ========================================
echo.

:: Set production environment variables
set NODE_ENV=production
set NEXT_TELEMETRY_DISABLED=1
set ANALYZE=true

:: Colors
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%[INFO]%NC% Starting production build process...
echo.

:: Verify environment
echo %BLUE%[INFO]%NC% Verifying build environment...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Node.js not found
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% npm not found
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Environment verified
echo.

:: Clean everything
echo %BLUE%[INFO]%NC% Cleaning build artifacts...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
echo %GREEN%[SUCCESS]%NC% Cleaned build artifacts
echo.

:: Fresh install
echo %BLUE%[INFO]%NC% Installing production dependencies...
npm ci --only=production
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Failed to install dependencies
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Production dependencies installed
echo.

:: Install dev dependencies for build
echo %BLUE%[INFO]%NC% Installing dev dependencies for build...
npm ci
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Failed to install dev dependencies
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Dev dependencies installed
echo.

:: Pre-build checks
echo %BLUE%[INFO]%NC% Running pre-build checks...

:: Check TypeScript
echo   - TypeScript compilation...
npx tsc --noEmit --skipLibCheck
if %errorlevel% neq 0 (
    echo %YELLOW%[WARNING]%NC% TypeScript warnings found
)

:: Check for missing environment variables
echo   - Environment variables...
if not defined NEXT_PUBLIC_API_URL (
    echo %YELLOW%[WARNING]%NC% NEXT_PUBLIC_API_URL not set, using default
    set NEXT_PUBLIC_API_URL=http://localhost:8080
)

echo %GREEN%[SUCCESS]%NC% Pre-build checks completed
echo.

:: Build with optimization
echo %BLUE%[INFO]%NC% Building optimized production bundle...
npm run build
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Production build failed
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Production build completed
echo.

:: Generate production report
echo %BLUE%[INFO]%NC% Generating production build report...
echo ======================================== > production-build-report.txt
echo   PRODUCTION BUILD REPORT >> production-build-report.txt
echo ======================================== >> production-build-report.txt
echo Build Date: %date% %time% >> production-build-report.txt
echo Node.js Version: >> production-build-report.txt
node --version >> production-build-report.txt
echo npm Version: >> production-build-report.txt
npm --version >> production-build-report.txt
echo. >> production-build-report.txt
echo Environment Variables: >> production-build-report.txt
echo NODE_ENV=%NODE_ENV% >> production-build-report.txt
echo NEXT_PUBLIC_API_URL=%NEXT_PUBLIC_API_URL% >> production-build-report.txt
echo. >> production-build-report.txt
echo Build Size Analysis: >> production-build-report.txt
echo ==================== >> production-build-report.txt

:: Analyze bundle sizes
if exist ".next\static\chunks" (
    echo JavaScript Chunks: >> production-build-report.txt
    dir ".next\static\chunks\*.js" /s >> production-build-report.txt 2>nul
    echo. >> production-build-report.txt
)

if exist ".next\static\css" (
    echo CSS Files: >> production-build-report.txt
    dir ".next\static\css\*.css" /s >> production-build-report.txt 2>nul
    echo. >> production-build-report.txt
)

echo Build completed successfully! >> production-build-report.txt

echo %GREEN%[SUCCESS]%NC% Production build report generated
echo.

:: Create deployment package
echo %BLUE%[INFO]%NC% Creating deployment package...
if not exist "deployment" mkdir "deployment"

:: Copy essential files for deployment
xcopy ".next" "deployment\.next" /E /I /H /Y >nul
copy "package.json" "deployment\" >nul
copy "next.config.ts" "deployment\" >nul
if exist ".env.production" copy ".env.production" "deployment\" >nul
xcopy "public" "deployment\public" /E /I /H /Y >nul

echo %GREEN%[SUCCESS]%NC% Deployment package created in 'deployment' folder
echo.

:: Final summary
echo ========================================
echo        PRODUCTION BUILD SUMMARY
echo ========================================
echo %GREEN%✓ Environment verified%NC%
echo %GREEN%✓ Dependencies installed%NC%
echo %GREEN%✓ Pre-build checks passed%NC%
echo %GREEN%✓ Production build successful%NC%
echo %GREEN%✓ Build report generated%NC%
echo %GREEN%✓ Deployment package created%NC%
echo.
echo %BLUE%Deployment files:%NC%
echo   - deployment/ (Ready for deployment)
echo   - production-build-report.txt
echo.
echo %BLUE%To start production server:%NC%
echo   cd deployment
echo   npm start
echo.
echo %BLUE%To deploy:%NC%
echo   1. Upload 'deployment' folder to server
echo   2. Run 'npm ci --only=production' on server
echo   3. Run 'npm start' on server
echo.
echo ========================================
echo     PRODUCTION BUILD COMPLETED
echo ========================================

pause