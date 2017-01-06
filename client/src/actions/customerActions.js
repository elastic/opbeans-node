import * as types from './actionTypes';
import customerApi from '../api/customerApi';


export function loadCustomer(id) {
    return function(dispatch) {
        dispatch(loadCustomerRequest());
        return customerApi.getCustomer(id).then(customer => {
            dispatch(loadCustomerSuccess(customer));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCustomerRequest() {
  return {type: types.LOAD_CUSTOMER_REQUEST};
}

export function loadCustomerSuccess(customer) {
  return {type: types.LOAD_CUSTOMER_SUCCESS, customer};
}

export function loadCustomers() {
    return function(dispatch) {
        dispatch(loadCustomersRequest());
        return customerApi.getAllCustomers().then(customers => {
            dispatch(loadCustomersSuccess(customers));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadCustomersRequest() {
  return {type: types.LOAD_CUSTOMERS_REQUEST};
}

export function loadCustomersSuccess(customers) {
  return {type: types.LOAD_CUSTOMERS_SUCCESS, customers};
}
