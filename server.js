'use strict'

var conf = require('./server/config')
var logger = require('pino')({ level: 'debug' })
var apmConf = Object.assign({}, conf.apm, {
  logger: logger.child({ level: 'trace' })
})
var apm = require('elastic-apm-node').start(apmConf)
var urlParse = require('url').parse

// Read config environment variables used to demonstrate Distributed Tracing
// For more info see:
// https://github.com/elastic/apm-integration-testing/issues/196
const opbeansServiceUrls = (process.env.OPBEANS_SERVICES || '')
  .split(',')
  .filter(s => s)
  .filter(s => s !== 'opbeans-node')
  .map(s => {
    return urlParse(s.indexOf('http') === 0 ? s : `http://${s}:3000`)
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

var path = require('path')
var express = require('express')

// start background worker to generate custom transactions
var worker = require('./worker')
worker.start()

var app = express()

app.use(require('express-pino-logger')({ logger }))
app.use(function (req, res, next) {
  req.log.debug('request received')
  next()
})
app.use(require('body-parser').json())
app.use(function (req, res, next) {
  if (req.method !== 'GET' || req.url !== '/rum-config.js') return next()
  const clientPkg = require('./client/package.json')
  const serverUrl = process.env.ELASTIC_APM_JS_SERVER_URL || 'http://localhost:8200'
  const serviceName = process.env.ELASTIC_APM_JS_SERVICE_NAME || clientPkg.name
  const serviceVersion = process.env.ELASTIC_APM_JS_SERVICE_VERSION || clientPkg.version
  const body = `
    window.elasticApmJsBaseServiceName = "${serviceName}";
    window.elasticApmJsBaseServiceVersion = "${serviceVersion}";
    window.elasticApmJsBaseServerUrl = "${serverUrl}";
  `
  res.setHeader('Content-Type', 'text/javascript')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)
})
app.use(express.static('client/build'))
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

app.use(require('./server/coffee'))

var http = require('http')
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

  var clientReq = http.request(opts)

  clientReq.on('response', clientRes => {
    res.writeHead(clientRes.statusCode, clientRes.headers)
    clientRes.pipe(res)
  })

  req.pipe(clientReq)
})

app.use('/api', require('./server/routes'))

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
})

var server = app.listen(conf.server.port, function () {
  var port = server.address().port
  logger.info('server is listening on port', port)
})
