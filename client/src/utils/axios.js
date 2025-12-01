import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (error) {
      console.error('Error parsing userInfo from localStorage:', error);
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
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

