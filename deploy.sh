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

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <branch_name>"
    echo "Error: Exactly one argument (branch name) is required."
    exit 1
fi

DEPLOY_BRANCH="$1"
echo ">>> Deployment requested for branch: $DEPLOY_BRANCH"

echo ">>> Resetting any local changes to HEAD..."
if ! git reset --hard HEAD; then
    echo "!!! Git reset --hard HEAD failed. Aborting deployment."
    exit 1
fi

echo ">>> Cleaning untracked files..."
git clean -fd

echo ">>> Local changes discarded."

echo ">>> Fetching latest from origin..."
if ! git fetch origin; then
    echo "!!! Git fetch failed. Aborting deployment."
    exit 1
fi
echo ">>> Git fetch successful."

echo ">>> Checking out branch $DEPLOY_BRANCH..."
if ! git checkout -B $DEPLOY_BRANCH origin/$DEPLOY_BRANCH; then
   echo "!!! Git checkout failed for branch $DEPLOY_BRANCH. Does the branch exist on origin? Aborting deployment."
   exit 1
fi
echo ">>> Git checkout successful to branch $DEPLOY_BRANCH."


echo ">>> Checking for changes between current HEAD and origin/$DEPLOY_BRANCH..."
if git diff --quiet origin/$DEPLOY_BRANCH HEAD; then
    echo ">>> No changes detected between current HEAD and origin/$DEPLOY_BRANCH. Skipping Docker container rebuild and restart."
else
    echo ">>> Changes detected. Performing git pull..."
    if ! git pull origin $DEPLOY_BRANCH; then
        echo "!!! Git pull failed for branch $DEPLOY_BRANCH. Aborting deployment."
        exit 1
    fi
    echo ">>> Git pull successful for branch $DEPLOY_BRANCH."

    echo ">>> Rebuilding and restarting Docker containers using '$DOCKER_COMPOSE_CMD'..."
    if ! $DOCKER_COMPOSE_CMD up --build -d; then
        echo "!!! Docker Compose command failed. Aborting deployment."
        exit 1
    fi
    echo ">>> Docker containers rebuilt and restarted successfully."

    echo ">>> Pruning old Docker images (dangling and unused)..."
    docker image prune -af || true
    echo ">>> Docker image pruning finished (or skipped)."
fi

echo "===== Frontend Deployment Finished Successfully ====="
exit 0
