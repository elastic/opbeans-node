'use strict'

var pg = require('pg')
var conf = require('./config')

var pool = new pg.Pool(conf.pg)

exports.client = function (cb) {
  pool.connect(cb)
}
