const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderModel: { type: String, enum: ['User', 'Trainer'], required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
  receiverModel: { type: String, enum: ['User', 'Trainer'], required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
