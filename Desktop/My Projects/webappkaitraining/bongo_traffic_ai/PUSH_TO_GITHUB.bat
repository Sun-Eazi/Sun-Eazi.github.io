@echo off
title Bongo Traffic AI - GitHub Push
echo ==========================================
echo   BONGO TRAFFIC AI - PUSH TO GITHUB
echo ==========================================
echo.

cd /d "%~dp0"

echo [1] Staging all changes...
git add .

echo [2] Creating commit...
set /p MSG="Commit message (Enter kukimbia default): "
if "%MSG%"=="" set MSG=Update - Bongo Traffic AI Classifier

git commit -m "%MSG%"

echo.
echo [3] Pushing to GitHub...
git push origin main

echo.
if %errorlevel% == 0 (
    echo ==========================================
    echo  IMEFANIKIWA! Imapushiwa GitHub.
    echo  GitHub Pages: https://sun-eazi.github.io/bongo-traffic-ai/
    echo ==========================================
) else (
    echo ==========================================
    echo  KOSA! Angalia internet au credentials.
    echo  Jaribu: git remote -v  kuona remote yako.
    echo ==========================================
)

pause
