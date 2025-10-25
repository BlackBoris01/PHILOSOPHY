#!/bin/bash

# Быстрый запуск React приложения
echo "🚀 Запуск React приложения..."

# Очистка кэша если нужно
if [ "$1" = "--clean" ]; then
    echo "🧹 Очистка кэша..."
    rm -rf node_modules/.cache
    rm -rf dist
    rm -f .tsbuildinfo
fi

# Запуск
echo "▶️  Запуск dev сервера..."
npm start
