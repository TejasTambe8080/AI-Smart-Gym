// Workout Model - Stores workout session data
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    exerciseType: {
      type: String,
      enum: ['squat', 'push_up', 'pull_up', 'sit_up', 'burpee', 'plank', 'dumbbell_curl', 'other'],
      required: true,
    },
    reps: {
      type: Number,
      required: true,
      min: 0,
    },
    sets: {
      type: Number,
      default: 1,
      min: 1,
    },
    duration: {
      type: Number, // in seconds
      required: true,
      min: 0,
    },
    postureScore: {
      type: Number, // 0-100
      default: 0,
      min: 0,
      max: 100,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    postureDetails: {
      backBent: { type: Number, default: 0 }, // percentage of time back was bent
      kneesMisaligned: { type: Number, default: 0 },
      shouldersMisaligned: { type: Number, default: 0 },
    },
    performanceMetrics: {
      consistency: { type: Number, default: 0, min: 0, max: 100 },
      depth: { type: Number, default: 0, min: 0, max: 100 },
      speed: { type: Number, default: 0, min: 0, max: 100 },
    },
  },
  { timestamps: true }
);

// Index for filtering workouts by user and date
workoutSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Workout', workoutSchema);
