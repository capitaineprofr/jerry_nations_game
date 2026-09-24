@echo off
chcp 65001 >nul
title Jerry Nations Game - Recuperation des modifications (Git Pull)
color 0B

echo ================================================================
echo       JERRY NATIONS GAME - SYNCHRONISATION AVANT DE COMMENCER
echo ================================================================
echo.
echo Telechargement des dernieres modifications depuis GitHub...
echo.

cd /d "%~dp0"

git pull origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo [SUCCES] Vos fichiers sont a jour avec GitHub !
    echo Vous pouvez commencer a travailler et tester le jeu.
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo [ATTENTION] La recuperation a rencontre un probleme.
    echo Verifiez votre connexion Internet ou si des conflits existent.
    echo ================================================================
)

echo.
pause
