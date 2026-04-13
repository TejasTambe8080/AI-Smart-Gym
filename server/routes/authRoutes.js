// Auth Routes
const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/update', authMiddleware, updateProfile);

module.exports = router;
