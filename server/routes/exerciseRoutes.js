// Exercise Routes - API endpoints for exercise management
const express = require('express');
const {
  getExercises,
  getExercisesByMuscleGroup,
  getExerciseById,
  getMuscleGroups,
  getExercisesByDifficulty,
  createExercise,
  updateExercise,
  deleteExercise,
  searchExercises,
} = require('../controllers/exerciseController');

const router = express.Router();

// Public routes (no authentication required)
router.get('/groups/list/all', getMuscleGroups);
router.get('/group/:muscleGroup', getExercisesByMuscleGroup);
router.get('/difficulty/:level', getExercisesByDifficulty);
router.get('/search/:query', searchExercises);
router.get('/', getExercises);
router.get('/:id', getExerciseById);

// Admin routes (would require auth middleware in production)
router.post('/', createExercise);
router.put('/:id', updateExercise);
router.delete('/:id', deleteExercise);

module.exports = router;
