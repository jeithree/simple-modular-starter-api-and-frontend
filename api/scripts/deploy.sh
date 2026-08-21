#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

cd /home/user-api/htdocs/api.jeitdev.com/api

npm ci
npx prisma migrate deploy

pm2 reload ecosystem.config.cjs --update-env