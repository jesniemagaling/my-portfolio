import axios from 'axios';

const projectApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/admin/projects/api`,
  timeout: 20000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default projectApi;
