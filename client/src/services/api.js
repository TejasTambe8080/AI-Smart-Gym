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

// Demo Mode Helper
const isDemoMode = () => localStorage.getItem('demo_mode') === 'true';

const mockData = {
  stats: {
    totalWorkouts: 42,
    totalDuration: 1250,
    totalReps: 8500,
    totalCalories: 15400,
    averagePostureScore: 88,
    currentStreak: 12,
    level: 5,
    weakMuscles: ['Triceps', 'Lower Back'],
    weeklyProgress: { percentage: 75, completed: 3, goal: 4 },
    dailyStats: []
  },
  workouts: [
    { _id: 'mock1', exerciseType: 'squat', reps: 20, duration: 120, postureScore: 92, date: new Date() },
    { _id: 'mock2', exerciseType: 'push_up', reps: 15, duration: 60, postureScore: 85, date: new Date(Date.now() - 86400000) }
  ]
};

// Auth Services
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => isDemoMode() ? Promise.resolve({ data: { success: true, token: 'demo_token', user: { name: 'Demo User', email: 'demo@formfix.ai' } } }) : api.post('/auth/login', data),
  getProfile: () => isDemoMode() ? Promise.resolve({ data: { user: { name: 'Demo User' } } }) : api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/update', data),
};

// Workout Services
export const workoutService = {
  createWorkout: async (data) => {
    if (isDemoMode()) return Promise.resolve({ data: { success: true, workout: { ...data, _id: 'demo' } } });
    if (!navigator.onLine) {
      const offlineQueue = JSON.parse(localStorage.getItem('offline_workouts') || '[]');
      const offlineWorkout = { ...data, id: Date.now(), isOffline: true, date: new Date() };
      offlineQueue.push(offlineWorkout);
      localStorage.setItem('offline_workouts', JSON.stringify(offlineQueue));
      return { data: { success: true, message: 'Saved locally. Syncing when online.', workout: offlineWorkout } };
    }
    return api.post('/workouts', data).catch(err => {
       if (isDemoMode()) return Promise.resolve({ data: { success: true, workout: data } });
       throw err;
    });
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
  getWorkouts: (params) => isDemoMode() ? Promise.resolve({ data: { workouts: mockData.workouts } }) : api.get('/workouts', { params }).catch(err => ({ data: { workouts: mockData.workouts } })),
  getWorkout: (id) => api.get(`/workouts/${id}`),
  updateWorkout: (id, data) => api.put(`/workouts/${id}`, data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  getStats: (period = 'week') => isDemoMode() ? Promise.resolve({ data: { success: true, stats: mockData.stats } }) : api.get('/workouts/stats/summary', { params: { period } }).catch(err => ({ data: { success: true, stats: mockData.stats } })),
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

