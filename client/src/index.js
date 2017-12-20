import { init as initApm } from 'elastic-apm-js-base'

let serviceName = process.env.ELASTIC_APM_JS_BASE_SERVICE_NAME;
let serviceVersion = process.env.ELASTIC_APM_JS_BASE_SERVICE_VERSION || null;
let serverUrl = process.env.ELASTIC_APM_JS_BASE_SERVER_URL;

initApm({
  serviceName: serviceName,
  serviceVersion: serviceVersion,
  serverUrl: serverUrl
})

import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'
import Routes from './routes'

const store = configureStore()

import './index.css'
import './semantic-ui/semantic.min.css'

ReactDOM.render(
  <Provider store={store}>
    <Routes history={browserHistory} />
  </Provider>,
  document.getElementById('root')
)
