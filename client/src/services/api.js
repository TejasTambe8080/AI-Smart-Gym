// API Service - Handles all API calls
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auto token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/update', data),
};

// Trainer Services
export const trainerService = {
  register: (data) => api.post('/trainers/register', data),
  getAll: () => api.get('/trainers'),
  bookSession: (data) => api.post('/trainers/book', data),
  getMyBookings: () => api.get('/trainers/my-bookings'),
  getClients: () => api.get('/trainers/clients'),
};

// Workout Services
export const workoutService = {
  createWorkout: async (data) => {
    if (!navigator.onLine) {
      const offlineQueue = JSON.parse(localStorage.getItem('offline_workouts') || '[]');
      const offlineWorkout = { ...data, id: Date.now(), isOffline: true, date: new Date() };
      offlineQueue.push(offlineWorkout);
      localStorage.setItem('offline_workouts', JSON.stringify(offlineQueue));
      return { data: { success: true, message: 'Saved locally. Syncing when online.', workout: offlineWorkout } };
    }
    return api.post('/workouts', data);
  },
  syncOfflineWorkouts: async () => {
    const offlineQueue = JSON.parse(localStorage.getItem('offline_workouts') || '[]');
    if (offlineQueue.length === 0 || !navigator.onLine) return;

    for (const workout of offlineQueue) {
      try {
        await api.post('/workouts', workout);
      } catch (e) { console.error('Sync failed for workout:', workout); }
    }
    localStorage.removeItem('offline_workouts');
  },
  getWorkouts: (params) => api.get('/workouts', { params }),
  getWorkout: (id) => api.get(`/workouts/${id}`),
  updateWorkout: (id, data) => api.put(`/workouts/${id}`, data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  getStats: (period = 'week') => api.get('/workouts/stats/summary', { params: { period } }),
};

// Exercise Services
export const exerciseService = {
  getAllExercises: (params) => api.get('/exercises', { params }),
  getExercisesByMuscleGroup: (muscleGroup) => api.get(`/exercises/${muscleGroup}`),
  getExerciseById: (id) => api.get(`/exercises/${id}`),
  getMuscleGroups: () => api.get('/exercises/groups/list/all'),
  getExercisesByDifficulty: (level) => api.get(`/exercises/difficulty/${level}`),
  searchExercises: (query) => api.get(`/exercises/search/${query}`),
  createExercise: (data) => api.post('/exercises', data),
  updateExercise: (id, data) => api.put(`/exercises/${id}`, data),
  deleteExercise: (id) => api.delete(`/exercises/${id}`),
};

// AI Services
export const aiService = {
  getDietPlan: (data) => api.post('/ai/diet', data),
  getSuggestions: (data) => api.post('/ai/suggestions', data),
  getInsights: (data) => api.post('/ai/insights', data),
};

export default api;

