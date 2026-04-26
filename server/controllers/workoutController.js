/**
 * Workout Controller - Production-Ready
 * Handles CRUD operations with validation, logging, error handling, and real-time sync
 */

const Workout = require('../models/Workout');
const UserStats = require('../models/UserStats');
const statsController = require('./statsController');
const { syncIntelligenceLoop } = require('../utils/intelligenceLoop');
const logger = require('../utils/logger');
const { responses, asyncHandler } = require('../utils/apiResponse');
const { validateWorkout } = require('../utils/validation');
const {
  recalculateStats,
  emitStatsUpdate,
  triggerDashboardRefresh,
  emitNotification
} = require('../utils/realtimeSync');
const { getUserWorkoutsPaginated, getUserWorkoutsCount, getUserRecentWorkouts } = require('../utils/dbOptimization');

// ============================================
// CREATE WORKOUT
// ============================================

/**
 * POST /api/workouts
 * Create a new workout session with full validation and real-time sync
 */
exports.createWorkout = asyncHandler(async (req, res) => {
  const {
    exercise,
    reps,
    sets,
    weight,
    duration,
    postureScore,
    caloriesBurned,
    muscleGroupWorked,
    notes,
    requestId,
  } = req.body;

  // 1. Validate input
  const validationError = validateWorkout(req.body);
  if (validationError) {
    logger.warn(`Workout validation failed for user ${req.userId}`, {
      errors: validationError.errors
    });
    return responses.badRequest(res, 'Validation failed');
  }

  // 2. Prevent duplicate submissions (request de-duplication)
  if (requestId) {
    const existingWorkout = await Workout.findOne({ requestId });
    if (existingWorkout) {
      logger.warn(`Duplicate workout submission detected: ${requestId}`);
      return responses.conflict(res, 'This workout already exists');
    }
  }

  // 3. Rate limiting - prevent accidental double-clicks within 30 seconds
  const recentWorkout = await Workout.findOne({
    userId: req.userId,
    createdAt: { $gte: new Date(Date.now() - 30 * 1000) }
  });

  if (recentWorkout && !requestId) {
    logger.warn(`Rate limit hit for user ${req.userId}`);
    return responses.badRequest(res, 'Please wait 30 seconds before submitting another workout');
  }

  // 4. Create workout
  const workout = new Workout({
    userId: req.userId,
    exercise: exercise || 'General Exercise',
    exerciseType: exercise || 'General Exercise',
    reps,
    sets,
    weight,
    duration,
    postureScore: postureScore || 75,
    caloriesBurned: caloriesBurned || 0,
    muscleGroupWorked: muscleGroupWorked || 'Full Body',
    notes,
    requestId,
    createdAt: new Date()
  });

  await workout.save();
  logger.info(`✅ Workout created: ${exercise}`, {
    userId: req.userId,
    workoutId: workout._id,
    reps,
    duration
  });

  // 5. Update stats asynchronously
  try {
    await statsController.updateStatsAfterWorkout(req.userId, workout);
    
    // Recalculate comprehensive stats
    const stats = await recalculateStats(req.userId);
    
    // Trigger intelligence loop in background
    syncIntelligenceLoop(req.userId, workout);

    // 6. Real-time sync to dashboard
    await emitStatsUpdate(req.userId, stats);
    await triggerDashboardRefresh(req.userId);

    // 7. Send notification
    await emitNotification(req.userId, {
      title: '💪 Workout Recorded',
      message: `Great job! Your ${exercise} workout has been saved.`,
      type: 'achievement'
    });

    logger.info(`🔄 Real-time sync completed for user ${req.userId}`);
  } catch (syncError) {
    logger.error(`Real-time sync failed (non-critical): ${syncError.message}`, {
      userId: req.userId
    });
    // Don't fail the response if sync fails
  }

  return responses.created(res, workout, 'Workout created successfully');
});

// ============================================
// GET ALL WORKOUTS
// ============================================

/**
 * GET /api/workouts
 * Get all workouts for authenticated user with pagination
 */
exports.getWorkouts = asyncHandler(async (req, res) => {
  const { skip = 0, limit = 10, exerciseType } = req.query;

  logger.info(`📋 Fetching workouts for user ${req.userId}`, {
    skip: parseInt(skip),
    limit: parseInt(limit)
  });

  // Build query
  let query = { userId: req.userId };
  if (exerciseType) query.exerciseType = exerciseType;

  // Get count and paginated results
  const total = await getUserWorkoutsCount(req.userId);
  const workouts = await getUserWorkoutsPaginated(
    req.userId,
    parseInt(skip),
    parseInt(limit)
  );

  logger.debug(`✅ Retrieved ${workouts.length} workouts`);
  return responses.listed(res, workouts, total, limit, skip);
});

// ============================================
// GET SPECIFIC WORKOUT
// ============================================

/**
 * GET /api/workouts/:id
 * Get a specific workout
 */
exports.getWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.debug(`Fetching workout: ${id} for user ${req.userId}`);

  const workout = await Workout.findOne({
    _id: id,
    userId: req.userId
  });

  if (!workout) {
    logger.warn(`Workout not found: ${id}`);
    return responses.notFound(res, 'Workout');
  }

  return responses.fetched(res, workout);
});

// ============================================
// UPDATE WORKOUT
// ============================================

/**
 * PUT /api/workouts/:id
 * Update a workout
 */
exports.updateWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Updating workout: ${id}`, { userId: req.userId });

  // Validate update data
  const validationError = validateWorkout(req.body);
  if (validationError) {
    return responses.badRequest(res, 'Validation failed');
  }

  const workout = await Workout.findOne({
    _id: id,
    userId: req.userId
  });

  if (!workout) {
    logger.warn(`Workout not found for update: ${id}`);
    return responses.notFound(res, 'Workout');
  }

  // Update fields
  const allowedFields = ['reps', 'sets', 'weight', 'duration', 'postureScore', 'caloriesBurned', 'notes'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      workout[field] = req.body[field];
    }
  });

  workout.updatedAt = new Date();
  await workout.save();

  logger.info(`✅ Workout updated: ${id}`);

  // Trigger stats recalculation
  try {
    await recalculateStats(req.userId);
    await emitStatsUpdate(req.userId);
  } catch (error) {
    logger.error(`Stats update failed: ${error.message}`);
  }

  return responses.updated(res, workout);
});

// ============================================
// DELETE WORKOUT
// ============================================

/**
 * DELETE /api/workouts/:id
 * Delete a workout
 */
exports.deleteWorkout = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Deleting workout: ${id}`, { userId: req.userId });

  const workout = await Workout.findOneAndDelete({
    _id: id,
    userId: req.userId
  });

  if (!workout) {
    logger.warn(`Workout not found for deletion: ${id}`);
    return responses.notFound(res, 'Workout');
  }

  logger.info(`✅ Workout deleted: ${id}`);

  // Trigger stats recalculation
  try {
    await recalculateStats(req.userId);
    await emitStatsUpdate(req.userId);
  } catch (error) {
    logger.error(`Stats update failed after deletion: ${error.message}`);
  }

  return responses.deleted(res);
});

// ============================================
// GET WORKOUT STATISTICS
// ============================================

/**
 * GET /api/workouts/stats/summary
 * Get comprehensive workout statistics
 */
exports.getWorkoutStats = asyncHandler(async (req, res) => {
  logger.info(`📊 Fetching stats for user ${req.userId}`);

  const mongoose = require('mongoose');
  
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    logger.warn(`⚠️ MongoDB not connected - returning empty stats for user ${req.userId}`);
    return responses.fetched(res, {
      totalWorkouts: 0,
      totalReps: 0,
      totalSets: 0,
      totalDuration: 0,
      totalCalories: 0,
      averagePostureScore: 0,
      averageDuration: 0,
      maxReps: 0,
      maxWeight: 0,
      recentWorkouts: [],
      lastWorkoutDate: null,
      topExercises: [],
      message: 'Running in fallback mode - no workout history available'
    });
  }

  try {
    const workouts = await Workout.find({ userId: req.userId }).lean();

    if (workouts.length === 0) {
      logger.debug(`No workouts found for user ${req.userId}`);
      return responses.fetched(res, {
        totalWorkouts: 0,
        message: 'No workouts recorded yet'
      });
    }

    // Calculate comprehensive stats
    const stats = {
      totalWorkouts: workouts.length,
      totalReps: workouts.reduce((sum, w) => sum + (w.reps || 0), 0),
      totalSets: workouts.reduce((sum, w) => sum + (w.sets || 0), 0),
      totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      totalCalories: workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0),
      averagePostureScore: Math.round(
        workouts.reduce((sum, w) => sum + (w.postureScore || 0), 0) / workouts.length
      ),
      averageDuration: Math.round(
        workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length
      ),
      maxReps: Math.max(...workouts.map(w => w.reps || 0)),
      maxWeight: Math.max(...workouts.map(w => w.weight || 0)),
      recentWorkouts: workouts.slice(0, 5),
      lastWorkoutDate: workouts[0]?.createdAt || null,
      topExercises: calculateTopExercises(workouts)
    };

    logger.info(`✅ Stats calculated`, {
      totalWorkouts: stats.totalWorkouts,
      avgPosture: stats.averagePostureScore
    });

    return responses.fetched(res, stats, 'Workout statistics retrieved successfully');
  } catch (error) {
    logger.error(`Error fetching workout stats: ${error.message}`);
    return responses.fetched(res, {
      totalWorkouts: 0,
      totalReps: 0,
      totalSets: 0,
      totalDuration: 0,
      totalCalories: 0,
      averagePostureScore: 0,
      averageDuration: 0,
      maxReps: 0,
      maxWeight: 0,
      recentWorkouts: [],
      lastWorkoutDate: null,
      topExercises: [],
      message: 'Error fetching stats - database unavailable'
    });
  }
});

// ============================================
// GET RECENT WORKOUTS
// ============================================

/**
 * GET /api/workouts/recent/:count
 * Get recent workouts (optimized query)
 */
exports.getRecentWorkouts = asyncHandler(async (req, res) => {
  const { count = 5 } = req.params;

  logger.debug(`Fetching ${count} recent workouts for user ${req.userId}`);

  const workouts = await getUserRecentWorkouts(req.userId, parseInt(count));

  return responses.fetched(res, workouts, 'Recent workouts retrieved successfully');
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate top exercises from workouts
 */
function calculateTopExercises(workouts) {
  const exerciseMap = {};

  workouts.forEach(w => {
    const exercise = w.exercise || w.exerciseType || 'Unknown';
    if (!exerciseMap[exercise]) {
      exerciseMap[exercise] = { name: exercise, count: 0, totalReps: 0 };
    }
    exerciseMap[exercise].count++;
    exerciseMap[exercise].totalReps += w.reps || 0;
  });

  return Object.values(exerciseMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
