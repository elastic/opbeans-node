'use strict'

require('dotenv').config()

var env = process.env.NODE_ENV || 'development'

var conf = module.exports = {
  env: env,
  server: {
    port: process.env.PORT || 3000
  },
  pg: {
    database: process.env.PGDATABASE || 'opbeans'
  },
  opbeat: {
    active: env === 'production'
  }
}

switch (env) {
  case 'development':
    conf.server.url = 'http://localhost:' + port
    break
  case 'production':
    conf.server.url = 'http://opbeans.com'
    break
  default:
    throw new Error('Unknown environment: ' + env)
}
