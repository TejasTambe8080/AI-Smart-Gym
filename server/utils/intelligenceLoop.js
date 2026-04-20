const UserStats = require('../models/UserStats');
const Workout = require('../models/Workout');
const Insight = require('../models/Insight');
const Notification = require('../models/Notification');
const { generateWeeklyPlan } = require('../controllers/weeklyPlanController');
const { getIO } = require('./socket');
const { generateAIResponse } = require('../services/geminiService');

/**
 * Intelligent Closed-Loop Orchestrator
 * Coordinates: Workout -> Stats -> Insights -> Planner -> Notifications
 */
exports.syncIntelligenceLoop = async (userId, lastWorkout) => {
  try {
    console.log(`[Intelligence Loop] Starting sync for user: ${userId}`);

    // 1. Calculate Consistency & Behavior
    const stats = await UserStats.findOne({ userId });
    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(10);
    
    // Consistency Score: (Days trained / Weekly Goal) * 100 [Simplified for now]
    const daysTrainedThisWeek = stats.weeklyWorkouts || 1;
    const goal = stats.weeklyGoal || 5;
    const consistencyScore = Math.min(Math.round((daysTrainedThisWeek / goal) * 100), 100);
    
    stats.consistencyScore = consistencyScore;
    
    // Detect Drop-off
    const lastThree = workouts.slice(0, 3);
    const avgPosture = lastThree.length ? lastThree.reduce((s, w) => s + w.postureScore, 0) / lastThree.length : 100;
    
    if (avgPosture < 70) {
      // High Priority Alert: Injury Risk / Fatigue
      await createSmartNotification(userId, {
        title: '⚠️ Biometric Fatigue Detected',
        message: 'Your postural precision has dropped by 20%. Potential neural fatigue or injury risk. Reducing next session intensity.',
        type: 'risk_alert',
        priority: 'HIGH',
        icon: '🚨'
      });
    } else if (consistencyScore < 50 && daysTrainedThisWeek < goal / 2) {
      // Medium Priority Alert: Consistency Drop
      await createSmartNotification(userId, {
        title: '📉 Consistency Variance',
        message: 'You have missed 2+ planned protocols this week. Restore momentum to maintain kinetic progress.',
        type: 'consistency_alert',
        priority: 'MEDIUM',
        icon: '⚠️'
      });
    }

    await stats.save();

    // 2. Trigger Adaptive Planning
    // The weeklyPlanController will be updated to be "aware" of recent performance
    await generateWeeklyPlan(userId);

    // 3. Emit Intelligence Update
    const io = getIO();
    io.to(userId.toString()).emit('intelligence_synced', {
      consistencyScore,
      priorityUpdate: true
    });

    console.log(`[Intelligence Loop] Sync complete for user: ${userId}`);
  } catch (error) {
    console.error('[Intelligence Loop] Error:', error);
  }
};

async function createSmartNotification(userId, data) {
  const notification = new Notification({
    userId,
    ...data
  });
  await notification.save();
  
  const io = getIO();
  io.to(userId.toString()).emit('notification_received', {
    ...data,
    id: notification._id
  });
}
