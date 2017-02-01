'use strict'

var opbeat = require('opbeat')
var express = require('express')
var afterAll = require('after-all-results')
var db = require('./db')
var redis = require('./redis')
var accounting = require('./accounting')

var app = module.exports = new express.Router()

app.get('/stats', function (req, res) {
  var next = afterAll(function (err, results) {
    if (err) return error(err, res)
    res.json({
      products: results[0].rows[0].count,
      customers: results[1].rows[0].count,
      orders: results[2].rows[0].count,
      numbers: results[3]
    })
  })

  db.pool.query('SELECT COUNT(*) FROM products', next())
  db.pool.query('SELECT COUNT(*) FROM customers', next())
  db.pool.query('SELECT COUNT(*) FROM orders', next())

  var done = next()
  var sql = 'SELECT product_id, COUNT(product_id) AS amount ' +
    'FROM order_lines ' +
    'GROUP BY product_id'

  db.pool.query(sql, function (err, result) {
    if (err) return done(err)

    var orderedProducts = result.rows
    var next = afterAll(function (err, results) {
      if (err) return done(err)
      var result = {revenue: 0, cost: 0, profit: 0}
      results.forEach(function (r, index) {
        var product = r.rows[0]
        var amount = orderedProducts[index].amount
        var cost = product.cost * amount
        var revenue = product.selling_price * amount
        result.revenue += revenue
        result.cost += cost
        result.profit += revenue - cost
      })
      done(null, result)
    })

    orderedProducts.forEach(function (row) {
      var sql = 'SELECT cost, selling_price FROM products WHERE id=$1'
      db.pool.query(sql, [row.product_id], next())
    })
  })
})

app.get('/products', function (req, res) {
  redis.get('products', function (err, obj) {
    if (err) opbeat.captureError(err)
    else if (obj) return res.json(obj)

    var sql = 'SELECT p.id, p.sku, p.name, p.stock, t.name AS type_name FROM products p ' +
      'LEFT JOIN product_types t ON p.type_id=t.id'

    db.pool.query(sql, function (err, result) {
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/products/top', function (req, res) {
  var sql = 'SELECT product_id, COUNT(product_id) AS amount ' +
    'FROM order_lines ' +
    'GROUP BY product_id ' +
    'LIMIT 3'

  db.pool.query(sql, function (err, result) {
    if (err) return error(err, res)

    var next = afterAll(function (err, results) {
      if (err) return error(err, res)
      var top = result.rows.map(function (row, index) {
        var product = results[index].rows[0]
        product.sold = row.amount
        return product
      })
      res.json(top)
    })

    result.rows.forEach(function (row) {
      var sql = 'SELECT id, sku, name, stock FROM products WHERE id=$1'
      db.pool.query(sql, [row.product_id], next())
    })
  })
})

app.get('/products/:id', function (req, res) {
  var sql = 'SELECT p.*, t.name AS type_name FROM products p ' +
    'LEFT JOIN product_types t ON p.type_id=t.id ' +
    'WHERE p.id=$1'

  db.pool.query(sql, [req.params.id], function (err, result) {
    if (err) return error(err, res)
    if (result.rowCount === 0) return res.status(404).end()
    res.json(result.rows[0])
  })
})

app.get('/products/:id/customers', function (req, res) {
  var sql = 'SELECT c.* FROM customers c ' +
    'LEFT JOIN orders o ON c.id=o.customer_id ' +
    'LEFT JOIN order_lines l ON o.id=l.order_id ' +
    'LEFT JOIN products p ON l.product_id=p.id ' +
    'WHERE p.id=$1 ' +
    'LIMIT 1000'

  db.pool.query(sql, [req.params.id], function (err, result) {
    if (err) return error(err, res)
    res.json(result.rows)
  })
})

app.get('/types', function (req, res) {
  redis.get('types', function (err, obj) {
    if (err) opbeat.captureError(err)
    else if (obj) return res.json(obj)

    db.pool.query('SELECT * FROM product_types', function (err, result) {
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/types/:id', function (req, res) {
  db.pool.query('SELECT * FROM product_types WHERE id=$1', [req.params.id], function (err, result) {
    if (err) return error(err, res)
    var type = result.rows[0]
    if (!type) return res.status(404).end()

    db.pool.query('SELECT id, name FROM products WHERE type_id=$1', [req.params.id], function (err, result) {
      if (err) return error(err, res)
      type.products = result.rows
      res.json(type)
    })
  })
})

app.get('/customers', function (req, res) {
  redis.get('customers', function (err, obj) {
    if (err) opbeat.captureError(err)
    else if (obj) return res.json(obj)

    db.pool.query('SELECT * FROM customers LIMIT 1000', function (err, result) {
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/customers/:id', function (req, res) {
  db.pool.query('SELECT * FROM customers WHERE id=$1', [req.params.id], function (err, result) {
    if (err) return error(err, res)
    if (result.rowCount === 0) return res.status(404).end()
    res.json(result.rows[0])
  })
})

app.get('/orders', function (req, res) {
  redis.get('orders', function (err, obj) {
    if (err) opbeat.captureError(err)
    else if (obj) return res.json(obj)

    var sql = 'SELECT o.*, c.full_name AS customer_name FROM orders o ' +
      'LEFT JOIN customers c ON c.id=o.customer_id ' +
      'LIMIT 1000'

    db.pool.query(sql, function (err, result) {
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

/**
 * Example body:
 * {
 *   customer_id: 1,
 *   lines: [
 *     {id: 1, amount: 1}
 *   ]
 * }
 */
app.post('/orders', function (req, res) {
  if (!req.body.customer_id || !req.body.lines) {
    res.status(400).end()
    return
  }

  db.client(function (err, client, done) {
    if (err) return error(err, res)

    var next = afterAll(function (err, results) {
      if (err) {
        done()
        error(err, res)
        return
      }

      if (results.some(function (result) { return result.rowCount === 0 })) {
        done()
        res.status(400).end()
        return
      }

      client.query('BEGIN', function (err) {
        if (err) return rollback(err)

        var sql = 'INSERT INTO orders (customer_id) VALUES ($1) RETURNING id'

        client.query(sql, [req.body.customer_id], function (err, result) {
          if (err) return rollback(err)

          var id = result.rows[0].id

          var next = afterAll(function (err) {
            if (err) return rollback(err)
            accounting.placeOrder({id: id}, function (err) {
              if (err) return rollback(err)
              client.query('COMMIT', function (err) {
                if (err) return rollback(err)
                done()
                redis.set('newest-order', id, function (err) {
                  if (err) return error(err, res)
                  res.json({id: id})
                })
              })
            })
          })

          req.body.lines.forEach(function (line) {
            var sql = 'INSERT INTO order_lines (order_id, product_id, amount) ' +
              'VALUES ($1, $2, $3)'
            client.query(sql, [id, line.id, line.amount], next())
          })
        })

        function rollback (err) {
          opbeat.captureError(err)
          client.query('ROLLBACK', function (err) {
            if (err) opbeat.captureError(err)
            done(err)
            res.status(500).end()
          })
        }
      })
    })

    client.query('SELECT id FROM customers WHERE id=$1', [req.body.customer_id], next())
    req.body.lines.forEach(function (line) {
      client.query('SELECT id FROM products WHERE id=$1', [line.id], next())
    })
  })
})

app.get('/orders/:id', function (req, res) {
  db.pool.query('SELECT * FROM orders WHERE id=$1', [req.params.id], function (err, result) {
    if (err) return error(err, res)
    var order = result.rows[0]
    if (!order) return res.status(404).end()

    var sql = 'SELECT l.amount, p.* FROM order_lines l ' +
      'LEFT JOIN products p ON l.product_id=p.id ' +
      'WHERE l.order_id=$1'

    db.pool.query(sql, [req.params.id], function (err, result) {
      if (err) return error(err, res)
      order.lines = result.rows
      res.json(order)
    })
  })
})

function error (err, res) {
  opbeat.captureError(err)
  res.status(500).end()
}
