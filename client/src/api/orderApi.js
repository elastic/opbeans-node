class OrderApi {
    static getAllOrders() {
        return fetch('http://localhost:3000/api/orders').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static getOrder(id) {
        return fetch('http://localhost:3000/api/orders/' + id).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default OrderApi;
