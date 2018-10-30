'use strict'

var conf = require('./server/config')
var logger = require('pino')({ level: 'trace' })
var apmConf = Object.assign({}, conf.apm, {
  serviceName: conf.apm.serviceName + '-api',
  logger: logger.child({ level: 'trace' })
})
var apm = require('elastic-apm-node').start(apmConf)

// Elastic APM needs to perform an async operation if an uncaught exception
// occurs. This ensures that we close the Express server before this happens to
// we don't keep accepting HTTP requests in the meantime
process.on('uncaughtException', function () {
  if (server) server.close()
})

// Ensure the Elastic APM queue is flushed before exiting the application in
// case of an uncaught exception
apm.handleUncaughtExceptions(function (err) {
  logger.error(err.stack)
  logger.error('Application encountered an uncaught exception. Flushing Elastic APM queue and exiting...')
  apm.flush(function (err) {
    if (err) logger.error(err)
    else logger.error('Elastic APM queue flushed!')
    process.exit(1)
  })
})

var express = require('express')

var app = express()

app.use(require('express-pino-logger')({ logger }))
app.use(function (req, res, next) {
  req.log.debug('request received')
  next()
})
app.use(require('body-parser').json())
app.use(function (req, res, next) {
  apm.setTag('foo', 'bar')
  apm.setTag('lorem', 'ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus, ipsum id scelerisque consequat, enim leo vulputate massa, vel ultricies ante neque ac risus. Curabitur tincidunt vitae sapien id pulvinar. Mauris eu vestibulum tortor. Integer sit amet lorem fringilla, egestas tellus vitae, vulputate purus. Nulla feugiat blandit nunc et semper. Morbi purus libero, mattis sed mauris non, euismod iaculis lacus. Curabitur eleifend ante eros, non faucibus velit lacinia id. Duis posuere libero augue, at dignissim urna consectetur eget. Praesent eu congue est, iaculis finibus augue.')
  apm.setTag('this-is-a-very-long-tag-name-without-any-spaces', 'test')
  apm.setTag('multi-line', 'foo\nbar\nbaz')

  // mimic logged in user
  apm.setUserContext({
    id: 42,
    username: 'kimchy',
    email: 'kimchy@elastic.co'
  })

  // mimic custom context
  apm.setCustomContext({
    containerId: Math.floor(Math.random() * 10000)
  })

  next()
})

app.use(require('./server/routes'))

var server = app.listen(conf.server.port2, function () {
  var port = server.address().port
  logger.info('server is listening on port', port)
})
