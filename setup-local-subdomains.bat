@echo off
echo Setting up local subdomains for development...
echo.
echo This script will add entries to your hosts file for local subdomain testing.
echo You need to run this as Administrator.
echo.
echo The following entries will be added to C:\Windows\System32\drivers\etc\hosts:
echo.
echo 127.0.0.1 dir.localhost
echo 127.0.0.1 vendor.localhost
echo 127.0.0.1 admin.localhost
echo 127.0.0.1 support.localhost
echo 127.0.0.1 customer.localhost
echo.
pause
echo.
echo Adding entries to hosts file...

echo 127.0.0.1 dir.localhost >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1 vendor.localhost >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1 admin.localhost >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1 support.localhost >> C:\Windows\System32\drivers\etc\hosts
echo 127.0.0.1 customer.localhost >> C:\Windows\System32\drivers\etc\hosts

echo.
echo Done! You can now test using:
echo - http://dir.localhost:3000
echo - http://vendor.localhost:3000
echo - http://admin.localhost:3000
echo - http://support.localhost:3000
echo - http://customer.localhost:3000
echo.
echo Note: You may need to restart your browser for changes to take effect.
pause
