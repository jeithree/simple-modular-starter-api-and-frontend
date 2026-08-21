#!/bin/bash

set -e

PROJECT_DIR="/home/user-frontend/htdocs/app.jeitdev.com"

cd "$PROJECT_DIR"

git pull origin main

cd frontend
npm ci
npm run build

pm2 reload ecosystem.config.js --update-env