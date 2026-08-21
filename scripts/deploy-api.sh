#!/bin/bash

set -e

PROJECT_DIR="/home/user-api/htdocs/api.jeitdev.com"

cd "$PROJECT_DIR"

git pull origin main

cd api
npm ci

pm2 reload ecosystem.config.js --update-env