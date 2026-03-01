// services/api.js
import axios from 'axios';

const API_URL = 'https://angebot-backend-ub6a.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // PDF isteklerinde responseType'i blob olarak ayarla
        if (config.url.includes('/pdf/')) {
            config.responseType = 'blob';
        }

        console.log('API Request:', config.method.toUpperCase(), config.url);
        console.log('Token:', token ? 'Var' : 'Yok'); // Token kontrolü
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // PDF yanıtlarını özel işle
        if (response.config.url.includes('/pdf/')) {
            console.log('PDF Response:', response.status, 'Size:', response.data?.size);
        } else {
            console.log('API Response:', response.status, response.config.url);
        }
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.message);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;