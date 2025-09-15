# PowerShell script to add local subdomain entries to hosts file
# Run this as Administrator

$hostsFile = "C:\Windows\System32\drivers\etc\hosts"

# Entries to add
$entries = @(
    "127.0.0.1 dir.localhost",
    "127.0.0.1 vendor.localhost", 
    "127.0.0.1 admin.localhost",
    "127.0.0.1 support.localhost",
    "127.0.0.1 customer.localhost"
)

Write-Host "Adding subdomain entries to hosts file..."
Write-Host "Hosts file location: $hostsFile"
Write-Host ""

# Check if running as admin
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit
}

# Read current hosts file
$currentHosts = Get-Content $hostsFile -ErrorAction SilentlyContinue

# Add entries if they don't exist
$added = 0
foreach ($entry in $entries) {
    if ($currentHosts -notcontains $entry) {
        Add-Content -Path $hostsFile -Value $entry
        Write-Host "Added: $entry" -ForegroundColor Green
        $added++
    } else {
        Write-Host "Already exists: $entry" -ForegroundColor Yellow
    }
}

Write-Host ""
if ($added -gt 0) {
    Write-Host "Successfully added $added entries to hosts file!" -ForegroundColor Green
} else {
    Write-Host "All entries already exist in hosts file!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "You can now test these URLs:"
Write-Host "- http://dir.localhost:3000" -ForegroundColor Cyan
Write-Host "- http://vendor.localhost:3000" -ForegroundColor Cyan  
Write-Host "- http://admin.localhost:3000" -ForegroundColor Cyan
Write-Host "- http://support.localhost:3000" -ForegroundColor Cyan
Write-Host "- http://customer.localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: You may need to restart your browser for changes to take effect."
Write-Host ""
pause
