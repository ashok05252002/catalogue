import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Handle 419 CSRF Token Mismatch errors safely without infinite reload loops
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            const hasReloaded = sessionStorage.getItem('csrf_419_reloaded');
            if (!hasReloaded) {
                sessionStorage.setItem('csrf_419_reloaded', 'true');
                window.location.reload();
            } else {
                sessionStorage.removeItem('csrf_419_reloaded');
                alert('Session expired or CSRF token mismatch. Please refresh the page and try logging in again.');
            }
        }
        return Promise.reject(error);
    }
);
