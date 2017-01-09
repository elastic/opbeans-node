import * as types from './actionTypes';
import statsApi from '../api/statsApi';

export function loadStats() {
    return function(dispatch) {
        dispatch(loadStatsRequest());
        return statsApi.getStats().then(stats => {
            dispatch(loadStatsSuccess(stats));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadStatsRequest() {
  return {type: types.LOAD_STATS_REQUEST};
}

export function loadStatsSuccess(stats) {
  return {type: types.LOAD_STATS_SUCCESS, stats};
}
