class ProductApi {
    static getAllProducts() {
        return fetch('http://localhost:3000/api/products').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
    static getProduct(id) {
        return fetch('http://localhost:3000/api/products/' + id).then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default ProductApi;
