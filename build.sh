#!/usr/bin/env bash

pathtoWebsite
npm i --prefix frontend
npm run build --prefix frontend
npm i --prefix backend

exit 0
