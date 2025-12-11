import axios from 'axios';

const stackApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/admin/stack/api`,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default stackApi;
