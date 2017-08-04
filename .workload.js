'use strict'

var opbeat = require('opbeat').start({
  apiHost: process.env.WORKLOAD_OPBEAT_API_HOST,
  apiPort: process.env.WORKLOAD_OPBEAT_API_PORT,
  apiHttps: process.env.WORKLOAD_OPBEAT_API_HTTPS,
  appName: process.env.WORKLOAD_OPBEAT_APP_NAME,
  active: process.env.NODE_ENV === 'production'
})

var Workload = require('workload')
var conf = require('./server/config')
var url = conf.server.url + '/'
var api = url + 'api/'

module.exports = {
  max: 120,
  filters: [
    Workload.stdFilters.expand,
    Workload.stdFilters.workdays,
    fillOutOrder
  ],
  requests: [
    {weight: 10, url: url},
    {weight: 10, url: url + 'favicon.ico'},
    {weight: 1, url: url, method: 'OPTIONS'},

    // api
    {weight: 8, url: api + 'stats'},
    {weight: 7, url: api + 'products'},
    {weight: 8, url: api + 'products/top'},
    {weight: 6, url: api + 'products/{1..6}'},
    {weight: 3, url: api + 'products/{1..6}/customers'},
    {weight: 1, url: api + 'products/5/customers?count=orders&limit=50'},
    {weight: 3, url: api + 'types'},
    {weight: 3, url: api + 'types/{1..3}'},
    {weight: 5, url: api + 'customers'},
    {weight: 4, url: api + 'customers/{1..1000}'},
    {weight: 7, url: api + 'orders'},
    {weight: 1, url: api + 'orders', method: 'POST'},
    {weight: 6, url: api + 'orders/{1..500}'},

    // errors
    {weight: 2, url: url + 'log-error'},
    {weight: 2, url: url + 'log-message'},
    {weight: 1, url: url + 'is-it-coffee-time'},
    {weight: 1, url: url + 'throw-error'},
    {weight: 0.25, url: url + 'throw-async-error'}
  ]
}

function fillOutOrder (req, next) {
  if (req.method === 'POST' && req.url === api + 'orders') {
    var order = {
      customer_id: randId(1000),
      lines: []
    }
    for (var n = 0; n < 5; n++) {
      order.lines.push({id: randId(3), amount: rand(3) + 1})
    }
    req.json = order
  }
  next(req)
}

function rand (max) {
  return Math.round(Math.random() * max)
}

function randId (max) {
  return rand(max - 1) + 1
}
