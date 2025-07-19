# iTech Development Server Startup Script
# This script starts both backend and frontend servers for development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  iTech Development Environment Setup  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Define paths
$backendPath = "D:\itech-backend\itech-backend"
$frontendPath = "C:\Users\Dipanshu pandey\OneDrive\Desktop\itm-main-fronted-main"

# Function to check if Java is installed
function Check-Java {
    try {
        $javaVersion = java -version 2>&1 | Select-String "version"
        Write-Host "✅ Java is installed: $javaVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Java is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Java 21 or later and add it to your PATH" -ForegroundColor Yellow
        return $false
    }
}

# Function to check if Node.js is installed
function Check-Node {
    try {
        $nodeVersion = node --version
        Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Node.js and npm" -ForegroundColor Yellow
        return $false
    }
}

# Function to check if MySQL is running
function Check-MySQL {
    try {
        $mysqlProcess = Get-Process mysqld -ErrorAction SilentlyContinue
        if ($mysqlProcess) {
            Write-Host "✅ MySQL is running" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "⚠️  MySQL is not running" -ForegroundColor Yellow
            Write-Host "Please start MySQL server (XAMPP, WAMP, or standalone MySQL)" -ForegroundColor Yellow
            return $false
        }
    }
    catch {
        Write-Host "⚠️  Could not check MySQL status" -ForegroundColor Yellow
        return $false
    }
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
$javaOk = Check-Java
$nodeOk = Check-Node
$mysqlOk = Check-MySQL

if (-not $javaOk -or -not $nodeOk) {
    Write-Host ""
    Write-Host "❌ Prerequisites not met. Please install missing components and try again." -ForegroundColor Red
    exit 1
}

if (-not $mysqlOk) {
    Write-Host ""
    Write-Host "⚠️  MySQL is not running. Backend may fail to start." -ForegroundColor Yellow
    $continue = Read-Host "Do you want to continue anyway? (y/n)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        exit 1
    }
}

Write-Host ""
Write-Host "🚀 Starting development servers..." -ForegroundColor Green
Write-Host ""

# Start backend in a new PowerShell window
Write-Host "📚 Starting Backend Server (Port 8080)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList @(
    "-Command", 
    "cd '$backendPath'; Write-Host '=== iTech Backend Server ===' -ForegroundColor Cyan; Write-Host 'Starting Spring Boot application...' -ForegroundColor Yellow; ./mvnw.cmd spring-boot:run; Write-Host 'Backend server stopped. Press any key to close...' -ForegroundColor Red; Read-Host"
) -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep 3

# Start frontend in a new PowerShell window  
Write-Host "🌐 Starting Frontend Server (Port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList @(
    "-Command", 
    "cd '$frontendPath'; Write-Host '=== iTech Frontend Server ===' -ForegroundColor Cyan; Write-Host 'Installing dependencies (if needed)...' -ForegroundColor Yellow; npm install; Write-Host 'Starting Next.js development server...' -ForegroundColor Yellow; npm run dev; Write-Host 'Frontend server stopped. Press any key to close...' -ForegroundColor Red; Read-Host"
) -WindowStyle Normal

Write-Host ""
Write-Host "🎉 Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Server Information:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:8080" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Useful URLs:" -ForegroundColor Cyan
Write-Host "   Frontend Application: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API Health:   http://localhost:8080/actuator/health" -ForegroundColor White
Write-Host "   Backend API Test:     http://localhost:8080/test" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Both servers will open in separate windows" -ForegroundColor White
Write-Host "   - Backend takes 30-60 seconds to start completely" -ForegroundColor White
Write-Host "   - Frontend should start in 10-20 seconds" -ForegroundColor White
Write-Host "   - Check console outputs for any errors" -ForegroundColor White
Write-Host "   - To stop servers, close their respective windows or use Ctrl+C" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script..." -ForegroundColor Gray
Read-Host
