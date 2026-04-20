const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  postureScore: Number,
  totalWorkouts: Number,
  weakMuscles: [String],
  insights: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Cache for 24 hours
  }
});

module.exports = mongoose.model('Insight', insightSchema);
