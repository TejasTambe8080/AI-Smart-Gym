const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  weakMuscles: [String],
  postureScore: Number,
  streak: Number,
  suggestions: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Cache for 24 hours
  }
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
