'use strict'

// this worker simulates a background job that uses custom transactions

var apm = require('elastic-apm-node')

queue(processPayment)
queue(processCompletedOrder)
queue(updateShippingStatus)

function processPayment () {
  apm.startTransaction('Process payment', 'Worker')
  performSubTasks(['Validate CC', 'Reserve funds'], function () {
    apm.endTransaction()
    queue(processPayment)
  })
}

function processCompletedOrder () {
  apm.startTransaction('Process completed order', 'Worker')
  performSubTasks(['Send receipt email', 'Update inventory'], function () {
    apm.endTransaction()
    queue(processCompletedOrder)
  })
}

function updateShippingStatus () {
  apm.startTransaction('Update shipping status', 'Worker')
  performSubTasks(['Fetch package status for all orders', 'Send tracking emails'], function () {
    apm.endTransaction()
    queue(updateShippingStatus)
  })
}

function performSubTasks (tasks, cb) {
  performSubTask(tasks.shift(), function () {
    if (tasks.length === 0) return cb()
    setTimeout(function () {
      performSubTasks(tasks, cb)
    }, Math.random() * 20)
  })
}

function performSubTask (name, cb) {
  var span = apm.buildSpan()
  if (span) span.start(name)

  setTimeout(function () {
    if (span) span.end()
    cb()
  }, Math.random() * 1000)
}

function queue (cb) {
  setTimeout(cb, Math.random() * 60000 + 10000)
}
