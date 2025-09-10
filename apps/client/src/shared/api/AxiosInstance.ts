import axios, { type AxiosInstance } from 'axios';

const DEFAULT_TIMEOUT = 1000 * 60 * 1;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: DEFAULT_TIMEOUT,
});

export default axiosInstance;
