// Stats Routes - User statistics and achievements
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

// Get user stats for dashboard
router.get('/', statsController.getUserStats);

// Get leaderboard (public)
router.get('/leaderboard', statsController.getLeaderboard);

module.exports = router;
