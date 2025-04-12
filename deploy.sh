#!/bin/bash

# Перейти в директорию скрипта (на всякий случай, если запускается из другого места)
# cd "$(dirname "$0")"

echo "===== Starting Frontend Deployment ====="

# 1. Получить последние изменения из Git
echo ">>> Pulling latest changes from Git..."
if ! git pull; then
    echo "!!! Git pull failed. Aborting deployment."
    exit 1
fi
echo ">>> Git pull successful."

# 2. Пересобрать и перезапустить контейнеры Docker Compose
echo ">>> Rebuilding and restarting Docker containers..."
if ! docker-compose up --build -d; then
    echo "!!! Docker Compose failed. Aborting deployment."
    exit 1
fi
echo ">>> Docker containers rebuilt and restarted successfully."

echo "===== Frontend Deployment Finished Successfully ====="

exit 0
