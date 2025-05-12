#!/bin/bash
set -e

echo "===== Starting Frontend Deployment ====="

if ! command -v docker &> /dev/null; then
    echo "!!! Docker could not be found. Please install Docker. Aborting deployment."
    exit 1
fi
echo ">>> Docker command found."

if ! docker info &> /dev/null; then
    echo "!!! Docker daemon is not running or not accessible. Please start Docker and ensure permissions. Aborting deployment."
    exit 1
fi
echo ">>> Docker daemon is running."


DOCKER_COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    echo ">>> Using 'docker-compose' (v1)."
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    echo ">>> Using 'docker compose' (v2)."
else
    echo "!!! Neither 'docker-compose' (v1) nor 'docker compose' (v2) could be found. Please install Docker Compose. Aborting deployment."
    exit 1
fi

echo ">>> Pulling latest changes from Git..."

GIT_PULL_OUTPUT=$(git pull 2>&1)
GIT_PULL_STATUS=$?

echo "$GIT_PULL_OUTPUT"

if [ $GIT_PULL_STATUS -ne 0 ]; then
    echo "!!! Git pull failed. Aborting deployment."
    echo "Error details:"
    echo "$GIT_PULL_OUTPUT"
    exit 1
fi
echo ">>> Git pull finished."


if echo "$GIT_PULL_OUTPUT" | grep -q "Already up to date."; then
    echo ">>> No changes detected by git pull. Skipping Docker container rebuild and restart."
else
    echo ">>> Changes detected by git pull. Rebuilding and restarting Docker containers using '$DOCKER_COMPOSE_CMD'..."
    if ! $DOCKER_COMPOSE_CMD up --build -d; then
        echo "!!! Docker Compose command failed. Aborting deployment."
        exit 1
    fi
    echo ">>> Docker containers rebuilt and restarted successfully."

    echo ">>> Pruning old Docker images (dangling and unused)..."
    # using true just for script dont crash
    docker image prune -af || true
    echo ">>> Docker image pruning finished (or skipped)."
fi

echo "===== Frontend Deployment Finished Successfully ====="
exit 0