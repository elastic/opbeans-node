#!/bin/bash

test $(jq -r '.packages."node_modules/elastic-apm-node".version' package-lock.json) != $1

exit $?
