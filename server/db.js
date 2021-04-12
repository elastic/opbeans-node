'use strict'

const pg = require('pg')
const conf = require('./config')

const pool = new pg.Pool(conf.pg)

exports.pool = pool

exports.client = function (cb) {
  pool.connect(cb)
}
