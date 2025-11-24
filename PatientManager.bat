@echo off

REM Ścieżki do projektów:
set FRONTEND_DIR=.\FrontEnd
set BACKEND_DIR=.\


start "" cmd /k "cd /d %BACKEND_DIR% && dotnet run --launch-profile https"
timeout /t 3 /nobreak > nul

start cmd /k "cd /d %FRONTEND_DIR% && npm start"
