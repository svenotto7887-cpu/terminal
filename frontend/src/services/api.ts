import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

console.log('🔌 API BaseURL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 15_000
});

// Add response interceptor to log errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    return Promise.reject(error);
  }
);

export const fetchPairs = async () => api.get('/trading/pairs');
export const fetchOrders = async () => api.get('/trading/orders');
export const placeOrder = async (payload: any) =>
  api.post('/trading/orders', payload);
