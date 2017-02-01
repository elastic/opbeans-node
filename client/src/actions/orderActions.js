import * as types from './actionTypes';
import orderApi from '../api/orderApi';


export function loadOrder(id) {
    return function(dispatch) {
        dispatch(loadOrderRequest());
        return orderApi.getOrder(id).then(order => {
            dispatch(loadOrderSuccess(order));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadOrderRequest() {
  return {type: types.LOAD_ORDER_REQUEST};
}

export function loadOrderSuccess(order) {
  return {type: types.LOAD_ORDER_SUCCESS, order};
}

export function loadOrders() {
    return function(dispatch) {
        dispatch(loadOrdersRequest());
        return orderApi.getAllOrders().then(orders => {
            dispatch(loadOrdersSuccess(orders));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadOrdersRequest() {
  return {type: types.LOAD_ORDERS_REQUEST};
}

export function loadOrdersSuccess(orders) {
  return {type: types.LOAD_ORDERS_SUCCESS, orders};
}

export function unloadOrders() {
  return {type: types.UNLOAD_ORDERS};
}
