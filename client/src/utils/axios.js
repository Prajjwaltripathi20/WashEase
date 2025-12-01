import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    try {
      // Check for employee token first
      const employeeInfoStr = localStorage.getItem('employeeInfo');
      if (employeeInfoStr) {
        const employeeInfo = JSON.parse(employeeInfoStr);
        if (employeeInfo && employeeInfo.token) {
          config.headers.Authorization = `Bearer ${employeeInfo.token}`;
          return config;
        }
      }

      // Fallback to user token
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing token from localStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response?.status === 401) {
        // Clear appropriate local storage and redirect to login
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

      // Attach a helpful message for network errors
      if (!error.response) {
        error.message = 'Network error: unable to reach API at ' + BASE_URL;
      }

      return Promise.reject(error);
    }
);

export default api;

