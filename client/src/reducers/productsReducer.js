import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function productsReducer(state = initialState.products, action) {
  switch(action.type) {
    case types.LOAD_PRODUCTS_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_PRODUCTS_SUCCESS:
      return { loading: false, items: action.products }
    case types.UNLOAD_PRODUCTS:
      return { ...state, items: [] }
    default:
      return state;
  }
}
