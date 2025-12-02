import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL;

const normalizeBase = (b) => {
  if (!b) return '/api';
  // Remove trailing slashes
  const trimmed = b.replace(/\/+$/g, '');
  // If it's a full URL (http/https), don't add /api - backend already has it
  if (trimmed.includes('://')) return trimmed;
  // For relative paths, add /api if not already present
  if (trimmed.endsWith('/api')) return trimmed;
  return `${trimmed}/api`;
};

const BASE_URL = normalizeBase(rawBase);

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// Attach token (employee first, then user) to each request if present
api.interceptors.request.use(
  (config) => {
    try {
      const employeeStr = localStorage.getItem('employeeInfo');
      if (employeeStr) {
        const employee = JSON.parse(employeeStr);
        if (employee?.token) {
          config.headers.Authorization = `Bearer ${employee.token}`;
          return config;
        }
      }

      const userStr = localStorage.getItem('userInfo');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      // ignore parsing errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally and attach friendly message for network errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      try {
        if (window.location.pathname.startsWith('/employee')) {
          localStorage.removeItem('employeeInfo');
          window.location.href = '/employee/login';
        } else {
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
        }
      } catch (e) {
        // ignore
      }
    }

    if (!error.response) {
      error.message = `Network error: unable to reach API at ${BASE_URL}`;
    }
    return Promise.reject(error);
  }
);

export default api;
