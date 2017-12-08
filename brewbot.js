'use strict'

// this worker simulates a background job that uses custom transactions

var apm = require('elastic-apm-node')

queue(roast)
queue(grind)
queue(boil)
queue(pour)
queue(serve)

function roast () {
  apm.startTransaction('Roast beans', 'Brewing Bot')
  performSubTask(function () {
    apm.endTransaction()
    queue(roast)
  })
}

function grind () {
  apm.startTransaction('Grind beans', 'Brewing Bot')
  performSubTask(function () {
    apm.endTransaction()
    queue(grind)
  })
}

function boil () {
  apm.startTransaction('Boil water', 'Brewing Bot')
  performSubTask(function () {
    apm.endTransaction()
    queue(boil)
  })
}

function pour () {
  apm.startTransaction('Pour water', 'Brewing Bot')
  performSubTask(function () {
    apm.endTransaction()
    queue(pour)
  })
}

function serve () {
  apm.startTransaction('Serve to customer', 'Brewing Bot')
  performSubTask(function () {
    apm.endTransaction()
    queue(serve)
  })
}

function performSubTask (cb) {
  // TODO: Rename everything to span instead of trace once we launch 6.2. For
  // now detect which version of the agent is running using this test.
  var trace = apm.buildSpan ? apm.buildSpan() : apm.buildTrace()
  if (trace) trace.start('perform some task')

  setTimeout(function () {
    if (trace) trace.end()
    cb()
  }, Math.random() * 1000)
}

function queue (cb) {
  setTimeout(cb, Math.random() * 60000 + 10000)
}
