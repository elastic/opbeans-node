'use strict'

var pkg = require('../package')
var env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  require('dotenv').config()
  env = process.env.NODE_ENV || env // in case dotenv changes NODE_ENV
}

var conf = module.exports = {
  env: env,
  server: {
    protocol: process.env.OPBEANS_SERVER_PROTOCOL || 'http:',
    auth: process.env.OPBEANS_SERVER_AUTH || '',
    hostname: process.env.OPBEANS_SERVER_HOSTNAME || 'localhost',
    port: process.env.OPBEANS_SERVER_PORT || process.env.PORT || 3000,
    port2: process.env.OPBEANS_SERVER_PORT2 || 3001
  },
  pg: {
    database: process.env.PGDATABASE || 'opbeans'
  },
  redis: process.env.REDIS_URL || null,
  apm: {
    serviceName: process.ELASTIC_APM_SERVICE_NAME || pkg.name,
    serviceVersion: process.ELASTIC_APM_SERVICE_VERSION || pkg.version,
    active: env === 'production'
  }
}

conf.server.url = conf.server.protocol + '//' +
  (conf.server.auth ? conf.server.auth + '@' : '') +
  conf.server.hostname +
  (conf.server.port ? ':' + conf.server.port : '')
