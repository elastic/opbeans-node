'use strict'

var opbeat = require('opbeat')
var express = require('express')
var db = require('./db')

var app = module.exports = new express.Router()

app.get('/data', function (req, res) {
  db.client(function (err, client, done) {
    if (err) return error(err, res)

    client.query('SELECT $1::int AS number', ['1'], function (err, result) {
      done()
      if (err) return error(err, res)
      res.json(result.rows)
    })
  })
})

function error (err, res) {
  opbeat.captureError(err)
  res.status(500).end()
}
