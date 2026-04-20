const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');

// Public/Registration routes
router.post('/register', trainerController.registerTrainer);

// Admin-only verification (Optional role check could go here)
router.patch('/verify/:id', protect, trainerController.verifyTrainer);

// Trainer CRUD operations
router.get('/', protect, trainerController.getAllTrainers);
router.get('/:id', protect, trainerController.getTrainer);
router.put('/:id', protect, trainerController.updateTrainer);
router.delete('/:id', protect, trainerController.deleteTrainer);

// Booking integrations
router.post('/book', protect, trainerController.bookSession);
router.get('/my-bookings', protect, trainerController.getUserBookings);

// Specific Trainer user workflows
router.get('/clients', protect, trainerController.getTrainerClients);
router.get('/clients/:clientId/stats', protect, trainerController.getClientStats);

// Messaging
router.post('/messages', protect, trainerController.sendMessage);
router.get('/messages/:contactId', protect, trainerController.getChatHistory);

module.exports = router;

