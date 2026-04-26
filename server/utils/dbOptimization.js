/**
 * Database Optimization & Indexes
 * Ensures optimal query performance
 */

const logger = require('./logger');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Workout = require('../models/Workout');
const Booking = require('../models/Booking');
const UserStats = require('../models/UserStats');
const Exercise = require('../models/Exercise');
const Notification = require('../models/Notification');

// ============================================
// INDEX INITIALIZATION
// ============================================

const initializeIndexes = async () => {
  try {
    logger.info('🔧 Initializing database indexes...');

    // ---- USER INDEXES ----
    await User.collection.createIndex({ email: 1 }, { unique: true });
    logger.debug('✓ User email index created');

    await User.collection.createIndex({ createdAt: -1 });
    logger.debug('✓ User createdAt index created');

    // ---- TRAINER INDEXES ----
    await Trainer.collection.createIndex({ email: 1 }, { unique: true });
    logger.debug('✓ Trainer email index created');

    await Trainer.collection.createIndex({ isVerified: 1 });
    logger.debug('✓ Trainer isVerified index created');

    await Trainer.collection.createIndex({ rating: -1 });
    logger.debug('✓ Trainer rating index created');

    // ---- WORKOUT INDEXES ----
    await Workout.collection.createIndex({ userId: 1, createdAt: -1 });
    logger.debug('✓ Workout userId + createdAt compound index created');

    await Workout.collection.createIndex({ userId: 1 });
    logger.debug('✓ Workout userId index created');

    await Workout.collection.createIndex({ exerciseType: 1 });
    logger.debug('✓ Workout exerciseType index created');

    await Workout.collection.createIndex({ createdAt: -1 });
    logger.debug('✓ Workout createdAt index created');

    // TTL index - automatically delete old temp workouts after 30 days
    await Workout.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
    logger.debug('✓ Workout TTL index created (30 days)');

    // ---- BOOKING INDEXES ----
    await Booking.collection.createIndex({ userId: 1, status: 1 });
    logger.debug('✓ Booking userId + status compound index created');

    await Booking.collection.createIndex({ trainerId: 1, status: 1 });
    logger.debug('✓ Booking trainerId + status compound index created');

    await Booking.collection.createIndex({ scheduledAt: 1 });
    logger.debug('✓ Booking scheduledAt index created');

    await Booking.collection.createIndex({ status: 1 });
    logger.debug('✓ Booking status index created');

    // ---- USER STATS INDEXES ----
    await UserStats.collection.createIndex({ userId: 1 }, { unique: true });
    logger.debug('✓ UserStats userId index created (unique)');

    await UserStats.collection.createIndex({ totalWorkouts: -1 });
    logger.debug('✓ UserStats totalWorkouts index created');

    await UserStats.collection.createIndex({ avgPostureScore: -1 });
    logger.debug('✓ UserStats avgPostureScore index created');

    // ---- EXERCISE INDEXES ----
    await Exercise.collection.createIndex({ muscleGroup: 1 });
    logger.debug('✓ Exercise muscleGroup index created');

    await Exercise.collection.createIndex({ difficulty: 1 });
    logger.debug('✓ Exercise difficulty index created');

    await Exercise.collection.createIndex({ name: 'text' });
    logger.debug('✓ Exercise name text index created');

    // ---- NOTIFICATION INDEXES ----
    await Notification.collection.createIndex({ userId: 1, createdAt: -1 });
    logger.debug('✓ Notification userId + createdAt compound index created');

    await Notification.collection.createIndex({ isRead: 1 });
    logger.debug('✓ Notification isRead index created');

    // TTL index - automatically delete read notifications after 30 days
    await Notification.collection.createIndex(
      { createdAt: 1 },
      { 
        expireAfterSeconds: 2592000,
        partialFilterExpression: { isRead: true }
      }
    );
    logger.debug('✓ Notification TTL index created (read notifications)');

    logger.info('✅ All database indexes initialized successfully');
    return true;
  } catch (error) {
    if (error.message.includes('index already exists')) {
      logger.debug('ℹ️ Indexes already exist');
      return true;
    }
    logger.error(`❌ Error initializing indexes: ${error.message}`);
    throw error;
  }
};

// ============================================
// QUERY OPTIMIZATION UTILITIES
// ============================================

/**
 * Get user with minimal fields (for auth responses)
 */
const getUserMinimal = (userId) => {
  return User.findById(userId)
    .select('_id name email fitnessGoal age weight height')
    .lean();
};

/**
 * Get user workouts with pagination
 */
const getUserWorkoutsPaginated = async (userId, skip = 0, limit = 10) => {
  const mongoose = require('mongoose');
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    logger.debug('⚠️ MongoDB not connected - returning empty workouts');
    return [];
  }
  try {
    return await Workout.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id exercise reps sets weight duration postureScore muscleGroupWorked createdAt')
      .lean();
  } catch (error) {
    logger.error('Error fetching paginated workouts:', error.message);
    return [];
  }
};

/**
 * Get user workouts count
 */
const getUserWorkoutsCount = async (userId) => {
  const mongoose = require('mongoose');
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    logger.debug('⚠️ MongoDB not connected - returning 0 workout count');
    return 0;
  }
  try {
    return await Workout.countDocuments({ userId });
  } catch (error) {
    logger.error('Error counting workouts:', error.message);
    return 0;
  }
};

/**
 * Get user stats with cache consideration
 */
const getUserStats = async (userId) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    logger.debug('⚠️ MongoDB not connected - returning empty stats');
    return null;
  }
  try {
    return await UserStats.findOne({ userId })
      .select('_id userId totalWorkouts avgPostureScore currentStreak weakMuscles lastWorkoutDate updatedAt')
      .lean();
  } catch (error) {
    logger.error('Error fetching user stats:', error.message);
    return null;
  }
};

/**
 * Get trainer with minimal fields
 */
const getTrainerMinimal = (trainerId) => {
  return Trainer.findById(trainerId)
    .select('_id name specialization experience rating pricePerSession imageUrl isVerified')
    .lean();
};

/**
 * Get verified trainers only
 */
const getVerifiedTrainers = (skip = 0, limit = 10) => {
  return Trainer.find({ isVerified: true })
    .select('_id name specialization experience rating pricePerSession imageUrl bio')
    .skip(skip)
    .limit(limit)
    .sort({ rating: -1 })
    .lean();
};

/**
 * Get user bookings with trainer info
 */
const getUserBookings = (userId) => {
  return Booking.find({ userId })
    .populate('trainerId', 'name specialization pricePerSession imageUrl')
    .sort({ scheduledAt: -1 })
    .lean();
};

/**
 * Get trainer bookings
 */
const getTrainerBookings = (trainerId, status = null) => {
  const query = { trainerId };
  if (status) query.status = status;

  return Booking.find(query)
    .populate('userId', 'name email age weight height')
    .sort({ scheduledAt: -1 })
    .lean();
};

/**
 * Get exercises by muscle group (optimized)
 */
const getExercisesByMuscleGroup = (muscleGroup, skip = 0, limit = 20) => {
  return Exercise.find({ muscleGroup })
    .select('_id name muscleGroup difficulty instructions equipment')
    .skip(skip)
    .limit(limit)
    .lean();
};

/**
 * Search exercises by text
 */
const searchExercises = (query, skip = 0, limit = 10) => {
  return Exercise.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(limit)
    .select('_id name muscleGroup difficulty')
    .lean();
};

/**
 * Get user's recent workouts (last N)
 */
const getUserRecentWorkouts = async (userId, count = 5) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    logger.debug('⚠️ MongoDB not connected - returning empty recent workouts');
    return [];
  }
  try {
    return await Workout.find({ userId })
      .sort({ createdAt: -1 })
      .limit(count)
      .select('exercise reps postureScore duration muscleGroupWorked createdAt')
      .lean();
  } catch (error) {
    logger.error('Error fetching recent workouts:', error.message);
    return [];
  }
};

/**
 * Get notifications for user (with pagination)
 */
const getUserNotifications = async (userId, skip = 0, limit = 20) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    logger.debug('⚠️ MongoDB not connected - returning empty notifications');
    return [];
  }
  try {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  } catch (error) {
    logger.error('Error fetching notifications:', error.message);
    return [];
  }
};

/**
 * Get unread notification count
 */
const getUnreadNotificationCount = async (userId) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    logger.debug('⚠️ MongoDB not connected - returning 0 unread count');
    return 0;
  }
  try {
    return await Notification.countDocuments({ userId, isRead: false });
  } catch (error) {
    logger.error('Error counting unread notifications:', error.message);
    return 0;
  }
};

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Bulk update workouts posture scores
 */
const bulkUpdateWorkoutsPosture = async (workoutIds, postureScore) => {
  try {
    const result = await Workout.updateMany(
      { _id: { $in: workoutIds } },
      { postureScore, updatedAt: new Date() },
      { multi: true }
    );
    logger.debug(`Bulk updated ${result.modifiedCount} workouts posture score`);
    return result;
  } catch (error) {
    logger.error(`Error in bulk update: ${error.message}`);
    throw error;
  }
};

/**
 * Bulk delete old workouts (cleanup)
 */
const deleteOldWorkouts = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await Workout.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    logger.info(`🗑️ Deleted ${result.deletedCount} workouts older than ${daysOld} days`);
    return result;
  } catch (error) {
    logger.error(`Error deleting old workouts: ${error.message}`);
    throw error;
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  initializeIndexes,
  getUserMinimal,
  getUserWorkoutsPaginated,
  getUserWorkoutsCount,
  getUserStats,
  getTrainerMinimal,
  getVerifiedTrainers,
  getUserBookings,
  getTrainerBookings,
  getExercisesByMuscleGroup,
  searchExercises,
  getUserRecentWorkouts,
  getUserNotifications,
  getUnreadNotificationCount,
  bulkUpdateWorkoutsPosture,
  deleteOldWorkouts
};
