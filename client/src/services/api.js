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

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/update', data),
};

export const userService = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/update', data),
};

// Trainer Services
export const trainerService = {
  register: (data) => api.post('/trainers/register', data),
  getAll: () => api.get('/trainers'),
  getTrainer: (id) => api.get(`/trainers/${id}`),
  verifyTrainer: (id) => api.post(`/trainers/verify/${id}`),
  bookSession: (data) => api.post('/trainers/book', data),
  getUserBookings: () => api.get('/trainers/bookings/user'),
  getTrainerBookings: () => api.get('/trainers/bookings'),
  getMyBookings: () => api.get('/trainers/my-bookings'),
  getClients: () => api.get('/trainers/clients'),
  getClientStats: (clientId) => api.get(`/trainers/clients/${clientId}/stats`),
  getDashboardStats: () => api.get('/trainers/dashboard/stats'),
  updateBookingStatus: (id, statusData) => api.put(`/trainers/bookings/${id}`, statusData),
  updateProfile: (id, data) => api.put(`/trainers/profile/${id}`, data),
  deleteTrainer: (id) => api.delete(`/trainers/${id}`),
  sendMessage: (data) => api.post('/trainers/messages', data),
  getChatHistory: (contactId) => api.get(`/trainers/messages/${contactId}`),
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
  getCoachFeedback: (data) => api.post('/ai/coach', data),
  generateWorkoutPlan: (data) => api.post('/ai/generate-workout', data),
};

export default api;

