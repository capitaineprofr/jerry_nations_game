@echo off
chcp 65001 >nul
title Jerry Nations Game - Lancement Local
color 03

echo ================================================================
echo             JERRY NATIONS GAME - TEST LOCAL DU JEU
echo ================================================================
echo.
echo Ouverture de index.html dans votre navigateur web...
echo.

cd /d "%~dp0"
start "" "%~dp0index.html"

echo Le jeu a ete lance dans votre navigateur.
echo Bon developpement et bon test !
echo.
pause
