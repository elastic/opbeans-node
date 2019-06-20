'use strict'

const config = {
  apps: [{
    name: 'server',
    script: './server.js',
    instances: 1
  }]
}

if (process.env.WORKLOAD_DISABLED !== 'True') {
  config.apps.push({
    name: 'workload',
    script: './node_modules/.bin/workload',
    args: '-f .workload.js',
    instances: 1,
    restart_delay: 2000
  })
}

module.exports = config
