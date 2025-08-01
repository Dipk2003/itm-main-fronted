@echo off
echo ========================================
echo    Indian Trade Mart - Build Script
echo ========================================
echo.

:: Set build environment
set NODE_ENV=production
set NEXT_TELEMETRY_DISABLED=1

:: Colors for output
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

echo %BLUE%[INFO]%NC% Starting build process...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% npm is not installed or not in PATH
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Node.js and npm are available
echo.

:: Clean previous build
echo %BLUE%[INFO]%NC% Cleaning previous build...
if exist ".next" (
    rmdir /s /q ".next"
    echo %GREEN%[SUCCESS]%NC% Cleaned .next directory
)
if exist "out" (
    rmdir /s /q "out"
    echo %GREEN%[SUCCESS]%NC% Cleaned out directory
)
echo.

:: Install dependencies
echo %BLUE%[INFO]%NC% Installing dependencies...
npm ci
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Failed to install dependencies
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Dependencies installed successfully
echo.

:: Run type checking
echo %BLUE%[INFO]%NC% Running type checking...
npx tsc --noEmit
if %errorlevel% neq 0 (
    echo %YELLOW%[WARNING]%NC% Type checking completed with warnings
) else (
    echo %GREEN%[SUCCESS]%NC% Type checking passed
)
echo.

:: Run linting
echo %BLUE%[INFO]%NC% Running ESLint...
npm run lint
if %errorlevel% neq 0 (
    echo %YELLOW%[WARNING]%NC% Linting completed with warnings
) else (
    echo %GREEN%[SUCCESS]%NC% Linting passed
)
echo.

:: Build the application
echo %BLUE%[INFO]%NC% Building Next.js application...
npm run build
if %errorlevel% neq 0 (
    echo %RED%[ERROR]%NC% Build failed
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%NC% Build completed successfully
echo.

:: Generate build report
echo %BLUE%[INFO]%NC% Generating build report...
echo Build completed at: %date% %time% > build-report.txt
echo Node.js version: >> build-report.txt
node --version >> build-report.txt
echo npm version: >> build-report.txt
npm --version >> build-report.txt
echo. >> build-report.txt
echo Build size analysis: >> build-report.txt
dir .next\static\chunks\*.js /s >> build-report.txt 2>nul

echo %GREEN%[SUCCESS]%NC% Build report generated: build-report.txt
echo.

:: Display build summary
echo ========================================
echo           BUILD SUMMARY
echo ========================================
echo %GREEN%✓ Dependencies installed%NC%
echo %GREEN%✓ Type checking completed%NC%
echo %GREEN%✓ Linting completed%NC%
echo %GREEN%✓ Next.js build successful%NC%
echo %GREEN%✓ Build report generated%NC%
echo.
echo %BLUE%Build artifacts:%NC%
echo   - .next/ (Next.js build output)
echo   - build-report.txt (Build summary)
echo.
echo %BLUE%To start the production server:%NC%
echo   npm start
echo.
echo ========================================
echo        BUILD COMPLETED SUCCESSFULLY
echo ========================================

pause