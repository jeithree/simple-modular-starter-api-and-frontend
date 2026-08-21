#!/bin/bash

set -e

echo "HOME=$HOME"
echo "NVM_DIR=$NVM_DIR"

export NVM_DIR="$HOME/.nvm"

echo "NVM_DIR=$NVM_DIR"

source "$NVM_DIR/nvm.sh"

echo "PATH=$PATH"
echo "npm=$(command -v npm)"
echo "node=$(command -v node)"
echo "pm2=$(command -v pm2)"

exit 0