import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
      return Promise.reject(err);
    }

    console.error('API Error:', err.response?.data || err.message);
    throw err;
  }
);

export default api;
