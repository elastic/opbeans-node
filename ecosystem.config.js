module.exports = {
  apps: [{
    name: 'workload',
    script: './node_modules/.bin/workload',
    args: '-f .workload.js',
    instances: 1,
    restart_delay: 2000
  }, {
    name: 'server',
    script: './server.js',
    instances: 1
  }, {
    name: 'api',
    script: './api.js',
    instances: 1
  }]
}
