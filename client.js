const API_BASE_URL = 'http://127.0.0.1:5000';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

export const getAuthRole = () => localStorage.getItem('role') || 'patient';
export const setAuthRole = (role) => localStorage.setItem('role', role);
export const removeAuthRole = () => localStorage.removeItem('role');

/**
 * Enhanced fetch wrapper that adds Authentication token and handles JSON
 */
export const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Auto-clear token on 401 (expired/invalid)
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        // Redirect to login
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export default apiClient;
