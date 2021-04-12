'use strict'

const conf = require('./server/config')
const logger = require('pino')({ level: 'debug' })
const apmConf = Object.assign({}, conf.apm, {
  logger: logger.child({ level: 'info' })
})
const apm = require('elastic-apm-node').start(apmConf)
const URL = require('url').URL
const fs = require('fs')

// Read config environment variables used to demonstrate Distributed Tracing
// For more info see:
// https://github.com/elastic/apm-integration-testing/issues/196
const opbeansServiceUrls = (process.env.OPBEANS_SERVICES || '')
  .split(',')
  .filter(s => s)
  .filter(s => s !== 'opbeans-node')
  .map(s => {
    return new URL(s.indexOf('http') === 0 ? s : `http://${s}:3000`)
  })
const opbeansRedirectProbability = opbeansServiceUrls.length === 0
  ? 0
  : Number(process.env.OPBEANS_DT_PROBABILITY || 0.5)

// Elastic APM needs to perform an async operation if an uncaught exception
// occurs. This ensures that we close the Express server before this happens to
// we don't keep accepting HTTP requests in the meantime
process.on('uncaughtException', function () {
  if (server) server.close()
  if (worker) worker.stop()
})

// Ensure the Elastic APM queue is flushed before exiting the application in
// case of an uncaught exception
apm.handleUncaughtExceptions(function (err) {
  logger.error(err)
  logger.error('Application encountered an uncaught exception. Flushing Elastic APM queue and exiting...')
  apm.flush(function (err) {
    if (err) logger.error(err)
    else logger.error('Elastic APM queue flushed!')
    process.exit(1)
  })
})

const path = require('path')
const express = require('express')

// start background worker to generate custom transactions
const worker = require('./worker')
worker.start()

const app = express()

app.use(require('express-pino-logger')({ logger }))
app.use(function (req, res, next) {
  req.log.debug('request received')
  next()
})
app.use(require('body-parser').json())
app.use(express.static('client/build', { index: false }))
app.use(function (req, res, next) {
  apm.setLabel('foo', 'bar')
  apm.setLabel('lorem', 'ipsum dolor sit amet, consectetur adipiscing elit. Nulla finibus, ipsum id scelerisque consequat, enim leo vulputate massa, vel ultricies ante neque ac risus. Curabitur tincidunt vitae sapien id pulvinar. Mauris eu vestibulum tortor. Integer sit amet lorem fringilla, egestas tellus vitae, vulputate purus. Nulla feugiat blandit nunc et semper. Morbi purus libero, mattis sed mauris non, euismod iaculis lacus. Curabitur eleifend ante eros, non faucibus velit lacinia id. Duis posuere libero augue, at dignissim urna consectetur eget. Praesent eu congue est, iaculis finibus augue.')
  apm.setLabel('this-is-a-very-long-tag-name-without-any-spaces', 'test')
  apm.setLabel('multi-line', 'foo\nbar\nbaz')

  // mimic logged in user
  apm.setUserContext({
    id: 42,
    username: 'kimchy',
    email: 'kimchy@elastic.co'
  })

  // mimic custom context
  apm.setCustomContext({
    shoppingBasketCount: 42
  })

  next()
})

app.use(require('./server/coffee'))

const http = require('http')
app.use('/api', function (req, res, next) {
  if (Math.random() > opbeansRedirectProbability) {
    return next()
  }

  const service = opbeansServiceUrls[Math.floor(Math.random() * opbeansServiceUrls.length)]
  const opts = {
    method: req.method,
    hostname: service.hostname,
    port: service.port,
    path: req.originalUrl
  }

  req.log.debug('proxying request: %s => %s:%s', req.originalUrl, opts.hostname, opts.port + opts.path)

  const clientReq = http.request(opts)

  clientReq.on('response', clientRes => {
    res.writeHead(clientRes.statusCode, clientRes.headers)
    clientRes.pipe(res)
  })

  req.pipe(clientReq)
})

app.use('/api', require('./server/routes'))

app.get('*', function (req, res, next) {
  const file = path.resolve(__dirname, 'client/build', 'index.html')
  fs.readFile(file, function (err, data) {
    if (err) return next(err)

    const clientPkg = require('./client/package.json')
    const rumConfig = {
      serviceName: process.env.ELASTIC_APM_JS_SERVICE_NAME || clientPkg.name,
      serviceVersion: process.env.ELASTIC_APM_JS_SERVICE_VERSION || clientPkg.version,
      serverUrl: process.env.ELASTIC_APM_JS_SERVER_URL || 'http://localhost:8200',
      pageLoadTraceId: undefined,
      pageLoadSpanId: undefined,
      pageLoadSampled: undefined
    }

    const transaction = apm.currentTransaction
    if (transaction) {
      rumConfig.pageLoadTraceId = transaction.traceId
      rumConfig.pageLoadSpanId = transaction.ensureParentId()
      rumConfig.pageLoadSampled = transaction.sampled
    }

    const body = data.toString()
      .replace('<script type="text/javascript" src="/rum-config.js"></script>', '')
      .replace('<head>', `<head><script>window.rumConfig = ${JSON.stringify(rumConfig)}</script>`)

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Length', Buffer.byteLength(body))
    res.end(body)
  })
})

const server = app.listen(conf.server.port, function () {
  const port = server.address().port
  logger.info('server is listening on port', port)
})
