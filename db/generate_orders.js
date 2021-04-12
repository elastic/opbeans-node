'use strict'

const pg = require('pg')
const afterAll = require('after-all-results')
const conf = require('../server/config')

const amount = parseInt(process.argv[2], 10)

if (!amount) throw new Error('Amount not specified!')

const client = new pg.Client(conf.pg)

client.connect(function (err) {
  if (err) throw err

  const next = afterAll(function (err, results) {
    if (err) throw err

    const products = results[0].rows
    const customers = results[1].rows

    const next = afterAll(function (err) {
      if (err) throw err
      client.end(function (err) {
        if (err) throw err
      })
    })

    for (let n = 0; n < amount; n++) {
      createOrder(randomId(customers), randomOrderLines(products), next())
    }
  })

  client.query('SELECT id FROM products', next())
  client.query('SELECT id FROM customers', next())

  function createOrder (customer, lines, cb) {
    const sql = 'INSERT INTO orders (customer_id) VALUES ($1) RETURNING id'
    client.query(sql, [customer], function (err, result) {
      if (err) return cb(err)
      const next = afterAll(cb)
      const id = result.rows[0].id
      lines.forEach(function (line) {
        const sql = 'INSERT INTO order_lines (order_id, product_id, amount) VALUES ($1, $2, $3)'
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
  const amount = random(8)
  const result = []
  for (let n = 0; n < amount; n++) {
    result.push({
      id: randomId(products),
      amount: random(3)
    })
  }
  return result
}
