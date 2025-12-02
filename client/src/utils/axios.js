import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL;
const isDev = import.meta.env.DEV;

/**
 * Normalizes the API base URL to always end with /api
 * 
 * Handles:
 * - Fully qualified URLs (http/https): ensures /api suffix
 * - Relative paths (dev proxy): ensures /api suffix
 * - Missing/empty: defaults to /api
 * 
 * @param {string} base - Raw base URL from env
 * @returns {string} Normalized base URL ending with /api
 */
const normalizeBase = (base) => {
  if (!base) {
    return '/api'; // dev proxy default
  }

  // Remove trailing slashes
  const trimmed = base.replace(/\/+$/g, '');

  // Already ends with /api - return as-is
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  // Add /api suffix
  return `${trimmed}/api`;
};

/**
 * Normalizes the request URL to prevent duplicate /api
 * 
 * Rules:
 * - If request URL is absolute (http/https), leave unchanged
 * - If base ends with /api and URL starts with /api, strip leading /api
 * - Ensure relative URLs start with /
 * 
 * @param {string} url - Request URL path
 * @param {string} base - Base URL (typically ends with /api)
 * @returns {string} Normalized URL path
 */
const normalizeRequestUrl = (url, base) => {
  // Absolute URLs (other domains) should not be touched
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }

  // Base ends with /api
  if (base.endsWith('/api')) {
    // Strip leading /api from URL if present (prevents /api/api)
    if (url && url.startsWith('/api/')) {
      return url.substring(4); // Remove '/api'
    }
    if (url === '/api') {
      return ''; // Just /api → empty string (will use base as-is)
    }
  }

  // Ensure relative URLs start with /
  if (url && !url.startsWith('/')) {
    return `/${url}`;
  }

  return url;
};

const BASE_URL = normalizeBase(rawBase);

// Log configuration in dev mode for debugging
if (isDev) {
  console.debug('[API Config] VITE_API_BASE_URL:', rawBase);
  console.debug('[API Config] Normalized BASE_URL:', BASE_URL);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// Request interceptor: normalize URL and attach auth tokens
api.interceptors.request.use(
  (config) => {
    // Normalize URL to prevent duplicate /api
    config.url = normalizeRequestUrl(config.url, BASE_URL);

    // Debug log final resolved URL (dev only)
    if (isDev && config.url) {
      try {
        const finalUrl = new URL(config.url, config.baseURL || BASE_URL).toString();
        console.debug('[API Request]', config.method?.toUpperCase(), finalUrl);
      } catch (e) {
        // Fallback for relative URLs in dev proxy
        console.debug('[API Request]', config.method?.toUpperCase(), `${BASE_URL}${config.url}`);
      }
    }

    // Attach authentication token (employee first, then user)
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
      console.error('[API Auth] Failed to parse stored credentials:', e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally and format network errors
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Handle 401 - redirect to login
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
        console.error('[API Auth] Failed to handle 401:', e);
      }
    }

    // Enhance network error messages
    if (!error.response) {
      error.message = `Network error: unable to reach API at ${BASE_URL}`;
    }

    return Promise.reject(error);
  }
);

export default api;
