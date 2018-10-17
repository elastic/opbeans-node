module.exports = {
  apps: [{
    name: 'server',
    script: './server.js',
    instances: 1
  }, {
    name: 'api',
    script: './api.js',
    instances: 1
  }]
}
