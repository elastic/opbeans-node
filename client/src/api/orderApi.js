class OrderApi {
    static getAllOrders() {
        return fetch('/api/orders').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static getOrder(id) {
        return fetch('/api/orders/' + id).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default OrderApi;
