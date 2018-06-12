#!/bin/bash
set -e
mkdir -p ./.tmp
node -p "require('./config/pm2-config')" > ./.tmp/pm2-config.json
pm2=`find .. -path '*/.bin/pm2'|head -1`
echo $pm2
$pm2 start ./.tmp/pm2-config.json 
echo let\'s watch log for a while
$pm2 logs &
pid_logs=$!
sleep 5
kill $pid_logs

n_process_1=`$pm2 list|grep -E 'stop|error'|wc -l`
if [ $n_process_1 -gt 0 ]; then
  $pm2 list
  exit 1
fi
