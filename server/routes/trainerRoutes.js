const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');

// User routes
router.get('/', protect, trainerController.getAllTrainers);
router.post('/book', protect, trainerController.bookSession);
router.get('/my-bookings', protect, trainerController.getUserBookings);

// Trainer routes
router.get('/clients', protect, trainerController.getTrainerClients);
router.get('/clients/:clientId/stats', protect, trainerController.getClientStats);

// Messaging
router.post('/messages', protect, trainerController.sendMessage);
router.get('/messages/:contactId', protect, trainerController.getChatHistory);

module.exports = router;
