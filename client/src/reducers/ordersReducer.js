import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function ordersReducer(state = initialState.orders, action) {
  switch(action.type) {
    case types.LOAD_ORDERS_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_ORDERS_SUCCESS:
      return { loading: false, items: action.orders }
    case types.UNLOAD_ORDERS:
        return { ...state, items: [] }
    default:
      return state;
  }
}
