#!/usr/bin/env bash

source frontend
npm i
npm run build
source backend
npm i

