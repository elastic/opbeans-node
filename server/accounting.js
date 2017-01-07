'use strict'

var request = require('request')

exports.placeOrder = function (order, cb) {
  request.post('http://example.com/opbeans', order, function (err, res, body) {
    cb(err, body)
  })
}
