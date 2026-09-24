@echo off
chcp 65001 >nul
title Jerry Nations Game - Configuration Initiale Collaborateur
color 0E

echo ================================================================
echo       CONFIGURATION INITIALE - JERRY NATIONS GAME
echo ================================================================
echo.
echo Verification de Git sur votre machine...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Git n'est pas installe ou pas dans votre PATH.
    echo Veuillez installer Git depuis : https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git est installe.
echo.
echo Configuration de votre identite Git pour vos contributions :
set /p USERNAME="Entrez votre prenom ou pseudo : "
set /p USEREMAIL="Entrez votre email : "

if not "%USERNAME%"=="" (
    git config user.name "%USERNAME%"
)
if not "%USEREMAIL%"=="" (
    git config user.email "%USEREMAIL%"
)

echo.
echo ================================================================
echo [SUCCES] Configuration terminee !
echo.
echo Pour travailler desormais :
echo  - Avant de coder : double-cliquez sur "1_DEBUT_TRAVAIL.bat"
echo  - Pour tester    : double-cliquez sur "LANCER_JEU_LOCAL.bat"
echo  - Apres avoir fini: double-cliquez sur "2_FIN_TRAVAIL.bat"
echo ================================================================
echo.
pause
