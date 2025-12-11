import axios from 'axios';

const aboutApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/admin/about/api`,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default aboutApi;
