@echo off
chcp 65001 >nul
title Jerry Nations Game - Envoi des modifications (Git Push)
color 0A

echo ================================================================
echo         JERRY NATIONS GAME - ENVOI DU TRAVAIL SUR GITHUB
echo ================================================================
echo.

cd /d "%~dp0"

echo Verification des fichiers modifies...
git status -s
echo.

set /p MESSAGE="Entrez un court resume de vos modifications (ou appuyez sur ENTREE pour message auto) : "

if "%MESSAGE%"=="" (
    for /f "tokens=1-4 delims=/:. " %%a in ("%date% %time%") do (
        set MESSAGE=Mise a jour Jerry Nations Game du %date% a %time%
    )
)

echo.
echo 1/3 - Ajout des fichiers modifies...
git add .

echo 2/3 - Enregistrement du commit...
git commit -m "%MESSAGE%"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Information : Rien a enregistrer ou commit deja a jour.
)

echo 3/3 - Envoi vers GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================================
    echo [SUCCES] Vos modifications ont ete envoyees avec succes sur GitHub !
    echo Votre equipe peut desormais recuperer la derniere version.
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo [ATTENTION] L'envoi vers GitHub a echoue.
    echo Conseil : Lancez d'abord "1_DEBUT_TRAVAIL.bat" au cas ou des
    echo modifications auraient ete publiees entre-temps, puis reessayez.
    echo ================================================================
)

echo.
pause
