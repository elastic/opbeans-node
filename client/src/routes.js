import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';
import { wrapRouter } from 'opbeat-react';
import App from './components/App';

import Dashboard from './components/Dashboard';

import Product from './components/Product';
import Products from './components/Products';
import Orders from './components/Orders';
import Order from './components/Order';
import Customers from './components/Customers';
import Customer from './components/Customer';

import NotFound from './components/NotFound';

const OpbeatRouter = wrapRouter(Router)

const Routes = (props) => (
  <OpbeatRouter {...props}>
    <Route path="/" component={App}>
        <IndexRedirect to="/dashboard" />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={Product} />
        <Route path="/orders" component={Orders} />
        <Route path="/orders/:id" component={Order} />
        <Route path="/customers" component={Customers} />
        <Route path="/customers/:id" component={Customer} />
        <Route path="*" component={NotFound} />
    </Route>
  </OpbeatRouter>
);

export default Routes;
