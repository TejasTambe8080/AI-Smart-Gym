const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const trainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  bio: { type: String },
  specialization: [{ type: String }],
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  availableSlots: [{
    day: { type: String },
    times: [{ type: String }]
  }],
  pricePerSession: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: 'trainer' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
trainerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
trainerSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Trainer', trainerSchema);
