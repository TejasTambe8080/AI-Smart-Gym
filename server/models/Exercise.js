// Exercise Model - Stores all available exercises with details
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add exercise name'],
      trim: true,
      maxlength: 100,
    },
    muscleGroup: {
      type: String,
      enum: ['chest', 'back', 'biceps', 'triceps', 'legs', 'abs', 'cardio'],
      required: [true, 'Please specify muscle group'],
      lowercase: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
      maxlength: 500,
    },
    instructions: [
      {
        order: Number,
        step: String,
      },
    ],
    targetReps: {
      type: Number,
      min: 1,
      max: 100,
      default: 12,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=Exercise',
    },
    video: {
      type: String,
      default: null,
    },
    equipment: [String], // e.g., ['dumbbell', 'barbell', 'bodyweight']
    caloriesBurned: {
      type: Number, // per session (estimated)
      default: 100,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries by muscleGroup
exerciseSchema.index({ muscleGroup: 1 });
exerciseSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
