const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const auth = require('../middleware/auth');

// User routes
router.get('/', auth, trainerController.getAllTrainers);
router.post('/book', auth, trainerController.bookSession);
router.get('/my-bookings', auth, trainerController.getUserBookings);

// Trainer routes
router.get('/clients', auth, trainerController.getTrainerClients);
router.get('/clients/:clientId/stats', auth, trainerController.getClientStats);

// Messaging
router.post('/messages', auth, trainerController.sendMessage);
router.get('/messages/:contactId', auth, trainerController.getChatHistory);

module.exports = router;
