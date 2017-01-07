import { createOpbeatMiddleware } from 'opbeat-react/redux';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';

export default function configureStore() {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(rootReducer, composeEnhancers(
      applyMiddleware(
          thunk,
          createOpbeatMiddleware()
      )
  ));
}
