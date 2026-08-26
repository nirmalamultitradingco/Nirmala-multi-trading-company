import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
});

// Attach the admin token when present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise error messages so components can show `err` directly.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || 'Network error. Please try again.';
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
    return Promise.reject(new Error(message));
  }
);

// Prefix a stored /uploads path (or pass through absolute URLs).
export const asset = (src) => {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  return (import.meta.env.VITE_API_URL || '') + src;
};

export default api;
