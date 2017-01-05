'use strict'

var pg = require('pg')
var afterAll = require('after-all-results')
var conf = require('../server/config')

var amount = parseInt(process.argv[2], 10)

if (!amount) throw new Error('Amount not specified!')

var client = new pg.Client(conf.pg)

client.connect(function (err) {
  if (err) throw err

  var next = afterAll(function (err, results) {
    if (err) throw err

    var products = results[0].rows
    var customers = results[1].rows

    var next = afterAll(function (err) {
      if (err) throw err
      client.end(function (err) {
        if (err) throw err
      })
    })

    for (var n = 0; n < amount; n++) {
      createOrder(randomId(customers), randomOrderLines(products), next())
    }
  })

  client.query('SELECT id FROM products', next())
  client.query('SELECT id FROM customers', next())

  function createOrder (customer, lines, cb) {
    var sql = 'INSERT INTO orders (customer_id, date) VALUES ($1, now()) RETURNING id'
    client.query(sql, [customer], function (err, result) {
      if (err) return cb(err)
      var next = afterAll(cb)
      var id = result.rows[0].id
      lines.forEach(function (line) {
        var sql = 'INSERT INTO order_lines (order_id, product_id, amount) VALUES ($1, $2, $3)'
        client.query(sql, [id, line.id, line.amount], next())
      })
    })
  }
})

function random (max) {
  return Math.round(Math.random() * max)
}

function randomElm (arr) {
  if (arr.length === 0) throw new Error('empty table!')
  return arr[random(arr.length - 1)]
}

function randomId (arr) {
  return randomElm(arr).id
}

function randomOrderLines (products) {
  var amount = random(8)
  var result = []
  for (var n = 0; n < amount; n++) {
    result.push({
      id: randomId(products),
      amount: random(3)
    })
  }
  return result
}
