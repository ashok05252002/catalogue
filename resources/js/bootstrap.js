import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Safety-net: handle 419 errors gracefully for any raw Axios calls.
// Inertia has its own handling, so this only covers direct axios usage.
window.axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 419) {
            // Session expired — redirect to login page cleanly
            window.location.href = '/login';
            return new Promise(() => {}); // Prevent further error handling
        }
        return Promise.reject(error);
    }
);
