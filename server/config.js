'use strict'

var url = require('url')

var env = process.env.NODE_ENV || 'development'

if (env === 'development') require('dotenv').config()

if (process.env.DATABASE_URL) {
  var params = url.parse(process.env.DATABASE_URL);
  var auth = params.auth.split(':');

  var dbUrlConfig = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  }
}

var conf = module.exports = {
  env: env,
  server: {
    port: process.env.PORT || 3001
  },
  pg: dbUrlConfig || {
    database: process.env.PGDATABASE || 'opbeans'
  },
  redis: process.env.REDIS_URL || null,
  opbeat: {
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
