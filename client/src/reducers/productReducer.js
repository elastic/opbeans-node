import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function productReducer(state = initialState.product, action) {
  switch(action.type) {
    case types.LOAD_PRODUCT_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_PRODUCT_SUCCESS:
      return { loading: false, product: action.product }
    default:
      return state;
  }
}
