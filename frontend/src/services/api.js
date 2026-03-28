import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH ENDPOINTS
// ============================================
export const authService = {
  register: (name, email, password, confirmPassword) => {
    console.log('Registering:', { name, email });
    return api.post('/auth/register', { name, email, password, confirmPassword });
  },

  login: (email, password) => {
    console.log('Logging in:', email);
    return api.post('/auth/login', { email, password });
  },

  getCurrentUser: () =>
    api.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ============================================
// TASK ENDPOINTS
// ============================================
export const taskService = {
  createTask: (taskData) =>
    api.post('/tasks', taskData),

  getAllTasks: (filters = {}) =>
    api.get('/tasks', { params: filters }),

  getTaskById: (id) =>
    api.get(`/tasks/${id}`),

  updateTask: (id, taskData) =>
    api.put(`/tasks/${id}`, taskData),

  deleteTask: (id) =>
    api.delete(`/tasks/${id}`),

  getTaskStats: () =>
    api.get('/tasks/stats/all')
};

export default api;
