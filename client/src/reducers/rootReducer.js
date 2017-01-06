import {combineReducers} from 'redux';
import product from './productReducer';
import products from './productsReducer';

const rootReducer = combineReducers({
  // short hand property names
  product,
  products
})

export default rootReducer;
