#!/usr/bin/env bash

. /home/ec2-user/QuikaV2-Dashboard/
npm i --prefix frontend
npm run build --prefix frontend
npm i --prefix backend

exit 0
