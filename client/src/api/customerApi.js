class CustomerApi {
    static getAllCustomers() {
        return fetch('/api/customers').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static getCustomer(id) {
        return fetch('/api/customers/' + id).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default CustomerApi;
