const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');

// Public trainer routes
router.get('/', trainerController.getAllTrainers);

// Protected routes - require authentication
router.post('/register', trainerController.registerTrainer);

// Trainer specific workflows (requires trainer role)
router.get('/dashboard/stats', protect, trainerController.getDashboardStats);
router.get('/bookings', protect, trainerController.getTrainerBookings);
router.put('/bookings/:bookingId', protect, trainerController.updateBookingStatus);
router.get('/bookings/user', protect, trainerController.getUserBookings);  // User bookings with trainers
router.get('/clients', protect, trainerController.getTrainerClients);
router.get('/clients/:clientId/stats', protect, trainerController.getClientStats);

// Profile Management
router.put('/profile/:id', protect, trainerController.updateTrainer);
router.delete('/:id', protect, trainerController.deleteTrainer);

// Messaging
router.post('/messages', protect, trainerController.sendMessage);
router.get('/messages/:contactId', protect, trainerController.getChatHistory);

// Public trainer routes that must remain last so they do not shadow protected paths
router.get('/:id', trainerController.getTrainer);

module.exports = router;
