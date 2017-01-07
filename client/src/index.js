import initOpbeat from 'opbeat-react';
import 'opbeat-react/router';

let opbeat_app_id = process.env.REACT_OPBEAT_APP_ID;
let opbeat_org_id = process.env.OPBEAT_ORGANIZATION_ID;

if(process.env.NODE_ENV === 'production' && opbeat_app_id && opbeat_org_id) {
    initOpbeat({
        appId: opbeat_app_id,
        orgId: opbeat_org_id,
    });
}

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import Routes from './routes';

const store = configureStore();

import './index.css';
import './semantic-ui/semantic.min.css';

ReactDOM.render(
  <Provider store={store}>
    <Routes history={browserHistory} />
  </Provider>,
  document.getElementById('root')
);
