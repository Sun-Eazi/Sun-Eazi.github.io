@echo off
title Bongo Traffic AI Launcher
echo ==========================================
echo BONGO TRAFFIC AI - LOCAL LAUNCHER
echo ==========================================
echo.
echo [1] Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo KOSA: Python haijapatikana! 
    echo Tafadhali install Python au tumia Chrome kufungua index.html moja kwa moja.
    echo (Lakini AI Classifier inahitaji Server kufanya kazi).
    pause
    exit /b
)

echo [2] Starting Local Server...
cd frontend
start http://localhost:8000
echo.
echo Server inafanya kazi kwenye: http://localhost:8000
echo USIFUNGE dirisha hili wakati unatumia website!
echo ------------------------------------------------
python -m http.server 8000
pause
