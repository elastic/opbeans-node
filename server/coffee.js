'use strict'

var express = require('express')

var app = module.exports = new express.Router()

app.get('/is-it-coffee-time', function (req, res) {
  if (req.paarms.level === 11) {
    res.send('Of course!')
  } else {
    res.send('You can\'t have any!')
  }
})
