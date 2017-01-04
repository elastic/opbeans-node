'use strict'

var opbeat = require('opbeat').start({
  active: process.env.NODE_ENV === 'production'
})

var express = require('express')

var app = express()

app.use(express.static('client/build'))
app.use('/api', require('./server/routes'))
app.use(opbeat.middleware.express())

var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port
  console.log('server is listening on port', port)
})
