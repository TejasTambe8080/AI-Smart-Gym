// Notification Controller - API Logic
const Notification = require('../models/Notification');

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const { limit = 10, skip = 0, unreadOnly = false } = req.query;
    const userId = req.user.id;

    const query = { userId };
    if (unreadOnly === 'true') query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      success: true,
      notifications,
      total,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get unread count', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    const unreadCount = 0;
    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark all as read', error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
};

// Clear all notifications
exports.clearAll = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.deleteMany({ userId });

    res.status(200).json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to clear notifications', error: error.message });
  }
};

// Create notification (internal use)
exports.createNotification = async (userId, title, message, type = 'info', icon = 'ℹ️', actionUrl = null) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      icon,
      actionUrl
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Trigger workout reminder (if no workout in 2 days)
exports.checkAndTriggerWorkoutReminder = async (userId) => {
  try {
    const Workout = require('../models/Workout');
    const twoDAysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    const recentWorkout = await Workout.findOne({
      userId,
      date: { $gte: twoDAysAgo }
    });

    if (!recentWorkout) {
      await exports.createNotification(
        userId,
        '💪 Get Back on Track',
        "You haven't worked out in 2 days. Let's build your streak!",
        'workout_reminder',
        '💪',
        '/workout'
      );
    }
  } catch (error) {
    console.error('Error checking workout reminder:', error);
  }
};

// Trigger posture alert
exports.triggerPostureAlert = async (userId, postureScore) => {
  try {
    if (postureScore < 60) {
      await exports.createNotification(
        userId,
        '📐 Improve Your Posture',
        `Your posture score is ${postureScore}%. Focus on form to prevent injuries.`,
        'posture_alert',
        '📐',
        '/posture'
      );
    }
  } catch (error) {
    console.error('Error triggering posture alert:', error);
  }
};

// Trigger achievement notification
exports.triggerAchievement = async (userId, badge, description) => {
  try {
    await exports.createNotification(
      userId,
      `🏆 New Achievement!`,
      `Congratulations! You unlocked: ${description}`,
      'achievement',
      badge,
      '/dashboard'
    );
  } catch (error) {
    console.error('Error triggering achievement:', error);
  }
};

// Trigger streak milestone
exports.triggerStreakMilestone = async (userId, streakDays) => {
  try {
    let message = '';
    let icon = '🔥';

    if (streakDays === 7) message = 'Amazing! You\'ve reached a 7-day workout streak!';
    else if (streakDays === 14) message = 'Incredible! 14-day streak - you\'re unstoppable!';
    else if (streakDays === 30) message = 'Legend! 30-day streak - consistency is key!';
    else if (streakDays % 10 === 0) message = `Fantastic! ${streakDays}-day streak - keep it up!`;

    if (message) {
      await exports.createNotification(
        userId,
        `${icon} Streak Milestone!`,
        message,
        'streak_achievement',
        icon,
        '/dashboard'
      );
    }
  } catch (error) {
    console.error('Error triggering streak milestone:', error);
  }
};

// Trigger weak muscle alert
exports.triggerWeakMuscleAlert = async (userId, weakMuscles) => {
  try {
    if (weakMuscles && weakMuscles.length > 0) {
      const muscleList = weakMuscles.slice(0, 2).map(m => m.muscle).join(' & ');
      
      await exports.createNotification(
        userId,
        '💥 Weak Muscle Detected',
        `Your ${muscleList} needs attention. Get a personalized AI plan!`,
        'weak_muscle',
        '💥',
        '/ai-workout'
      );
    }
  } catch (error) {
    console.error('Error triggering weak muscle alert:', error);
  }
};
