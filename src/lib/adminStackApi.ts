import axios from 'axios';

const stackApi = axios.create({
  baseURL: '/admin/stack/api',
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default stackApi;
