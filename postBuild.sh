#!/usr/bin/env bash

cd /home/ec2-user/QuikaV2-Dashboard/ && pm2 start ./backend/server.js

exit 0