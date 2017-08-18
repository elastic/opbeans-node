'use strict'

var env = process.env.NODE_ENV || 'development'

if (env === 'development') require('dotenv').config()

var conf = module.exports = {
  env: env,
  server: {
    port: process.env.PORT || 3001
  },
  pg: {
    database: process.env.PGDATABASE || 'opbeans'
  },
  redis: process.env.REDIS_URL || null,
  apm: {
    active: env === 'production'
  }
}

switch (env) {
  case 'development':
    conf.server.url = 'http://localhost:' + conf.server.port
    break
  case 'production':
    conf.server.url = 'http://www.opbeans.com'
    break
  default:
    throw new Error('Unknown environment: ' + env)
}
