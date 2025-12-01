import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL;

// Use the raw base URL if provided (no automatic '/api' append).
// If not provided, use empty string so relative '/api/..' requests hit the frontend origin
// and can be proxied in dev via Vite's server.proxy configuration.
const BASE_URL = rawBase ? rawBase.replace(/\/+$/g, '') : '';

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
