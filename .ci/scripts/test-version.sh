#!/bin/bash

test $(jq -r '.dependencies."elastic-apm-node".version' package-lock.json) != $1

exit $?