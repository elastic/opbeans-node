'use strict'

const apm = require('elastic-apm-node')
const express = require('express')
const afterAll = require('after-all-results')
const db = require('./db')
const redis = require('./redis')
const accounting = require('./accounting')

const app = module.exports = new express.Router()

app.get('/stats', function (req, res) {
  const next = afterAll(function (err, results) {
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

  const done = next()
  const sql = 'SELECT product_id, COUNT(product_id) AS amount ' +
    'FROM order_lines ' +
    'GROUP BY product_id'

  db.pool.query(sql, function (err, result) {
    if (err) return done(err)

    const orderedProducts = result.rows
    const next = afterAll(function (err, results) {
      if (err) return done(err)
      const result = { revenue: 0, cost: 0, profit: 0 }
      results.forEach(function (r, index) {
        const product = r.rows[0]
        const amount = orderedProducts[index].amount
        const cost = product.cost * amount
        const revenue = product.selling_price * amount
        result.revenue += revenue
        result.cost += cost
        result.profit += revenue - cost
      })
      done(null, result)
    })

    orderedProducts.forEach(function (row) {
      const sql = 'SELECT cost, selling_price FROM products WHERE id=$1'
      db.pool.query(sql, [row.product_id], next())
    })
  })
})

app.get('/products', function (req, res) {
  redis.get('products', function (err, obj) {
    if (err) apm.captureError(err)
    else if (obj) return res.json(obj)

    const sql = 'SELECT p.id, p.sku, p.name, p.stock, t.name AS type_name FROM products p ' +
      'LEFT JOIN product_types t ON p.type_id=t.id'

    db.pool.query(sql, function (err, result) {
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.get('/products/top', function (req, res) {
  const sql = 'SELECT product_id, COUNT(product_id) AS amount ' +
    'FROM order_lines ' +
    'GROUP BY product_id ' +
    'LIMIT 3'

  db.pool.query(sql, function (err, result) {
    if (err) return error(err, res)

    const next = afterAll(function (err, results) {
      if (err) return error(err, res)
      const top = result.rows.map(function (row, index) {
        const product = results[index].rows[0]
        product.sold = row.amount
        return product
      })
      res.json(top)
    })

    result.rows.forEach(function (row) {
      const sql = 'SELECT id, sku, name, stock FROM products WHERE id=$1'
      db.pool.query(sql, [row.product_id], next())
    })
  })
})

app.get('/products/:id', function (req, res) {
  const sql = 'SELECT p.*, t.name AS type_name FROM products p ' +
    'LEFT JOIN product_types t ON p.type_id=t.id ' +
    'WHERE p.id=$1'

  db.pool.query(sql, [req.params.id], function (err, result) {
    if (err) return error(err, res)
    if (result.rowCount === 0) return res.status(404).end()
    res.json(result.rows[0])
  })
})

app.get('/products/:id/customers', function (req, res) {
  const limit = req.query.limit || 1000
  const sql = 'SELECT c.* FROM customers c ' +
    'LEFT JOIN orders o ON c.id=o.customer_id ' +
    'LEFT JOIN order_lines l ON o.id=l.order_id ' +
    'LEFT JOIN products p ON l.product_id=p.id ' +
    'WHERE p.id=$1 ' +
    'LIMIT $2'

  db.pool.query(sql, [req.params.id, limit], function (err, result) {
    if (err) return error(err, res)
    if (!req.query.count) return res.json(result.rows)

    const next = afterAll(function (err, results) {
      if (err) return error(err, res)

      result.rows.forEach(function (row, index) {
        row.orderCount = results[index].rows.length
      })

      res.json(result.rows)
    })

    result.rows.forEach(function (row) {
      const sql = 'SELECT * FROM orders WHERE customer_id=$1'
      db.pool.query(sql, [row.id], next())
    })
  })
})

app.get('/types', function (req, res) {
  redis.get('types', function (err, obj) {
    if (err) apm.captureError(err)
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
    const type = result.rows[0]
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
    if (err) apm.captureError(err)
    else if (obj) return res.json(obj)

    const limit = req.query.limit || 1000
    const sql = 'SELECT * FROM customers LIMIT $1'

    db.pool.query(sql, [limit], function (err, result) {
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

app.post('/customers', function (req, res) {
  const customer = req.body
  const isEmail = /^([a-zA-Z0-9])(([-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/

  if (!customer.full_name || !customer.company_name || !isEmail.test(customer.email)) {
    res.status(400).end()
    return
  }

  const sql = 'INSERT INTO customers (full_name, company_name, email, address, postal_code, city, country) VALUES ($1, $2, $3, $4, $5, $6, $7)'
  const values = [
    customer.full_name,
    customer.company_name,
    customer.email,
    customer.address,
    customer.postal_code,
    customer.city,
    customer.country
  ]

  db.pool.query(sql, values, function (err) {
    if (err) return error(err, res)
    res.end()
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
    if (err) apm.captureError(err)
    else if (obj) return res.json(obj)

    const limit = req.query.limit || 1000
    const sql = 'SELECT o.*, c.full_name AS customer_name FROM orders o ' +
      'LEFT JOIN customers c ON c.id=o.customer_id ' +
      'LIMIT $1'

    db.pool.query(sql, [limit], function (err, result) {
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

    const next = afterAll(function (err, results) {
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

        const sql = 'INSERT INTO orders (customer_id) VALUES ($1) RETURNING id'

        client.query(sql, [req.body.customer_id], function (err, result) {
          if (err) return rollback(err)

          const id = result.rows[0].id

          const next = afterAll(function (err) {
            if (err) return rollback(err)
            accounting.placeOrder({ id: id }, function (err) {
              if (err) return rollback(err)
              client.query('COMMIT', function (err) {
                if (err) return rollback(err)
                done()
                redis.set('newest-order', id, function (err) {
                  if (err) return error(err, res)
                  res.json({ id: id })
                })
              })
            })
          })

          req.body.lines.forEach(function (line) {
            const sql = 'INSERT INTO order_lines (order_id, product_id, amount) ' +
              'VALUES ($1, $2, $3)'
            client.query(sql, [id, line.id, line.amount], next())
          })
        })

        function rollback (err) {
          apm.captureError(err)
          client.query('ROLLBACK', function (err) {
            if (err) apm.captureError(err)
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
    const order = result.rows[0]
    if (!order) return res.status(404).end()

    const sql = 'SELECT l.amount, p.* FROM order_lines l ' +
      'LEFT JOIN products p ON l.product_id=p.id ' +
      'WHERE l.order_id=$1'

    db.pool.query(sql, [req.params.id], function (err, result) {
      if (err) return error(err, res)
      order.lines = result.rows

      apm.setCustomContext({
        orderLines: result.rows.length
      })

      res.json(order)
    })
  })
})

function error (err, res) {
  apm.captureError(err)
  res.status(500).end()
}
