#!/bin/bash

set -e

cd /home/user-frontend/htdocs/app.jeitdev.com

git pull origin main

cd frontend

npm ci

npm run build

pm2 reload ecosystem.config.cjs --update-env