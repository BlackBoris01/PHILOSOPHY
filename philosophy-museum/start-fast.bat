@echo off
echo 🚀 Быстрый запуск React приложения...

REM Очистка кэша если нужно
if "%1"=="--clean" (
    echo 🧹 Очистка кэша...
    rmdir /s /q node_modules\.cache 2>nul
    rmdir /s /q dist 2>nul
    del .tsbuildinfo 2>nul
)

REM Быстрый запуск без лишних логов
echo ▶️  Запуск dev сервера (быстрый режим)...
npm run dev-fast
