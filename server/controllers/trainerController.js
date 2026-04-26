const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const UserStats = require('../models/UserStats');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const {
  findTrainerByEmail,
  findTrainerById,
  createTrainer,
  updateTrainer: updateTrainerFallback,
  getAllTrainers: getAllTrainersFallback,
} = require('../services/trainerService');

// Trainer Registration
exports.registerTrainer = async (req, res) => {
  try {
    const { name, email, password, specialization, experience, pricePerSession, bio } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const useFallbackStore = mongoose.connection.readyState !== 1;
    
    const existingTrainer = useFallbackStore
      ? findTrainerByEmail(normalizedEmail)
      : await Trainer.findOne({ email: normalizedEmail });
    if (existingTrainer) {
      return res.status(400).json({ message: 'Trainer with this email already exists' });
    }

    if (useFallbackStore) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdTrainer = createTrainer({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        specialization: specialization ? specialization.split(',') : [],
        experience,
        pricePerSession,
        bio,
        isVerified: false,
      });

      const trainerResponse = { ...createdTrainer };
      delete trainerResponse.password;

      return res.status(201).json({ message: 'Trainer registered successfully. Pending verification.', trainer: trainerResponse });
    }

    // Password hashing is handled by Trainer model pre-save hook
    const trainer = new Trainer({
      name,
      email: normalizedEmail,
      password,
      specialization: specialization ? specialization.split(',') : [],
      experience,
      pricePerSession,
      bio,
      isVerified: false
    });

    await trainer.save();
    const trainerResponse = trainer.toObject();
    delete trainerResponse.password;
    
    res.status(201).json({ message: 'Trainer registered successfully. Pending verification.', trainer: trainerResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Verify Trainer
exports.verifyTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const useFallbackStore = mongoose.connection.readyState !== 1;
    const trainer = useFallbackStore
      ? updateTrainerFallback(id, { isVerified: true })
      : await Trainer.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ message: 'Trainer verified', trainer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single trainer
exports.getTrainer = async (req, res) => {
  try {
    const useFallbackStore = mongoose.connection.readyState !== 1;
    const trainer = useFallbackStore
      ? findTrainerById(req.params.id)
      : await Trainer.findById(req.params.id).select('-password');
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
    
    const useFallbackStore = mongoose.connection.readyState !== 1;
    const trainer = useFallbackStore
      ? updateTrainerFallback(req.params.id, updates)
      : await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete trainer
exports.deleteTrainer = async (req, res) => {
  try {
    const useFallbackStore = mongoose.connection.readyState !== 1;
    const trainer = useFallbackStore ? null : await Trainer.findByIdAndDelete(req.params.id);
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
    const useFallbackStore = mongoose.connection.readyState !== 1;
    if (useFallbackStore) {
      const trainers = getAllTrainersFallback().filter((trainer) => (req.user && req.user.role === 'admin') ? true : trainer.isVerified);
      return res.json(trainers.map(({ password, ...trainer }) => trainer));
    }

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
    const userId = req.user?.id || req.userId;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Return empty bookings in fallback mode
      return res.json([]);
    }

    const bookings = await Booking.find({ userId }).populate('trainerId', 'name specialization imageUrl');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error.message);
    // Return empty array on error instead of 500
    res.json([]);
  }
};

exports.getTrainerClients = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.user.id).populate('clients', 'name email');
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    
    const clientsWithStats = await Promise.all(trainer.clients.map(async (client) => {
      const stats = await UserStats.findOne({ userId: client._id });
      return {
        _id: client._id,
        name: client.name,
        email: client.email,
        score: stats ? stats.averagePostureScore : 0,
        streak: stats ? stats.currentStreak : 0,
        weakMuscles: stats ? stats.weakMuscles.map(m => m.muscle || m) : [],
        lastWorkout: stats ? stats.lastWorkoutDate : null
      };
    }));
    
    res.json(clientsWithStats);
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

// Update Booking Status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, feedback } = req.body;
    
    if (!['Confirmed', 'Rejected', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const updateData = { status };
    
    // Generate meeting link when status is confirmed
    if (status === 'Confirmed') {
      updateData.meetingLink = `https://meet.jitsi.si/formfix-${bookingId}`;
    }
    
    // Add feedback and completion time if marking as complete
    if (status === 'Completed') {
      updateData.feedback = feedback || '';
      updateData.completedAt = new Date();
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, trainerId: req.user.id },
      updateData,
      { new: true }
    ).populate('userId', 'name email');

    if (!booking) return res.status(404).json({ message: 'Booking not found or not authorized' });
    
    res.json({ 
      message: `Booking ${status.toLowerCase()} successfully`, 
      booking,
      meetingLink: booking.meetingLink || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const trainerId = req.user.id;
    
    const totalClients = await Trainer.findById(trainerId).then(t => t.clients.length);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await Booking.countDocuments({
      trainerId,
      scheduledAt: { $gte: today, $lt: tomorrow },
      status: 'Confirmed'
    });

    const pendingBookings = await Booking.countDocuments({
      trainerId,
      status: 'Pending'
    });

    // Average client score
    const trainer = await Trainer.findById(trainerId).populate('clients');
    let avgScore = 0;
    if (trainer.clients.length > 0) {
      const stats = await UserStats.find({ userId: { $in: trainer.clients.map(c => c._id) } });
      const totalScore = stats.reduce((acc, curr) => acc + (curr.averagePostureScore || 0), 0);
      avgScore = stats.length > 0 ? (totalScore / stats.length).toFixed(1) : 0;
    }

    res.json({
      totalClients,
      todaySessions,
      pendingBookings,
      avgClientScore: avgScore
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Trainer Bookings
exports.getTrainerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ trainerId: req.user.id })
      .populate('userId', 'name email')
      .sort('-scheduledAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
