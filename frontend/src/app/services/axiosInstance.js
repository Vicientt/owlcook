import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '';
const api = axios.create({ baseURL: apiBaseUrl });
let token = null;

export const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null;
};

// Add token to request headers
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Handle authentication errors => Automatically navigate to login if error (in case token is expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.error || error.response?.data?.message || '');
    const isAuthError =
      status === 401 ||
      status === 403 ||
      /jwt (must be provided|expired|invalid|malformed)/i.test(message) ||
      /unauthorized|token.*invalid/i.test(message);

    if (isAuthError && window.localStorage.getItem('UserInformation')) {
      window.localStorage.clear();
      window.location.replace('/');
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
