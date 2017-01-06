import {combineReducers} from 'redux';

import product from './productReducer';
import products from './productsReducer';
import order from './orderReducer';
import orders from './ordersReducer';

const rootReducer = combineReducers({
  // short hand property names
  product,
  products,
  order,
  orders,
})

export default rootReducer;
