#!/usr/bin/env bash
set -euo pipefail

# ─── Global Tasks - Deploy Script ─────────────────────────────────────────────
# Usage: ./scripts/deploy.sh [env]
#   env: "dev" (default) | "prod"

ENV="${1:-dev}"
COMPOSE_FILE="infra/docker-compose${ENV:+.${ENV}}.yml"
COMPOSE="docker compose -f ${COMPOSE_FILE}"

echo "=== Deploying Global Tasks [${ENV}] ==="

# 1. Pull latest
echo "--- Pulling latest changes ---"
git pull origin main

# 2. Build images
echo "--- Building images ---"
${COMPOSE} build --parallel

# 3. Start services
echo "--- Starting services ---"
${COMPOSE} up -d --remove-orphans

# 4. Health check
echo "--- Health check ---"
sleep 5
${COMPOSE} ps

# 5. Clean up
echo "--- Cleaning up ---"
docker image prune -f

echo "=== Deploy complete ==="
echo "Frontend: http://localhost:3000"
echo "API:      http://localhost:8000"
echo "MCP:      http://localhost:3100"
