import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';

import About from './components/About';

import Product from './components/Product';
import Products from './components/Products';

import NotFound from './components/NotFound';

const Routes = (props) => (
  <Router {...props}>
    <Route component={App}>
        <Route path="/" component={About} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={Product} />
        <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;
