'use stirct'

var redis = require('redis')
var conf = require('./config')

module.exports = redis.createClient(conf.redis)
