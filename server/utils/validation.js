/**
 * Input Validation Utility
 * Comprehensive validation for all API endpoints
 */

const logger = require('./logger');

// Standardized validation response
const validationError = (errors) => ({
  success: false,
  status: 400,
  message: 'Validation failed',
  errors: Array.isArray(errors) ? errors : [errors]
});

// ============================================
// USER VALIDATION
// ============================================

const validateUserSignup = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (data.age && (data.age < 10 || data.age > 120)) {
    errors.push({ field: 'age', message: 'Age must be between 10 and 120' });
  }

  if (data.weight && (data.weight < 20 || data.weight > 500)) {
    errors.push({ field: 'weight', message: 'Weight must be between 20 and 500 kg' });
  }

  if (data.height && (data.height < 100 || data.height > 250)) {
    errors.push({ field: 'height', message: 'Height must be between 100 and 250 cm' });
  }

  const validGoals = ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'];
  if (data.fitnessGoal && !validGoals.includes(data.fitnessGoal)) {
    errors.push({ field: 'fitnessGoal', message: 'Invalid fitness goal' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

const validateUserLogin = (data) => {
  const errors = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be provided' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

// ============================================
// WORKOUT VALIDATION
// ============================================

const validateWorkout = (data) => {
  const errors = [];

  if (!data.exercise || typeof data.exercise !== 'string' || data.exercise.trim().length < 2) {
    errors.push({ field: 'exercise', message: 'Exercise name is required and must be at least 2 characters' });
  }

  if (data.reps !== undefined && (typeof data.reps !== 'number' || data.reps < 1)) {
    errors.push({ field: 'reps', message: 'Reps must be a positive number' });
  }

  if (data.sets !== undefined && (typeof data.sets !== 'number' || data.sets < 1)) {
    errors.push({ field: 'sets', message: 'Sets must be a positive number' });
  }

  if (data.weight !== undefined && (typeof data.weight !== 'number' || data.weight < 0)) {
    errors.push({ field: 'weight', message: 'Weight must be a non-negative number' });
  }

  if (data.duration !== undefined && (typeof data.duration !== 'number' || data.duration < 1)) {
    errors.push({ field: 'duration', message: 'Duration must be a positive number (in seconds)' });
  }

  if (data.postureScore !== undefined) {
    if (typeof data.postureScore !== 'number' || data.postureScore < 0 || data.postureScore > 100) {
      errors.push({ field: 'postureScore', message: 'Posture score must be between 0 and 100' });
    }
  }

  if (data.caloriesBurned !== undefined && (typeof data.caloriesBurned !== 'number' || data.caloriesBurned < 0)) {
    errors.push({ field: 'caloriesBurned', message: 'Calories must be a non-negative number' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

// ============================================
// BOOKING VALIDATION
// ============================================

const validateBooking = (data) => {
  const errors = [];

  if (!data.trainerId || typeof data.trainerId !== 'string') {
    errors.push({ field: 'trainerId', message: 'Valid trainer ID is required' });
  }

  const validSessionTypes = ['Video Call', 'Chat Session', 'Form Review'];
  if (data.sessionType && !validSessionTypes.includes(data.sessionType)) {
    errors.push({ field: 'sessionType', message: `Session type must be one of: ${validSessionTypes.join(', ')}` });
  }

  if (!data.scheduledAt || isNaN(new Date(data.scheduledAt).getTime())) {
    errors.push({ field: 'scheduledAt', message: 'Valid scheduled date/time is required' });
  } else if (new Date(data.scheduledAt) <= new Date()) {
    errors.push({ field: 'scheduledAt', message: 'Scheduled time must be in the future' });
  }

  if (data.notes && typeof data.notes !== 'string') {
    errors.push({ field: 'notes', message: 'Notes must be a string' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

const validateBookingStatusUpdate = (data) => {
  const errors = [];

  const validStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!data.status || !validStatuses.includes(data.status)) {
    errors.push({ field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  if (data.feedback && typeof data.feedback !== 'string') {
    errors.push({ field: 'feedback', message: 'Feedback must be a string' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

// ============================================
// TRAINER VALIDATION
// ============================================

const validateTrainerSignup = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.password || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  if (data.experience !== undefined && (typeof data.experience !== 'number' || data.experience < 0)) {
    errors.push({ field: 'experience', message: 'Experience must be a non-negative number' });
  }

  if (data.pricePerSession !== undefined && (typeof data.pricePerSession !== 'number' || data.pricePerSession < 0)) {
    errors.push({ field: 'pricePerSession', message: 'Price must be a non-negative number' });
  }

  if (data.specialization && !Array.isArray(data.specialization)) {
    errors.push({ field: 'specialization', message: 'Specialization must be an array' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

// ============================================
// AI ENDPOINT VALIDATION
// ============================================

const validateAICoachInput = (data) => {
  const errors = [];

  if (!data.exercise || typeof data.exercise !== 'string' || data.exercise.trim().length < 2) {
    errors.push({ field: 'exercise', message: 'Exercise name is required' });
  }

  if (data.reps !== undefined && (typeof data.reps !== 'number' || data.reps < 1)) {
    errors.push({ field: 'reps', message: 'Reps must be a positive number' });
  }

  if (data.postureScore !== undefined && (typeof data.postureScore !== 'number' || data.postureScore < 0 || data.postureScore > 100)) {
    errors.push({ field: 'postureScore', message: 'Posture score must be between 0 and 100' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

const validateAIWorkoutPlanInput = (data) => {
  const errors = [];

  const validGoals = ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'];
  if (data.goal && !validGoals.includes(data.goal)) {
    errors.push({ field: 'goal', message: `Goal must be one of: ${validGoals.join(', ')}` });
  }

  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (data.experience && !validLevels.includes(data.experience)) {
    errors.push({ field: 'experience', message: `Experience must be one of: ${validLevels.join(', ')}` });
  }

  if (data.daysPerWeek !== undefined && (typeof data.daysPerWeek !== 'number' || data.daysPerWeek < 1 || data.daysPerWeek > 7)) {
    errors.push({ field: 'daysPerWeek', message: 'Days per week must be between 1 and 7' });
  }

  return errors.length > 0 ? validationError(errors) : null;
};

// ============================================
// Middleware for validation
// ============================================

const validate = (validator) => (req, res, next) => {
  const error = validator(req.body);
  if (error) {
    logger.warn(`Validation failed for ${req.path}`, { 
      path: req.path, 
      errors: error.errors,
      userId: req.userId 
    });
    return res.status(400).json(error);
  }
  next();
};

module.exports = {
  validate,
  validateUserSignup,
  validateUserLogin,
  validateWorkout,
  validateBooking,
  validateBookingStatusUpdate,
  validateTrainerSignup,
  validateAICoachInput,
  validateAIWorkoutPlanInput,
  validationError
};
