@echo off
echo 🚀 Запуск React приложения...

REM Очистка кэша если нужно
if "%1"=="--clean" (
    echo 🧹 Очистка кэша...
    rmdir /s /q node_modules\.cache 2>nul
    rmdir /s /q dist 2>nul
    del .tsbuildinfo 2>nul
)

REM Запуск
echo ▶️  Запуск dev сервера...
npm start
