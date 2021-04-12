'use strict'

const express = require('express')
const apm = require('elastic-apm-node')

const app = module.exports = new express.Router()

app.get('/is-it-coffee-time', function (req, res) {
  if (req.paarms.level === 11) {
    res.send('Of course!')
  } else {
    res.send('You can\'t have any!')
  }
})

app.get('/log-error', function (req, res) {
  apm.captureError(new Error('foo'), function (err) {
    if (err) {
      res.status(500).send('could not capture error: ' + err.message)
    } else {
      res.status(500).send('error have been recorded')
    }
  })
})

app.get('/log-message', function (req, res) {
  apm.captureError('this is a string', function (err) {
    if (err) {
      res.status(500).send('could not capture error: ' + err.message)
    } else {
      res.status(500).send('error have been recorded')
    }
  })
})

app.get('/throw-error', function (req, res) {
  throw new Error('this will get captured by express')
})

app.get('/throw-async-error', function (req, res) {
  process.nextTick(function () {
    throw new Error('this will not get captured by express')
  })
})
