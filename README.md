# Opbeans

The Opbeans inventory management system is a demo app created and
maintained by [Elastic](https://elastic.co).

It's hosted on [opbeans.com](http://opbeans.com).

[![Build status](https://travis-ci.org/elastic/opbeans.svg?branch=master)](https://travis-ci.org/elastic/opbeans)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Technology Stack

This application uses the following technologies:

- [Node.js](https://nodejs.org)
- [Express](http://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Redis](https://redis.io)
- [React](https://facebook.github.io/react/)
- [React Router](https://github.com/ReactTraining/react-router)
- [Redux](https://github.com/reactjs/redux)
- [Elastic APM](https://www.elastic.co/blog/starting-down-the-path-for-elastic-apm)

## Deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This app can be deployed directly to Heroku by pressing the button
above. You will need to enter the required environment variables to
complete the deployment. See below for configuration options.

## Configuration

Setup the following environment variables:

- `NODE_ENV` - The current Node environment (set to `production` to enable Elastic APM)
- `OPBEANS_SERVER_PROTOCOL` - Set protocol used to connect to the backend
  server (defaults to `http:`)
- `OPBEANS_SERVER_AUTH` - Set authentication used to connet to the
  backend in the format of `username:password` (defaults to an empty
  string)
- `OPBEANS_SERVER_HOSTNAME` - Set hostname used to connect to the
  backend (defaults to `localhost`)
- `OPBEANS_SERVER_PORT` - Set port used to connect to the
  backend (defaults to value of `PORT` or `3001`)
- `PGHOST` - PostgreSQL server host
- `PGPORT` - PostgreSQL server port
- `PGUSER` - PostgreSQL database username
- `PGPASSWORD` - PostgreSQL database password
- `PGDATABASE` - PostgreSQL database name (defaults to `opbeans`)
- `ELASTIC_APM_SERVICE_NAME` - Elastic APM service name for the server app
- `ELASTIC_APM_SERVER_URL` - APM Server URL (defaults to
  `http://localhost:8080`)
- `ELASTIC_APM_JS_BASE_SERVER_URL` - Elastic APM Server URL for the client app
- `ELASTIC_APM_JS_BASE_APP_NAME` - Elastic APM App Name for the client app

For a complete list of PostgreSQL environment variables [see the
official
documentation](https://www.postgresql.org/docs/9.5/static/libpq-envars.html).

In development, you can create a `.env` file in the root of the project
containing all your secret environment variables. See
[dotenv](https://github.com/motdotla/dotenv) for details. Additionally
if you create a `.env` file in the `/client` folder, variables prefixed
with `ELASTIC_APM_JS_BASE_` will be available in the React app.


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

## Demo notes

The Node.js server have a built-in bug that you can trigger by
navigating to the path `/is-it-coffee-time`.

## License

MIT

<br>Made with ♥️ and ☕️ by Elastic.
