import * as types from './actionTypes';
import productApi from '../api/productApi';


export function loadProduct(id) {
    return function(dispatch) {
        dispatch(loadProductRequest());
        return productApi.getProduct(id).then(product => {
            dispatch(loadProductSuccess(product));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadProductRequest() {
  return {type: types.LOAD_PRODUCT_REQUEST};
}

export function loadProductSuccess(product) {
  return {type: types.LOAD_PRODUCT_SUCCESS, product};
}

export function loadProducts() {
    return function(dispatch) {
        dispatch(loadProductsRequest());
        return productApi.getAllProducts().then(products => {
            dispatch(loadProductsSuccess(products));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadProductsRequest() {
  return {type: types.LOAD_PRODUCTS_REQUEST};
}

export function loadProductsSuccess(products) {
  return {type: types.LOAD_PRODUCTS_SUCCESS, products};
}


export function loadProductsTop() {
    return function(dispatch) {
        dispatch(loadProductsTopRequest());
        return productApi.getTopProducts().then(productsTop => {
            dispatch(loadProductsTopSuccess(productsTop));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadProductsTopRequest() {
  return {type: types.LOAD_PRODUCTS_TOP_REQUEST};
}

export function loadProductsTopSuccess(productsTop) {
  return {type: types.LOAD_PRODUCTS_TOP_SUCCESS, productsTop};
}


export function loadProductCustomers(id) {
    return function(dispatch) {
        dispatch(loadProductCustomersRequest());
        return productApi.getProductCustomers(id).then(productCustomers => {
            dispatch(loadProductCustomersSuccess(productCustomers));
        }).catch(error => {
            throw (error);
        });
    };
}

export function loadProductCustomersRequest() {
  return {type: types.LOAD_PRODUCT_CUSTOMERS_REQUEST};
}

export function loadProductCustomersSuccess(productCustomers) {
  return {type: types.LOAD_PRODUCT_CUSTOMERS_SUCCESS, productCustomers};
}
