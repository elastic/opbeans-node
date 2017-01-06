'use strict'

var opbeat = require('opbeat')
var express = require('express')
var afterAll = require('after-all-results')
var db = require('./db')

var app = module.exports = new express.Router()

app.get('/products', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    var sql = 'SELECT p.id, p.name, p.stock, t.name AS type_name FROM products p ' +
      'LEFT JOIN product_types t ON p.type_id=t.id'

    client.query(sql, function (err, result) {
      done()
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/products/:id', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    var sql = 'SELECT p.*, t.name AS type_name FROM products p ' +
      'LEFT JOIN product_types t ON p.type_id=t.id ' +
      'WHERE p.id=$1'

    client.query(sql, [req.params.id], function (err, result) {
      done()
      if (err) return error(err, res)
      if (result.rows.length === 0) return res.status(404).end()
      res.json(result.rows[0])
    })
  })
})

app.get('/products/:id/customers', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    var sql = 'SELECT c.* FROM customers c ' +
      'LEFT JOIN orders o ON c.id=o.customer_id ' +
      'LEFT JOIN order_lines l ON o.id=l.order_id ' +
      'LEFT JOIN products p ON l.product_id=p.id ' +
      'WHERE p.id=$1'

    client.query(sql, [req.params.id], function (err, result) {
      done()
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/types', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    client.query('SELECT * FROM product_types', function (err, result) {
      done()
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/types/:id', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    client.query('SELECT * FROM product_types WHERE id=$1', [req.params.id], function (err, result) {
      if (err) {
        done()
        error(err, res)
        return
      }

      var type = result.rows[0]

      if (!type) {
        done()
        res.status(404).end()
        return
      }

      client.query('SELECT id, name FROM products WHERE type_id=$1', [req.params.id], function (err, result) {
        done()
        if (err) return error(err, res)
        type.products = result.rows
        res.json(type)
      })
    })
  })
})

app.get('/customers', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    client.query('SELECT * FROM customers', function (err, result) {
      done()
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/customers/:id', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    client.query('SELECT * FROM customers WHERE id=$1', [req.params.id], function (err, result) {
      done()
      if (err) return error(err, res)
      if (result.rows.length === 0) return res.status(404).end()
      res.json(result.rows[0])
    })
  })
})

app.get('/orders', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    var sql = 'SELECT o.*, c.full_name AS customer_name FROM orders o ' +
      'LEFT JOIN customers c ON c.id=o.customer_id'

    client.query(sql, function (err, result) {
      done()
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

      if (results.some(function (result) { return result.length === 1 })) {
        res.status(400).end()
        return
      }

      client.query('BEGIN', function (err) {
        if (err) {
          done()
          error(err, res)
          return
        }

        var sql = 'INSERT INTO orders (customer_id) VALUES ($1) RETURNING id'

        client.query(sql, [req.body.customer_id], function (err, result) {
          if (err) return rollback(err)

          var next = afterAll(function (err) {
            if (err) return rollback(err)
            client.query('COMMIT', function (err) {
              if (err) return rollback(err)
              res.json({id: id})
            })
          })

          var id = result.rows[0].id

          req.body.lines.forEach(function (line) {
            var sql = 'INSERT INTO order_lines (order_id, product_id, amount) ' +
              'VALUES ($1, $2, $3)'
            client.query(sql, [id, line.id, line.amount], next())
          })
        })

        function rollback (err1) {
          client.query('ROLLBACK', function (err2) {
            done(err2)
            error(err1, res)
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
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    client.query('SELECT * FROM orders WHERE id=$1', [req.params.id], function (err, result) {
      if (err) {
        done()
        error(err, res)
        return
      }

      var order = result.rows[0]

      if (!order) {
        done()
        res.status(404).end()
        return
      }

      var sql = 'SELECT l.amount, p.* FROM order_lines l ' +
        'LEFT JOIN products p ON l.product_id=p.id ' +
        'WHERE l.order_id=$1'

      client.query(sql, [req.params.id], function (err, result) {
        done()
        if (err) return error(err, res)
        order.lines = result.rows
        res.json(order)
      })
    })
  })
})

function error (err, res) {
  opbeat.captureError(err)
  res.status(500).end()
}
