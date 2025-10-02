@echo off
echo Adding subdomain entries to hosts file...
echo.
echo Adding dir.localhost...
echo 127.0.0.1 dir.localhost >> C:\Windows\System32\drivers\etc\hosts
echo Adding vendor.localhost...
echo 127.0.0.1 vendor.localhost >> C:\Windows\System32\drivers\etc\hosts
echo Adding admin.localhost...
echo 127.0.0.1 admin.localhost >> C:\Windows\System32\drivers\etc\hosts
echo Adding support.localhost...
echo 127.0.0.1 support.localhost >> C:\Windows\System32\drivers\etc\hosts
echo Adding customer.localhost...
echo 127.0.0.1 customer.localhost >> C:\Windows\System32\drivers\etc\hosts
echo.
echo Done! Entries added to hosts file.
echo.
echo Test these URLs now:
echo - http://dir.localhost:3000
echo - http://vendor.localhost:3000
echo - http://admin.localhost:3000
echo - http://support.localhost:3000
echo - http://customer.localhost:3000
echo.
echo Note: Restart your browser for changes to take effect.
pause
