import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function customerReducer(state = initialState.customer, action) {
  switch(action.type) {
    case types.LOAD_CUSTOMER_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_CUSTOMER_SUCCESS:
      return { loading: false, customer: action.customer }
    default:
      return state;
  }
}
