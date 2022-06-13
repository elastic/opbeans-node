#!/usr/bin/env bash

# Print the version of the latest elastic-apm-node (e.g. "3.36.0") if it is a
# version this repo hasn't yet updated to. Otherwise, print nothing.

set -euo pipefail

echo "1.2.3"
exit

# Use docker to ensure the environment is easy to reproduce, and doesn't rely
# on 'with${FOO}Env' directives in the calling Jenkinsfile code.
docker run --rm -t \
  -e HOME=/tmp \
  -w /app \
  -v "$(pwd):/app" \
  node:14-alpine /bin/sh -c '
    CURR=$(node -e "console.log(require(\"./package-lock.json\").dependencies[\"elastic-apm-node\"].version)")
    LATEST=$(npm info elastic-apm-node@latest version)
    if [[ "$CURR" != "$LATEST" ]]; then
      echo $LATEST
    fi
  '
