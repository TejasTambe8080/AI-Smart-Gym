// Workout Routes
const express = require('express');
const {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
} = require('../controllers/workoutController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All workout routes require authentication
router.use(authMiddleware);

// Stats route (place before :id to avoid conflicts)
router.get('/stats/summary', getWorkoutStats);

// CRUD operations
router.post('/', createWorkout);
router.get('/', getWorkouts);
router.get('/:id', getWorkout);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;
