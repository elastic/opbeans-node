import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function customersReducer(state = initialState.customers, action) {
  switch(action.type) {
    case types.LOAD_CUSTOMERS_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_CUSTOMERS_SUCCESS:
      return { loading: false, items: action.customers }
    case types.UNLOAD_CUSTOMERS:
      return { ...state, items: [] }
    default:
      return state;
  }
}
