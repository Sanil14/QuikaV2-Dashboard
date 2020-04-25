#!/usr/bin/env bash

cd /home/ec2-user/QuikaV2-Dashboard/ && pm2 restart ./backend/server.js

exit 0