const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  sessionType: { 
    type: String, 
    enum: ['Video Call', 'Chat Session', 'Form Review'], 
    default: 'Video Call' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  scheduledAt: { type: Date, required: true },
  notes: { type: String },
  meetingLink: { type: String, default: null },
  feedback: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Booking', bookingSchema);
