import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Automatically handle 419 CSRF Token Mismatch errors
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // Reload the page on token expiration to fetch a new token and potentially redirect to login
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
