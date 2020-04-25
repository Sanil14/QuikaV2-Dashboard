#!/usr/bin/env bash

source frontend
"$(which npm)" i
"$(which npm)" run build
source backend
"$(which npm)" i

