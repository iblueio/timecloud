#!/bin/bash
set -e
pm2=`find .. -path '*/.bin/pm2'|head -1`
$pm2 stop ./.tmp/pm2-config.json
$pm2 kill
