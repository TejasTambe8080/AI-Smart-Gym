// UserStats Model - Tracks user statistics, streaks, and achievements
const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    // Streak Information
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastWorkoutDate: {
      type: Date,
      default: null
    },
    
    // Cumulative Stats
    totalWorkouts: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDuration: {
      type: Number, // in minutes
      default: 0,
      min: 0
    },
    totalReps: {
      type: Number,
      default: 0,
      min: 0
    },
    totalCalories: {
      type: Number,
      default: 0,
      min: 0
    },
    averagePostureScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    
    // Weekly Stats
    weeklyWorkouts: {
      type: Number,
      default: 0,
      min: 0
    },
    weeklyGoal: {
      type: Number,
      default: 5,
      min: 1,
      max: 7
    },
    consistencyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    missedSessions: {
      type: Number,
      default: 0
    },

    
    // Gamification
    totalXP: {
      type: Number,
      default: 0,
      min: 0
    },
    level: {
      type: Number,
      default: 1,
      min: 1
    },
    badges: [{
      name: String,
      icon: String,
      unlockedAt: Date
    }],
    
    // Weak Muscle Groups (last 3 identified)
    weakMuscles: [{
      muscle: String,
      frequency: Number,
      lastIdentified: Date
    }],
    
    // Recent Stats (for charts)
    dailyStats: [{
      date: Date,
      workouts: Number,
      duration: Number,
      calories: Number,
      postureScore: Number
    }],
    
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Index for efficient querying
userStatsSchema.index({ userId: 1, updatedAt: -1 });
userStatsSchema.index({ currentStreak: -1 }); // For leaderboards

module.exports = mongoose.model('UserStats', userStatsSchema);
