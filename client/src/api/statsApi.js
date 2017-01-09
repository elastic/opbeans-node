class StatsApi {
    static getStats() {
        return fetch('/api/stats').then(response => {
            return response.json();
        }).catch(error => {
            return error;
        });
    }
}

export default StatsApi;
