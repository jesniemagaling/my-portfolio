import axios from 'axios';

const aboutApi = axios.create({
  baseURL: '/admin/about/api',
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default aboutApi;
