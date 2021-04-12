'use stirct'

const redis = require('redis')
const conf = require('./config')

module.exports = redis.createClient(conf.redis)
