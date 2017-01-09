import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function statsReducer(state = initialState.stats, action) {
  switch(action.type) {
    case types.LOAD_STATS_REQUEST:
        return { ...state, loading: true }
    case types.LOAD_STATS_SUCCESS:
      return { loading: false, data: action.stats }
    default:
      return state;
  }
}
