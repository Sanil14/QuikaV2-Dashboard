#!/usr/bin/env bash

lsof -ti tcp:8080 | xargs kill
rm -rf /home/ec2-user/QuikaV2-Dashboard

exit 0