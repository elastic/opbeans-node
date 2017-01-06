import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function orderReducer(state = initialState.order, action) {
  switch(action.type) {
    case types.LOAD_ORDER_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_ORDER_SUCCESS:
      return { loading: false, order: action.order }
    default:
      return state;
  }
}
