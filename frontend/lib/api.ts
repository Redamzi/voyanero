import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach auth token (if available in future)
api.interceptors.request.use(
    (config) => {
        // You can add logic here to get token from localStorage/cookies
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle global errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401/403 errors globally (e.g., redirect to login)
        if (error.response && error.response.status === 401) {
            // Redirect to login or clear session
            console.log('Unauthorized, please login.');
        }
        return Promise.reject(error);
    }
);

export default api;
