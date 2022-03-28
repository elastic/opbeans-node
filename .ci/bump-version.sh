#!/usr/bin/env bash
set -euxo pipefail

AGENT_VERSION="${1?Missing the APM Node.js agent version}"

## Use docker to bump the version to ensure the environment is easy to reproduce.
docker run --rm -t \
  --user $UID \
  -e HOME=/tmp \
  -e AGENT_VERSION="${AGENT_VERSION}" \
  -w /app \
  -v "$(pwd):/app" \
  node:12-alpine /bin/sh -c "set -x
    CI=true npm install elastic-apm-node@${AGENT_VERSION}"


## Bump agent version in the Dockerfile
sed -ibck "s#\(org.label-schema.version=\)\(\".*\"\)\(.*\)#\1\"${AGENT_VERSION}\"\3#g" Dockerfile
rm -f Dockerfilebck

# Commit changes
git add package.json package-lock.json Dockerfile
git commit -m "fix(package): bump elastic-apm-node to v${AGENT_VERSION}"
