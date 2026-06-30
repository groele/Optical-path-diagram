@echo off
setlocal EnableExtensions

title Optical Path System - One Click Launcher

set "APP_DIR=%~dp0"
set "HOST=127.0.0.1"
set "PORT=8000"
set "URL=http://%HOST%:%PORT%/"

cd /d "%APP_DIR%"

echo ====================================================
echo          Optical Path System One Click Launcher
echo ====================================================
echo [Project] %CD%
echo [URL]     %URL%
echo.

if not exist "index.html" (
    echo [ERROR] index.html was not found.
    echo Put this script in the project root folder and run it again.
    echo.
    pause
    exit /b 1
)

call :check_port
if errorlevel 1 (
    echo [INFO] %HOST%:%PORT% is already in use.
    echo [INFO] Opening the existing local service...
    start "" "%URL%"
    echo.
    pause
    exit /b 0
)

call :select_runtime
if not defined SERVE_CMD (
    echo [ERROR] No local static-server runtime was found.
    echo Install either Python 3 or Node.js, then run this script again.
    echo Python 3: https://www.python.org
    echo Node.js:  https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [INFO] Starting local server on port %PORT%...
echo [INFO] The browser will open automatically.
echo [INFO] Keep this window open. Closing it stops the server.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Milliseconds 800; Start-Process '%URL%'" >nul 2>nul
%SERVE_CMD%

echo.
echo [INFO] Local server stopped.
pause
exit /b 0

:check_port
powershell -NoProfile -ExecutionPolicy Bypass -Command "$listener = $null; try { $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Parse('%HOST%'), %PORT%); $listener.Start(); exit 0 } catch { exit 1 } finally { if ($listener) { $listener.Stop() } }" >nul 2>nul
exit /b %errorlevel%

:select_runtime
set "SERVE_CMD="

where py >nul 2>nul
if %errorlevel% equ 0 (
    set "SERVE_CMD=py -3 -m http.server %PORT% --bind %HOST%"
    echo [Runtime] Python Launcher ^(py -3^)
    exit /b 0
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    set "SERVE_CMD=python -m http.server %PORT% --bind %HOST%"
    echo [Runtime] Python
    exit /b 0
)

where python3 >nul 2>nul
if %errorlevel% equ 0 (
    set "SERVE_CMD=python3 -m http.server %PORT% --bind %HOST%"
    echo [Runtime] Python 3
    exit /b 0
)

where npx >nul 2>nul
if %errorlevel% equ 0 (
    set "SERVE_CMD=npx --yes http-server . -a %HOST% -p %PORT% -c-1"
    echo [Runtime] Node.js npx/http-server
    exit /b 0
)

exit /b 0
