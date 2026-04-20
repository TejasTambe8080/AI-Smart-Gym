const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const UserStats = require('../models/UserStats');

const bcrypt = require('bcryptjs');

// Trainer Registration
exports.registerTrainer = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, pricePerSession, bio } = req.body;
    
    const existingTrainer = await Trainer.findOne({ email });
    if (existingTrainer) {
      return res.status(400).json({ message: 'Trainer with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const trainer = new Trainer({
      name,
      email,
      password: hashedPassword,
      specialization: specialization ? specialization.split(',') : [],
      experience,
      pricePerSession,
      bio,
      isVerified: false
    });

    await trainer.save();
    res.status(201).json({ message: 'Trainer registered successfully. Pending verification.', trainer: { id: trainer._id, name: trainer.name, email: trainer.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Verify Trainer
exports.verifyTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ message: 'Trainer verified', trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single trainer
exports.getTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).select('-password');
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update trainer
exports.updateTrainer = async (req, res) => {
  try {
    // Basic update - prevent password/verification updates here
    const updates = { ...req.body };
    delete updates.password;
    delete updates.isVerified;
    delete updates.email; // Usually don't update email directly
    
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Actions
exports.getAllTrainers = async (req, res) => {
  try {
    // Only return verified trainers for common users
    const query = req.user && req.user.role === 'admin' ? {} : { isVerified: true };
    const trainers = await Trainer.find(query).select('-password');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSession = async (req, res) => {
  try {
    const { trainerId, sessionType, scheduledAt, notes } = req.body;
    const booking = new Booking({
      userId: req.user.id,
      trainerId,
      sessionType,
      scheduledAt,
      notes
    });
    await booking.save();
    
    // Add client to trainer's list if not already there
    await Trainer.findByIdAndUpdate(trainerId, { $addToSet: { clients: req.user.id } });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('trainerId', 'name specialization imageUrl');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Trainer Actions
exports.getTrainerClients = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id).populate('clients', 'name email');
    res.json(trainer.clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClientStats = async (req, res) => {
  try {
    const { clientId } = req.params;
    const stats = await UserStats.findOne({ userId: clientId });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Messaging
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, text } = req.body;
    const message = new Message({
      senderId: req.user.id,
      senderModel: req.user.role === 'trainer' ? 'Trainer' : 'User',
      receiverId,
      receiverModel,
      text
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { contactId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: contactId },
        { senderId: contactId, receiverId: req.user.id }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
