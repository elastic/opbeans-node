'use strict'

// this worker simulates a background job that uses custom transactions

var opbeat = require('opbeat')

queue(roast)
queue(grind)
queue(boil)
queue(pour)
queue(serve)

function roast () {
  opbeat.startTransaction('Roast beans', 'Brewing Bot')
  performSubTask(function () {
    opbeat.endTransaction()
    queue(roast)
  })
}

function grind () {
  opbeat.startTransaction('Grind beans', 'Brewing Bot')
  performSubTask(function () {
    opbeat.endTransaction()
    queue(grind)
  })
}

function boil () {
  opbeat.startTransaction('Boil water', 'Brewing Bot')
  performSubTask(function () {
    opbeat.endTransaction()
    queue(boil)
  })
}

function pour () {
  opbeat.startTransaction('Pour water', 'Brewing Bot')
  performSubTask(function () {
    opbeat.endTransaction()
    queue(pour)
  })
}

function serve () {
  opbeat.startTransaction('Serve to customer', 'Brewing Bot')
  performSubTask(function () {
    opbeat.endTransaction()
    queue(serve)
  })
}

function performSubTask (cb) {
  var trace = opbeat.buildTrace()
  if (trace) trace.start('perform some task')

  setTimeout(function () {
    if (trace) trace.end()
    cb()
  }, Math.random() * 1000)
}

function queue (cb) {
  setTimeout(cb, Math.random() * 60000 + 10000)
}
