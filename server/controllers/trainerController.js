const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const UserStats = require('../models/UserStats');

// User Actions
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().select('-password');
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
