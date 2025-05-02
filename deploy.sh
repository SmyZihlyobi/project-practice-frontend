#!/bin/bash

echo "===== Starting Frontend Deployment ====="

echo ">>> Pulling latest changes from Git..."
if ! git pull; then
    echo "!!! Git pull failed. Aborting deployment."
    exit 1
fi
echo ">>> Git pull successful."

echo ">>> Rebuilding and restarting Docker containers..."
if ! docker compose up --build -d; then
    echo "!!! Docker Compose failed. Aborting deployment."
    exit 1
fi
echo ">>> Docker containers rebuilt and restarted successfully."

echo "===== Frontend Deployment Finished Successfully ====="

exit 0
