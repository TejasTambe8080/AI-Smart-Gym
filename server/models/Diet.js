const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One diet plan per user
  },
  height: Number,
  weight: Number,
  goal: String,
  plan: {
    calories: String,
    protein: String,
    meals: {
      breakfast: String,
      lunch: String,
      dinner: String
    },
    tips: [String]
  },
  rawResponse: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 * 7 // Cache for 7 days
  }
});

module.exports = mongoose.model('Diet', dietSchema);
