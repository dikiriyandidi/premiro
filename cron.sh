#!/usr/bin/env sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
#node --max_old_space_size=4096 /root/dbimport/index.js
cd /root/node/indigo/code
node --max_old_space_size=4096 cron.js $1