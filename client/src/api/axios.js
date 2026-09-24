// import axios from 'axios';

// const api = axios.create({
//   baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
// });

// // Attach the admin token when present.
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Normalise error messages so components can show `err` directly.
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const message =
//       err.response?.data?.message || err.message || 'Network error. Please try again.';
//     if (err.response?.status === 401 && localStorage.getItem('token')) {
//       localStorage.removeItem('token');
//     }
//     return Promise.reject(new Error(message));
//   }
// );

// // Prefix a stored /uploads path (or pass through absolute URLs).
// export const asset = (src) => {
//   if (!src) return '';
//   if (src.startsWith('http')) return src;
//   return (import.meta.env.VITE_API_URL || '') + src;
// };

// export default api;



import axios from 'axios';

// Dynamically compute the API base URL from environment or fallback to relative '/api'
const getDynamicApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getDynamicApiBase(),
  timeout: 30000,
});

// Dynamically attach admin JWT token when present in storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalise error messages and handle expired/invalid JWT tokens gracefully
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      'Network error. Please try again.';

    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }

    return Promise.reject(new Error(message));
  }
);

// Fully dynamic asset URL resolver for uploads, certificates, and external CDN media
export const asset = (src) => {
  if (!src) return '';

  // Already an absolute URL or inline data URI
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  const cleanSrc = src.startsWith('/') ? src : `/${src}`;
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl) {
    const baseHost = envUrl.trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
    return `${baseHost}${cleanSrc}`;
  }

  return cleanSrc;
};

export default api;