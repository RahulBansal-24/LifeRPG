import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// User API calls
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateStats: (stats) => api.put('/user/stats', { statUpdates: stats }),
  updateAvatar: (avatar) => api.put('/user/avatar', { avatar }),
};

// Quest API calls
export const questAPI = {
  getQuests: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/quests${params ? `?${params}` : ''}`);
  },
  createQuest: (questData) => api.post('/quests', questData),
  updateQuest: (questId, updates) => api.put(`/quests/${questId}`, updates),
  deleteQuest: (questId) => api.delete(`/quests/${questId}`),
  generateDailyQuests: () => api.post('/quests/generate-daily'),
};

// Leaderboard API calls
export const leaderboardAPI = {
  getLeaderboard: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return api.get(`/leaderboard${queryParams ? `?${queryParams}` : ''}`);
  },
  getMyRank: () => api.get('/leaderboard/my-rank'),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
