#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

cd /home/user-api/htdocs/api.jeitdev.com/api

COMMIT=$(git rev-parse HEAD)

echo "Deploying API commit: $COMMIT"

npm ci
npx prisma migrate deploy

pm2 reload ecosystem.config.cjs --update-env

echo "Checking API health..."

curl --fail --silent --show-error \
  --retry 10 \
  --retry-delay 2 \
  http://127.0.0.1:5000/health

echo "API health check passed."
echo "API deployed successfully: $COMMIT"