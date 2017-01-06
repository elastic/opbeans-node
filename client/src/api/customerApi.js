class CustomerApi {
    static getAllCustomers() {
        return fetch('http://localhost:3000/api/customers').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static getCustomer(id) {
        return fetch('http://localhost:3000/api/customers/' + id).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default CustomerApi;
