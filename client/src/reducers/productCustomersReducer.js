import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function productCustomersReducer(state = initialState.productCustomers, action) {
  switch(action.type) {
    case types.UNLOAD_PRODUCT_CUSTOMERS:
        return { ...initialState.productCustomers }
    case types.LOAD_PRODUCT_CUSTOMERS_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_PRODUCT_CUSTOMERS_SUCCESS:
      return { loading: false, items: action.productCustomers }
    default:
      return state;
  }
}
