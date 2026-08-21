#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

cd /home/user-frontend/htdocs/app.jeitdev.com/frontend

COMMIT=$(git rev-parse HEAD)

echo "Deploying frontend commit: $COMMIT"

npm ci
npm run build

pm2 reload ecosystem.config.cjs --update-env

# TODO: need to implement frontend health enpoint to be used here
# echo "Checking frontend health..."

# curl --fail --silent --show-error \
#   --connect-timeout 2 \
#   --max-time 5 \
#   --retry 30 \
#   --retry-delay 2 \
#   --retry-connrefused \
#   http://127.0.0.1:3000

# echo "Frontend health check passed."
echo "Frontend deployed successfully: $COMMIT"