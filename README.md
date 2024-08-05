# Opbeans for Node.js

The Opbeans inventory management system is a demo app created and
maintained by [Elastic](https://elastic.co).

[![Build Status](https://apm-ci.elastic.co/job/apm-agent-nodejs/job/opbeans-node-mbp/job/main/badge/icon)](https://apm-ci.elastic.co/job/apm-agent-nodejs/job/opbeans-node-mbp/job/main/)
[![Lint status](https://github.com/elastic/opbeans-node/workflows/Lint/badge.svg)](https://github.com/elastic/opbeans-node/actions)

## Technology Stack

This application uses the following technologies:

- [Node.js](https://nodejs.org)
- [Express](http://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Redis](https://redis.io)
- [React](https://facebook.github.io/react/) (via [opbeans-frontend])
- [React Router](https://github.com/ReactTraining/react-router) (via
  [opbeans-frontend])
- [Redux](https://github.com/reactjs/redux) (via [opbeans-frontend])
- [Elastic APM](https://www.elastic.co/solutions/apm)

## Configuration

Setup the following environment variables:

- `NODE_ENV` - The current Node environment (set to `production` to
  enable Elastic APM)
- `PORT` - The port at which to run the Opbeans server (default: `3000`)
- `PGHOST` - PostgreSQL server host
- `PGPORT` - PostgreSQL server port
- `PGUSER` - PostgreSQL database username
- `PGPASSWORD` - PostgreSQL database password
- `PGDATABASE` - PostgreSQL database name (default: `opbeans`)
- `ELASTIC_APM_SERVICE_NAME` - Elastic APM service name for the server
  app (default: `opbeans-node`)
- `ELASTIC_APM_SERVER_URL` - APM Server URL (default:
  `http://localhost:8200`)
- `ELASTIC_APM_JS_SERVER_URL` - Elastic APM Server URL for the
  client app (default: `http://localhost:3000`)
- `ELASTIC_APM_JS_SERVICE_NAME` - Elastic APM App Name for the
  client app (defaults to `name` from [opbeans-frontend package.json
  file](https://github.com/elastic/opbeans-frontend/blob/master/package.json)
- `ELASTIC_APM_JS_SERVICE_VERSION` - Elastic APM App Name for the
  client app (defaults to `version` from [opbeans-frontend package.json
  file](https://github.com/elastic/opbeans-frontend/blob/master/package.json)

For a complete list of Elastic APM agent environment variables, [see the
offical
documentation](https://www.elastic.co/guide/en/apm/agent/nodejs/current/agent-api.html#apm-start)

For a complete list of PostgreSQL environment variables [see the
official
documentation](https://www.postgresql.org/docs/9.5/static/libpq-envars.html).

## Bootstrap

Populate the database with tables and basic data:

```
npm run db-setup
```

Generate random orders:

```
node db/generate_orders.js <num>
```

Where `<num>` is the amount of orders to create.

## Start

```
npm start
```

## Updating the client

If `NODE_ENV` isn't `production`, running `npm install` will also clone,
install and build [opbeats-frontend]. If you ever want to update the
opbeans-frontend, just run:

```
npm run client-update
```

## Testing locally

The simplest way to test this demo is by running:

```bash
make test
```

Tests are written using [bats](https://github.com/sstephenson/bats) under the tests dir

## Publishing to dockerhub locally

Publish the docker image with

```bash
VERSION=1.2.3 make publish
```

NOTE: VERSION refers to the tag for the docker image which will be published in the registry

## Demo notes

### Trigger error

The app have a built-in bug that you can trigger by navigating to the
path `/is-it-coffee-time`.

### Trigger slowness

The app have two npm scripts for adding a new customer:

- `customer-add-ok`, which will add a new customer
- `customer-add-redos`, which fail adding a new customer and block the
  server from processing any other requests in the meantime.

Run either of the two scripts using `npm run <name>`.

If running inside docker, you can run it using `docker compose`, e.g:

```
docker compose exec opbeans-node npm run customer-add-redos
```

## License

MIT

<br>Made with ♥️ and ☕️ by Elastic.

[opbeans-frontend]: https://github.com/elastic/opbeans-frontend
