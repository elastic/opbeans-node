class ProductApi {
    static getAllProducts() {
        return fetch('/api/products').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static getProduct(id) {
        return fetch('/api/products/' + id).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default ProductApi;
