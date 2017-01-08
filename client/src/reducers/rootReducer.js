import {combineReducers} from 'redux';

import product from './productReducer';
import products from './productsReducer';
import productCustomers from './productCustomersReducer';
import order from './orderReducer';
import orders from './ordersReducer';
import customer from './customerReducer';
import customers from './customersReducer';

const rootReducer = combineReducers({
  // short hand property names
  product,
  products,
  productCustomers,
  order,
  orders,
  customer,
  customers,
})

export default rootReducer;
