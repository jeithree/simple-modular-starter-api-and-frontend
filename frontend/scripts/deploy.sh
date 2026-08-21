#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

cd /home/user-frontend/htdocs/app.jeitdev.com

git pull origin main

cd frontend

npm ci
npm run build

pm2 reload ecosystem.config.cjs --update-env