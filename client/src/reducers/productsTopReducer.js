import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function productsTopReducer(state = initialState.productsTop, action) {
  switch(action.type) {
    case types.LOAD_PRODUCTS_TOP_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_PRODUCTS_TOP_SUCCESS:
      return { loading: false, items: action.productsTop }
    case types.UNLOAD_PRODUCTS_TOP:
      return { ...state, items: [] }
    default:
      return state;
  }
}
