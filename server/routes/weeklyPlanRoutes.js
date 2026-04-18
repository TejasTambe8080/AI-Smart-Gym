// Weekly Plan Routes
const express = require('express');
const router = express.Router();
const weeklyPlanController = require('../controllers/weeklyPlanController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get personalized weekly plan
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const plan = await weeklyPlanController.getWeeklyPlan(userId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate new weekly plan
router.post('/generate', async (req, res) => {
  try {
    const userId = req.user.id;
    const plan = await weeklyPlanController.generateWeeklyPlan(userId);
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
