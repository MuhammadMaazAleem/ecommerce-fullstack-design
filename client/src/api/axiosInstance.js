import axios from 'axios';
import { clearAuthUser, getAuthToken, setAuthSession } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

const resolveRefreshQueue = (error, token = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(token);
  });
  refreshQueue = [];
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    if (!originalRequest || statusCode !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes('/auth/login')
      || originalRequest.url?.includes('/auth/register')
      || originalRequest.url?.includes('/auth/refresh')
      || originalRequest.url?.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await refreshClient.post('/auth/refresh');
      const session = refreshResponse.data.data;

      setAuthSession(session);
      resolveRefreshQueue(null, session.token);

      originalRequest.headers.Authorization = `Bearer ${session.token}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthUser();
      resolveRefreshQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
