'use strict'

// this worker simulates a background job that uses custom transactions

var apm = require('elastic-apm-node')
var running = false

exports.start = function () {
  running = true
  queue(processPayment)
  queue(processCompletedOrder)
  queue(updateShippingStatus)
}

exports.stop = function () {
  running = false
}

function processPayment () {
  if (!running) return

  apm.startTransaction('Process payment', 'Worker')
  performSubTasks(['Validate CC', 'Reserve funds'], function () {
    apm.endTransaction()
    queue(processPayment)
  })
}

function processCompletedOrder () {
  if (!running) return

  apm.startTransaction('Process completed order', 'Worker')
  performSubTasks(['Send receipt email', 'Update inventory'], function () {
    apm.endTransaction()
    queue(processCompletedOrder)
  })
}

function updateShippingStatus () {
  if (!running) return

  apm.startTransaction('Update shipping status', 'Worker')
  performSubTasks(['Fetch package status for all orders', 'Send tracking emails'], function () {
    apm.endTransaction()
    queue(updateShippingStatus)
  })
}

function performSubTasks (tasks, cb) {
  if (!running) return

  performSubTask(tasks.shift(), function () {
    if (tasks.length === 0) return cb()
    setTimeout(function () {
      performSubTasks(tasks, cb)
    }, Math.random() * 20).unref()
  })
}

function performSubTask (name, cb) {
  if (!running) return

  var span = apm.startSpan(name)

  setTimeout(function () {
    if (span) span.end()
    cb()
  }, Math.random() * 1000).unref()
}

function queue (cb) {
  setTimeout(cb, Math.random() * 60000 + 10000).unref()
}
