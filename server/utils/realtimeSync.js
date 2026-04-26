/**
 * Real-Time Sync Service
 * Triggers immediate stats recalculation and dashboard updates
 */

const logger = require('./logger');
const UserStats = require('../models/UserStats');
const Workout = require('../models/Workout');
const User = require('../models/User');

// ============================================
// STATS RECALCULATION
// ============================================

/**
 * Recalculate user stats after workout
 * Called immediately after workout is saved
 */
const recalculateStats = async (userId) => {
  try {
    logger.info(`📊 Recalculating stats for user: ${userId}`);

    // Get all workouts for user
    const workouts = await Workout.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    if (workouts.length === 0) {
      logger.debug(`No workouts found for user: ${userId}`);
      return null;
    }

    // Calculate metrics
    const totalWorkouts = workouts.length;
    const avgPostureScore = Math.round(
      workouts.reduce((sum, w) => sum + (w.postureScore || 0), 0) / workouts.length
    );
    const totalCalories = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

    // Calculate streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < workouts.length; i++) {
      const workoutDate = new Date(workouts[i].createdAt);
      workoutDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (workoutDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Find weak muscle groups (exercises with lowest average posture)
    const muscleGroups = {};
    workouts.forEach(w => {
      const muscle = w.muscleGroupWorked || 'General';
      if (!muscleGroups[muscle]) {
        muscleGroups[muscle] = { count: 0, totalPosture: 0 };
      }
      muscleGroups[muscle].count++;
      muscleGroups[muscle].totalPosture += w.postureScore || 0;
    });

    const weakMuscles = Object.entries(muscleGroups)
      .map(([muscle, data]) => ({
        muscle,
        avgPosture: Math.round(data.totalPosture / data.count)
      }))
      .sort((a, b) => a.avgPosture - b.avgPosture)
      .slice(0, 3)
      .map(m => m.muscle);

    // Prepare stats update
    const statsData = {
      userId,
      totalWorkouts,
      avgPostureScore,
      totalCalories,
      totalDuration,
      currentStreak,
      weakMuscles,
      lastWorkoutDate: workouts[0].createdAt,
      lastWorkoutExercise: workouts[0].exerciseType || workouts[0].exercise,
      lastPostureScore: workouts[0].postureScore || 0,
      updatedAt: new Date()
    };

    // Update or create stats document
    const userStats = await UserStats.findOneAndUpdate(
      { userId },
      statsData,
      { upsert: true, new: true }
    );

    logger.info(`✅ Stats recalculated for user: ${userId}`, {
      totalWorkouts,
      avgPosture: avgPostureScore,
      streak: currentStreak
    });

    return userStats;
  } catch (error) {
    logger.error(`❌ Error recalculating stats: ${error.message}`, { 
      userId, 
      error: error.stack 
    });
    throw error;
  }
};

// ============================================
// REAL-TIME EMIT TO CLIENT
// ============================================

/**
 * Emit real-time update to connected user
 */
const emitStatsUpdate = async (userId, data = {}) => {
  try {
    const { getIO } = require('./socket');
    const io = getIO();

    if (!io) {
      logger.debug('Socket.IO not initialized yet');
      return;
    }

    // Get latest stats
    const stats = await UserStats.findOne({ userId }).lean();

    const updatePayload = {
      event: 'stats_updated',
      timestamp: new Date(),
      data: {
        ...stats,
        ...data,
        success: true
      }
    };

    // Emit to specific user
    io.to(userId.toString()).emit('stats_updated', updatePayload);
    logger.debug(`📤 Emitted stats update to user: ${userId}`);

    return updatePayload;
  } catch (error) {
    logger.error(`Error emitting stats update: ${error.message}`, { userId });
    // Don't throw - Socket.IO failure shouldn't break API response
  }
};

// ============================================
// DASHBOARD UPDATE TRIGGER
// ============================================

/**
 * Trigger dashboard refresh for user
 */
const triggerDashboardRefresh = async (userId) => {
  try {
    const { getIO } = require('./socket');
    const io = getIO();

    if (!io) {
      logger.debug('Socket.IO not initialized yet');
      return;
    }

    io.to(userId.toString()).emit('dashboard_refresh', {
      event: 'dashboard_refresh',
      timestamp: new Date(),
      message: 'Dashboard data has been updated'
    });

    logger.debug(`🔄 Dashboard refresh triggered for user: ${userId}`);
  } catch (error) {
    logger.error(`Error triggering dashboard refresh: ${error.message}`, { userId });
  }
};

// ============================================
// NOTIFICATION EMIT
// ============================================

/**
 * Emit notification to user
 */
const emitNotification = async (userId, notification) => {
  try {
    const { getIO } = require('./socket');
    const io = getIO();

    if (!io) {
      logger.debug('Socket.IO not initialized yet');
      return;
    }

    const payload = {
      event: 'notification_received',
      timestamp: new Date(),
      data: {
        title: notification.title || 'Notification',
        message: notification.message,
        type: notification.type || 'info',
        action: notification.action || null
      }
    };

    io.to(userId.toString()).emit('notification_received', payload);
    logger.debug(`📢 Notification sent to user: ${userId}`, { 
      title: notification.title 
    });

    return payload;
  } catch (error) {
    logger.error(`Error emitting notification: ${error.message}`, { userId });
  }
};

// ============================================
// BOOKING UPDATE HANDLER
// ============================================

/**
 * Handle real-time updates for booking changes
 */
const handleBookingUpdate = async (booking, updateType) => {
  try {
    const { getIO } = require('./socket');
    const io = getIO();

    if (!io) {
      logger.debug('Socket.IO not initialized yet');
      return;
    }

    const payload = {
      event: 'booking_updated',
      updateType, // 'created', 'confirmed', 'completed', 'cancelled'
      timestamp: new Date(),
      data: booking
    };

    // Emit to user
    io.to(booking.userId.toString()).emit('booking_updated', {
      ...payload,
      recipient: 'user'
    });

    // Emit to trainer
    io.to(booking.trainerId.toString()).emit('booking_updated', {
      ...payload,
      recipient: 'trainer'
    });

    logger.info(`📅 Booking update emitted: ${updateType}`, {
      bookingId: booking._id,
      status: booking.status
    });

    return payload;
  } catch (error) {
    logger.error(`Error handling booking update: ${error.message}`, { 
      bookingId: booking._id 
    });
  }
};

// ============================================
// SYNC TRIGGERS
// ============================================

/**
 * Full sync trigger - called after important events
 */
const triggerFullSync = async (userId) => {
  try {
    logger.info(`🔄 Triggering full sync for user: ${userId}`);

    // Recalculate stats
    const stats = await recalculateStats(userId);

    // Emit updates
    await emitStatsUpdate(userId, stats);
    await triggerDashboardRefresh(userId);

    logger.info(`✅ Full sync completed for user: ${userId}`);
    return true;
  } catch (error) {
    logger.error(`Error during full sync: ${error.message}`, { userId });
    return false;
  }
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  recalculateStats,
  emitStatsUpdate,
  triggerDashboardRefresh,
  emitNotification,
  handleBookingUpdate,
  triggerFullSync
};
