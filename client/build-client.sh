#!/usr/bin/env bash

if [ "$NODE_ENV" = production ]
  then
  npm run client-install && npm run client-build
fi
