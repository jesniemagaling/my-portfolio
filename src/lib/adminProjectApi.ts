import axios from 'axios';

const projectApi = axios.create({
  baseURL: '/admin/projects/api',
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default projectApi;
